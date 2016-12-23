const socketStream = require('socket.io-stream');
module.exports = (io)=>{
  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });

    socket.on('onRegist',  (d) =>{
      console.log(d)
      socket.emit('onRegist', {id: 0})
    });
    
    
    
    
    
    socketStream(socket).on('file', function(stream) {
      let data = [];
      stream.on('data', (d)=>{
        data.push(d);
      });
      stream.on('end', (e, d)=>{
        console.log("file send")
        socket.emit('file', Buffer.concat(data));
      });
    });
  });
};
