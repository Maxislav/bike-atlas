let connection;
const util = require('./util');


class OnAuth {
    constructor(socket, _connection, chat) {
        this.socket = socket;
        this.chat = chat;
        connection = _connection;
        this.socket.on('onAuth', this.onAuth.bind(this));
    }

    onAuth(data) {
        util
            .getUserByHash(connection, data.hash)
            .then(user => {
                return util.updateSocketIdByHash(connection, data.hash, this.socket.id)
                    .then(d => {
                        /**
                         * авторизация в чате
                         */
                        this.chat.onAuth(this.socket.id, user.user_id);
                        return util.getUserSettingByUserId(connection, user.user_id)
                            .then(setting => {
                                this.socket.emit('onAuth', {
                                    result: 'ok',
                                    user: {
                                        id: user.user_id,
                                        image: user.image,
                                        name: user.name,
                                        setting: setting
                                    }
                                })
                            })
                    })
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
