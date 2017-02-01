const util = require('./util');



class OnChat{
  constructor(socket, connection, chat){
    this.socket = socket;
    this.connection = connection;
    this.chat =  chat;
    this.socket.on('onChatSend', this.onChatSend.bind(this, 'onChatSend' ))
  }

  onChatSend(eName, data){
    const toUserId = data.id;
      util.getUserIdBySocketId(this.connection, this.socket.id)
          .then(userId=>{
              this.socket.emit(eName, {
                  toUserId: toUserId,
                  fromUserId: userId,
                  time: new Date(),
                  text:data.text
              });
              this.chat.onChatSend(toUserId, userId, data.text)
          })


  }
  
  
}

module.exports = OnChat;