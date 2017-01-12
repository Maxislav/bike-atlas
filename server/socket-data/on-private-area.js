const util = require('./util');


class OnPrivateArea {

  constructor(socket, connection) {
    this.socket = socket;
    this.connection = connection;
    this.socket.on('savePrivateArea', this.savePrivateArea.bind(this))
    this.socket.on('getPrivateArea', this.getPrivateArea.bind(this))
    this.socket.on('removeArea', this.removeArea.bind(this))
    this.socket.on('lockPrivateArea', this.lockPrivateArea.bind(this, 'lockPrivateArea'))
  }

  lockPrivateArea(eName, val){
    util.getUserIdBySocketId(this.connection, this.socket.id)
      .then(user_id=>{
        return util.lockPrivateArea(this.connection, user_id, val)
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
    util.getUserIdBySocketId(this.connection, this.socket.id)
      .then(user_id=> {
        return util.getPrivateArea(this.connection, user_id)


      })
      .then(areas=> {
        const area = areas.find(item=> {
          return item.id == area_id;
        });


        return area;
      })
      .then(area=> {
        if (area) {
          return util.removePrivateArea(this.connection, area.id)
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
    util.getUserIdBySocketId(this.connection, this.socket.id)
      .then(user_id=> {
        return util.getPrivateArea(this.connection, user_id)
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
    util.getUserIdBySocketId(this.connection, this.socket.id)
      .then(user_id=> {
        return util.addPrivateArea(this.connection, user_id, area)
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