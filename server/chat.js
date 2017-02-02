const util = require('./socket-data/util');
const R = require('ramda');

class Chat{
    constructor(connection){
        this.connection = connection;
        this._sockets = {};
        this.user = {};
    }

    onAuth(socketId, userId){
        this.user[userId] = this.user[userId] || [];

        if(!this.isExist(this.user[userId], socketId)  ){
            this.user[userId].push(socketId);
        }
        console.log('chat user ids->', this.user)
        util.getUserNameById(this.connection, userId)
            .then(name=>{
                console.log('chat auth ->', name, new Date());
            });
    }
    onEnter(socketId, userId){

        util.getUserNameBySocketId(this.connection, this.socket.id)
            .then(name=>{
                console.log('chat enter ->', socketId, name, new Date());
            });
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
    
    sendUpdateInvite(inveteId){
        
        if(this.user[inveteId]){
            this.user[inveteId].forEach(socketId=>[
              this.sockets[socketId].emit('updateInvites', true)
            ]);
            return true;
        }
        return false;
    }
    sendUpdateFriends(friendId){
        if(this.user[friendId]){
            this.user[friendId].forEach(socketId=>[
                this.sockets[socketId].emit('updateFriends', true)
            ]);
            return true;
        }
        
    }


    onChatSend(d){

        const  toUserId = d.toUserId;
        const  userId = d.fromUserId;
        const  text = d.text;

        if(this.user[toUserId]){
            this.user[toUserId].forEach(socketId=>{
                this.sockets[socketId].emit('onChat', {
                    id: d.id,
                    userId,
                    text,
                    date: d.date
                })
            })
        }
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
