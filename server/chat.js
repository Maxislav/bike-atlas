const R = require('ramda');

class Chat{
    constructor(util){
        this.util = util;
        this._sockets = {};
	    /**
         *
         * @type {{[userId:number]:[]}}
         */
        this.user = {};
    }

    onAuth(socketId, userId){
        const util = this.util;
        this.user[userId] = this.user[userId] || [];

        if(!this.isExist(this.user[userId], socketId)  ){
            this.user[userId].push(socketId);
        }
        console.log('chat user ids->', this.user)
        util.getUserNameById(userId)
            .then(name=>{
                console.log('chat auth ->', name, new Date());
            });
    }
    onEnter(socketId, userId){
        this.user[userId] = this.user[userId] || [];
        console.log('chat enter ->', userId);
        if(!this.isExist(this.user[userId], socketId)  ){
            this.user[userId].push(socketId);
        }
    }
    onExit(socketId){
        console.log('chat exit ->', socketId);
        const userId = this.clearSocket(socketId);
        if(userId){
            this.util.getUserById(userId)
                .then(user=>{
                    console.log('chat exit - >',  user.name)
                })
                .catch(err => {
                    console.error('Error getUserById ->', err)
                });
        }
    }
    onDisconnect(socketId){
        this.util.getUserIdBySocketId(socketId)
            .then(userId=>{
               return this.util.getUserNameById(userId)
            })
            .then(name=>{
                console.log('chat disconnect ->', name);
            });
        this.clearSocket(socketId)
    }

    clearSocket(socketId){

        let userId = null;
        R.mapObjIndexed((item, key)=>{
            const index = item.indexOf(socketId);
            if(-1<index){
                item.splice(index,1)
                userId = key
            }
        }, this.user);

        return userId;

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
