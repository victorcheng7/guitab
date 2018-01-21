import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as multer from 'multer'
import * as cors from 'cors'
import * as fs from 'fs'
import * as path from 'path'
import * as Loki from 'lokijs'
import { audioFilter, loadCollection, cleanFolder } from './utils';
var efp = require("express-form-post");
var mp3ToBin = require('../mp3ToBin');
var request = require('request');

const DB_NAME = 'db.json';
const COLLECTION_NAME = 'audio';
const UPLOAD_PATH = 'uploads';
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.mp3')
  }
})
const upload = multer({storage: storage, fileFilter: audioFilter});
//const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: audioFilter });
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: 'fs' });

// optional: clean all data before start
//cleanFolder(UPLOAD_PATH);
const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', '.ejs');
app.use(express.static(__dirname + '/../public'));

app.get("/", (req, res) => {
  res.render('index');
});

app.post("/postmp3", upload.single('audio'), async (req, res) => {
    try{
        const col = await loadCollection(COLLECTION_NAME, db);
        const data = col.insert(req.file);

        //console.log(data);
        db.saveDatabase();
        //res.send({ id: data.$loki, fileName: data.filename, originalName: data.originalname });

        var fourierResult;
        if(data.mimetype === "audio/mp3"){
          mp3ToBin.mp3ToWave(data.filename);
          mp3ToBin.fourier("./mp3/" + data.filename + 'converted.wav', res);
        }
        else if (data.mimetype === "audio/wav"){
          mp3ToBin.fourier("./uploads/" + data.filename, res);
        }
    }
    catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
});
/*
fs.readFile('./uploads/' + data.filename, function read(err, data) {
    if (err) {
        throw err;
    }
    console.log(data);   // Put all of the code here (not the best solution)
    //processFile();          // Or put the next step in a function and invoke it
});

const formPost = efp({
    store: "disk",
    directory: path.join(__dirname, "tmp"),
    maxfileSize: 10000000,
    filename: function(req, file, cb) {
        cb(Date.now() + "-" + "yo");
    },
    validateFile: function(file, cb) {
        if(file.mimetype != "audio/wav") {
            return cb(false);
        }
        return cb();
    },
    validateBody: function(body, cb) {
        // validates password length before uploading file
        if(body.password.length > 7) {
            return cb(false);
        }
        cb();
    }
});

app.post("/upload", formPost.middleware(), function(req, res, next) {
    console.log("I just received files", req.files);
    res.send("Upload successful!");
});
*/
app.listen(3000, function () {
    console.log('listening on port 3000!');
})
