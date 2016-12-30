let connection;
let socket;

function getUserIdByHash(data) {
    return new Promise((resolve, reject)=>{
        connection.query('SELECT * FROM `hash` WHERE `key`=?', [data.hash], (err, rows)=>{
            if(err){
                reject(err);
                return;
            }
            resolve(rows[0]);
        });
    })
}

function getUserNameById(row) {
    return new Promise((resolve, reject)=>{
        connection.query('SELECT * FROM `user` WHERE `id`=?', [row.user_id], (err, rows)=>{
            if(err){
                reject(err);
                return;
            }

            resolve(rows[0]);
        });
    })
}


class OnAuth{
    constructor(){

    }
    onAuth(data){
        getUserIdByHash(data)
            .then(getUserNameById)
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
