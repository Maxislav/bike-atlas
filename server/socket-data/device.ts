import { DeviceRow, LoggerRow } from '../types';

import * as ProtoData from './proto-data';
import { autobind } from '../util/autobind';

class Device extends ProtoData {
    constructor(private socket, private util, private logger) {
        super(socket, util);

        this.socket.$get('onDevices', this.onDevices);
        this.socket.$get('onAddDevice', this.onAddDevice);
        this.socket.$get('onDelDevice', this.onDelDevice);


        this.socket.on('emitLastPosition', this.emitLastPosition);
        //socket.on('onDelDevice', this.onDelDevice.bind(this));
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

                console.error(err)
            })

    }


    @autobind()
    onDevices(req, res) {
        const util = this.util;
        return util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return util.getDeviceByUserId(user_id)
                    .then((rows: Array<DeviceRow>) => {
                        res.end({
                            result: 'ok',
                            devices: rows
                        });

                    });
            })
            .catch((err) => {
               res.end ({
                    result: false,
                    error: err.toString()
                });
                console.error('error getDevice->', err);
            });

    }

    @autobind()
    emitLastPosition(): void{
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.getDeviceByUserId(user_id)
                    .then((rows:Array<DeviceRow>) => {
                        return Promise.all(rows.map(row => {
                            return this.util.getLastPosition(row.device_key)
                                .then((row: LoggerRow) => {
                                    if(row){
                                        const loggerRow = {
                                            alt: 0,
                                            azimuth: 0,
                                            date: row.date,
                                            device_key: row.device_key,
                                            id: row.id,
                                            lng: row.lng,
                                            lat: row.lat,
                                            speed: row.speed,
                                            src: row.src,
                                            type: row.type,
                                            bs: row.bs,
                                            accuracy: row.accuracy,
                                            batt: row.batt
                                        };
                                        this.socket.emit('log', loggerRow);
                                    }
                                    return Promise.resolve(row)
                                })
                        }))
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }

    @autobind()
    onAddDevice(req, res) {

        const device = req.data

        const util = this.util;
        util.getDeviceByKey(device.id)
            .then(rows => {
                if (rows && rows.length) {

                    res.end({
                        result: false,
                        error: 'Device exist'
                    });

                    return false;
                } else {
                    return true;
                }

            })
            .then(d => {
                if (d) {
                    return util.addDeviceBySocketId(this.socket.id, device)
                        .then(d => {
                            res.end({
                                result: 'ok',
                                error: null
                            })
                        });
                }
            })
            .catch(err => {
                res.end({
                    error: err.toString()
                })
            });


    }

    @autobind()
    onDelDevice(req, res) {

        const device = req.data;
        console.log('onDelDevice->', device.device_key);
        const util = this.util;

        util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                util.delDeviceByUserDeviceKey(user_id, device.device_key)
                    .then((d) => {
                        res.end({
                            result: 'ok'
                        })
                    })
                    .catch(err => {
                        res.end({
                            result: false,
                            message: err
                        });
                        console.error('Error onDelDevice->', err);
                    });
            });

    }
}


module.exports = Device;
