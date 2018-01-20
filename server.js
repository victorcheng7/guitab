var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var uuidv4 = require('uuid/v4');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/", (req, res) => {

});

app.get("/getchords", (req, res) => {

});

app.listen(process.env.PORT || 5000, () => console.log("Server started"));
