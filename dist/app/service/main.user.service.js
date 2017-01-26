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
let UserService = class UserService {
    constructor() {
        this._friends = [];
        this._user = {
            name: null,
            id: null,
            image: null
        };
        this._other = {
            id: null,
            name: null,
            image: null,
            devices: []
        };
    }
    clearUser() {
        for (let opt in this._user) {
            this._user[opt] = null;
        }
    }
    clearAll() {
        this.user.devices.forEach(device => {
            if (device.marker) {
                device.marker.remove();
            }
        });
        this.friends.forEach(friend => {
            friend.devices.forEach(device => {
                if (device.marker) {
                    device.marker.remove();
                }
            });
        });
        while (this.friends.length) {
            this.friends.shift();
        }
        this.clearUser();
    }
    createDeviceOther(device) {
        this._other.devices.push(device);
        return device;
    }
    get other() {
        return this._other;
    }
    set other(value) {
        this._other = value;
    }
    set friends(friends) {
        if (!friends)
            return;
        this._friends.length = 0;
        friends.forEach(friend => {
            this._friends.push(friend);
        });
    }
    get friends() {
        return this._friends;
    }
    get user() {
        return this._user;
    }
    set user(value) {
        for (let opt in value) {
            this._user[opt] = value[opt];
        }
    }
};
UserService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=main.user.service.js.map