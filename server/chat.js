const util = require('./socket-data/util');
const R = require('ramda');

class Chat{
    constructor(connection){
        this.connection = connection;
        this._sockets = {};
        this.user = {};
    }

    onAuth(socketId, userId){
        console.log('chat auth ->', socketId, userId);
        this.user[userId] = this.user[userId] || [];
        if(!this.isExist(this.user[userId], socketId)  ){
            this.user[userId].push(socketId);
        }
    }
    onEnter(socketId, userId){
        console.log('chat enter ->', socketId, userId);
        this.user[userId] = this.user[userId] || [];
        if(!this.isExist(this.user[userId], socketId)  ){
            this.user[userId].push(socketId);
        }
    }
    onExit(socketId){
        console.log('chat exit ->', socketId);
        this.clearSocket(socketId)
    }
    onDisconnect(socketId){
        console.log('chat disconnect ->', socketId);
        this.clearSocket(socketId)
    }

    clearSocket(socketId){
        R.map((item)=>{
            const intex = item.indexOf(socketId);
            if(-1<intex){
                item.splice(intex,1)
            }
        },this.user)
    }

    set sockets(connected) {
        this._sockets = connected;
    }

    get sockets() {
        return this._sockets;
    }

    isExist(user,  socketId){
        return -1<user.indexOf(socketId)
    }
}
module.exports = Chat;
