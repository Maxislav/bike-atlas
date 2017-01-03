/**
 * Created by maxislav on 29.12.16.
 */
let connection;
const hashKeys = [];
const util = require('./util');

function getRandom(min, max, int) {
  var rand = min + Math.random() * (max - min);
  if(int){
    rand = Math.round(rand)
  }
  return rand;
}


class OnEnter{
  constructor(socket, _connection){
    this.socket = socket;
    this.connection = connection = _connection;
    this.setHashKeys();
      socket.on('onEnter', this.onEnter.bind(this));
      socket.on('onExit', this.onExit.bind(this));
  }

  onEnter(data){
    const tepmlate = ['name', 'pass'];
    /*const arrData = [];
    tepmlate.forEach(item => {
      arrData.push(data[item])
    });*/
    const query = 'SELECT * from user WHERE `name`=? order by `id` desc limit 150';
    connection.query(query, [data.name], (err, rows) => {
      if (err) {
        console.error('onEnter', err)
        return
      }
      console.log('onEnter', rows);
      if(rows.length){
        if(rows.length == 1 && rows[0].pass == data.pass){
            this.setHash(rows[0].id)
                .then(hash=>{
                    this.socket.emit('onEnter', {
                        result: 'ok',
                        hash: hash,
                        name: rows[0].name
                    })
                })
                .catch(err=>{
                  console.error(err)
                })
        }else{
          this.socket.emit('onEnter', {
            result: false,
            message: 'user or password incorrect'
          })  
        }
        
      }else{
        this.socket.emit('onEnter', {
          result: false,
          message: 'User not exist'
        })
      }
    })
  }
  getHash(){
    const $possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let hash = '';
    for(let i=0; i<32; i++){
      hash += ''+$possible[getRandom(0,61, true)] ;
    };
    if(-1<hashKeys.indexOf[hash]){
      return this.getHash()
    }else{
      return hash;
    }
  }

  setHash(user_id){
    const hash =  this.getHash();
    console.log(this.socket.id)
    return new Promise((resolve, reject)=>{
        connection.query('INSERT INTO `hash` (`id`, `user_id`, `socket_id`, `key`) VALUES (NULL, ?, ?, ?)', [user_id, this.socket.id, hash], (err, results)=>{
            if(err){
                reject(err);
                return;
            }else{
              resolve(hash);
            }
        })
    })
  }
  onExit(data){

      util.deleteHashRow(connection, data.hash)
          .then((d) => {
              this.socket.emit('onExit', {
                  result: 'ok'
              });
              const index = hashKeys.indexOf(data.hash);
              if (-1 < index) {
                  hashKeys.splice(index, 1)
              }
          })
          .catch(err => {
              this.socket.emit('onExit', {
                  result: false,
                  message: err
              })
          });

  }

  setHashKeys(){
    const query = 'SELECT * FROM `hash`';
    this.connection.query(query, (err, rows)=>{
      if(err){
        console.error('SELECT * FROM `hash', err)
        return;
      }
      console.log(rows);
      rows.forEach(item=>{
        hashKeys.push(item.key)
      })
    })
  }
}

module.exports = OnEnter;