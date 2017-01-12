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
var FriendsService = (function () {
    function FriendsService(io, ls, userService) {
        this.io = io;
        this.ls = ls;
        this.userService = userService;
        this._friends = [];
        // this._friends = [];
        this._myInvites = [];
        this._users = [];
        this._invites = [];
        this.socket = io.socket;
        //this.friends = userService.friends;
    }
    FriendsService.prototype.getFriends = function () {
        this.updateFriends();
    };
    FriendsService.prototype.updateFriends = function () {
        var _this = this;
        return this.socket.$emit('getFriends')
            .then(function (d) {
            console.log(d);
            if (d.result == 'ok') {
                _this.friends = d.friends;
                _this.myInvites = d.invites;
                return _this.friends;
            }
            else {
                return null;
            }
        });
    };
    FriendsService.prototype.onDelFriend = function (id) {
        var _this = this;
        this.socket.$emit('onDelFriend', id)
            .then(function (d) {
            console.log(d);
            _this.updateFriends();
        });
    };
    FriendsService.prototype.getInvites = function () {
        var _this = this;
        var hash = this.ls.userKey;
        this.socket.$emit('getInvites', { hash: hash })
            .then(function (d) {
            console.log(d);
            _this.invites = d;
        });
    };
    FriendsService.prototype.onAcceptInvite = function (friend) {
        var _this = this;
        return this.socket.$emit('onAcceptInvite', friend.id)
            .then(function (d) {
            _this.updateFriends();
            _this.getInvites();
        });
    };
    FriendsService.prototype.getAllUsers = function () {
        var _this = this;
        this.socket.$emit('getAllUsers', { hash: this.ls.userKey, id: this.userService.user.id })
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
        var _this = this;
        this.socket.$emit('onInvite', { hash: this.ls.userKey, inviteId: inviteId })
            .then(function (d) {
            console.log(d);
            _this.updateFriends();
        });
    };
    FriendsService.prototype.onRejectInvite = function (enemy_id) {
        var _this = this;
        this.socket.$emit('onRejectInvite', enemy_id)
            .then(function (rows) {
            _this.updateFriends();
            _this.getInvites();
        });
    };
    FriendsService.prototype.clearUsers = function () {
        this.users = [];
        this.invites = [];
    };
    Object.defineProperty(FriendsService.prototype, "invites", {
        get: function () {
            return this._invites;
        },
        set: function (value) {
            var _this = this;
            this._invites.length = 0;
            value.forEach(function (item) {
                _this._invites.push(item);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FriendsService.prototype, "myInvites", {
        get: function () {
            return this._myInvites;
        },
        set: function (value) {
            var _this = this;
            this._myInvites.length = 0;
            value.forEach(function (item) {
                _this._myInvites.push(item);
            });
        },
        enumerable: true,
        configurable: true
    });
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
        __metadata('design:paramtypes', [socket_oi_service_1.Io, local_storage_service_1.LocalStorage, main_user_service_1.UserService])
    ], FriendsService);
    return FriendsService;
}());
exports.FriendsService = FriendsService;
//# sourceMappingURL=friends.service.js.map