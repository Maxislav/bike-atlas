const socketStream = require('socket.io-stream');

const mysql = require('mysql');
const config = require('./mysql.config.json');
const io = require('socket.io')
config.mysql['database'] = 'monitoring';
//let connection = mysql.createConnection(config.mysql);

const OnEnter = require('./socket-data/on-enter');
const OnAuth = require('./socket-data/on-auth');
const Device = require('./socket-data/device');
const OnRegist = require('./socket-data/on-regist');
const OnProfile = require('./socket-data/on-profile');
const OnFriend = require('./socket-data/on-friends');
const OnPrivateArea = require('./socket-data/on-private-area');
const Chat = require('./chat');
const TrackFromTo = require('./socket-data/track-from-to')
const OnChat = require('./socket-data/on-chat')
const Logger = require('./logger');
let connection, server, app;
let resolveExport;
let promiseExport = new Promise((resolve, reject)=>{
    resolveExport = resolve
});
let socketData;
class SocketData{
    constructor(server, app, connection){
        this.connection = connection;
        const ioServer = io(server);
        const logger = new Logger(app, ioServer, connection);
        const chat = new Chat(connection);

        ioServer.on('connection',  (socket) => {
            logger.sockets = ioServer.sockets.connected;
            chat.sockets = ioServer.sockets.connected;
            const onEnter = new OnEnter(socket, this.connection, logger, chat);
            const onAuth = new OnAuth(socket, this.connection, chat, logger);
            const device = new Device(socket, this.connection, logger);
            const onRegist = new OnRegist(socket, this.connection, logger);
            const onProfile = new OnProfile(socket, this.connection, logger);
            const onFriend = new OnFriend(socket, this.connection, logger, chat);
            const onPrivateArea = new OnPrivateArea(socket, this.connection);
            const trackFromTo = new TrackFromTo(socket, this.connection);
            const onChat = new OnChat(socket, this.connection, chat);
            socket.on('disconnect',()=>{
                logger.onDisconnect(socket.id);
                chat.onDisconnect(socket.id);
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

    }
    updateConnect(connection){
        this.connection = connection;
    }
}


    

const connectionConnect = ()=>{
    connection = mysql.createConnection(config.mysql);
    connection.on('error', (err)=>{
        console.log(err);
        if(err.code == 'PROTOCOL_CONNECTION_LOST'){
            console.error('PROTOCOL_CONNECTION_LOST ->' + err);
            connection.end();
            setTimeout(connectionConnect, 10000)
        }
    });
    
    connection.on('connect', (err)=>{
        if(err){
            console.log('err.connect -> ', err)
            return;
        }
        
        console.log('connected connect ->');

    });
    connection.connect((err)=>{
        if (err) throw err;
        console.log('connected as id ->' + connection.threadId);
        promiseExport
            .then(d=>{
                server = d.server;
                app = d.app;
                if(socketData){
                    socketData.updateConnect(connection)
                }else{
                    socketData = new SocketData(server, app, connection)    
                }
                
            });
    })
    
};
connectionConnect();






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


module.exports = (server, app) => {
    //server = _server; app = _app;
    resolveExport({server, app})
    
   // socketData =   new SocketData(server, app, connection)



    //INSERT INTO `user` (`id`, `name`, `pass`, `opt`) VALUES (NULL, 'max', 'eeew', NULL);
};
