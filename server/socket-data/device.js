const util = require('./util');

class Device {

  constructor(socket, connection, logger) {
    this.logger = logger;
    this.socket = socket;
    this.connection = connection;
    socket.on('getDevice', this.getDevice.bind(this));
    socket.on('onAddDevice', this.onAddDevice.bind(this, 'onAddDevice'));
    socket.on('onDelDevice', this.onDelDevice.bind(this));
    // socket.on('getLastPosition', this.getLastPosition.bind(this));
  }

  /**
   *
   * @param {boolean} isLastPosition
   * @returns {Promise<R>}
   */
  getDevice(isLastPosition) {
    return util.getUserIdBySocketId(this.connection, this.socket.id)
      .then(user_id=> {

        return util.getDeviceByUserId(this.connection, user_id)
          .then(rows=> {
            this.socket.emit('getDevice', {
              result: 'ok',
              devices: rows
            });
          });
      })
      .catch((err)=> {
        this.socket.emit('getDevice', {
          result: false
        });
        console.error('error getDevice->', err)
      });

  }

  /* getLastPosition(){


   }*/
  onAddDevice(eName, device) {
    util.getDeviceByKey(this.connection, device.id)
      .then(rows=> {
        if (rows && rows.length) {
          return false;
        } else {
          return true
        }

      })
      .then(d=> {
        if (d) {
          return util.addDeviceBySocketId(this.connection, this.socket.id, device)
            .then(d=> {
              this.socket.emit(eName, {
                result: 'ok'
              });
            })
        } else {
          this.socket.emit(eName, {
            result: false,
            message: 'device exist'
          });
          return null
        }
      })
      .catch(err=> {
        this.socket.emit(eName, {
          result: false,
          message: err
        });
      })


  }

  onDelDevice(device) {
    console.log('onDelDevice->', device.device_key)

    util.getUserIdBySocketId(this.connection, this.socket.id)
      .then(user_id=> {
        util.delDeviceByUserDeviceKey(this.connection, user_id, device.device_key)
          .then((d)=> {
            this.socket.emit('onDelDevice', {
              result: 'ok'
            })
          })
          .catch(err=> {
            this.socket.emit('onDelDevice', {
              result: false,
              message: err
            });
            console.error('Error onDelDevice->', err)
          });
      })

  }

  /* getLastPosition(){
   this.getDevice(true)
   .then(devices=>{
   const arrPromise = [];
   devices.forEach(device=>{
   arrPromise.push(util.getLastPosition(this.connection, device));
   });
   Promise.all(arrPromise)
   .then(devices=>{
   const devi = [];
   devices.forEach(row=>{
   if(row){
   devi.push(util.formatDevice(row));
   }
   });
   this.socket.emit('getLastPosition', devi)
   })
   .catch(err=>{
   console.error('Error emitLastPosition->', err)
   })
   })
   }*/
}


module.exports = Device;