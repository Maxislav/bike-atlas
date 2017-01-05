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
var device_service_1 = require("../../../service/device.service");
var map_service_1 = require("../../../service/map.service");
var log_service_1 = require("../../../service/log.service");
var timer_service_1 = require("./timer.service");
var MenuAthleteComponent = (function () {
    function MenuAthleteComponent(ds, mapServ, ls, timer) {
        var _this = this;
        this.ds = ds;
        this.mapServ = mapServ;
        this.ls = ls;
        this.timer = timer;
        this.devices = ds.devices;
        this.interval = setInterval(function () {
            _this.devices.forEach(function (device) {
                var deviceData = _this.ls.getDeviceData(device.id);
                if (deviceData) {
                    var date = deviceData.date;
                    device.passed = _this.timer.elapse(date);
                }
            });
        }, 1000);
    }
    MenuAthleteComponent.prototype.selectDevice = function (device) {
        var deviceData = this.ls.getDeviceData(device.id);
        console.log(deviceData);
        if (deviceData) {
            this.mapServ.map.flyTo({
                center: [deviceData.lng, deviceData.lat]
            });
        }
    };
    MenuAthleteComponent.prototype.ngOnDestroy = function () {
        if (this.interval) {
            clearInterval(this.interval);
        }
    };
    MenuAthleteComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'menu-athlete',
            templateUrl: './menu.athlete.component.html',
            styleUrls: ['./menu.athlete.component.css'],
            providers: [timer_service_1.TimerService]
        }), 
        __metadata('design:paramtypes', [device_service_1.DeviceService, map_service_1.MapService, log_service_1.LogService, timer_service_1.TimerService])
    ], MenuAthleteComponent);
    return MenuAthleteComponent;
}());
exports.MenuAthleteComponent = MenuAthleteComponent;
//# sourceMappingURL=menu.athlete.component.js.map