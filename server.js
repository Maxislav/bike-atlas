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
app.use((req, res, next)=>{
  
  if(/^\/src/.test(req.url)){
    kSrc++;
  }
  
  
  
  timeout && clearTimeout(timeout);
  
  timeout = setTimeout(()=>{
    console.info('Scripts ->', kSrc, k );
    k=0;
    kSrc = 0;
  }, 1000);
  k++;
  
  
  console.log(req.url);
  next()
});

app.use(express.static(__dirname));


app.get('*.html', function(req, res) {
 // console.log(req.url)
  res.sendFile(__dirname +'/src/app/' +req.url)
});
app.get('*.css', function(req, res) {
  //console.log(req.url)
  res.sendFile(__dirname +'/src/app/' +req.url)
});


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