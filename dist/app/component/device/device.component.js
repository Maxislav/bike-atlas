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
var app_component_1 = require("../../app.component");
var toast_component_1 = require("../toast/toast.component");
var DeviceComponent = (function () {
    function DeviceComponent(location, router, ds, toast, lh) {
        this.location = location;
        this.router = router;
        this.ds = ds;
        this.toast = toast;
        this.lh = lh;
        this.device = {
            name: '',
            id: ''
        };
        this.btnPreDel = {
            index: -1
        };
        this.devices = ds.devices;
    }
    DeviceComponent.prototype.onAdd = function (e) {
        var _this = this;
        e.preventDefault();
        this.device.name = this.device.name.replace(/^\s+/, '');
        this.device.id = this.device.id.replace(/^\s+/, '');
        console.log(this.device);
        if (!this.device.name || !this.device.id) {
            this.toast.show({
                type: 'warning',
                text: "Имя или Идентификатор не заполнено"
            });
            return;
        }
        this.ds.onAddDevice(this.device)
            .then(function (d) {
            if (d && d.result == 'ok') {
                _this.reset();
            }
        });
    };
    DeviceComponent.prototype.onDel = function (e, i) {
        e.stopPropagation();
        if (-1 < i) {
            var delDevice = this.devices.splice(i, 1)[0];
            //console.log(delDevice)
            this.ds.onDelDevice(delDevice)
                .then(function (d) {
                console.log(d);
            });
            this.clearPredel();
        }
    };
    DeviceComponent.prototype.preDel = function (e, i) {
        e.stopPropagation();
        this.btnPreDel.index = i;
    };
    DeviceComponent.prototype.clearPredel = function () {
        this.btnPreDel.index = -1;
    };
    DeviceComponent.prototype.reset = function () {
        this.device = {
            name: '',
            id: ''
        };
    };
    DeviceComponent.prototype.onClose = function () {
        if (this.lh.is) {
            this.location.back();
        }
        else {
            this.router.navigate(['/auth/map']);
        }
    };
    DeviceComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'device.component.html',
            styleUrls: [
                'device.component.css',
            ]
        }), 
        __metadata('design:paramtypes', [common_1.Location, router_1.Router, device_service_1.DeviceService, toast_component_1.ToastService, app_component_1.NavigationHistory])
    ], DeviceComponent);
    return DeviceComponent;
}());
exports.DeviceComponent = DeviceComponent;
//# sourceMappingURL=device.component.js.map