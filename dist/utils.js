"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const del = require("del");
const audioFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(mp3|wav)$/)) {
        return cb(new Error('Only mp3 and wav files are allowed!'), false);
    }
    cb(null, true);
};
exports.audioFilter = audioFilter;
const loadCollection = function (colName, db) {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName);
            resolve(_collection);
        });
    });
};
exports.loadCollection = loadCollection;
const cleanFolder = function (folderPath) {
    // delete files inside folder but not the folder itself
    del.sync([`${folderPath}/**`, `!${folderPath}`]);
};
exports.cleanFolder = cleanFolder;
//# sourceMappingURL=utils.js.map