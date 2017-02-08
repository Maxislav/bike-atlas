const util = require('./util');
const ProtoData = require('./proto-data');

class Device extends ProtoData{

  constructor(socket, util, logger) {
    super(socket, util);
    this.logger = logger;
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
    const util = this.util;
    return util.getUserIdBySocketId(this.socket.id)
      .then(user_id=> {

        return util.getDeviceByUserId(user_id)
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
    const util = this.util;
    util.getDeviceByKey(device.id)
      .then(rows=> {
        if (rows && rows.length) {
          return false;
        } else {
          return true
        }

      })
      .then(d=> {
        if (d) {
          return util.addDeviceBySocketId(this.socket.id, device)
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
    const util = this.util;

    util.getUserIdBySocketId(this.socket.id)
      .then(user_id=> {
        util.delDeviceByUserDeviceKey(user_id, device.device_key)
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
}


module.exports = Device;