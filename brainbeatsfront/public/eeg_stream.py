
import sys
import argparse
import time
import json
import brainflow
import numpy as np
import pandas as pd

from brainflow.board_shim import BoardShim, BrainFlowInputParams, LogLevels, BoardIds, BrainFlowError
from brainflow.data_filter import DataFilter, FilterTypes, AggOperations, WindowFunctions, DetrendOperations
from brainflow.ml_model import MLModel, BrainFlowMetrics, BrainFlowClassifiers, BrainFlowModelParams
from brainflow.exit_codes import *


# TODO Create an impedance test, a way to find the mac address for faster connectivity
# TODO When customizing adding a circuit board, need to allow for the user to input the serial port, mac address, and board-id in order for it to work well with it.
# Based off of the board id, update the brainflow input params [offer default settings recommended by the docs and offer for the user to customize it as well]
# https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js
# TODO have the EEG data save in a cleaner spot aka in it's own directory

def get_band_values(data, sampling_rate, eeg_channel):
    print('Get_band_values')
    df = pd.DataFrame(np.transpose(data))

    # Refactored to make time a variable wherever 4 was - may need to change back to 4
    temp = []
    nfft = DataFilter.get_nearest_power_of_two(sampling_rate)

    for j in range(0, int(len(df)-1)):
        temp.append(data[eeg_channel][int(j)])

    DataFilter.detrend(np.array(temp), DetrendOperations.LINEAR.value)
    psd = DataFilter.get_psd_welch(data=np.array(temp), nfft=nfft, overlap=nfft //
                                   2, sampling_rate=sampling_rate, window=WindowFunctions.BLACKMAN_HARRIS.value)
    print(psd)

    # Potential way to plot https://brainflow.readthedocs.io/en/stable/notebooks/band_power.html
    # plt.plot(psd[1][:60], psd[0][:60])
    # plt.show()

    # Have to have get_band_power in try excepts since if the finds 0, it will throw an error
    try:
        delta = DataFilter.get_band_power(psd, 0.5, 4.0)
    except:
        delta = 0.0
    try:
        theta = DataFilter.get_band_power(psd, 4.1, 7.9)
    except:
        theta = 0.0
    try:
        alpha = DataFilter.get_band_power(psd, 8.0, 13.9)
    except:
        alpha = 0.0
    try:
        beta = DataFilter.get_band_power(psd, 14.0, 31.0)
    except:
        beta = 0.0
    try:
        gamma = DataFilter.get_band_power(psd, 32.0, 100.0)
    except:
        gamma = 0.0

    all_band_values = {"delta": delta, "theta": theta,
                       "alpha": alpha, "beta": beta, "gamma": gamma}

    print(all_band_values)
    # To get it to print it back to node:
    # print(json.dumps(all_band_values))
    return all_band_values


def get_feature_vector(data, eeg_channels_count, sampling_rate):
    # Create the feature vector for the machine learning models
    bands = DataFilter.get_avg_band_powers(
        data, eeg_channels_count, sampling_rate, True)
    vector = np.concatenate((bands[0], bands[1]))
    print(f'Feature vector: {vector}')
    return vector


def get_concentration_percent(data, eeg_channels_count, sampling_rate):
    feature_vector = get_feature_vector(
        data, eeg_channels_count, sampling_rate)
    concentration_params = BrainFlowModelParams(
        BrainFlowMetrics.CONCENTRATION.value, BrainFlowClassifiers.KNN.value)
    concentration_model = MLModel(concentration_params)
    concentration_model.prepare()
    concentration_prediction_percent = concentration_model.predict(
        feature_vector)
    print('Concentration: %f' % concentration_prediction_percent,  flush=True)
    concentration_model.release()
    return concentration_prediction_percent


def get_relaxation_percent(data, eeg_channels_count, sampling_rate):
    feature_vector = get_feature_vector(
        data, eeg_channels_count, sampling_rate)
    relaxation_params = BrainFlowModelParams(
        BrainFlowMetrics.RELAXATION.value, BrainFlowClassifiers.REGRESSION.value)
    relaxation_model = MLModel(relaxation_params)
    relaxation_model.prepare()
    relaxation_prediction_percent = relaxation_model.predict(feature_vector)
    print('Relaxation: %f' % relaxation_prediction_percent,  flush=True)
    relaxation_model.release()
    return relaxation_prediction_percent


def main():
    # Enable loggers
    BoardShim.enable_board_logger()
    DataFilter.enable_data_logger()
    MLModel.enable_ml_logger()

    type = ''

    # Setting up the board specifications & preparing the board, data, models, & parsing:
    parser = argparse.ArgumentParser()

    # Set up default settings:
    parser.add_argument('--ip-port', type=int,
                        help='ip port', required=False, default=0)
    parser.add_argument('--ip-protocol', type=int, help='ip protocol, check IpProtocolType enum', required=False,
                        default=0)
    parser.add_argument('--ip-address', type=str,
                        help='ip address', required=False, default='')
    parser.add_argument('--other-info', type=str,
                        help='other info', required=False, default='')
    parser.add_argument('--streamer-params', type=str,
                        help='streamer params', required=False, default='')
    parser.add_argument('--serial-number', type=str,
                        help='serial number', required=False, default='')
    parser.add_argument('--file', type=str, help='file',
                        required=False, default='')

    if type == 'ganglion':
        print('EEG Headset determined to be Ganglion')
        parser.add_argument('--serial-port', type=str,
                            help='serial port', required=False, default='COM3')  # COM3
        parser.add_argument('--mac-address', type=str, help='mac address',
                            required=False, default='d2:a0:57:70:bd:01')  # d2:a0:57:70:bd:01
        parser.add_argument('--board-id', type=int, help='board id, check docs to get a list of supported boards',
                            required=False, default=1)  # 1
        parser.add_argument('--timeout', type=int, help='timeout for device discovery or connection', required=False,
                            default=15)  # 15
    else:
        print('EEG Headset is synthetic. If you did not choose this, it means the EEG Headset was not found, not an option, or could not connect.')
        parser.add_argument('--serial-port', type=str,
                            help='serial port', required=False, default='')
        parser.add_argument('--mac-address', type=str,
                            help='mac address', required=False, default='')
        parser.add_argument('--board-id', type=int, help='board id, check docs to get a list of supported boards',
                            required=False, default=-1)
        parser.add_argument('--timeout', type=int, help='timeout for device discovery or connection', required=False,
                            default=0)

    args = parser.parse_args()

    # Set configured data within BrainFlowInputParams
    # TODO: Bring to own function?
    params = BrainFlowInputParams()
    params.ip_port = args.ip_port
    params.serial_port = args.serial_port
    params.mac_address = args.mac_address
    params.other_info = args.other_info
    params.serial_number = args.serial_number
    params.ip_address = args.ip_address
    params.ip_protocol = args.ip_protocol
    params.timeout = args.timeout
    params.file = args.file

    # Create board object, save important default data about the boards
    board = BoardShim(args.board_id, params)
    master_board_id = board.get_board_id()
    sampling_rate = BoardShim.get_sampling_rate(master_board_id)
    eeg_channels_count = BoardShim.get_eeg_channels(int(master_board_id))
    print(
        f'Board ID: {master_board_id}, Sampling rate: {sampling_rate}, Total Channels: {eeg_channels_count}')

    # Starting the streamming session with a buffer of 450000, pausing the script to get the EEG readings
    board.prepare_session()
    print('Preparing to log EEG data')
    board.start_stream(45000, args.streamer_params)
    BoardShim.log_message(LogLevels.LEVEL_INFO.value,
                          'start sleeping in the main thread')
    there_is_still_time = 5

    while(there_is_still_time):
        time.sleep(4)

        # TODO This is using only the eeg data from the second channel, in the future it'd be best to average the values between all of the channels
        eeg_channel = eeg_channels_count[1]

        data = board.get_board_data()
        band_values = get_band_values(data, sampling_rate, eeg_channel)
        concentration_percent = get_concentration_percent(
            data, eeg_channels_count, sampling_rate)
        relaxation_percent = get_relaxation_percent(
            data, eeg_channels_count, sampling_rate)
        eeg_data = {"band_values": band_values,
                    "concentration": concentration_percent, "relaxation": relaxation_percent}
        print(json.dumps(eeg_data))
        there_is_still_time = there_is_still_time - 1

    # Ending the streaming & preparing the data.
    board.stop_stream()
    board.release_session()
    sys.stdout.flush()


if __name__ == "__main__":
    main()
