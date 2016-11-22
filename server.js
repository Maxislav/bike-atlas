/**
 * Created by maxislav on 20.10.16.
 */
let express = require('express');
const port = 8080;

let app = express();

app.use(express.static(__dirname));

app.get('/template*', function(req, res) {
  res.sendFile(__dirname + '/src/app'+ req.url)
});
app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/index.html')
});



app.listen(port,()=>console.log('started at '+port));