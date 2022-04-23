"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnFriend = void 0;
const autobind_1 = require("../util/autobind");
const R = require("ramda");
const proto_data_1 = require("./proto-data");
class OnFriend extends proto_data_1.ProtoData {
    constructor(socket, util, logger, chat) {
        super(socket, util);
        this.logger = logger;
        this.chat = chat;
        this.socket.$get('getFriends', this.getFriends);
        this.socket.$get('getAllUsers', this.getAllUsers);
        this.socket.$get('getInvites', this.getInvites);
        this.socket.$get('requestUserById', this.requestUserById);
        // this.socket.on('getInvites', this.getInvites.bind(this));
        this.socket.$get('onInvite', this.onInvite);
        this.socket.$get('getRequests', this.getRequests);
        this.socket.$get('onCancelInvite', this.onCancelInvite);
        this.socket.on('onAcceptInvite', this.onAcceptInvite.bind(this));
        this.socket.on('onDelFriend', this.onDelFriend.bind(this));
        this.socket.on('onRejectInvite', this.onRejectInvite.bind(this));
        this.socket.on('getUserImage', this.getUserImage.bind(this, 'getUserImage'));
        //this.socket.on('onCancelInvite', this.onCancelInvite.bind(this, 'onCancelInvite'));
    }
    onCancelInvite(req, res) {
        const enemy_id = req.data.id;
        return this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
            return this.util.onCancelInvite(user_id, enemy_id);
        })
            .then(d => {
            res.end({
                result: 'ok'
            });
        })
            .catch(err => {
            res.end({
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
                const enemy = R.find((item) => {
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
    getFriends(req, res) {
        const user = this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
            return this.util.getFriends(user_id);
        })
            .then((friends) => {
            const rows = proto_data_1.ProtoData.toCamelCaseArrObj(friends);
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
    getAllUsers(req, res) {
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
            return this.util.getUsersNotSelf(user_id);
        })
            .then(users => {
            res.end({
                result: 'ok',
                users: proto_data_1.ProtoData.toCamelCaseArrObj(users)
            });
        })
            .catch(err => {
            res.end({
                error: err.toString()
            });
        });
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
    requestUserById(req, res) {
        const id = req.data.id;
        this.util.getUserById(id)
            .then(u => {
            const user = Object.assign({}, u);
            delete user.pass;
            res.end({
                result: 'ok',
                user
            });
        });
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
    getRequests(req, res) {
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
            return this.util.getRequests(user_id);
        })
            .then(rows => {
            res.end({
                result: 'ok',
                data: rows
            });
        });
    }
    getInvites(req, res) {
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
            return this.util.getInvites(user_id)
                .then(rows => {
                res.end({
                    result: 'ok',
                    data: rows
                });
            });
        })
            .catch(err => {
            res.end({
                error: err.toString()
            });
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
                }
                else {
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
    onInvite(req, res) {
        const inviteId = req.data.id;
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
            return this.util.onInviteFromToId(user_id, inviteId)
                .then((d) => {
                res.end({
                    result: 'ok'
                });
                return inviteId;
            });
        })
            .then(inviteId => {
            this.chat.sendUpdateInvite(inviteId);
        })
            .catch(err => {
            this.socket.end({
                result: false,
                message: err
            });
            console.error('error onInvite -> ', err);
        });
    }
    _onInvite({ inviteId }) {
        /*this.util.getUserIdBySocketId(this.socket.id)
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
            });*/
    }
}
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OnFriend.prototype, "onCancelInvite", null);
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OnFriend.prototype, "getFriends", null);
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OnFriend.prototype, "getAllUsers", null);
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OnFriend.prototype, "requestUserById", null);
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OnFriend.prototype, "getRequests", null);
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OnFriend.prototype, "getInvites", null);
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OnFriend.prototype, "onInvite", null);
exports.OnFriend = OnFriend;
//# sourceMappingURL=on-friends.js.map