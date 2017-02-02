const util = require('./util');
const R = require('ramda');

class OnChat {
  constructor(socket, connection, chat) {
    this.socket = socket;
    this.connection = connection;
    this.chat = chat;
    this.socket.on('onChatSend', this.onChatSend.bind(this, 'onChatSend'));
    this.socket.on('chatHistory', this.chatHistory.bind(this, 'chatHistory'));


  }

  onChatSend(eName, data) {
    const toUserId = data.id;
    util.getUserIdBySocketId(this.connection, this.socket.id)
      .then(userId=> {
        const resData = {
          toUserId: toUserId,
          fromUserId: userId,
          date: new Date(),
          text: data.text
        };
        return util.onChatSend(this.connection, resData)
          .then(rows=> {
            resData.id = rows.insertId;
            this.chat.onChatSend(resData);
            this.socket.emit(eName, resData);
          })
      })
      .catch(err=> {
        console.error(eName, '->', err)
      })
  }

  chatHistory(eName, opponentId) {
    util.getUserIdBySocketId(this.connection, this.socket.id)
      .then(userId=> {
        return util.chatHistory(this.connection, userId, opponentId)
          .then(arrRows=> {
            const ownMess = formatMess(arrRows[0], true);
            const outMess = formatMess(arrRows[1], false);
            let result = ownMess.concat(outMess);

            result =  result.sort(function (a, b) {
            const aTime = new Date(a.date).getTime();
            const bTime = new Date(b.date).getTime();

              if (aTime > bTime) {
                return 1;
              }
              if (aTime < bTime) {
                return -1;
              }
              return 0;
            });

            this.socket.emit(eName, result)
          })
      })
      .catch(err=> {

      })


  }
}


function formatMess(mess, own) {
  const  res = [];

  mess.forEach(mes=>{
    const _mes = {};
    for(let key in mes){
      _mes[camelCased(key)] = mes[key]
    }
    _mes['isMy'] = own
    res.push(_mes)
  });
  return res
}

function camelCased(myString) {
 return myString.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

module.exports = OnChat;