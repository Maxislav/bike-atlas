const util = require('./util');


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
    }

    getFriends() {
        const friends = util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(user_id => {
                return util.getFriends(this.connection, user_id)
            });

        const myInvites = util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(user_id => {
                return util.getMyInvites(this.connection, user_id)
            });

        Promise.all([friends, myInvites])
            .then(d => {
                const rows = d[0];
                const invites = d[1];
                this.socket.emit('getFriends', {
                    result: 'ok',
                    friends: rows,
                    invites: invites
                })

            })
            .catch(err => {
                this.socket.emit('getFriends', {
                    result: false,
                    message: err
                });
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

    onDelFriend(friend_id){

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