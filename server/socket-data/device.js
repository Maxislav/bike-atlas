
const util = require('./util');

class Device{

    constructor(socket, connection){
        this.socket = socket;
        this.connection = connection;
        socket.on('getDevice', this.getDevice.bind(this))
        socket.on('onAddDevice', this.onAddDevice.bind(this))
    }

    /**
     *
     * @param {{hash: string}}d
     */
    getDevice(d){
        util.getDeviceByHash(this.connection, d.hash)
            .then(rows=>{
                this.socket.emit('getDevice', {
                    result: 'ok',
                    devices: rows
                } )
            })
            .catch((err)=>{
                this.socket.emit('getDevice', {
                    result: false
                })
            })
    }
    onAddDevice(device){
        console.log(this.socket.id)
    }



}

module.exports = Device;