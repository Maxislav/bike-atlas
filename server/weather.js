var Jimp = require("jimp");
module.exports = (req, res, nest) => {
  //const path = 'http://localhost/src/img/1342970542_meteoradar_borispol.png';
  const path = 'http://meteoinfo.by/radar/UKBB/UKBB_latest.png';

  console.log('meteo->','meteoinfo.by')
  return new Promise((resolve, reject)=> {
    Jimp.read(path, function (err, image) {
      if (err) {
        console.error('meteoinfo error->',err)
        reject(err);
        return;
      }
      image.crop(5, 5, 500, 475);
      image.scale(2);
      image.blur(1);
      image.scale(0.5);
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        var red = image.bitmap.data[idx + 0];
        var green = image.bitmap.data[idx + 1];
        var blue = image.bitmap.data[idx + 2];
        var alpha = image.bitmap.data[idx + 3];
        if (red == green && red < 240) {
          image.bitmap.data[idx + 3] = 0
        }
      });
      image.getBuffer(Jimp.MIME_PNG, (err, im)=> {
        resolve(im)
      })
    })
  })
    .then(buff=> {
      res.send(buff);
    })
    .catch(err=> {
      console.error('meteoinfo error->',err)
      res.setStatus = 500;
      res.end(err)
    });


}; 