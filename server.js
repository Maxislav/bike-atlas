/**
 * Created by maxislav on 20.10.16.
 */
let express = require('express');

let app = express();

app.use(express.static(__dirname));

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/index.html')
});



app.listen(3000,()=>console.log('started at 3000'));