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
var core_1 = require("@angular/core");
var socket_oi_service_1 = require("./socket.oi.service");
var local_storage_service_1 = require("./local-storage.service");
var main_user_service_1 = require("./main.user.service");
var AuthService = (function () {
    function AuthService(io, ls, userService) {
        this.io = io;
        this.ls = ls;
        this.userService = userService;
        this._userName = null;
        this._userImage = null;
        this.socket = io.socket;
        this._setting = {};
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('disconnect', function (d) {
            console.info('disconnect');
        });
    }
    AuthService.prototype.resolve = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.resolveAuth = resolve;
        });
    };
    AuthService.prototype.onAuth = function () {
        this.onConnect();
    };
    AuthService.prototype.onConnect = function () {
        var _this = this;
        console.info('connect');
        this.socket.$emit('onAuth', {
            hash: this.ls.userKey
        }).then(function (d) {
            if (d.result == 'ok') {
                _this.userService.user = d.user;
                _this.userService.friends = d.user.friends;
                _this.socket.emit(d.user.hash);
            }
            else {
                _this.userName = null;
            }
            console.log(d);
            _this.resolveAuth(true);
        });
    };
    Object.defineProperty(AuthService.prototype, "userName", {
        get: function () {
            return this._userName;
        },
        set: function (name) {
            this._userName = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "setting", {
        get: function () {
            return this._setting;
        },
        set: function (value) {
            this._setting = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "userImage", {
        get: function () {
            return this._userImage;
        },
        set: function (value) {
            this._userImage = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "userId", {
        get: function () {
            return this._userId;
        },
        set: function (value) {
            this._userId = value;
        },
        enumerable: true,
        configurable: true
    });
    AuthService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [socket_oi_service_1.Io, local_storage_service_1.LocalStorage, main_user_service_1.UserService])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map