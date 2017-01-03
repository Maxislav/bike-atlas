let app, ioServer;

module.exports = class Logger {
    /** @namespace this.connection */

    constructor(_app, _ioServer, connection) {
        app = _app;
        ioServer = _ioServer;
        this.connection = connection;
        this._sockets = {};
        this.devices = {};

        app.get('/logger*', this.onLog.bind(this))
    }

    onLog(req, res, next) {

        const device_id = req.query.id;

        let checkSum;
        try {
            checkSum = req.query.gprmc.match(/\*.+$/)[0]
        } catch (err) {
            console.error(err)
        }

        if (checkSum) {
            res.setStatus = 200;
            checkSum = checkSum.replace(/\*/, '');
            res.end(checkSum);
        } else {
            res.setStatus = 500;
            res.end();
        }
        //console.log('checkSum', checkSum)
        if (this.devices && this.devices[device_id]) {
            this.devices[device_id].forEach(socket_id => {
                this.sockets[socket_id] && this.sockets[socket_id].emit('log', req.query.gprmc);
//                $GPRMC,153946,A,5023.31220,N,3029.63150,E,0.000000,0.000000,030117,,*2A

                console.log(req.query.gprmc)
            })
        }
    }

    updateDevice(device_key, socket_id) {
        this.devices[device_key] = this.devices[device_key] || [];
        this.devices[device_key].push(socket_id);
    }

    onDisconnect(id) {
        for (let opt in this.devices) {
            let ids = this.devices[opt];
            let i = 0;
            while (i < ids.length) {
                if (ids[i] == id) {
                    ids.splice(i, 1);
                } else {
                    i++
                }
            }
        }
        console.log('onDisconnect', this.devices)
    }


    set sockets(connected) {
        this._sockets = connected;
    }

    get sockets() {
        return this._sockets;
    }


};
