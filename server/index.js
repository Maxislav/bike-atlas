/**
 * Created by maxislav on 20.10.16.
 */
process.env.TZ = 'UTC';
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

/**
 * tiler proxy
 */
app.get('/server*',(req, res, next)=>{
  res.setStatus = 500;
  res.send('<h4 style="color: darkred; padding: 10px; text-align: center">Permission denied</h4>');

} );
app.get('*/hills/:z/:x/:y', tileProxy);

app.post('/import/kml-data',kmlData);


app.use((req, res, next)=>{
  console.log('req.url ->', req.url)

  
  if(/sprite/.test(req.url)){
    console.log('sprite', req.url)
  }
  if(/\..{1,4}$/.test(req.url)){
    res.sendFile(dirname + req.url);
  }else{
    console.log('html5', req.url);
    res.sendFile(dirname + '/index.html')
  }




});






app.listen(port,()=>console.log('started at '+port));
