/**
 * Created by maxislav on 20.10.16.
 */
let express = require('express');

const port = 8080;

let app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(8081);
let timeout; 
let k = 0;
let kSrc = 0;
let kCss = 0;
let kMyJs = 0;
let kNM = 0;
app.use((req, res, next)=>{
  
  
  if(/\.css$/.test(req.url)){
   // console.log('css  ', req.url)
    kCss++;
  }

  if(/^\/src.+\.js$/.test(req.url)){
    console.log('js  ', req.url)
    kMyJs++;
  }
  
  if(/node_modules/.test(req.url)){
   // console.log('node', req.url)
    kNM++;
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
  next()
});

app.get("*.js", function (req, res, next) {
  
 // console.log("*.js ->",__dirname, req.url)
  next()
});

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


app.get('/node_modules*', function(req, res) {
  //console.log("node_modules -> ", req.url)
  if(/^\/node_m/.test(req.url)){
    res.sendFile(__dirname +req.url)
  }else{
    res.sendFile(__dirname +'/src/app/' +req.url)  
  }
  
});

app.use(express.static(__dirname));


app.get('/*template*', function(req, res) {
  //console.log(req.url)
  res.sendFile(__dirname + req.url)
});
app.get('/*', function(req, res) {
  //console.log(req.url)
  res.sendFile(__dirname + '/index.html')
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
})




app.listen(port,()=>console.log('started at '+port));