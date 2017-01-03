let app, ioServer;

module.exports = class Logger{
    /** @namespace this.connection */

    constructor(_app, _ioServer, connection){
       app = _app; ioServer = _ioServer;
       this.connection = connection;
       this._sockets = {};
       this.devices = {};

       app.get('/logger*',this.onLog.bind(this))
    }

    onLog(req, res, next){
        res.setStatus = 200;
        res.end('ok');
        const device_id = req.query.id;
        if(this.devices && this.devices[device_id]){
            this.devices[device_id].forEach(socket_id=>{
                this.sockets[socket_id] && this.sockets[socket_id].emit('log', req.query.gprmc )
            })
        }
    }
    updateDevice(device_key, socket_id){
        this.devices[device_key] = this.devices[device_key] || [];
        this.devices[device_key].push(socket_id);
       //console.log('ololo',this.devices)
    }



    set sockets(connected){
        this._sockets  = connected;
    }
    get sockets(){
        return this._sockets;
    }


};
