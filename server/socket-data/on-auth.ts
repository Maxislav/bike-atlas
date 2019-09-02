import * as ProtoData from './proto-data';
import { Deferred } from '../deferred';
import { DeviceRow, LoggerRow, User  } from '../types';
import { autobind } from '../util/autobind';
export class OnAuth extends ProtoData {


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
        this.socket.$get('onAuth', this.onAuth);
    }

    @autobind()
    onAuth(req, res): void {
        const data = req.data;
        if (!data) return;
        let _user;
        let _userDevices: Array<DeviceRow>;
        let _friends;
        let _markers;
        const util = this.util;
        util
            .getUserByHash(data.hash)
            .then(user => {
                _user = user;
                if(!user){
                    return Promise.reject('User Unauthorized')
                }

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
                deviceKeys.forEach(key => {
                    this.logger.updateDevice(key, this.socket.id);
                    this.gl520.updateDevice(key, this.socket.id);
                });



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

                res.end({
                    result: 'ok',
                    user: user
                });
                //this.emitLastPosition(deviceKeys);
                return Promise.resolve(user)
            })
            .catch(err => {
                console.log('Catch 3 -> ', err);
                res.end({
                    result: false,
                    message: err
                });
            });
    }


    private emitLastPosition(deviceKeys: Array<string>) : Promise <Array<Promise<LoggerRow>>>{
        const deferred: Deferred<Array<Promise<LoggerRow>>> = new Deferred();

        console.log('deviceKeys', deviceKeys);

        Promise.all(deviceKeys.map(key => {

            return this.util.getLastPosition(key)
                .then((row: LoggerRow) => {

                    if(row){
                        const loggerRow = {
                            alt: 0,
                            azimuth: 0,
                            date: row.date,
                            device_key: key,
                            id: row.id,
                            lng: row.lng,
                            lat: row.lat,
                            speed: row.speed,
                            src: row.src,
                            type: row.type,
                            bs: row.bs,
                            accuracy: row.accuracy
                        };
                        this.socket.emit('log', loggerRow);
                    }

                });

        }))
            .then((rows) => {
                deferred.resolve(rows);
            })
            .catch(err => {
                console.log('err 2 -> ', err);
                return err;
            });
        return deferred.promise
    }

    private getRound(...list: number[]) {
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        return list.reduce(reducer) / list.length;
    }

    private groupByDate(list) {
        const s = new Set();
        const idMap = {};


        const resArr = [];
        const _list = list.map(item => {
            idMap[item.id] = item;
            const dateInt = new Date(item.date).getTime();
            s.add(dateInt);
            return Object.assign({
                dateInt
            }, item);
        });

        const arr = Array.from(s).sort();
        arr.forEach(dateInt => {
            const group = _list.filter(it => it.dateInt === dateInt).map(item => idMap[item.id]);
            resArr.push(group);
        });

        return resArr;


    }


}
