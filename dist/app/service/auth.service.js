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
const core_1 = require("@angular/core");
const socket_oi_service_1 = require("./socket.oi.service");
const local_storage_service_1 = require("./local-storage.service");
const friends_service_1 = require("./friends.service");
const main_user_service_1 = require("./main.user.service");
const chat_service_1 = require("./chat.service");
let AuthService = class AuthService {
    constructor(io, ls, friendsService, userService, chatService) {
        this.io = io;
        this.ls = ls;
        this.friendsService = friendsService;
        this.userService = userService;
        this.chatService = chatService;
        this._userName = null;
        this._userImage = null;
        this.fbUser = { userID: null, name: null };
        this.socket = io.socket;
        this._setting = {};
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('disconnect', (d) => {
            console.info('disconnect');
        });
    }
    resolve() {
        return new Promise((resolve, reject) => {
            this.resolveAuth = resolve;
        });
    }
    onAuth() {
        return this.onConnect();
    }
    onConnect() {
        //this.resolveAuth(true);
        console.info('connect');
        return this.socket.$emit('onAuth', {
            hash: this.ls.userKey
        }).then(d => {
            if (d.result == 'ok') {
                this.userService.user = d.user;
                this.userService.friends = d.user.friends;
                this.socket.emit(d.user.hash);
                this.friendsService.getInvites();
                this.chatService.getUnViewed(true);
            }
            else {
                this.userName = null;
                //console.info(d);
                FB.getLoginStatus((response) => {
                    this.statusChangeCallback(response);
                });
            }
            console.log(d);
            this.resolveAuth(true);
        });
    }
    statusChangeCallback(res) {
        switch (res.status) {
            case "unknown":
            case "not_authorized":
                this.fbUser.name = null;
                this.fbUser.userID = null;
                break;
            case "connected":
                this.fbUser.userID = parseInt(res.authResponse.userID);
                const authResponse = res.authResponse;
                FB.api('/me', (response) => {
                    this.fbUser.name = response.name;
                    this
                        .setFacebookUser({
                        name: this.fbUser.name,
                        accessToken: authResponse.accessToken,
                        userID: authResponse.userID
                    })
                        .then(d => {
                        d;
                    });
                });
                break;
        }
    }
    setFacebookUser(data) {
        return this.socket.$emit('setFacebookUser', data)
            .then(d => {
            this.userService.user = d.user;
            return d;
        });
    }
    get userName() {
        return this._userName;
    }
    set userName(name) {
        this._userName = name;
    }
    get setting() {
        return this._setting;
    }
    set setting(value) {
        this._setting = value;
    }
    get userImage() {
        return this._userImage;
    }
    set userImage(value) {
        this._userImage = value;
    }
    get userId() {
        return this._userId;
    }
    set userId(value) {
        this._userId = value;
    }
};
AuthService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [socket_oi_service_1.Io, local_storage_service_1.LocalStorage, friends_service_1.FriendsService, main_user_service_1.UserService, chat_service_1.ChatService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map