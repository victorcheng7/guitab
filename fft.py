#!/usr/bin/env python

from __future__ import print_function

import sys
import struct
import wave
import sys
import csv
import pickle
import os
import glob

import numpy as np

FPS = 25.0

nFFT = 512
BUF_SIZE = 4 * nFFT
SAMPLE_SIZE = 2
CHANNELS = 1
RATE = 16000

numpixels = 60

def animate(i, wf, MAX_y):
 N = (int((i + 1) * RATE / FPS) - wf.tell()) / nFFT
 if not N:
   return line,
 N *= nFFT
 data = wf.readframes(N)
 # print('{:5.1f}% - V: {:5,d} - A: {:10,d} / {:10,d}'.format(
 #   100.0 * wf.tell() / wf.getnframes(), i, wf.tell(), wf.getnframes()
 # ))

 # Unpack data
 y = np.array(struct.unpack("%dh" % (len(data) / wf.getsampwidth()), data)) / MAX_y

 if wf.getnchannels() == 2:
   y = y[::2]

 Y_L = np.fft.fft(y, nFFT)
 Y = list(abs(Y_L[-nFFT / 2:-1]))

 #return Y
 return [y if y > 0.001 else 0 for y in Y]

def fft(file):
  MAX_y = 2.0 ** (SAMPLE_SIZE * 8 - 1)
  wf = wave.open(file, 'rb')
  #assert wf.getnchannels() == CHANNELS
  #assert wf.getsampwidth() == SAMPLE_SIZE
  #RATE = wf.getframerate()
  #assert wf.getframerate() == RATE
  frames = wf.getnframes()

  output = list()

  for i in xrange(int(frames / RATE * FPS)):
    frame = animate(i, wf, MAX_y)
    if frame[0] > 0.001:
      output.append(frame)

  wf.close()

  return output

fourierList = fft(str(sys.argv[1]));
#print(fourierList)
#fourierString = ''.join(str(e) for e in fourierList)
fh = open("fourier.txt","w")
fh.write(str(fourierList))
fh.close()
