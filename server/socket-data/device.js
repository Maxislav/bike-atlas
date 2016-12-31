let connection;
let socket;

class Device{

    getDevice(d){
        socket.emit('getDevice', d)
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
    }
}

module.exports = new Device();