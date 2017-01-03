const socketStream = require('socket.io-stream');

const mysql = require('mysql');
const config = require('./mysql.config.json');
const io = require('socket.io')
config.mysql['database'] = 'monitoring';
const connection = mysql.createConnection(config.mysql);
const OnEnter = require('./socket-data/on-enter');
const OnAuth = require('./socket-data/on-auth');
const Device = require('./socket-data/device');
connection.connect((err)=>{
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
    //onEnter.connection = connection;
    //onAuth.connection = connection;
    //device.connection = connection;
    //onEnter.setHashKeys();


});



/**
 * Проверка ли существукт user
 * @param arrData
 * @returns {Promise}
 */

function checkExistUser(arrData) {

  return new Promise((resolve, reject) => {
    const query = 'SELECT `name` from user WHERE `name`=? order by `id` desc limit 150';
    connection.query(query, arrData, (err, rows) => {
      if (err) {
        reject(err);
        return
      }
      resolve(rows)
    })
  })
}

function addUser(arrData) {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO `user` (`id`, `name`, `pass`, `opt`) VALUES (NULL, ?, ?, NULL)', arrData, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        result: 'ok',
        message: null
      })
    })
  })
}


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


module.exports = (sever) => {

  io(sever).on('connection', function (socket) {
    const onEnter = new OnEnter(socket, connection);
    const onAuth = new OnAuth(socket, connection);
    const device = new Device(socket, connection);




    socket.on('onRegist', (d) => {
      console.log('onRegist start', d);

      onRegist(d)
        .then(d => {
          socket.emit('onRegist', d)
        }, err => {
          console.error(err)
        })
        .catch((err)=> {
          console.error('Cache onRegist', err);
          socket.emit('onRegist', {result: false, status: 500, message: err})
        })

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
