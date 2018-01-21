var fs = require('fs');
let wav = require('node-wav');
var db = require('decibels');
var PythonShell = require('python-shell');

//var wav = require('wav');
//var Speaker = require('speaker');
var cloudconvert = new (require('cloudconvert'))('59gWXStyZW-QLDnb7A9rj5pi7ki5goBcKVKty491pzcd1YoiNJmSShFA8H4Sm2Qe3IRLf8VluYDZFSTYqRdtDQ');

//mp3ToWave('c.mp3');
//fourierIntermediary('c.wav');

//fourier('c.wav');

module.exports = {
  fourier: function (wavFile) {
    var myPythonScript = "fft.py";
    var pythonExecutable = "python";

    // Function to convert an Uint8Array to a string
    var uint8arrayToString = function(data){
        return String.fromCharCode.apply(null, data);
    };

    const spawn = require('child_process').spawn;
    const scriptExecution = spawn(pythonExecutable, [myPythonScript, wavFile]);

    // Handle normal output
    scriptExecution.stdout.on('data', (data) => {
        console.log(uint8arrayToString(data));
    });

    // Handle error output
    scriptExecution.stderr.on('data', (data) => {
        // As said before, convert the Uint8Array to a readable string.
        console.log(uint8arrayToString(data));
    });

    scriptExecution.on('exit', (code) => {
        console.log("Process quit with code : " + code);
    });
    },
  mp3ToWave: function (mp3File) {
    fs.createReadStream(mp3File)
    .pipe(cloudconvert.convert({
        inputformat: 'mp3',
        outputformat: 'wav',
        converteroptions: {
            quality : 75,
        }
     }))
    .pipe(fs.createWriteStream('c.wav'))
    .on('finish', function() {
        console.log('Done!');
    });
  }
};
/*
function fourier(wavData){
    var myPythonScript = "fft.py";
    var pythonExecutable = "python";

    // Function to convert an Uint8Array to a string
    var uint8arrayToString = function(data){
        return String.fromCharCode.apply(null, data);
    };

    const spawn = require('child_process').spawn;
    const scriptExecution = spawn(pythonExecutable, [myPythonScript, wavData]);

    // Handle normal output
    scriptExecution.stdout.on('data', (data) => {
        console.log(uint8arrayToString(data));
    });

    // Handle error output
    scriptExecution.stderr.on('data', (data) => {
        // As said before, convert the Uint8Array to a readable string.
        console.log(uint8arrayToString(data));
    });

    scriptExecution.on('exit', (code) => {
        console.log("Process quit with code : " + code);
    });
}

function mp3ToWave(mp3File){
  fs.createReadStream(mp3File)
  .pipe(cloudconvert.convert({
      inputformat: 'mp3',
      outputformat: 'wav',
      converteroptions: {
          quality : 75,
      }
   }))
  .pipe(fs.createWriteStream('c.wav'))
  .on('finish', function() {
      console.log('Done!');
  });
}
*/
/*
function fourierIntermediary(wavFile){
  let buffer = fs.readFileSync(wavFile);
  let result = wav.decode(buffer);
  /*
  console.log(result.sampleRate);
  console.log(result.channelData); // array of Float32Arrays

  wav.encode(result.channelData, { sampleRate: result.sampleRate, float: true, bitDepth: 32 });\
  fourier(result.channelData); //TODO what are the parameters
}*/
