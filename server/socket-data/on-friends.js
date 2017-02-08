const R = require('ramda');
const ProtoData = require('./proto-data');

class OnFriend extends ProtoData{
    constructor(socket, util, logger, chat) {
        super(socket, util);
        this.logger = logger;
        this.chat = chat;
        this.socket.on('getAllUsers', this.getAllUsers.bind(this));
        this.socket.on('getInvites', this.getInvites.bind(this));
        this.socket.on('onInvite', this.onInvite.bind(this));
        this.socket.on('onAcceptInvite', this.onAcceptInvite.bind(this));
        this.socket.on('getFriends', this.getFriends.bind(this));
        this.socket.on('onDelFriend', this.onDelFriend.bind(this));
        this.socket.on('onRejectInvite', this.onRejectInvite.bind(this));
        this.socket.on('getUserImage', this.getUserImage.bind(this, 'getUserImage'));
        this.socket.on('onCancelInvite', this.onCancelInvite.bind(this, 'onCancelInvite'));
    }

    onCancelInvite(eName, enemy_id) {
        return this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id=>{
                return this.util.onCancelInvite(user_id, enemy_id)
            })
            .then(d=>{
                this.socket.emit(eName, {
                    result: 'ok'
                })
            })
            .catch(err => {
                this.socket.emit(eName, {
                    result: false,
                    message: err
                });

                console.error('error onCancelInvite -> ', err)
            });



    }

    getUserImage(eName, user_id) {
        return this.util.getUserImageById(user_id)
            .then(image => {
                this.socket.emit(eName, {
                    id: user_id,
                    image: image
                })
            })
            .catch(err => {
                console.error('Error getUserImage->', err)
            })
    }


    onRejectInvite(enemy_id) {

        return this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.getInvites( user_id)
                    .then((rows) => {
                        const enemy = R.find(item => {
                            return item.user_id == enemy_id
                        })(rows);

                        if (enemy) {
                            this.util.delInviteByUserId(enemy.user_id)
                                .then(d => {
                                    this.socket.emit('onRejectInvite', {
                                        result: 'ok'
                                    })
                                })
                        }
                    })

            })
            .catch(err => {
                this.socket.emit('onRejectInvite', {
                    result: false,
                    message: err
                });

                console.error('error onRejectInvite -> ', err)
            });

    }

    /**
     *
     * @param {boolean}isOnDelFriend
     */
    getFriends(isOnDelFriend) {
        const user = this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.getFriends(user_id)
            });

        const myInvites = this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.getMyInvites( user_id)
            });

        return Promise.all([user, myInvites])
            .then(d => {
                const rows = d[0];
                const invites = d[1];
                if (!isOnDelFriend) {
                    this.socket.emit('getFriends', {
                        result: 'ok',
                        friends: rows,
                        invites: invites
                    })
                } else {
                    return d[0]
                }
            })
            .catch(err => {
                if (!isOnDelFriend) {
                    this.socket.emit('getFriends', {
                        result: false,
                        message: err
                    });
                }

                console.error('error getFriends -> ', err)
            });

    }


    getAllUsers({hash, id}) {
        this.util.getUsersNotSelf(id)
            .then(d => {
                this.socket.emit('getAllUsers', {
                    result: 'ok',
                    users: d
                })
            })
            .catch(err => {
                this.socket.emit('getAllUsers', {
                    result: false,
                    message: err
                });
                console.error('error getAllUsers -> ', err)
            })

    }

    onDelFriend(friend_id) {
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.getFriends(true)
                    .then(friends => {
                        const friend = friends.find(item => {
                            return item.id == friend_id;
                        });
                        if (friend) {
                            return this.util.delFriend(user_id, friend_id)
                                .then(d => {
                                    this.socket.emit('onDelFriend', {
                                        user_id,
                                        friend_id
                                    })
                                })
                        }
                    })
            })
            .catch(err => {
                console.error('Error onDelFriend ->', err)
            })

    }

    getInvites(d) {
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.getInvites(user_id)
                    .then(rows => {
                        rows.forEach(item => {
                            item.id = item.user_id;
                            delete item.user_id
                        });
                        this.socket.emit('getInvites', rows);
                    })

            })
            .catch(err => {
                this.socket.emit('getInvites', {
                    result: false,
                    message: err
                });
                console.error('error getInvites -> ', err)
            })

    }


    onAcceptInvite(friendId) {
        this.util.getUserIdBySocketId(this.socket.id)
            .then(userId => {
                return this.util.getInviteByOwnerId(userId, friendId)
                    .then(rows => {
                        if (rows.length) {
                            return this.util.setFriends(userId, friendId)
                                .then(d => {
                                    this.socket.emit('onAcceptInvite', {
                                        result: 'ok',
                                    });
                                    return this.util.delInvite(rows[0].id)
                                      .then(d=>{
                                        return friendId
                                      })
                                })
                        } else {
                            this.socket.emit('onAcceptInvite', {
                                result: false,
                                message: 'no invite'
                            })
                        }
                    });
            })
            .then(friendId=>{
                return this.chat.sendUpdateFriends(friendId)
            })
            .catch(err => {
                this.socket.emit('onAcceptInvite', {
                    result: false,
                    message: err
                });
                console.error('error onAcceptInvite -> ', err)
            })

    }


    onInvite({inviteId}) {
       this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.onInviteFromToId(user_id, inviteId)
                    .then((d) => {
                        this.socket.emit('onInvite', {
                            result: 'ok'
                        });
                      return inviteId
                    })

            })
          .then(inviteId=>{
              this.chat.sendUpdateInvite(inviteId)
          }) 
            .catch(err => {
                this.socket.emit('onInvite', {
                    result: false,
                    message: err
                });
                console.error('error onInvite -> ', err)
            })

    }

}
module.exports = OnFriend;