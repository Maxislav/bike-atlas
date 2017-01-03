let connection;
const util = require('./util');


class OnAuth {
    constructor(socket, _connection) {
        this.socket = socket;
        connection = _connection;
       this.socket.on('onAuth', this.onAuth.bind(this));
    }

    onAuth(data) {
        util
            .getUserByHash(connection, data.hash)
            .then(user => {
                console.log(user)
               this.socket.emit('onAuth', {
                    result: 'ok',
                    user: {
                        name: user.name
                    }
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
