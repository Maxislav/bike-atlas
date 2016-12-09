/**
 * Created by maxislav on 20.10.16.
 */
const livereload = require('express-livereload');
const path = require('path');
const express = require('express');
const port = 8080;
const kmlData = require('./kml-data');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');




const dirname =  path.normalize(__dirname+'/../');

const app = express();

app.use(fileUpload());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

livereload(app, {
  watchDir: dirname + '/dist'
});
var server = require('http').Server(app);
var io = require('socket.io')(server);
const ss = require('socket.io-stream');

server.listen(8081);
let timeout;
let k = 0;
let kSrc = 0;
let kCss = 0;
let kMyJs = 0;
let kNM = 0;

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
  //console.log(req.url)

  if(/src.+\.(html|css)$/.test(req.url)){
    req.url = req.url.replace('src', 'dist')
  }
  if(/\..{1,4}$/.test(req.url)){
    if(/\.css$/.test(req.url)){
      res.sendFile(dirname +req.url)
      //console.log('css  ', req.url)
      kCss++;
    }else  if(/^\/src.+\.js$/.test(req.url)){
      res.sendFile(dirname +req.url)
      //console.log('js  ', req.url)
      kMyJs++;
    }else  if(/node_modules/.test(req.url)){
      res.sendFile(dirname +req.url)
      // console.log('node', req.url)
      kNM++;
    }else{
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
    path
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

//app.use(express.static(__dirname));


app.get('/*template*', function(req, res) {
  //console.log(req.url)
  res.sendFile(dirname + req.url)
});
app.get('*', function(req, res) {
  //console.log(req.url)
  res.sendFile(dirname + req.url)
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  ss(socket).on('file', function(stream) {
    let data = [];
    stream.on('data', (d)=>{
      data.push(d);
    });
    stream.on('end', (e, d)=>{
      console.log("file send")
      socket.emit('file', Buffer.concat(data));
    });
  });
});




app.listen(port,()=>console.log('started at '+port));