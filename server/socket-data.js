const socketStream = require('socket.io-stream');

const mysql      = require('mysql');
const config = require('./mysql.config.json');

config.mysql['database'] = 'monitoring';
const connection = mysql.createConnection(config.mysql);

function onRegist(data) {

  return new Promise((resolve, reject)=>{
    const tepmlate = ['name', 'pass'];
    const arrData = [];
    tepmlate.forEach(item=>{
      arrData.push(data[item])
    });

    connection.query('INSERT INTO `user` (`id`, `name`, `pass`, `opt`) VALUES (NULL, ?, ?, NULL)', arrData, (err, results)=>{
        if(err){
          reject(err);
          return;
        }
      
        resolve(results)
    } )
  })
}




module.exports = (io)=>{
  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });

    socket.on('onRegist',  (d) =>{
      console.log(d)

      onRegist(d)
        .then(d=>{
          socket.emit('onRegist', d)
        }, err=>{
          console.error(err)
        })
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


  //INSERT INTO `user` (`id`, `name`, `pass`, `opt`) VALUES (NULL, 'max', 'eeew', NULL);
};
