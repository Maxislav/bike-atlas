import { LoggerRow, User } from '../types';

const util = require('./util');
import * as ProtoData from './proto-data';
import { Deferred } from '../deferred';
import { DeviceRow } from '../types';

class OnAuth extends ProtoData {


    chat: any;
    logger: any;
    gl520: any;
    socket: any;
    util: any;

    constructor(socket, util, chat, logger, gl520) {
        super(socket, util);
        this.chat = chat;
        this.logger = logger;
        this.gl520 = gl520;
        //this.socket.on('onAuth', this.onAuth.bind(this, 'onAuth'));

        const onAuth = this.onAuth.bind(this)
        this.socket.$get('onAuth', onAuth);
    }

    onAuth(req, res) {
        const data = req.data;
        if(!data) return;
        let _user;
        let _userDevices: Array<DeviceRow>;
        let _friends;
        let _markers;
        const util = this.util;
        util
            .getUserByHash(data.hash)
            .then(user => {
                _user = user;
                /**
                 * авторизация в чате
                 */

                this.chat.onAuth(this.socket.id, _user.user_id);
                return util.updateSocketIdByHash(data.hash, this.socket.id);
            })
            .then(d => {
                return this.util.getMyMarker(_user.user_id)
                    .then(list => {
                        _markers = list.map(m => {
                            return {...m, ...{shared: !!m.shared}};
                        });
                        return d;
                    });
            })


            .then(d => {
                return util.getDeviceByUserId(_user.user_id);
            })


            .then(userDevices => {
                _userDevices = userDevices;
                return util.getFriends(_user.user_id);
            })
            .then(friends => {
                _friends = friends;
                const arrDevicesPromise = [];
                friends.forEach(friend => {
                    arrDevicesPromise.push(util.getDeviceByUserId(friend.id)
                        .then(devices => {
                            return friend.devices = devices;
                        }));
                });
                return arrDevicesPromise;
            })
            .then(d => {
                return util.getUserSettingByUserId(_user.user_id);
            })
            .then(setting => {
                const hash = util.getHash();
                const deviceKeys: Array<string> = [];

                _userDevices.forEach(device => {
                    deviceKeys.push(device.device_key);
                });
                _friends.forEach(friend => {
                    friend.devices.forEach(device => {
                        deviceKeys.push(device.device_key);
                    });
                });

                const deferred: Deferred<Array<Promise<LoggerRow>> > = new Deferred();

                const arrLastPosition: Array<Promise<LoggerRow>> = [];
                const emitLastPosition = () => {
                    this.socket.removeListener(hash, emitLastPosition);
                    util.clearHash(hash);

                    Promise.all(deviceKeys.map(key => {
                       return util.getLastPosition(key)
                            .then((row: LoggerRow) => {
                                //console.log('device key->', key)
                                this.logger.updateDevice(key, this.socket.id);
                                this.gl520.updateDevice(key, this.socket.id);
                                row.lng = Number(row.lng);
                                row.lat = Number(row.lat);
                                this.socket.emit('log', row);
                                return row;
                            })
                    })).then((rows)=>{
                        deferred.resolve(rows)
                    })


                };
                this.socket.on(hash, emitLastPosition);


                const user: User = {
                    id: _user.user_id,
                    name: _user.name,
                    image: _user.image,
                    devices: _userDevices,
                    markers: _markers,
                    friends: _friends,
                    hash: hash,
                    setting: setting
                };

                res.end( {
                    result: 'ok',
                    user: user
                });
                /*this.socket.emit(eName, {
                    result: 'ok',
                    user: user
                });*/
                return deferred.promise
            })

            .catch(err => {
                res.end({
                    result: false,
                    message: err
                })
                /*this.socket.emit(eName, {
                    result: false,
                    message: err
                });*/
            });
    }


}

module.exports = {
    OnAuth
};
