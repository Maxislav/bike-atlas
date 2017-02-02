const util = require('./util');


class OnChat {
  constructor(socket, connection, chat) {
    this.socket = socket;
    this.connection = connection;
    this.chat = chat;
    this.socket.on('onChatSend', this.onChatSend.bind(this, 'onChatSend'))
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
}

module.exports = OnChat;