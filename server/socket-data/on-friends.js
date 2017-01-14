const util = require('./util');
const R = require('ramda');

class OnFriend {
    constructor(socket, connection, logger) {
        this.socket = socket;
        this.logger = logger;
        this.connection = connection;
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
        return util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(user_id=>{
                return util.onCancelInvite(this.connection, user_id, enemy_id)
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
        return util.getUserImageById(this.connection, user_id)
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

        return util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(user_id => {
                return util.getInvites(this.connection, user_id)
                    .then((rows) => {
                        const enemy = R.find(item => {
                            return item.user_id == enemy_id
                        })(rows);

                        if (enemy) {
                            util.delInviteByUserId(this.connection, enemy.user_id)
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
        const user = util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(user_id => {
                return util.getFriends(this.connection, user_id)
            });

        const myInvites = util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(user_id => {
                return util.getMyInvites(this.connection, user_id)
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
        util.getUsersNotSelf(this.connection, id)
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
        util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(user_id => {
                return this.getFriends(true)
                    .then(friends => {
                        const friend = friends.find(item => {
                            return item.id == friend_id;
                        });
                        if (friend) {
                            return util.delFriend(this.connection, user_id, friend_id)
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
        util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(user_id => {
                return util.getInvites(this.connection, user_id)
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
        util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(userId => {
                return util.getInviteByOwnerId(this.connection, userId, friendId)
                    .then(rows => {
                        if (rows.length) {
                            return util.setFriends(this.connection, userId, friendId)
                                .then(d => {
                                    this.socket.emit('onAcceptInvite', {
                                        result: 'ok',
                                    });
                                    return util.delInvite(this.connection, rows[0].id)
                                })
                        } else {
                            this.socket.emit('onAcceptInvite', {
                                result: false,
                                message: 'no invite'
                            })
                        }
                    });
            })
            .catch(err => {
                this.socket.emit('onAcceptInvite', {
                    result: false,
                    message: err
                });
                console.error('error onAcceptInvite -> ', err)
            })

    }


    onInvite(d) {
        util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(user_id => {
                util.onInviteFromToId(this.connection, user_id, d.inviteId)
                    .then((d) => {
                        this.socket.emit('onInvite', {
                            result: 'ok'
                        });
                    })

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