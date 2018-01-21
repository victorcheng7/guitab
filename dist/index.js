"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const Loki = require("lokijs");
const utils_1 = require("./utils");
var efp = require("express-form-post");
var mp3ToBin = require('../mp3ToBin');
var request = require('request');
const DB_NAME = 'db.json';
const COLLECTION_NAME = 'audio';
const UPLOAD_PATH = 'uploads';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        if (file.mimetype === "audio/mp3")
            cb(null, Date.now() + '.mp3');
        else if (file.mimetype === "audio/wav")
            cb(null, Date.now() + '.wav');
    }
});
const upload = multer({ storage: storage, fileFilter: utils_1.audioFilter });
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
app.post("/postmp3", upload.single('audio'), (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const col = yield utils_1.loadCollection(COLLECTION_NAME, db);
        const data = col.insert(req.file);
        //console.log(data);
        db.saveDatabase();
        //res.send({ id: data.$loki, fileName: data.filename, originalName: data.originalname });
        var fourierResult;
        if (data.mimetype === "audio/mp3") {
            mp3ToBin.mp3ToWave(data.filename, mp3ToBin.fourier, res);
            //mp3ToBin.fourier("./mp3/" + data.filename.slice(0,-4) + 'converted.wav', res);
        }
        else if (data.mimetype === "audio/wav") {
            mp3ToBin.fourier("./uploads/" + data.filename, res);
        }
    }
    catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}));
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
});
//# sourceMappingURL=index.js.map