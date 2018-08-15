const ProtoData = require('./proto-data');

class OnMyMarker extends ProtoData {

    constructor(socket, connection) {
        super(socket, connection);
        this.socket.on('saveMyMarker', this.saveMyMarker.bind(this, 'saveMyMarker'));
        this.socket.on('removeMyMarker', this.removeMyMarker.bind(this, 'removeMyMarker'));
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

    /**
     * @param {string} eName
     * @param {{id: number}} data
     */
    removeMyMarker(eName, data){
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.removeMyMarker(user_id, data.id)
            })
            .then(()=>{
                this.socket.emit(eName, {result: 'ok'})
            })
            .catch((e)=>{
                this.socket.emit(eName, {error: e})
            })
    }

}

module.exports = OnMyMarker;
