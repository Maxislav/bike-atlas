"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProtoData = require("./proto-data");
const deferred_1 = require("../deferred");
class OnAuth extends ProtoData {
    constructor(socket, util, chat, logger, gl520) {
        super(socket, util);
        this.chat = chat;
        this.logger = logger;
        this.gl520 = gl520;
        //this.socket.on('onAuth', this.onAuth.bind(this, 'onAuth'));
        const onAuth = this.onAuth.bind(this);
        this.socket.$get('onAuth', onAuth);
    }
    onAuth(req, res) {
        const data = req.data;
        if (!data)
            return;
        let _user;
        let _userDevices;
        let _friends;
        let _markers;
        const util = this.util;
        util
            .getUserByHash(data.hash)
            .then(user => {
            _user = user;
            if (!user) {
                return Promise.reject('User Unauthorized');
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
                    return Object.assign({}, m, { shared: !!m.shared });
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
            const deviceKeys = [];
            _userDevices.forEach(device => {
                deviceKeys.push(device.device_key);
            });
            _friends.forEach(friend => {
                friend.devices.forEach(device => {
                    deviceKeys.push(device.device_key);
                });
            });
            const deferred = new deferred_1.Deferred();
            const arrLastPosition = [];
            const emitLastPosition = () => {
                this.socket.removeListener(hash, emitLastPosition);
                util.clearHash(hash);
                console.log('deviceKeys', deviceKeys);
                Promise.all(deviceKeys.map(key => {
                    return util.getLastPosition(key)
                        .then((row) => {
                        //console.log('device key->', key)
                        this.logger.updateDevice(key, this.socket.id);
                        this.gl520.updateDevice(key, this.socket.id);
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
                    });
                }))
                    .then((rows) => {
                    deferred.resolve(rows);
                })
                    .catch(err => {
                    console.log('err 2 -> ', err);
                    return err;
                });
            };
            this.socket.on(hash, emitLastPosition);
            const user = {
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
            return deferred.promise;
        })
            .catch(err => {
            console.log('Catch 3 -> ', err);
            res.end({
                result: false,
                message: err
            });
        });
    }
    getRound(...list) {
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        return list.reduce(reducer) / list.length;
    }
    groupByDate(list) {
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
exports.OnAuth = OnAuth;
//# sourceMappingURL=on-auth.js.map