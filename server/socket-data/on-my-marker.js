const ProtoData = require('./proto-data');

class OnMyMarker extends ProtoData {

    constructor(socket, connection) {
        super(socket, connection);
        this.socket.on('saveMyMarker', this.saveMyMarker.bind(this, 'saveMyMarker'))
    }

    saveMyMarker(eName, data) {
        console.log('saveMyMarker ->  ', data);
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.saveMyMarker(user_id, data)
            })
            .then(res => {
                this.socket.emit(eName, {...data, ...{id: res.insertId}})
            })
            .catch(err=>{
                console.log('Err save marker', err)
            })

    }

}

module.exports = OnMyMarker;
