
const util = require('./util');

class Device{

    constructor(socket, connection, logger){
        this.logger = logger;
        this.socket = socket;
        this.connection = connection;
        socket.on('getDevice', this.getDevice.bind(this));
        socket.on('onAddDevice', this.onAddDevice.bind(this));
        socket.on('onDelDevice', this.onDelDevice.bind(this));
    }

    /**
     *
     * @param {{hash: string}}d
     */
    getDevice(d){
        util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(user_id=>{
                return util.getFriends(this.connection, user_id)
                    .then(friends=>{
                        const ids = [user_id];
                        friends.forEach(friend=>{
                            ids.push(friend.id)
                        });
                        return util.getDeviceByIds(this.connection, ids.join(', '))
                            .then(rows=>{
                                rows.forEach(item=>{
                                    item.id = item.device_key;
                                    delete    item.device_key;
                                    item.ownerId = item.user_id;
                                    delete item.user_id;
                                });
                                this.socket.emit('getDevice', {
                                    result: 'ok',
                                    devices: rows
                                } );
                                this.emitLastPosition(rows)
                            })


                    });


                //console.log('user id ->' , user_id);

            })
            .catch((err)=>{
                this.socket.emit('getDevice', {
                    result: false
                })
                console.error('error getDevice->',err)
            });

        /*util.getDeviceByHash(this.connection, d.hash)
            .then(rows=>{
                const devices = [];
                rows.forEach(item=>{
                    devices.push({
                        id: item.device_key,
                        ownerId: item.user_id,
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
            })*/
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
    onDelDevice(device){
        console.log('onDelDevice->',device)

        util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(user_id=>{
                util.delDeviceByUserDeviceKey(this.connection, user_id, device.id)
                    .then((d)=>{
                        this.socket.emit('onDelDevice', {
                            result: 'ok'
                        })
                    })
                    .catch(err=>{
                        this.socket.emit('onDelDevice', {
                            result: false,
                            message: err
                        });
                        console.error('Error onDelDevice->', err)
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
                        console.log('emitLastPosition ->', rows[0])
                        this.socket.emit('log', util.formatDevice(rows[0]))
                    }

                });
            })
            .catch(err=>{
                console.error('Error emitLastPosition->', err)
            })

    }
}


module.exports = Device;