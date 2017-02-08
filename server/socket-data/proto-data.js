const util = require('./util');
const R = require('ramda');

/**
 * 
 */
class ProtoData{
	/**
     * 
     * @param socket
     * @param {Util} util
     */
    constructor(socket, util) {
        this.socket = socket;
        this.util = util;
        
     
    }
    getUserId() {
        return this.util.getUserIdBySocketId(this.socket.id)
    }
    getFriendsIds(){
        return this.getUserId()
          .then(userId=>{
             return this.util.getFriendIds( userId)
               .then(rows=>{
                   return R.pluck('friend_id')(rows)
               })
          })

    }
   
}
module.exports = ProtoData;