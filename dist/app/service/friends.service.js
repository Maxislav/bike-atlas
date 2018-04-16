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
const core_1 = require("@angular/core");
const socket_oi_service_1 = require("./socket.oi.service");
const local_storage_service_1 = require("./local-storage.service");
const main_user_service_1 = require("./main.user.service");
const chat_service_1 = require("./chat.service");
let FriendsService = class FriendsService {
    constructor(io, ls, userService, chatService) {
        this.io = io;
        this.ls = ls;
        this.userService = userService;
        this.chatService = chatService;
        this._friends = [];
        // this._friends = [];
        this._myInvites = [];
        this._users = [];
        this._invites = [];
        this.socket = io.socket;
        this.socket.on('updateInvites', this.getInvites.bind(this));
        this.socket.on('updateFriends', this.updateFriends.bind(this));
        chatService.addChatUnViewed = this.addChatUnViewed.bind(this);
    }
    getFriends() {
        this.updateFriends();
    }
    updateFriends() {
        return this.socket.$emit('getFriends')
            .then(d => {
            console.log('getFriends ->', d);
            if (d.result == 'ok') {
                this.friends = d.friends;
                this.myInvites = d.invites;
                this.bindChatUnViewed(this.friends);
                return this.friends;
            }
            else {
                return null;
            }
        });
    }
    bindChatUnViewed(user) {
        this.chatService.unViewedDefer.promise.then(d => {
            console.log('unViewedDefer->', d);
            user.forEach(user => {
                if (d[user.id]) {
                    user.chatUnViewed = d[user.id];
                }
            });
        });
    }
    addChatUnViewed(userId, mesId) {
        this.friends.forEach(user => {
            if (user.id == userId) {
                push(user);
            }
        });
        this.users.forEach(user => {
            if (user.id == userId) {
                push(user);
            }
        });
        function push(user) {
            user.chatUnViewed = user.chatUnViewed || [];
            user.chatUnViewed.push(mesId);
        }
    }
    unBindChatUnViewed(userId) {
        const user = this.users.find(user => {
            return user.id == userId;
        });
        if (user && user.chatUnViewed) {
            this.chatService.emitChatViewed(user.chatUnViewed)
                .then(d => {
                console.log(d);
                delete user.chatUnViewed;
            });
        }
        const friend = this.friends.find(user => {
            return user.id == userId;
        });
        if (friend && friend.chatUnViewed) {
            this.chatService.emitChatViewed(friend.chatUnViewed)
                .then(d => {
                console.log(d);
                delete friend.chatUnViewed;
            });
        }
    }
    onDelFriend(id) {
        this.socket.$emit('onDelFriend', id)
            .then((d) => {
            console.log(d);
            this.updateFriends();
        });
    }
    getInvites() {
        const hash = this.ls.userKey;
        this.socket.$emit('getInvites', { hash })
            .then((d) => {
            // console.log(d);
            this.invites = d;
        });
    }
    onAcceptInvite(friend) {
        return this.socket.$emit('onAcceptInvite', friend.id)
            .then(d => {
            this.updateFriends();
            this.getInvites();
        });
    }
    getAllUsers() {
        this.socket.$emit('getAllUsers', { hash: this.ls.userKey, id: this.userService.user.id })
            .then(d => {
            console.log(d);
            if (d && d.result == 'ok') {
                console.log('getAllUsers->', d);
                this.users = d.users;
                this.bindChatUnViewed(this.users);
            }
            else {
                console.error('getAllUsers', d);
            }
        });
    }
    onInvite(inviteId) {
        this.socket.$emit('onInvite', { hash: this.ls.userKey, inviteId })
            .then(d => {
            //console.log(d)
            this.updateFriends();
        });
    }
    onRejectInvite(enemy_id) {
        this.socket.$emit('onRejectInvite', enemy_id)
            .then(rows => {
            this.updateFriends();
            this.getInvites();
        });
    }
    onCancelInvite(enemy_id) {
        this.socket.$emit('onCancelInvite', enemy_id)
            .then(d => {
            console.log(d);
            this.updateFriends();
            this.getInvites();
        });
    }
    clearUsers() {
        this.users = [];
        this.invites = [];
    }
    get invites() {
        return this._invites;
    }
    set invites(value) {
        this._invites.length = 0;
        value.forEach(item => {
            this._invites.push(item);
        });
    }
    get myInvites() {
        return this._myInvites;
    }
    set myInvites(value) {
        this._myInvites.length = 0;
        value.forEach(item => {
            this._myInvites.push(item);
        });
    }
    set friends(value) {
        this._friends.length = 0;
        if (value) {
            value.forEach(item => {
                this._friends.push(item);
            });
        }
    }
    get friends() {
        return this._friends;
    }
    get users() {
        return this._users;
    }
    set users(value) {
        this._users.length = 0;
        if (value) {
            value.forEach(item => {
                this._users.push(item);
            });
        }
    }
};
FriendsService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [socket_oi_service_1.Io,
        local_storage_service_1.LocalStorage,
        main_user_service_1.UserService,
        chat_service_1.ChatService])
], FriendsService);
exports.FriendsService = FriendsService;
//# sourceMappingURL=friends.service.js.map