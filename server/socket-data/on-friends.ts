import { autobind } from '../util/autobind';

const R = require('ramda');
import * as ProtoData from './proto-data';

class OnFriend extends ProtoData {
    private socket;
    private util;
    private logger;
    private chat;

    constructor(socket, util, logger, chat) {
        super(socket, util);
        this.logger = logger;
        this.chat = chat;


        this.socket.$get('getFriends', this.getFriends);
        this.socket.$get('getAllUsers', this.getAllUsers);
        this.socket.$get('getInvites', this.getInvites);


        // this.socket.on('getInvites', this.getInvites.bind(this));
        this.socket.on('onInvite', this.onInvite.bind(this));
        this.socket.on('onAcceptInvite', this.onAcceptInvite.bind(this));
        this.socket.on('onDelFriend', this.onDelFriend.bind(this));
        this.socket.on('onRejectInvite', this.onRejectInvite.bind(this));
        this.socket.on('getUserImage', this.getUserImage.bind(this, 'getUserImage'));
        this.socket.on('onCancelInvite', this.onCancelInvite.bind(this, 'onCancelInvite'));
    }

    onCancelInvite(eName, enemy_id) {
        return this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.onCancelInvite(user_id, enemy_id);
            })
            .then(d => {
                this.socket.emit(eName, {
                    result: 'ok'
                });
            })
            .catch(err => {
                this.socket.emit(eName, {
                    result: false,
                    message: err
                });

                console.error('error onCancelInvite -> ', err);
            });


    }

    getUserImage(eName, user_id) {
        return this.util.getUserImageById(user_id)
            .then(image => {
                this.socket.emit(eName, {
                    id: user_id,
                    image: image
                });
            })
            .catch(err => {
                console.error('Error getUserImage->', err);
            });
    }


    onRejectInvite(enemy_id) {

        return this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.getInvites(user_id)
                    .then((rows) => {
                        const enemy = R.find(item => {
                            return item.user_id == enemy_id;
                        })(rows);

                        if (enemy) {
                            this.util.delInviteByUserId(enemy.user_id)
                                .then(d => {
                                    this.socket.emit('onRejectInvite', {
                                        result: 'ok'
                                    });
                                });
                        }
                    });

            })
            .catch(err => {
                this.socket.emit('onRejectInvite', {
                    result: false,
                    message: err
                });

                console.error('error onRejectInvite -> ', err);
            });

    }


    @autobind()
    getFriends(req, res) {


        const user = this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.getFriends(user_id);
            })
            .then((friends) => {
                const rows = ProtoData.toCamelCaseArrObj(friends);
                res.end({
                    result: 'ok',
                    friends: rows
                });
            })

            .catch(err => {
                res.end({
                    error: err.toString()
                });
            });


        //console.error('error getFriends -> ', err);

    }


    @autobind()
    getAllUsers(req, res) {
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.getUsersNotSelf(user_id)
            })
            .then(users  =>{
                res.end({
                    result: 'ok',
                    users: ProtoData.toCamelCaseArrObj(users)
                })
            })
            .catch(err => {
                res.end({
                    error: err.toString()
                })
            })

      /*
        this.util.getUsersNotSelf(id)
            .then(d => {
                this.socket.emit('getAllUsers', {
                    result: 'ok',
                    users: ProtoData.toCamelCaseArrObj(d)
                });
            })
            .catch(err => {
                this.socket.emit('getAllUsers', {
                    result: false,
                    message: err
                });
                console.error('error getAllUsers -> ', err);
            });*/

    }

    onDelFriend(friend_id) {
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                /*return this.getFriends(true)
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
                                    });
                                });
                        }
                    });*/
            })
            .catch(err => {
                console.error('Error onDelFriend ->', err);
            });

    }

    @autobind()
    getInvites(req, res) {
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.getInvites(user_id)
                    .then(rows => {
                       /* rows.forEach(item => {
                            item.id = item.user_id;
                            delete item.user_id;
                        });*/
                        res.end({
                            result:'ok',
                            invites: rows
                        } );
                    });

            })
            .catch(err => {

                res.end({
                    error: err.toString()
                } );

                console.error('error getInvites -> ', err);
            });

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
                                        .then(d => {
                                            return friendId;
                                        });
                                });
                        } else {
                            this.socket.emit('onAcceptInvite', {
                                result: false,
                                message: 'no invite'
                            });
                        }
                    });
            })
            .then(friendId => {
                return this.chat.sendUpdateFriends(friendId);
            })
            .catch(err => {
                this.socket.emit('onAcceptInvite', {
                    result: false,
                    message: err
                });
                console.error('error onAcceptInvite -> ', err);
            });

    }


    onInvite({inviteId}) {
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.onInviteFromToId(user_id, inviteId)
                    .then((d) => {
                        this.socket.emit('onInvite', {
                            result: 'ok'
                        });
                        return inviteId;
                    });

            })
            .then(inviteId => {
                this.chat.sendUpdateInvite(inviteId);
            })
            .catch(err => {
                this.socket.emit('onInvite', {
                    result: false,
                    message: err
                });
                console.error('error onInvite -> ', err);
            });

    }

}

module.exports = OnFriend;