const util = require('./util');

class TrackFromTo {
    constructor(socket, connection) {
        this.socket = socket;
        this.connection = connection;
        socket.on('trackFromTo', this.trackFromTo.bind(this, 'trackFromTo'))
    }

    trackFromTo(eName, data) {
        let _userId;
        util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(userId => {
                _userId = userId;
                return util.getDeviceByUserId(this.connection, userId)
            }).then(devices => {
            this.socket.emit(eName, {
                result: 'ok',
                devices: devices
            })
        })


    }


}

module.exports = TrackFromTo;