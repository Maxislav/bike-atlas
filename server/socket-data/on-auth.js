"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnAuth = void 0;
const ProtoData = require("./proto-data");
const deferred_1 = require("../deferred");
const autobind_1 = require("../util/autobind");
class OnAuth extends ProtoData {
    constructor(socket, util, chat, logger, gl520) {
        super(socket, util);
        this.chat = chat;
        this.logger = logger;
        this.gl520 = gl520;
        this.socket.$get('onAuth', this.onAuth);
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
                    return Object.assign(Object.assign({}, m), { shared: !!m.shared });
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
            deviceKeys.forEach(key => {
                this.logger.updateDevice(key, this.socket.id);
                this.gl520.updateDevice(key, this.socket.id);
            });
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
            //this.emitLastPosition(deviceKeys);
            return Promise.resolve(user);
        })
            .catch(err => {
            console.log('Catch 3 -> ', err);
            res.end({
                result: false,
                message: err
            });
        });
    }
    emitLastPosition(deviceKeys) {
        const deferred = new deferred_1.Deferred();
        console.log('deviceKeys', deviceKeys);
        Promise.all(deviceKeys.map(key => {
            return this.util.getLastPosition(key)
                .then((row) => {
                if (row) {
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
        return deferred.promise;
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
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OnAuth.prototype, "onAuth", null);
exports.OnAuth = OnAuth;
//# sourceMappingURL=on-auth.js.map