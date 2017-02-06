const util = require('./util');
const R = require('ramda');

class ProtoData{
    constructor(socket, connection) {
        this.socket = socket;
        this.connection = connection;
    }
    getUserId() {
        return util.getUserIdBySocketId(this.connection, this.socket.id)
    }
    getFriendsIds(){
        return this.getUserId()
          .then(userId=>{
             return util.getFriendIds(this.connection, userId)
               .then(rows=>{
                   return R.pluck('friend_id')(rows)
               })
          })


    }
}
module.exports = ProtoData;