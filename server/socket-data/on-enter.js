/**
 * Created by maxislav on 29.12.16.
 */
let connection;
let socket;

const hashKeys = [];

function getRandom(min, max, int) {
  var rand = min + Math.random() * (max - min);
  if(int){
    rand = Math.round(rand)
  }
  return rand;
}

function getUserIdByHash(arrData) {
  return new Promise((resolve, reject)=>{
    const  query = 'SELECT `id` FROM `user` WHERE `name`=?';
    connection.query(query, arrData, (err, rows)=>{
      if(err){
        reject(err);
        return;
      }
      resolve(rows[0].id)
    })
  })
}

function deleteHashRow(data) {
  return new Promise((resolve, reject)=>{
    connection.query('DELETE FROM `hash` WHERE `key`=?', [data.hash], (err, result) =>{
        if(err){
          reject(err);
          return;
        }
        const index = hashKeys.indexOf(data.hash)
        if(-1<index){
            hashKeys.splice(index,1)
        }
        resolve(result)
    })
  })

}

class OnEnter{

  constructor(){
    
  }

  onEnter(data){
    const tepmlate = ['name', 'pass'];
    const arrData = [];
    tepmlate.forEach(item => {
      arrData.push(data[item])
    });
    const query = 'SELECT * from user WHERE `name`=? order by `id` desc limit 150';
    connection.query(query, arrData, (err, rows) => {
      if (err) {
        console.error('onEnter', err)
        return
      }
      console.log(rows);
      if(rows.length){
        if(rows.length == 1 && rows[0].pass == data.pass){
          this.setHash(arrData)
        }else{
          socket.emit('onEnter', {
            result: false,
            message: 'user or password incorrect'
          })  
        }
        
      }else{
        socket.emit('onEnter', {
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

  setHash(arrData){
    const hash =  this.getHash();
    getUserIdByHash(arrData)
      .then(id=>{
        connection.query('INSERT INTO `hash` (`id`, `user_id`, `key`) VALUES (NULL, ?, ?)', [id, hash], (err, results)=>{
          if(err){
            socket.emit('onEnter', {
              result: false,
              message: err
            })
          }else{
            socket.emit('onEnter', {
              result: 'ok',
              hash: hash,
              name: arrData[0]
            })
          }
        })
      });

  }
  onExit(data){
      deleteHashRow(data)
          .then((d)=>{

              socket.emit('onExit', {
                result: 'ok'
              })
          })
          .catch(err=>{
              socket.emit('onExit', {
                  result: false,
                  message: err
              })
          })

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

  set connection(con){
    connection = con;
  }
  get connection(){
    return connection;
  }

  get socket(){
    return socket;
  }
  set socket(s){
    socket = s;
    socket.on('onEnter', this.onEnter.bind(this));
    socket.on('onExit', this.onExit.bind(this));
  }
}

module.exports = new OnEnter();