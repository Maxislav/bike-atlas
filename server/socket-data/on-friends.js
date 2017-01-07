const util = require('./util');


class OnFriend {
    constructor(socket, connection, logger) {
        this.socket = socket;
        this.logger = logger;
        this.connection = connection;
        this.socket.on('getAllUsers', this.getAllUsers.bind(this));
        this.socket.on('getInvites', this.getInvites.bind(this));
        this.socket.on('onInvite', this.onInvite.bind(this));
    }

    getAllUsers({hash, id}){

        util.getUsersNotSelf(this.connection, id)
            .then(d=>{
                this.socket.emit('getAllUsers', {
                    result: 'ok',
                    users: d
                })
            })
            .catch(err=>{
                this.socket.emit('getAllUsers', {
                    result: false,
                    message: err
                });
                console.error('error getAllUsers -> ', err)
            })

    }

    getInvites(d){
        util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(user_id=>{
                util.getInvites(this.connection, user_id)
                    .then(rows=>{
                        rows.forEach(item=>{
                            item.id = item.user_id;
                            delete item.user_id
                        });
                        this.socket.emit('getInvites', rows);
                    })
                    .catch(err=>{
                        this.socket.emit('getInvites', {
                            result: false,
                            message: err
                        });
                        console.error('error getInvites -> ', err)
                    })

            })
            .catch(err=>{
                this.socket.emit('getInvites', {
                    result: false,
                    message: err
                });
                console.error('error getInvites -> ', err)
            })

    }


    onInvite(d){
        util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(user_id=>{
                util.onInviteFromToId(this.connection, user_id,d.inviteId)
                    .then((d)=>{
                        this.socket.emit('onInvite', {
                            result: 'ok'
                        });
                    })

            })
            .catch(err=>{
                this.socket.emit('onInvite', {
                    result: false,
                    message: err
                });
                 console.error('error onInvite -> ', err)
            })

    }

}
module.exports = OnFriend;