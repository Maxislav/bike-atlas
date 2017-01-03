let connection;
let socket;
const util = require('./util');

class Device{

    /**
     *
     * @param {{hash: string}}d
     */
    getDevice(d){
        util.getDeviceByHash(connection, d.hash)
            .then(rows=>{
                socket.emit('getDevice', rows)
            })
            .catch((err)=>{
                socket.emit('getDevice', null)
            })
    }
    onAddDevice(device){
       // console.log()
    }

    set connection(con){
        connection = con;
    }
    get connection(){
        return connection;
    }

    get socket(){
        return socket;
    }
    set socket(s){
        socket = s;
        socket.on('getDevice', this.getDevice.bind(this))
        socket.on('onAddDevice', this.onAddDevice.bind(this))
    }
}

module.exports = new Device();