const ProtoData = require('./proto-data')

class OnPrivateArea extends ProtoData{

  constructor(socket, connection) {
    super(socket, connection);
    this.socket.on('savePrivateArea', this.savePrivateArea.bind(this))
    this.socket.on('getPrivateArea', this.getPrivateArea.bind(this))
    this.socket.on('removeArea', this.removeArea.bind(this))
    this.socket.on('lockPrivateArea', this.lockPrivateArea.bind(this, 'lockPrivateArea'))
  }

  lockPrivateArea(eName, val){
    this.util.getUserIdBySocketId(this.socket.id)
      .then(user_id=>{
        return this.util.lockPrivateArea(user_id, val)
      })
      .then(d=>{
        this.socket.emit(eName, {
          result: 'ok'
        })
      })
      .catch(err=>{

        console.error('lockPrivateArea->', err)
      })
  }
  removeArea(area_id) {
    this.util.getUserIdBySocketId(this.socket.id)
      .then(user_id=> {
        return this.util.getPrivateArea(user_id)
      })
      .then(areas=> {
        const area = areas.find(item=> {
          return item.id == area_id;
        });


        return area;
      })
      .then(area=> {
        if (area) {
          return this.util.removePrivateArea(this.connection, area.id)
        } else {
          this.socket.emit('removeArea', {
            result: false,
            message: 'no area'
          })
        }

      })
      .then(d=> {
        this.socket.emit('removeArea', {
          result: 'ok'
        })
      })
      .catch(err=> {
        console.error('Error removeArea ->', err);
        this.socket.emit('removeArea', {
          result: false,
          message: err
        })
      })

  }

  getPrivateArea() {
    this.util.getUserIdBySocketId(this.socket.id)
      .then(user_id=> {
        return this.util.getPrivateArea(user_id)
      })
      .then(rows=> {
        this.socket.emit('getPrivateArea', {
          result: 'ok',
          areas: rows
        })
      })
      .catch(err=> {
        console.error('Error getPrivateArea ->', err);
        this.socket.emit('getPrivateArea', {
          result: false,
          message: err
        })
      })
  }

  savePrivateArea(area) {
    this.util.getUserIdBySocketId(this.socket.id)
      .then(user_id=> {
        return this.util.addPrivateArea(user_id, area)
      })
      .then(d=> {
        this.socket.emit('savePrivateArea', {
          result: 'ok'
        })

      })
      .catch(err=> {
        console.error('Error savePrivateArea ->', err);
        this.socket.emit('savePrivateArea', {
          result: false,
          message: err
        })
      })

  }

}

module.exports = OnPrivateArea;