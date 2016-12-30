let connection;
let socket;


class OnAuth{
    constructor(){

    }

    onAuth(data){
        console.log(data)
        socket.emit('onAuth', data)
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

        socket.on('onAuth', this.onAuth.bind(this))
    }
}
module.exports = new OnAuth();
