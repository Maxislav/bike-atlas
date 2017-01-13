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
var marker_service_1 = require("./marker.service");
var main_user_service_1 = require("./main.user.service");
var LogService = (function () {
    function LogService(io, user, markerService) {
        this.user = user;
        this.markerService = markerService;
        this.socket = io.socket;
        this.socket.on('log', this.log.bind(this));
        this.devices = {};
        var a = {
            a: 1,
            b: 3
        };
    }
    LogService.prototype.log = function (devData) {
        var user;
        var device = this.getDevice(this.user.user, devData);
        if (device) {
            user = this.user.user;
        }
        if (!device) {
            var i = 0;
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
        }
        else if (device && device.marker) {
            device.marker.update(devData);
        }
        /* const device: Device = this.ds.devices.find(item => {
         return item.id == marker.id
         });

         if(!device) return;

         if(device.marker){

         }else{
         device.marker = this.markerService.marker(marker)
         }*/
        /*console.log(deviceData);
         if (this.devices[deviceData.id]) {
         this.devices[deviceData.id].update(deviceData);
         } else {
         let device: Device = this.ds.devices.find(item => {
         return item.id == deviceData.id
         });
         deviceData.name = device.name;
         deviceData.image = device.image;
         device.marker = this.devices[deviceData.id] = this.markerService.marker(deviceData)
         }*/
    };
    LogService.prototype.getDevice = function (user, devData) {
        if (!devData)
            return null;
        if (!user.devices) {
            return null;
        }
        var devices = user.devices;
        return devices.find(function (item) {
            return item.device_key == devData.device_key;
        });
    };
    LogService.prototype.clearDevices = function () {
    };
    LogService.prototype.setOtherImage = function (ownerId, image) {
        var device = this.user.other.devices.find(function (dev) {
            return dev.ownerId == ownerId;
        });
        if (device && device.marker) {
            device.marker.updateSetImage(image);
        }
    };
    LogService.prototype.getOtherImage = function (id) {
        var _this = this;
        this.socket.$emit('getUserImage', id)
            .then(function (d) {
            _this.setOtherImage(d.id, d.image);
        });
    };
    LogService.prototype.getLastPosition = function () {
        var _this = this;
        this.socket.$emit('getLastPosition')
            .then(function (rows) {
            _this.clearDevices();
            rows.forEach(function (deviceData) {
                _this.log(deviceData);
            });
        });
    };
    LogService.prototype.getDeviceData = function (id) {
        if (this.devices[id]) {
            return this.devices[id].deviceData;
        }
        return null;
    };
    LogService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [socket_oi_service_1.Io, main_user_service_1.UserService, marker_service_1.MarkerService])
    ], LogService);
    return LogService;
}());
exports.LogService = LogService;
//# sourceMappingURL=log.service.js.map