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

# Easy way to control if the developer wants to have the debug values print or write to csv
# When this script is communicating with node, the only print statement should be the EEG data!
# The print option is for when the developer wants to see the print values when just running the script by itself

DEBUG_MODE = ''
DEBUG_OPTIONS = ['', 'write_file', 'print']

def configure_eeg_headset():
    """ Configures EEG Headset board specifications for Ganglion and synthetic boards """
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

    # print_debug('EEG Headset determined to be Ganglion')
    parser.add_argument('--serial-port', type=str,
                        help='serial port', required=False, default='COM3')  # COM3
    parser.add_argument('--mac-address', type=str, help='mac address',
                        required=False, default='')  # d2:a0:57:70:bd:01
    parser.add_argument('--board-id', type=int, help='board id, check docs to get a list of supported boards',
                        required=False, default=1)  # 1
    parser.add_argument('--timeout', type=int, help='timeout for device discovery or connection', required=False,
                        default=30)  # 15

    for arg, value in sorted(vars(parser.parse_args()).items()):
            print_debug("Argument " + str(arg) + " val: " + str(value))

    return parser


def get_band_values(data, sampling_rate, eeg_channel):
    """Gets delta, theta, alpha, beta, & gamma values at current point"""

    df = pd.DataFrame(np.transpose(data))
    nfft = DataFilter.get_nearest_power_of_two(sampling_rate)
    temp = []

    for j in range(0, int(len(df)-1)):
        temp.append(data[eeg_channel][int(j)])

    DataFilter.detrend(np.array(temp), DetrendOperations.LINEAR.value)
    psd = DataFilter.get_psd_welch(data=np.array(temp), nfft=nfft, overlap=nfft //
                                   2, sampling_rate=sampling_rate, window=WindowFunctions.BLACKMAN_HARRIS.value)

    # get_band_power must be in a try excepts since if the finds 0 or less, it will throw an error
    try:
        delta = round(DataFilter.get_band_power(psd, 0.5, 4.0), 3)
    except:
        delta = 0.0
    try:
        theta = round(DataFilter.get_band_power(psd, 4.1, 7.9), 3)
    except:
        theta = 0.0
    try:
        alpha = round(DataFilter.get_band_power(psd, 8.0, 13.9), 3)
    except:
        alpha = 0.0
    try:
        beta = round(DataFilter.get_band_power(psd, 14.0, 31.0), 3)
    except:
        beta = 0.0
    try:
        gamma = round(DataFilter.get_band_power(psd, 32.0, 100.0), 3)
    except:
        gamma = 0.0

    all_band_values = {"delta": delta, "theta": theta,
                       "alpha": alpha, "beta": beta, "gamma": gamma}

    print_debug(str(all_band_values))
    return all_band_values


def get_feature_vector(data, eeg_channels_count, sampling_rate):
    bands = DataFilter.get_avg_band_powers(data, eeg_channels_count, sampling_rate, True)
    feature_vector = np.concatenate((bands[0], bands[1]))
    return feature_vector


def get_concentration_percent(data, eeg_channels_count, sampling_rate):
    """Gets BrainFlow Concentration ML Prediction"""
    feature_vector = get_feature_vector(
        data, eeg_channels_count, sampling_rate)
    concentration_params = BrainFlowModelParams(
        BrainFlowMetrics.CONCENTRATION.value, BrainFlowClassifiers.KNN.value)
    concentration_model = MLModel(concentration_params)
    concentration_model.prepare()

    concentration_prediction_percent = round(concentration_model.predict(
        feature_vector)*100, 3)
    print_debug(
        f'Concentration: {concentration_prediction_percent}')
    concentration_model.release()
    return concentration_prediction_percent


def get_relaxation_percent(data, eeg_channels_count, sampling_rate):
    feature_vector = get_feature_vector(
        data, eeg_channels_count, sampling_rate)
    relaxation_params = BrainFlowModelParams(
        BrainFlowMetrics.RELAXATION.value, BrainFlowClassifiers.REGRESSION.value)
    relaxation_model = MLModel(relaxation_params)
    relaxation_model.prepare()
    relaxation_prediction_percent = round(relaxation_model.predict(
        feature_vector)*100, 3)
    print_debug(f'Relaxation: {relaxation_prediction_percent}')
    relaxation_model.release()
    return relaxation_prediction_percent


def main():
    # Enable loggers
    BoardShim.enable_board_logger()
    DataFilter.enable_data_logger()
    MLModel.enable_ml_logger()

    # Determine EEG Params:
    parser = configure_eeg_headset()
    eeg_args = parser.parse_args()

    # Set configured data within BrainFlowInputParams
    # TODO: Bring to own function?
    params = BrainFlowInputParams()
    params.ip_port = eeg_args.ip_port
    params.serial_port = eeg_args.serial_port
    params.mac_address = eeg_args.mac_address
    params.other_info = eeg_args.other_info
    params.serial_number = eeg_args.serial_number
    params.ip_address = eeg_args.ip_address
    params.ip_protocol = eeg_args.ip_protocol
    params.timeout = eeg_args.timeout
    params.file = eeg_args.file

    # Create board object, save important default data about the boards
    board = BoardShim(eeg_args.board_id, params)
    master_board_id = board.get_board_id()
    sampling_rate = BoardShim.get_sampling_rate(master_board_id)
    eeg_channels_count = BoardShim.get_eeg_channels(int(master_board_id))
    print_debug(
        f'Board ID: {master_board_id}, Sampling rate: {sampling_rate}, Total Channels: {eeg_channels_count}')

    print_debug(' Preparing board to stream EEG data...')
    if (eeg_args.board_id == 1):
        while True: 
            try:
                board.prepare_session()
                board.start_stream(45000, eeg_args.streamer_params)
                BoardShim.log_message(LogLevels.LEVEL_INFO.value,
                                    'start sleeping in the main thread')
                break
            except BrainFlowError: 
                print_debug("Brainflow failed to connect to the board")
    else: 
        board.prepare_session()
        board.start_stream(45000, eeg_args.streamer_params)
        BoardShim.log_message(LogLevels.LEVEL_INFO.value,
                    'start sleeping in the main thread')

    # Brainflow recommends waiting at least collectively 4 seconds for the first EEG reading
    time.sleep(2.7)
    nfft = DataFilter.get_nearest_power_of_two(int(sampling_rate))
    waitTime = 1.3
    while(True):
        # Wait the smallest amount of time between each snapshot!
        time.sleep(waitTime)

        # TODO This is using only the eeg data from the second channel, in the future it'd be best to average the values between all of the channels
        first_channel = eeg_channels_count[0]
        second_channel = eeg_channels_count[1]
        third_channel = eeg_channels_count[2]
        fourth_channel = eeg_channels_count[3]
        eeg_channel = eeg_channels_count[1]
        data = board.get_board_data()
        data_len = len(np.transpose(data))

        if (data_len > nfft): 
            band_values = get_band_values(data, sampling_rate, eeg_channel)
            first_values= get_band_values(data, sampling_rate, first_channel)
            second_values = get_band_values(data, sampling_rate, second_channel)
            third_values = get_band_values(data, sampling_rate, third_channel)
            fourth_values = get_band_values(data, sampling_rate, fourth_channel)
            concentration_percent = get_concentration_percent(
                data, eeg_channels_count, sampling_rate)
            relaxation_percent = get_relaxation_percent(
                data, eeg_channels_count, sampling_rate)
            eeg_data = {"band_values": band_values, "first_values": first_values, "second_values": second_values, "third_values": third_values, "fourth_values": fourth_values,
                        "concentration": concentration_percent, "relaxation": relaxation_percent}
            print(str(json.dumps(eeg_data)))
            # Required to flush output for python to allow for python to output script!!!
            sys.stdout.flush()
        # time.sleep(1)
        else: 
            waitTime = waitTime + 1


def print_debug(string):
    if DEBUG_MODE == 'print':
        print(string)
    if DEBUG_MODE == 'write_file': 
        file1 = open("myfile.txt", "a")  
        file1.write(str(string))
        file1.write(str("\n"))
        file1.close()   



if __name__ == "__main__":
    main()
