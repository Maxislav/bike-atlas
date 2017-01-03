/**
 * Created by maxislav on 20.10.16.
 */
//const livereload = require('express-livereload');
const path = require('path');
const express = require('express');
const port = 8080;
const kmlData = require('./kml-data');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const tileProxy = require('./tile-proxy');
const socketData = require('./socket-data');





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

//server.listen(8081);
let timeout;
let k = 0;
let kSrc = 0;
let kCss = 0;
let kMyJs = 0;
let kNM = 0;


/**
 * tiler proxy
 */
app.get('*/hills/:z/:x/:y', tileProxy);

app.post('/import/kml-data',kmlData);
//app.use(express.bodyParser());

app.get("*", function (req, res, next) {
  let reqUrl = ''  ;
  if(req.url.match(/^\/app/)){
    reqUrl+='/src/'+req.url
  }else{
    reqUrl+=req.url
  }
  req.url = reqUrl;
  next()
});

app.use((req, res, next)=>{

  if(/src.+\.(html|css)$/.test(req.url)){
    req.url = req.url.replace('src', 'dist')
  }
  
  if(/sprite/.test(req.url)){
    console.log('sprite', req.url)
  }
  if(/\..{1,4}$/.test(req.url)){
    
    switch (true){
      case /\.css$/.test(req.url):
      case /^\/src.+\.js$/.test(req.url):
      case /node_modules/.test(req.url):
        req.url = path.normalize(req.url)
        console.log('files', req.url);
        res.sendFile(dirname +req.url);
        break;
      default:
        next()
    }
    timeout && clearTimeout(timeout);
    timeout = setTimeout(()=>{
      console.info('Scripts src ->', kMyJs );
      console.info('Scripts node_module ->', kNM );
      console.info('Styles css ->', kCss );
      k=0;
      kMyJs = 0;
      kNM = 0;
      kCss = 0;
    }, 1000);
    k++;

  }else{
    console.log('html5', req.url);
    res.sendFile(dirname + '/index.html')
  }




});




app.get('/node_modules*', function(req, res) {
  //console.log("node_modules -> ", req.url)
  if(/^\/node_m/.test(req.url)){
    res.sendFile(dirname +req.url)
  }else{
    res.sendFile(dirname +'/src/app/' +req.url)
  }

});

app.get('/*template*', function(req, res) {
  //console.log(req.url)
  res.sendFile(dirname + req.url)
});
app.get('*', function(req, res) {
  //console.log(req.url)
  res.sendFile(dirname + req.url)
});





app.listen(port,()=>console.log('started at '+port));