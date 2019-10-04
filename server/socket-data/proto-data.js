const util = require('./util');
const R = require('ramda');



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
    static toCamelCaseArrObj(arr){
      return arr.map(item=>{
        return ProtoData.toCamelCaseObj(item)
      })
    }
  
    static toCamelCaseObj(obj){
      const res = {};
      for (let opt in obj){
        res[camelCased(opt)] = obj[opt]
      }
      function camelCased(myString) {
        return myString.replace(/_([a-z])/g, function (g) {
          return g[1].toUpperCase();
        });
      }
      return res;
    }

}
module.exports = ProtoData;