const util = require('./util');


class OnFriend {
    constructor(socket, connection, logger) {
        this.socket = socket;
        this.logger = logger;
        this.connection = connection;
        this.socket.on('getAllUsers', this.getAllUsers.bind(this));
    }

    getAllUsers({hash, id}){

        util.getUsersNotSelf(this.connection, id)
            .then(d=>{
                this.socket.emit('getAllUsers', {
                    result: 'ok',
                    users: d
                })
            })
            .catch(err=>{
                this.socket.emit('getAllUsers', {
                    result: false,
                    message: err
                })
                console.error('error getAllUsers -> ', err)
            })

    }

}
module.exports = OnFriend;