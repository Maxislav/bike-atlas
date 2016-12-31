let connection;
let socket;
const util = require('./util');




class OnAuth{
    constructor(){

    }
    onAuth(data){
        util.getUserIdByHash(connection, data.hash)
            .then((row)=>{
                return util.getUserNameById(connection,row.user_id)
            })
            .then(user=>{
                console.log(user)
                socket.emit('onAuth', {
                    result: 'ok',
                    user: {
                        name: user.name
                    }
                })
            })
            .catch(err=>{
                socket.emit('onAuth', {
                    result: false,
                    message:err
                })
            });
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
