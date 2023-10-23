declare const process: { [key: string]: any };
declare const __dirname: string;
process.env.TZ = 'UTC';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import './colors';
import * as path from 'path';
import * as express from 'express';

const kmlData = require('./kml-data');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const tileProxy = require('./tile-proxy');
import { ssocketData } from './socket-data';
import * as weather from './weather';

const { sendFile } = require('./send-file');
import { gtgbc } from './gtgbc';
import * as http from 'http';

const PORT = 8080;

const dirname = path.join(__dirname, '../', 'dist');

const app = express();
const ioServer = require('socket.io')(8081);
ssocketData(ioServer, app);
app.use(fileUpload());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());


app.get('/borisbolukbb', weather);

app.get('/gtgbc*', gtgbc);

/**
 * tiler proxy
 */
app.get('/server*', (req, res, next) => {
    res.sendStatus(500);
    res.send('<h4 style="color: darkred; padding: 10px; text-align: center">Permission denied</h4>');
});
app.get('*/hills/:z/:x/:y', tileProxy);

app.post('/import/kml-data', kmlData);

//http://178.62.44.54/?state=&code=5f2bb3d2417d2834a1f0cf240a9d6c7a9ee12558
app.use((req, res, next) => {
    // console.log('req.query.state->',req.query.state)
    if (req.query.gprmc || req.query.id) {

        //res.send('<a href="http://localhost/#/auth/map/strava-invite/'+req.query.code+'">accept</a>')
        next();
        return
    }

    if (req.url.match(/:/)) {
        res.status(500);
        res.end('olol');
        return;
    }
    res.header("Access-Control-Allow-Origin", "http://maxislav.github.io");
    if (req.url.match(/node_modules/)) {
        // console.log('node_modules ->', req.url)
    } else {
        //console.log('req.url ->', req.url)
    }

    if (!req.url.match(/^(\/dist|\/src|\/node|\/lib|\/system|\/langs).+/)) {
        console.log('bot url ->', req.url)
    }

    if (/sprite/.test(req.url)) {
        console.log('sprite', req.url)
    }
    if (/\..{1,4}$/.test(req.url)) {

        console.log('path - >'.yellow, req.url);
        if (/\.(js|css|html|png|gif)$/.test(req.url)) {
            res.set({
                'Cache-control': 'public, max-age=2629000;',
                'Content-Security-Policy': 'upgrade-insecure-requests'
            })
        }
        res.sendFile(dirname + req.url);

    } else {
        console.log('html5', req.url);
        res.set({
            'Content-Security-Policy': 'upgrade-insecure-requests'
        })
        res.sendFile(dirname + '/index.html')
    }

});


app.listen(PORT, () => console.log('started at ' + PORT));
