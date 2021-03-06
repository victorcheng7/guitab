var fs = require('fs');
let wav = require('node-wav');
var db = require('decibels');
var PythonShell = require('python-shell');
var request = require('request');

var cloudconvert = new (require('cloudconvert'))('cAQywWaxUXrkHjYyI7MVGY93oxz_Bc0UAiklefi7EywH4o2YecrWsV7M6xbew0z3zkfHAACvcUCPhQIjjWxS6w');
//NOTE backup key cAQywWaxUXrkHjYyI7MVGY93oxz_Bc0UAiklefi7EywH4o2YecrWsV7M6xbew0z3zkfHAACvcUCPhQIjjWxS6w


//mp3ToWave('c.mp3');
//fourier('c.wav');

module.exports = {
  fourier: function (wavFile, res) {
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
        //console.log("fourier data", data)
        console.log(uint8arrayToString(data));
    });

    // Handle error output
    scriptExecution.stderr.on('data', (data) => {
        // As said before, convert the Uint8Array to a readable string.
        console.log(uint8arrayToString(data));
    });

    scriptExecution.on('exit', (code) => {
        console.log("Process quit with code : " + code);
        if(code == 1){
          res.send({result: "Error process quit with code"});
          return;
        }

        fs.readFile('fourier.txt', function read(err, data) {
            if (err) {
                throw err;
            }
            //Just in case https://nxtpitch.herokuapp.com/
            var req = request.post('http://35.193.223.162:8080/', function (err, resp, body) { //TODO change the endpoint
              if (err) {
                console.log('Error!', err);
                res.send({result: "Error" + err});
              } else {
                console.log(body);
                res.send({result: body});
              }

              fs.writeFile("fourier.txt", "", function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("Emptied fourier.txt");
                });
            });
            var form = req.form();
            form.append('input', data.toString('utf8'), {
              contentType: 'text/plain'
            });
        });
    });
  },
  mp3ToWave: function (mp3File, callback, res) {
    fs.createReadStream('uploads/' + mp3File)
    .pipe(cloudconvert.convert({
        inputformat: 'mp3',
        outputformat: 'wav',
        converteroptions: {
            quality : 75,
        }
     }))
    .pipe(fs.createWriteStream('mp3/' + mp3File.slice(0,-4) + 'converted.wav'))
    .on('finish', function() {
        console.log('Done!');
        callback("./mp3/" + mp3File.slice(0,-4) + 'converted.wav', res);
    });
  }
};
