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
var friends_service_1 = require("./friends.service");
var main_user_service_1 = require("./main.user.service");
var DeviceService = (function () {
    function DeviceService(io, ls, user, friend) {
        this.io = io;
        this.ls = ls;
        this.user = user;
        this.friend = friend;
        this.socket = io.socket;
        this._devices = [];
    }
    DeviceService.prototype.updateDevices = function () {
        var _this = this;
        var hash = this.ls.userKey;
        this.socket.$emit('getDevice', { hash: hash })
            .then(function (d) {
            if (d && d.result == 'ok') {
                _this.devices = d.devices;
            }
            console.log(d);
            return _this.devices;
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    DeviceService.prototype.onAddDevice = function (device) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.socket.$emit('onAddDevice', device)
                .then(function (d) {
                if (d && d.result == 'ok') {
                    _this.updateDevices();
                    resolve(d);
                }
                reject();
            });
        });
    };
    DeviceService.prototype.onDelDevice = function (device) {
        var _this = this;
        return this.socket.$emit('onDelDevice', device)
            .then(function (d) {
            if (d.result == 'ok') {
                var index = _this.devices.indexOf(device);
                if (-1 < index) {
                    _this._devices.splice(index, 1);
                }
            }
            return d;
        });
    };
    DeviceService.prototype.clearDevice = function () {
        this._devices.length = 0;
    };
    Object.defineProperty(DeviceService.prototype, "devices", {
        get: function () {
            return this._devices;
        },
        set: function (devices) {
            var _this = this;
            this._devices.length = 0;
            devices.forEach(function (device) {
                if (device.ownerId == _this.user.user.id) {
                    device.image = _this.user.user.image;
                }
                else {
                    var friend = _this.friend.friends.find(function (item) {
                        return device.ownerId == item.id;
                    });
                    if (friend) {
                        device.image = friend.image;
                    }
                }
                _this._devices.push(device);
            });
        },
        enumerable: true,
        configurable: true
    });
    DeviceService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [socket_oi_service_1.Io, local_storage_service_1.LocalStorage, main_user_service_1.UserService, friends_service_1.FriendsService])
    ], DeviceService);
    return DeviceService;
}());
exports.DeviceService = DeviceService;
//# sourceMappingURL=device.service.js.map