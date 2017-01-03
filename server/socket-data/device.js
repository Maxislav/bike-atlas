
const util = require('./util');

class Device{

    constructor(socket, connection, logger){
        this.logger = logger;
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
                const devices = [];
                rows.forEach(item=>{
                    devices.push({
                        id: item.device_key,
                        name: item.name,
                        phone: item.phone
                    });
                    this.logger.updateDevice(item.device_key, this.socket.id)
                });
                this.emitLastPosition(devices);


               // this.logger.sockets[this.socket.id]

                this.socket.emit('getDevice', {
                    result: 'ok',
                    devices: devices
                } )
            })
            .catch((err)=>{
                this.socket.emit('getDevice', {
                    result: false
                })
            })
    }
    onAddDevice(device){
        util.addDeviceBySocketId(this.connection, this.socket.id, device)
            .then(d=>{
                this.socket.emit('onAddDevice', {
                    result: 'ok'
                });
            })
            .catch(err=>{
                this.socket.emit('onAddDevice', {
                    result: false,
                    message: err
                });
            })
    }

    emitLastPosition(devices){
        const arrPromise = [];
        devices.forEach(device=>{
            arrPromise.push(util.getLastPosition(this.connection, device));
        });


        Promise.all(arrPromise)
            .then(devices=>{
                devices.forEach(rows=>{
                    if(rows && rows.length){
                        this.socket.emit('log', rows[0])
                    }

                });
                //console.log('emitLastPosition', d)
            })
            .catch(err=>{
                console.error('emitLastPosition', err)
            })



    }



}

module.exports = Device;