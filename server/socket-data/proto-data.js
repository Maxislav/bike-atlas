const util = require('./util');

class ProtoData{
    constructor(socket, connection) {
        this.socket = socket;
        this.connection = connection;
    }
    getUserId() {
     return util.getUserIdBySocketId(this.connection, this.socket.id)
    }
}
module.exports = ProtoData;