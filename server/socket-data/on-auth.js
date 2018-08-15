const util = require('./util');
const ProtoData = require('./proto-data');

class OnAuth extends ProtoData {
    constructor(socket, util, chat, logger) {
        super(socket, util);
        this.chat = chat;
        this.logger = logger;
        this.socket.on('onAuth', this.onAuth.bind(this, 'onAuth'));
    }

    onAuth(eName, data) {
        let _user;
        let _userDevices;
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
                return util.updateSocketIdByHash(data.hash, this.socket.id)
            })
            .then(d => {
                return this.util.getMyMarker(_user.user_id)
                    .then(list => {
                        _markers = list.map(m => {
                            return {...m, ...{shared: !!m.shared}};
                        });
                        return d
                    })
            })


            .then(d => {
                return util.getDeviceByUserId(_user.user_id)
            })


            .then(userDevices => {
                _userDevices = userDevices;
                return util.getFriends(_user.user_id)
            })
            .then(friends => {
                _friends = friends;
                const arrDevicesPromise = [];
                friends.forEach(friend => {
                    arrDevicesPromise.push(util.getDeviceByUserId(friend.id)
                        .then(devices => {
                            return friend.devices = devices;
                        }))
                });
                return arrDevicesPromise;
            })
            .then(d => {
                return util.getUserSettingByUserId(_user.user_id)
            })
            .then(setting => {
                const hash = util.getHash();
                const deviceKeys = [];

                _userDevices.forEach(device => {
                    deviceKeys.push(device.device_key)
                });
                _friends.forEach(friend => {
                    friend.devices.forEach(device => {
                        deviceKeys.push(device.device_key)
                    })
                });

                const arrLastPosition = [];
                const emitLastPosition = () => {
                    this.socket.removeListener(hash, emitLastPosition);
                    util.clearHash(hash);
                    deviceKeys.forEach(key => {
                        arrLastPosition.push(
                            util.getLastPosition(key)
                                .then(row => {
                                    //console.log('device key->', key)
                                    this.logger.updateDevice(key, this.socket.id)
                                    this.socket.emit('log', row);
                                    return row;
                                }))
                    })

                };
                this.socket.on(hash, emitLastPosition);


                this.socket.emit(eName, {
                    result: 'ok',
                    user: {
                        id: _user.user_id,
                        name: _user.name,
                        image: _user.image,
                        devices: _userDevices,
                        markers: _markers,
                        friends: _friends,
                        hash: hash,
                        setting: setting
                    }
                });
                return Promise.all(arrLastPosition)
            })

            .catch(err => {
                this.socket.emit(eName, {
                    result: false,
                    message: err
                })
            });
    }


}

module.exports = OnAuth;
