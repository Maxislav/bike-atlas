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
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var router_1 = require("@angular/router");
var device_service_1 = require("../../service/device.service");
var DeviceComponent = (function () {
    function DeviceComponent(location, router, ds) {
        this.location = location;
        this.router = router;
        this.ds = ds;
        this.device = {
            name: null,
            id: null
        };
        this.devices = ds.devices;
    }
    DeviceComponent.prototype.onAdd = function (e) {
        var _this = this;
        e.preventDefault();
        console.log(this.device);
        this.ds.onAddDevice(this.device)
            .then(function (d) {
            if (d && d.result == 'ok') {
                _this.reset();
            }
        });
    };
    DeviceComponent.prototype.reset = function () {
        this.device = {
            name: null,
            id: null
        };
    };
    DeviceComponent.prototype.onOk = function (e) {
        e.preventDefault();
        this.router.navigate(['/auth/map']);
    };
    DeviceComponent.prototype.onCancel = function (e) {
        e.preventDefault();
        this.router.navigate(['/auth/map']);
    };
    DeviceComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'device.component.html',
            styleUrls: [
                'device.component.css',
            ]
        }), 
        __metadata('design:paramtypes', [common_1.Location, router_1.Router, device_service_1.DeviceService])
    ], DeviceComponent);
    return DeviceComponent;
}());
exports.DeviceComponent = DeviceComponent;
//# sourceMappingURL=device.component.js.map