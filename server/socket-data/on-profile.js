const  ProtoData = require('./proto-data')


class OnProfile extends ProtoData{
    constructor(socket, util, logger) {
        super(socket, util)
        this.logger = logger;
        this.socket.on('onImage', this.onImage.bind(this));
    }

    onImage(base64){
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id=>{
                this.util.setImageProfile(user_id, base64)
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