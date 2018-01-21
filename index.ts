import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as multer from 'multer'
import * as cors from 'cors'
import * as fs from 'fs'
import * as path from 'path'
import * as Loki from 'lokijs'
import { audioFilter, loadCollection, cleanFolder } from './utils';
var efp = require("express-form-post");


const DB_NAME = 'db.json';
const COLLECTION_NAME = 'audio';
const UPLOAD_PATH = 'uploads';
const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: audioFilter });
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: 'fs' });

// optional: clean all data before start
//cleanFolder(UPLOAD_PATH);
const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', '.ejs');
console.log(__dirname);
app.use(express.static(__dirname + '/../public'));

app.get("/", (req, res) => {
  res.render('index');
});

app.post("/postmp3", upload.single('audio'), async (req, res) => {
      try{
        const col = await loadCollection(COLLECTION_NAME, db);
        const data = col.insert(req.file);
        console.log("---------------------------");
        console.log(data);
        db.saveDatabase();
        res.send({ id: data.$loki, fileName: data.filename, originalName: data.originalname });
        //TODO include Vaibhav's data
      }
      catch (err) {
        console.log(err);
        res.sendStatus(400);
      }
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

app.listen(3000, function () {
    console.log('listening on port 3000!');
})
