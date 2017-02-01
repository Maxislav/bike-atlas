const util = require('./util');



class OnChat{
  constructor(socket, connection, chat){
    this.socket = socket;
    this.connection = connection;
    this.chat =  chat;
    this.socket.on('onChatSend', this.onChatSend.bind(this, 'onChatSend' ))
  }

  onChatSend(eName, data){
    this.socket.emit(eName, data)
  }
  
  
}

module.exports = OnChat;