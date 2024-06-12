const path = require('path');
const api = require('./api.js');
const apimessages = require('./apimessages.js');
// Détermine le répertoire de base
const basedir = path.normalize(path.dirname(__dirname));
console.debug(`Base directory: ${basedir}`);

express = require('express');
const app = express()
api_1 = require("./api.js");
const session = require("express-session");
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cors());

app.use(session({
    secret: "technoweb rocks",
    resave: true,
    saveUninitialized: false
}));

app.use('/api', api.default());
app.use('/apimessages', apimessages.default());
// Démarre le serveur
app.on('close', () => {
});
exports.default = app;

