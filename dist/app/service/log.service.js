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
var device_service_1 = require("./device.service");
var marker_service_1 = require("./marker.service");
var LogService = (function () {
    function LogService(io, ds, markerService) {
        this.ds = ds;
        this.markerService = markerService;
        this.socket = io.socket;
        this.socket.on('log', this.log.bind(this));
        this.devices = {};
    }
    LogService.prototype.log = function (deviceData) {
        console.log(deviceData);
        if (this.devices[deviceData.id]) {
            this.devices[deviceData.id].update(deviceData);
        }
        else {
            var device = this.ds.devices.find(function (item) {
                return item.id == deviceData.id;
            });
            deviceData.name = device.name;
            device.marker = this.devices[deviceData.id] = this.markerService.marker(deviceData);
        }
    };
    LogService.prototype.clearDevices = function () {
        for (var opt in this.devices) {
            this.devices[opt].hide();
            delete this.devices[opt];
        }
    };
    LogService.prototype.getDeviceData = function (id) {
        if (this.devices[id]) {
            return this.devices[id].deviceData;
        }
        return null;
    };
    LogService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [socket_oi_service_1.Io, device_service_1.DeviceService, marker_service_1.MarkerService])
    ], LogService);
    return LogService;
}());
exports.LogService = LogService;
//# sourceMappingURL=log.service.js.map