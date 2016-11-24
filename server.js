/**
 * Created by maxislav on 20.10.16.
 */
let express = require('express');
const port = 8080;

let app = express();

app.use(express.static(__dirname));

app.get('*.html', function(req, res) {
  console.log(req.url)
  res.sendFile(__dirname +'/src/app/' +req.url)
});
app.get('*.css', function(req, res) {
  console.log(req.url)
  res.sendFile(__dirname +'/src/app/' +req.url)
});


app.get('/*template*', function(req, res) {
  console.log(req.url)
  res.sendFile(__dirname + req.url)
});
app.get('/*', function(req, res) {
  console.log(req.url)
  res.sendFile(__dirname + '/index.html')
});



app.listen(port,()=>console.log('started at '+port));