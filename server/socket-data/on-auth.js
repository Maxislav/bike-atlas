let connection;
const util = require('./util');


class OnAuth {
    constructor(socket, _connection, logger) {
        this.socket = socket;
        this.logger = logger;
        connection = _connection;
        this.socket.on('onAuth', this.onAuth.bind(this));
    }

    onAuth(data) {
        util
            .getUserByHash(connection, data.hash)
            .then(user => {
               return util.updateSocketIdByHash(connection, data.hash, this.socket.id)
                   .then(d=>{
                       this.socket.emit('onAuth', {
                           result: 'ok',
                           user: {
                               name: user.name
                           }
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
