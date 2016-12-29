/**
 * Created by maxislav on 29.12.16.
 */
let connection;
let socket;


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
        socket.emit('onEnter', rows)

      }else{
        socket.emit('onEnter', {
          result: false,
          message: 'User not exist'
        })
      }

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
    socket.on('onEnter', d=>{
      this.onEnter(d)
     /* console.log('onEnter', d)
      socket.emit('onEnter', d);*/
    })
  }
}

module.exports = new OnEnter();