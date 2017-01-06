const util = require('./util');


class OnProfile {
    constructor(socket, connection, logger) {
        this.socket = socket;
        this.logger = logger;
        this.connection = connection;
        this.socket.on('onImage', this.onImage.bind(this));
    }

    onImage(base64){
      //  console.log(base64)
        util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(user_id=>{
                util.setImageProfile(this.connection, user_id, base64)
                    .then(d=>{
                        this.socket.emit('onImage', {
                            result: 'ok',
                            userId: user_id
                        })
                    })
                    .catch(err=>{
                        this.socket.emit('onImage', {
                            result: false,
                            message: err
                        })
                    })


            })

    }

}

module.exports = OnProfile;