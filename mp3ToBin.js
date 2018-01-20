var fs = require('fs');
let wav = require('node-wav');
//var wav = require('wav');
//var Speaker = require('speaker');
var cloudconvert = new (require('cloudconvert'))('59gWXStyZW-QLDnb7A9rj5pi7ki5goBcKVKty491pzcd1YoiNJmSShFA8H4Sm2Qe3IRLf8VluYDZFSTYqRdtDQ');

//mp3ToWave('c.mp3');
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

fourier('c.wav');

function fourier(waveFile){
  let buffer = fs.readFileSync('c.wav');
  let result = wav.decode(buffer);
  console.log(result.sampleRate);
  console.log(result.channelData); // array of Float32Arrays

  wav.encode(result.channelData, { sampleRate: result.sampleRate, float: true, bitDepth: 32 });
}
