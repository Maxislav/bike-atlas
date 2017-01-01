let connection;
let socket;
const util = require('./util');


class OnAuth {
    constructor() {

    }

    onAuth(data) {
        util
            .getUserByHash(connection, data.hash)
            .then(user => {
                console.log(user)
                socket.emit('onAuth', {
                    result: 'ok',
                    user: {
                        name: user.name
                    }
                })
            })
            .catch(err => {
                socket.emit('onAuth', {
                    result: false,
                    message: err
                })
            });
    }

    set connection(con) {
        connection = con;
    }

    get connection() {
        return connection;
    }

    get socket() {
        return socket;
    }

    set socket(s) {
        socket = s;
        socket.on('onAuth', this.onAuth.bind(this))
    }
}
module.exports = new OnAuth();
