const  ProtoData = require('./proto-data');

class OnStrava extends ProtoData{
    constructor(socket, util) {
        super(socket, util);
        socket.on('onStrava', this.onStrava.bind(this, 'onStrava'))

    }
    onStrava(eName, {stravaClientId, atlasToken}){
        this.getUserId()
            .then(userId=>{
                return this.util.onStrava(userId, stravaClientId, atlasToken)
            })
            .then(d=>{
                this.socket.emit(eName,{
                    result: 'ok'
                })
            })
            .catch(error=>{
                console.error('Error onStrava ->', error)
            })



    }

}
module.exports = OnStrava;