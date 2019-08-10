import { DeviceRow } from '../types';

const util = require('./util');
const ProtoData = require('./proto-data');

class Device extends ProtoData {
    logger: any;
    constructor(private socket, private util, logger) {
        super(socket, util);
        this.logger = logger;
        socket.on('getDevice', this.getDevice.bind(this));
        socket.on('onAddDevice', this.onAddDevice.bind(this, 'onAddDevice'));
        socket.on('onDelDevice', this.onDelDevice.bind(this));
        const onAddDeviceImage = this.onAddDeviceImage.bind(this);
        socket.$get('onAddDeviceImage', onAddDeviceImage);
    }


    onAddDeviceImage(request, response){

        const device_key = request.data.deviceKey;
        const image = request.data.image;

        const util = this.util;
        return util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return util.getDeviceByUserId(user_id)
            })
            .then((rows: Array<DeviceRow>) =>{
                return !!rows.find(item => item.device_key === device_key)
            })
            .then((bool: boolean) => {
                if(bool){
                    return this.util.upadetDeviceImage(device_key, image)

                }else {
                    response.end({
                        error: 'Device not found for current user'
                    });
                    throw new Error('Device not found for current user')
                }
            })
            .then(() => {
                response.end({
                    result: 'ok'
                });
            })
            .catch(err => {
                response.end({
                    error: err.toString()
                });
            })

    }


    /**
     *
     * @param {boolean} isLastPosition
     * @returns {Promise<R>}
     */
    getDevice(isLastPosition) {
        const util = this.util;
        return util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {

                return util.getDeviceByUserId(user_id)
                    .then(rows => {
                        this.socket.emit('getDevice', {
                            result: 'ok',
                            devices: rows
                        });
                    });
            })
            .catch((err) => {
                this.socket.emit('getDevice', {
                    result: false
                });
                console.error('error getDevice->', err);
            });

    }

    onAddDevice(eName, device) {
        const util = this.util;
        util.getDeviceByKey(device.id)
            .then(rows => {
                if (rows && rows.length) {
                    return false;
                } else {
                    return true;
                }

            })
            .then(d => {
                if (d) {
                    return util.addDeviceBySocketId(this.socket.id, device)
                        .then(d => {
                            this.socket.emit(eName, {
                                result: 'ok'
                            });
                        });
                } else {
                    this.socket.emit(eName, {
                        result: false,
                        message: 'device exist'
                    });
                    return null;
                }
            })
            .catch(err => {
                this.socket.emit(eName, {
                    result: false,
                    message: err
                });
            });


    }

    onDelDevice(device) {
        console.log('onDelDevice->', device.device_key);
        const util = this.util;

        util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                util.delDeviceByUserDeviceKey(user_id, device.device_key)
                    .then((d) => {
                        this.socket.emit('onDelDevice', {
                            result: 'ok'
                        });
                    })
                    .catch(err => {
                        this.socket.emit('onDelDevice', {
                            result: false,
                            message: err
                        });
                        console.error('Error onDelDevice->', err);
                    });
            });

    }
}


module.exports = Device;