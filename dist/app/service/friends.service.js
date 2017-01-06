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
var auth_service_1 = require("./auth.service");
var FriendsService = (function () {
    function FriendsService(io, ls, as) {
        this.io = io;
        this.ls = ls;
        this.as = as;
        this._friends = [];
        this._users = [];
        this.socket = io.socket;
    }
    FriendsService.prototype.updateFriends = function () {
        var hash = this.ls.userKey;
        this.socket.$emit('getFriends', { hash: hash })
            .then(function (d) {
        });
    };
    FriendsService.prototype.getAllUsers = function () {
        var _this = this;
        this.socket.$emit('getAllUsers', { hash: this.ls.userKey, id: this.as.userId })
            .then(function (d) {
            console.log(d);
            if (d && d.result == 'ok') {
                _this.users = d.users;
            }
            else {
                console.error('getAllUsers', d);
            }
        });
    };
    FriendsService.prototype.onInvite = function (inviteId) {
        this.socket.$emit('onInvite', { hash: this.ls.userKey, inviteId: inviteId })
            .then(function (d) {
            console.log(d);
        });
    };
    FriendsService.prototype.clearUsers = function () {
        this.users = [];
    };
    Object.defineProperty(FriendsService.prototype, "friends", {
        get: function () {
            return this._friends;
        },
        set: function (value) {
            var _this = this;
            this._friends.length = 0;
            if (value) {
                value.forEach(function (item) {
                    _this._friends.push(item);
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FriendsService.prototype, "users", {
        get: function () {
            return this._users;
        },
        set: function (value) {
            var _this = this;
            this._users.length = 0;
            if (value) {
                value.forEach(function (item) {
                    _this._users.push(item);
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    FriendsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [socket_oi_service_1.Io, local_storage_service_1.LocalStorage, auth_service_1.AuthService])
    ], FriendsService);
    return FriendsService;
}());
exports.FriendsService = FriendsService;
//# sourceMappingURL=friends.service.js.map