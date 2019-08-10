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
//import {Device} from '../../global';
let DeviceService = class DeviceService {
    constructor(io, ls, user, friend) {
        this.io = io;
        this.ls = ls;
        this.user = user;
        this.friend = friend;
        this._devices = [];
        this.socket = io.socket;
        //this.devices = user.user.devices;
    }
    updateDevices() {
        return this.socket.$emit('getDevice')
            .then(d => {
            if (d && d.result == 'ok') {
                this.devices = d.devices;
            }
            console.log(d);
            return this.devices;
        })
            .catch(err => {
            console.log(err);
        });
    }
    onAddDevice(device) {
        return this.socket.$emit('onAddDevice', device)
            .then(d => {
            if (d && d.result == 'ok') {
                this.updateDevices();
            }
            return d;
        });
    }
    onDelDevice(device) {
        return this.socket.$emit('onDelDevice', device)
            .then(d => {
            if (d.result == 'ok') {
                let index = this.devices.indexOf(device);
                if (-1 < index) {
                    this._devices.splice(index, 1);
                }
            }
            return d;
        });
    }
    clearDevices() {
        this._devices.length = 0;
    }
    onAddDeviceImage(device) {
        return this.socket.$get('onAddDeviceImage', {
            deviceKey: device.device_key,
            image: device.image
        });
    }
    get devices() {
        return this._devices;
    }
    set devices(devices) {
        this._devices.length = 0;
        devices.forEach(device => {
            this._devices.push(device);
        });
    }
};
DeviceService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [socket_oi_service_1.Io,
        local_storage_service_1.LocalStorage,
        main_user_service_1.UserService,
        friends_service_1.FriendsService])
], DeviceService);
exports.DeviceService = DeviceService;
//# sourceMappingURL=device.service.js.map