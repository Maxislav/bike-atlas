const fs = require('fs');
const parseString = require('xml2js').parseString;


class Robot {
  constructor(connection) {
    this.connection = connection;
    this.ownerId = null;

    this.getDemoId(connection)
      .then(owner_id=>{
        this.ownerId = owner_id;
        return this.getPoints()
      })
      .then(points=>{
        return this.tick(points)
      })
      .catch(err=>{
        console.error('Чтото пошло не так -> ', err)
      });
    
    
    this._sockets = [];

    
  }

  getDemoId(connection){
    return new Promise((resolve, reject)=>{
      connection.query('SELECT id FROM `user` WHERE `name`=?', ['demo'], function (err, rows) {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows[0].id)
      });
    })
  }

  
  tick(points){
    const tick = (i)=>{
      console.log(points[i]);
      setTimeout(()=>{
        const point = points[i]
        for(let id in this.sockets){
          this.sockets[id].emit('log', {
            lng:point.lng,
            lat: point.lat,
            device_key: '0000',
            ownerId:this.ownerId,
            bearing: 0,
            date: new Date().toISOString()
          })
        }
        if(i<points.length){
          tick(++i)  
        }else{
          tick(0)
        }
      }, points[i].timeout)
    };
    tick(0);
    return true;
  }

  
  getPoints(){
    return new Promise((resolve, reject)=>{
      const positions = [];
      fs.readFile(__dirname + '/history-2016-12-06.gpx', (err, data) => {
        parseString(data, {trim: true}, (err, result) => {
          const track = result.gpx.trk[0].trkseg[0].trkpt;
          track.forEach((item, i)=> {
            const position = {
              lng: item.$.lon,
              lat: item.$.lat,
             // timeout: i != (track.length - 2) ? new Date(track[i + 1].time).getTime() - new Date(item.time).getTime() : 10000
            };

            if(i<track.length-2){
              position.timeout = new Date(track[i + 1].time).getTime() - new Date(item.time).getTime();
            }else{
              position.timeout = 10000
            }
            positions.push(position)
          });
          resolve(positions)
        });
      });
    })
  }
  set sockets(sockets) {
    this._sockets = sockets
  }
  get sockets(){
    return this._sockets;
  }

}


module.exports = Robot;