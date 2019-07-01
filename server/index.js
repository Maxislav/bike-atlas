/**
 * Created by maxislav on 20.10.16.
 */
process.env.TZ = 'UTC';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//const livereload = require('express-livereload');
const path = require('path');
const express = require('express');
const port = 8080;
const kmlData = require('./kml-data');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const tileProxy = require('./tile-proxy');
const socketData = require('./socket-data');
const weather = require('./weather');
const {sendFile} = require('./send-file');
const gtgbc = require('./gtgbc');




const colors = {
    Reset : "\x1b[0m",
    Bright : "\x1b[1m",
    Dim : "\x1b[2m",
    Underscore : "\x1b[4m",
    Blink : "\x1b[5m",
    Reverse : "\x1b[7m",
    Hidden : "\x1b[8m",

    FgBlack : "\x1b[30m",
    FgRed : "\x1b[31m",
    FgGreen : "\x1b[32m",
    FgYellow : "\x1b[33m",
    FgBlue : "\x1b[34m",
    FgMagenta : "\x1b[35m",
    FgCyan : "\x1b[36m",
    FgWhite : "\x1b[37m",

    BgBlack : "\x1b[40m",
    BgRed : "\x1b[41m",
    BgGreen : "\x1b[42m",
    BgYellow : "\x1b[43m",
    BgBlue : "\x1b[44m",
    BgMagenta : "\x1b[45m",
    BgCyan : "\x1b[46m",
    BgWhite : "\x1b[47m"
};

Object.defineProperties(String.prototype, {
    yellow: {
        get: function () {
            return colors.FgYellow.concat(this).concat(colors.Reset)
        }
    },
    green: {
        get: function () {
            return colors.FgGreen.concat(this).concat(colors.Reset)
        }
    },
    blue: {
        get: function () {
            return colors.FgBlue.concat(this).concat(colors.Reset)
        }
    },
    red: {
        get: function () {
            return colors.FgRed.concat(this).concat(colors.Reset)
        }
    }
})



const dirname =  path.normalize(__dirname+'/../');

const app = express();

app.use(fileUpload());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


/*
livereload(app, {
  watchDir: dirname + '/dist'
});*/
const server = require('http').Server(app);
server.listen(8081);
socketData(server, app);


app.get('/borisbolukbb', weather);

app.get('/gtgbc*', gtgbc);

/**
 * tiler proxy
 */
app.get('/server*',(req, res, next)=>{
  res.setStatus = 500;
  res.send('<h4 style="color: darkred; padding: 10px; text-align: center">Permission denied</h4>');

} );
app.get('*/hills/:z/:x/:y', tileProxy);

app.post('/import/kml-data',kmlData);

//http://178.62.44.54/?state=&code=5f2bb3d2417d2834a1f0cf240a9d6c7a9ee12558
app.use((req, res, next)=>{
 // console.log('req.query.state->',req.query.state)
  if(req.query.gprmc){

    //res.send('<a href="http://localhost/#/auth/map/strava-invite/'+req.query.code+'">accept</a>')
      next();
    return
  }

  if(req.url.match(/:/)){
    res.status(500);
    res.end('olol');
    return;
  }
  res.header("Access-Control-Allow-Origin", "http://maxislav.github.io");
  if(req.url.match(/node_modules/)){
   // console.log('node_modules ->', req.url)
  }else {
      //console.log('req.url ->', req.url)
  }

  if(!req.url.match(/^(\/dist|\/src|\/node|\/lib|\/system|\/langs).+/)){
      console.log('bot url ->', req.url)
  }

  if(/sprite/.test(req.url)){
    console.log('sprite', req.url)
  }
  if(/\..{1,4}$/.test(req.url)){

    console.log('path - >'.yellow, req.url);
    if(/\.(js|css|html|png|gif)$/.test(req.url)){
      res.set({
	      'Cache-control': 'public, max-age=2629000;',
      })
    }
    res.sendFile(dirname + req.url);

  }else{
    console.log('html5', req.url);
    res.sendFile(dirname + '/index.html')
  }

});







app.listen(port,()=>console.log('started at '+port));
