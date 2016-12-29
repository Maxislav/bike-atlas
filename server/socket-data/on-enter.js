/**
 * Created by maxislav on 29.12.16.
 */
let connection;
let socket;

function getRandom(min, max, int) {
  var rand = min + Math.random() * (max - min);
  if(int){
    rand = Math.round(rand)
  }
  return rand;
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
          socket.emit('onEnter', {
            result: 'ok',
            hash: this.getHash()
          })
        }
        socket.emit('onEnter', {
          result: false,
          message: 'user or password incorrect'
        })
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
    return hash;
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
    socket.on('onEnter', d=>{
      this.onEnter(d)
     /* console.log('onEnter', d)
      socket.emit('onEnter', d);*/
    })
  }
}

module.exports = new OnEnter();