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
const friends_service_1 = require("./friends.service");
const main_user_service_1 = require("./main.user.service");
const chat_service_1 = require("./chat.service");
const toast_component_1 = require("../component/toast/toast.component");
const deferred_1 = require("../util/deferred");
let AuthService = class AuthService {
    constructor(io, ls, friend, userService, chatService, toast) {
        this.io = io;
        this.ls = ls;
        this.friend = friend;
        this.userService = userService;
        this.chatService = chatService;
        this.toast = toast;
        this._userName = null;
        this._userImage = null;
        this.canActiveDefer = new deferred_1.Deferred();
        this.socket = io.socket;
        this._setting = {};
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('disconnect', (d) => {
            console.info('disconnect');
        });
        this.canActiveDefer.promise
            .catch(d => {
            return d;
        });
        this.resolver = new Promise((resolve, reject) => {
            this.resolveAuth = resolve;
            this.rejectAuth = reject;
        });
    }
    canActivate(route, state) {
        return this.canActiveDefer.promise
            .then(v => {
            if (!v) {
                this.toast.show({
                    type: 'warning',
                    translate: 'NOT_LOGGED'
                });
                this.router.navigate(['/auth/map']);
            }
            return v;
        });
    }
    resolve() {
        return this.resolver;
    }
    onAuth() {
        return this.onConnect();
    }
    onConnect() {
        console.info('connect');
        return this.socket.$emit('onAuth', {
            hash: this.ls.userKey
        }).then(d => {
            if (d.result == 'ok') {
                this.userService.user = d.user;
                this.userService.friends = d.user.friends;
                this.socket.emit(d.user.hash);
                this.friend.getInvites();
                this.chatService.getUnViewed(true);
                this.canActiveDefer.resolve(true);
            }
            else {
                this.userName = null;
                this.canActiveDefer.reject(false);
            }
            console.log('onAuth ->', d);
            this.resolveAuth(true);
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
    __metadata("design:paramtypes", [socket_oi_service_1.Io,
        local_storage_service_1.LocalStorage,
        friends_service_1.FriendsService,
        main_user_service_1.UserService,
        chat_service_1.ChatService,
        toast_component_1.ToastService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map