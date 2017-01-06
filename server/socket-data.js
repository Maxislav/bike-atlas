const socketStream = require('socket.io-stream');

const mysql = require('mysql');
const config = require('./mysql.config.json');
const io = require('socket.io')
config.mysql['database'] = 'monitoring';
const connection = mysql.createConnection(config.mysql);
const OnEnter = require('./socket-data/on-enter');
const OnAuth = require('./socket-data/on-auth');
const Device = require('./socket-data/device');
const OnRegist = require('./socket-data/on-regist');
const OnProfile = require('./socket-data/on-profile');

const Logger = require('./logger');
connection.connect((err)=>{
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

function onRegist(data) {
  const tepmlate = ['name', 'pass'];
  const arrData = [];
  tepmlate.forEach(item => {
    arrData.push(data[item])
  });

  return checkExistUser(arrData)
    .then((rows) => {
      if (rows.length) {
        return {
          result: false,
          message: 'User exist'
        }
      } else {
        return addUser(arrData)
      }

    })
    .catch((err) => {
      console.log('onRegist +>', err)
    })


}


module.exports = (sever, app) => {
    const ioServer = io(sever);
    const logger = new Logger(app, ioServer, connection);

    ioServer.on('connection', function (socket) {
        logger.sockets = ioServer.sockets.connected;
        const onEnter = new OnEnter(socket, connection, logger);
        const onAuth = new OnAuth(socket, connection, logger);
        const device = new Device(socket, connection, logger);
        const onRegist = new OnRegist(socket, connection, logger);
        const onProfile = new OnProfile(socket, connection, logger);
        socket.on('disconnect',()=>{
            logger.onDisconnect(socket.id)
        });

        socketStream(socket).on('file', function (stream) {
            let data = [];
            stream.on('data', (d) => {
                data.push(d);
            });
            stream.on('end', (e, d) => {
                console.log("file send")
                socket.emit('file', Buffer.concat(data));
            });
        });


    });


    //INSERT INTO `user` (`id`, `name`, `pass`, `opt`) VALUES (NULL, 'max', 'eeew', NULL);
};
