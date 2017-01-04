const util = require('./util');


class OnRegist {
    constructor(socket, connection, logger) {
        this.socket = socket;
        this.connection = connection;
        this.logger = logger;
        socket.on('onRegist', this.onRegist.bind(this))
    }

    onRegist(d) {
        util.onRegist(this.connection, d)
            .then(d => {
                if(d && d.result == 'ok'){
                    this.socket.emit('onRegist', {
                        result: 'ok',
                        message: null
                    })
                }else{
                    this.socket.emit('onRegist', d)
                }

            }, err => {
                console.error(err)
            })
            .catch((err) => {
                console.error('Cache onRegist', err);
                this.socket.emit('onRegist', {result: false, status: 500, message: err})
            })
    }
}

module.exports = OnRegist;