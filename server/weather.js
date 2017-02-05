const Jimp = require("jimp");

let isProcess = false;
module.exports = (req, res, nest) => {
  //const path = 'http://localhost/src/img/1342970542_meteoradar_borispol.png';
  const path = 'http://meteoinfo.by/radar/UKBB/UKBB_latest.png';

  
  
  
  if(isProcess){
    res.status(500).send({ error: 'meteoinfo isProcess' });
    return
  }
  console.log('meteoinfo.by ->','try');
  
  isProcess = true;
  res.header("Access-Control-Allow-Origin", "http://maxislav.github.io");
  
  Jimp.read(path, function (err, image) {
    if (err) {
      console.error('meteoinfo error->',err);
      res.status(500).send({ error: 'meteoinfo error' });
      isProcess = false
      return;
    }
    image.crop(5, 5, 500, 475);
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      var red = image.bitmap.data[idx + 0];
      var green = image.bitmap.data[idx + 1];
      var blue = image.bitmap.data[idx + 2];
      var alpha = image.bitmap.data[idx + 3];
      if (red == green && red < 240) {
        image.bitmap.data[idx + 3] = 0;
      }
    });
    image.getBuffer(Jimp.MIME_PNG, (err, buf)=> {
      if(err){
        res.setStatus = 500;
        console.error('err -> ', err);
        isProcess = false;
        return;
      }
      res.send(buf);
      isProcess = false;
    })
  });
  
  

  
  /*return new Promise((resolve, reject)=> {
    
  })
    .then(buff=> {
      res.send(buff);
    })
    .catch(err=> {
      console.error('meteoinfo error->',err)
      res.setStatus = 500;
      res.end(err)
    });*/


}; 