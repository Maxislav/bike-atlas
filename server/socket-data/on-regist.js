const Protodata = require('./proto-data')


class OnRegist extends Protodata{
    constructor(socket, util, logger) {
        super(socket, util);
       
        this.logger = logger;
        socket.on('onRegist', this.onRegist.bind(this))
    }

    onRegist(d) {
        
        this.util.onRegist(d)
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