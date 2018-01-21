var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var uuidv4 = require('uuid/v4');
var multer = require('multer');
var Loki = require('lokijs');
var del = require('del');

const DB_NAME = 'db.json';
const COLLECTION_NAME = 'mp3';
const UPLOAD_PATH = './uploads/'
const upload = multer({ dest: `${UPLOAD_PATH}/` }); // multer configuration
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: 'fs' });
const loadCollection = function (colName, db: Loki): Promise<LokiCollection<any>> {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName);
            resolve(_collection);
        })
    });
}

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  res.render('index');
});


app.post("/postmp3", upload.single('avatar'), async (req, res) => {
  try {
        const col = await loadCollection(COLLECTION_NAME, db);
        const data = col.insert(req.file);

        db.saveDatabase();
        res.send({ id: data.$loki, fileName: data.filename, originalName: data.originalname });
    } catch (err) {
        res.sendStatus(400);
    }
});

app.listen(process.env.PORT || 5000, () => console.log("Server started"));
