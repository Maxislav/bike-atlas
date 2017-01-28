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
const marker_service_1 = require("./marker.service");
const main_user_service_1 = require("./main.user.service");
let LogService = class LogService {
    constructor(io, user, markerService) {
        this.user = user;
        this.markerService = markerService;
        this.socket = io.socket;
        this.socket.on('log', this.log.bind(this));
        this.devices = {};
        const a = {
            a: 1,
            b: 3
        };
    }
    log(devData) {
        if (!devData)
            return;
        let user;
        let device = this.getDevice(this.user.user, devData);
        if (device) {
            user = this.user.user;
        }
        if (!device) {
            let i = 0;
            while (i < this.user.friends.length) {
                device = this.getDevice(this.user.friends[i], devData);
                if (device) {
                    user = this.user.friends[i];
                    break;
                }
                i++;
            }
        }
        if (!device) {
            device = this.getDevice(this.user.other, devData);
        }
        if (!device) {
            device = this.user.createDeviceOther({
                device_key: devData.device_key,
                name: devData.name,
                ownerId: devData.ownerId
            });
            this.getOtherImage(devData.ownerId);
            user = {
                id: null,
                name: devData.name,
                image: null
            };
        }
        console.log(device);
        if (device && !device.marker) {
            devData.name = device.name;
            device.marker = this.markerService.marker(devData, user);
            if (this.devices[device.device_key]) {
                this.devices[device.device_key].marker.remove();
            }
            this.devices[device.device_key] = device;
        }
        else if (device && device.marker) {
            device.marker.update(devData);
        }
    }
    getDevice(user, devData) {
        if (!devData)
            return null;
        if (!user.devices) {
            return null;
        }
        const devices = user.devices;
        return devices.find(item => {
            return item.device_key == devData.device_key;
        });
    }
    clearDevices() {
    }
    setOtherImage(ownerId, image) {
        const device = this.user.other.devices.find(dev => {
            return dev.ownerId == ownerId;
        });
        if (device && device.marker) {
            device.marker.updateSetImage(image);
        }
    }
    getOtherImage(id) {
        this.socket.$emit('getUserImage', id)
            .then(d => {
            this.setOtherImage(d.id, d.image);
        });
    }
    getLastPosition() {
        this.socket.$emit('getLastPosition')
            .then(rows => {
            this.clearDevices();
            rows.forEach(deviceData => {
                this.log(deviceData);
            });
        });
    }
    getDeviceData(id) {
        if (this.devices[id]) {
            return this.devices[id].deviceData;
        }
        return null;
    }
};
LogService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [socket_oi_service_1.Io, main_user_service_1.UserService, marker_service_1.MarkerService])
], LogService);
exports.LogService = LogService;
//# sourceMappingURL=log.service.js.map