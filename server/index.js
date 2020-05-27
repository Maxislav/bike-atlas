"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.TZ = 'UTC';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require("./colors");
const path = require("path");
const express = require("express");
const kmlData = require('./kml-data');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const tileProxy = require('./tile-proxy');
const socket_data_1 = require("./socket-data");
const weather = require("./weather");
const { sendFile } = require('./send-file');
const gtgbc_1 = require("./gtgbc");
const http = require("http");
const PORT = 8080;
const dirname = path.join(__dirname, '../', 'dist');
const app = express();
app.use(fileUpload());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const server = new http.Server(app);
server.listen(8081);
socket_data_1.ssocketData(server, app);
app.get('/borisbolukbb', weather);
app.get('/gtgbc*', gtgbc_1.gtgbc);
/**
 * tiler proxy
 */
app.get('/server*', (req, res, next) => {
    res.setStatus = 500;
    res.send('<h4 style="color: darkred; padding: 10px; text-align: center">Permission denied</h4>');
});
app.get('*/hills/:z/:x/:y', tileProxy);
app.post('/import/kml-data', kmlData);
//http://178.62.44.54/?state=&code=5f2bb3d2417d2834a1f0cf240a9d6c7a9ee12558
app.use((req, res, next) => {
    // console.log('req.query.state->',req.query.state)
    if (req.query.gprmc) {
        //res.send('<a href="http://localhost/#/auth/map/strava-invite/'+req.query.code+'">accept</a>')
        next();
        return;
    }
    if (req.url.match(/:/)) {
        res.status(500);
        res.end('olol');
        return;
    }
    res.header("Access-Control-Allow-Origin", "http://maxislav.github.io");
    if (req.url.match(/node_modules/)) {
        // console.log('node_modules ->', req.url)
    }
    else {
        //console.log('req.url ->', req.url)
    }
    if (!req.url.match(/^(\/dist|\/src|\/node|\/lib|\/system|\/langs).+/)) {
        console.log('bot url ->', req.url);
    }
    if (/sprite/.test(req.url)) {
        console.log('sprite', req.url);
    }
    if (/\..{1,4}$/.test(req.url)) {
        console.log('path - >'.yellow, req.url);
        if (/\.(js|css|html|png|gif)$/.test(req.url)) {
            res.set({
                'Cache-control': 'public, max-age=2629000;',
            });
        }
        res.sendFile(dirname + req.url);
    }
    else {
        console.log('html5', req.url);
        res.sendFile(dirname + '/index.html');
    }
});
app.listen(PORT, () => console.log('started at ' + PORT));
//# sourceMappingURL=index.js.map