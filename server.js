/**
 * Created by maxislav on 20.10.16.
 */
let express = require('express');

const port = 8080;

let app = express();
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

  if(/\..{1,4}$/.test(req.url)){
    if(/\.css$/.test(req.url)){
      res.sendFile(__dirname +req.url)
       console.log('css  ', req.url)
      kCss++;
    }else  if(/^\/src.+\.js$/.test(req.url)){
      res.sendFile(__dirname +req.url)
     // console.log('js  ', req.url)
      kMyJs++;
    }else  if(/node_modules/.test(req.url)){
      res.sendFile(__dirname +req.url)
      // console.log('node', req.url)
      kNM++;
    }
    else{
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
    res.sendFile(__dirname + '/index.html')  
  }
  
  
  
  
});




app.get('/node_modules*', function(req, res) {
  //console.log("node_modules -> ", req.url)
  if(/^\/node_m/.test(req.url)){
    res.sendFile(__dirname +req.url)
  }else{
    res.sendFile(__dirname +'/src/app/' +req.url)  
  }
  
});

//app.use(express.static(__dirname));


app.get('/*template*', function(req, res) {
  //console.log(req.url)
  res.sendFile(__dirname + req.url)
});
app.get('*', function(req, res) {
  //console.log(req.url)
  res.sendFile(__dirname + req.url)
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
      socket.emit('file', Buffer.concat(data));
    });
  });
});




app.listen(port,()=>console.log('started at '+port));