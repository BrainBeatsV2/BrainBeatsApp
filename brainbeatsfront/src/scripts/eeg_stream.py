
import sys
import argparse
import time
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

def main():
    ganglion = False

    # Setting up the board specifications & preparing the board, data, models, & parsing: 
    BoardShim.enable_board_logger()
    DataFilter.enable_data_logger()
    MLModel.enable_ml_logger()
    parser = argparse.ArgumentParser()

    parser.add_argument('--ip-port', type=int, help='ip port', required=False, default=0)
    parser.add_argument('--ip-protocol', type=int, help='ip protocol, check IpProtocolType enum', required=False,
                        default=0)
    parser.add_argument('--ip-address', type=str, help='ip address', required=False, default='')
    parser.add_argument('--other-info', type=str, help='other info', required=False, default='')
    parser.add_argument('--streamer-params', type=str, help='streamer params', required=False, default='')
    parser.add_argument('--serial-number', type=str, help='serial number', required=False, default='')
    parser.add_argument('--file', type=str, help='file', required=False, default='')

    if ganglion: 
        parser.add_argument('--serial-port', type=str, help='serial port', required=False, default='COM3') #COM3
        parser.add_argument('--mac-address', type=str, help='mac address', required=False, default='d2:a0:57:70:bd:01') #d2:a0:57:70:bd:01
        parser.add_argument('--board-id', type=int, help='board id, check docs to get a list of supported boards',
                            required=False, default=1) # 1
        parser.add_argument('--timeout', type=int, help='timeout for device discovery or connection', required=False,
                    default=15) # 15
    # Defaults to synthetic board 
    else:
        parser.add_argument('--serial-port', type=str, help='serial port', required=False, default='')
        parser.add_argument('--mac-address', type=str, help='mac address', required=False, default='') 
        parser.add_argument('--board-id', type=int, help='board id, check docs to get a list of supported boards',
                            required=False, default=-1)
        parser.add_argument('--timeout', type=int, help='timeout for device discovery or connection', required=False,
                    default=0) 

    args = parser.parse_args()
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

    board = BoardShim(args.board_id, params)
    master_board_id = board.get_board_id()
    sampling_rate = BoardShim.get_sampling_rate(master_board_id)

    # Starting the streamming session with a buffer of 450000, pausing the script to get the EEG readings 
    board.prepare_session()
    board.start_stream(45000, args.streamer_params) 
    BoardShim.log_message(LogLevels.LEVEL_INFO.value, 'start sleeping in the main thread')
    time.sleep(4)  # recommended window size for eeg metric calculation is at least 4 seconds, bigger is better

    # Ending the streaming & preparing the data. 
    data = board.get_board_data()
    board.stop_stream()
    board.release_session()

    # TODO This is using only the eeg data from the second channel, in the future it'd be best to average the values between all of the channels 
    # Apply the fast Fourier transform (FFT) to determine the delta, theta, alpha, beta and gamma
    eeg_channels = BoardShim.get_eeg_channels(int(master_board_id))
    eeg_channel = eeg_channels[1]


    # TODO Possibly add headers
    df = pd.DataFrame(np.transpose(data))
    eeg_data = []

    for i in range(0,4):
        temp = []
        val = int(len(df)/4)
        nfft = DataFilter.get_nearest_power_of_two(int(val/2))
        print(val)
        print(nfft)

        for j in range(0,val): 
            temp.append(data[eeg_channel][int(j+i*len(df)/4)])

        DataFilter.detrend(np.array(temp), DetrendOperations.LINEAR.value)
        psd = DataFilter.get_psd_welch(np.array(temp), nfft, nfft // 2, sampling_rate, WindowFunctions.HANNING.value)
        print(psd)

        # Have to have get_band_power in try excepts since if the finds 0 deltas, it will throw an error 
        try: 
            delta = DataFilter.get_band_power(psd, 0.5, 4.0)
        except: delta = 0.0 

        try: 
            theta = DataFilter.get_band_power(psd, 4.1, 7.9)
        except: theta = 0.0
        
        try: 
            alpha = DataFilter.get_band_power(psd, 8.0, 13.9)
        except: alpha = 0.0 

        try: 
            beta = DataFilter.get_band_power(psd, 14.0, 31.0)
        except: beta = 0.0 

        try: 
            gamma = DataFilter.get_band_power(psd, 32.0, 100.0)
        except: gamma = 0.0 

        print("Overall:")
        print("Delta %f" % delta)
        print("Theta %f" % theta)
        print("Alpha %f" % alpha)
        print("Beta %f" % beta)
        print("Gamma %f" % gamma)

        cur_eeg_data = []
        cur_eeg_data.append(delta)
        cur_eeg_data.append(theta)
        cur_eeg_data.append(alpha)
        cur_eeg_data.append(beta)
        cur_eeg_data.append(gamma)
        print(cur_eeg_data)
        eeg_data.append(cur_eeg_data)

    DataFilter.write_file(np.array(eeg_data), 'eeg_data.csv', 'w')  # use 'a' for append mode

    # Create the feature vector for the machine learning models
    bands = DataFilter.get_avg_band_powers(data, eeg_channels, sampling_rate, True)
    feature_vector = np.concatenate((bands[0], bands[1]))

    # calc concentration
    concentration_params = BrainFlowModelParams(BrainFlowMetrics.CONCENTRATION.value, BrainFlowClassifiers.KNN.value)
    concentration = MLModel(concentration_params)
    concentration.prepare()
    print('Concentration: %f' % concentration.predict(feature_vector),  flush=True)
    concentration.release()

    # calc relaxation
    relaxation_params = BrainFlowModelParams(BrainFlowMetrics.RELAXATION.value, BrainFlowClassifiers.REGRESSION.value)
    relaxation = MLModel(relaxation_params)
    relaxation.prepare()
    print('Relaxation: %f' % relaxation.predict(feature_vector),  flush=True)
    relaxation.release()

    DataFilter.write_file(data, 'raw_channel_data.csv', 'w')  # use 'a' for append mode
    restored_data = DataFilter.read_file('raw_channel_data.csv')
    restored_df = pd.DataFrame(np.transpose(restored_data))
    print('Data From the File')
    print(restored_df)

    print(eeg_data,  flush=True)
    sys.stdout.flush()

if __name__ == "__main__":
    main()