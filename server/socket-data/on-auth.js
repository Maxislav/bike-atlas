let connection;
const util = require('./util');


class OnAuth {
    constructor(socket, _connection, chat, logger) {
        this.socket = socket;
        this.chat = chat;
        this.logger = logger;
        this.connection = connection = _connection;
        this.socket.on('onAuth', this.onAuth.bind(this));
    }

    onAuth(data) {
        let _user;
        let _userDevices;
        let _friends;
        util
            .getUserByHash(connection, data.hash)
            .then(user => {
                _user = user;
                /**
                 * авторизация в чате
                 */

                this.chat.onAuth(this.socket.id, _user.user_id);
                return util.updateSocketIdByHash(connection, data.hash, this.socket.id)
            })
            .then(d=>{
                return util.getDeviceByUserId(this.connection, _user.user_id)
            })
            .then(userDevices=>{
                _userDevices = userDevices;
                return util.getFriends(this.connection, _user.user_id)
            })
            .then(friends => {
                _friends = friends;
                const arrDevicesPromise = [];
                friends.forEach(friend=>{
                    arrDevicesPromise.push( util.getDeviceByUserId(this.connection, friend.id)
                        .then(devices=>{
                            return friend.devices = devices;
                        }))
                });
                return arrDevicesPromise;
            })
            .then(d=>{
                return util.getUserSettingByUserId(connection, _user.user_id)
            })
            .then(setting => {
                const hash = util.getHash();
                const deviceKeys = [];

                _userDevices.forEach(device=>{
                    deviceKeys.push(device.device_key)
                });
                _friends.forEach(friend=>{
                    friend.devices.forEach(device=>{
                        deviceKeys.push(device.device_key)
                    })
                });

                const arrLastPosition = [];
                const emitLastPosition= () =>{
                    this.socket.removeListener(hash, emitLastPosition);
                    util.clearHash(hash);
                    deviceKeys.forEach(key=>{
                        arrLastPosition.push(
                            util.getLastPosition(this.connection, key)
                            .then(row=>{
                                console.log('key->', key)
                                this.logger.updateDevice(key, this.socket.id)
                                this.socket.emit('log', row);
                                return row;
                            }))
                    })

                };
                this.socket.on(hash,emitLastPosition);


                this.socket.emit('onAuth', {
                    result: 'ok',
                    user: {
                        id: _user.user_id,
                        name: _user.name,
                        image: _user.image,
                        devices: _userDevices,
                        friends: _friends,
                        hash: hash,
                        setting: setting
                    }
                });
                return Promise.all(arrLastPosition)
            })

            .catch(err => {
                this.socket.emit('onAuth', {
                    result: false,
                    message: err
                })
            });
    }


}
module.exports = OnAuth;
