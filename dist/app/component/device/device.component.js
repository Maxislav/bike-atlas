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
var main_user_service_1 = require("../../service/main.user.service");
var HelpContainer = (function () {
    function HelpContainer(el, renderer) {
        var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], x = w.innerWidth || e.clientWidth || g.clientWidth, y = w.innerHeight || e.clientHeight || g.clientHeight;
        renderer.setElementStyle(el.nativeElement, 'height', y - 300 + 'px');
    }
    HelpContainer = __decorate([
        core_1.Directive({
            selector: 'help-container',
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], HelpContainer);
    return HelpContainer;
}());
exports.HelpContainer = HelpContainer;
var IsOwner = (function () {
    function IsOwner(user) {
        this.user = user;
    }
    IsOwner.prototype.transform = function (value, args) {
        var _this = this;
        // console.log('fds')
        return value.filter(function (item) {
            return item.ownerId == _this.user.user.id;
        });
    };
    IsOwner = __decorate([
        core_1.Pipe({
            name: 'isOwner',
            pure: false
        }), 
        __metadata('design:paramtypes', [main_user_service_1.UserService])
    ], IsOwner);
    return IsOwner;
}());
exports.IsOwner = IsOwner;
var DeviceComponent = (function () {
    function DeviceComponent(location, router, userService, deviceService, toast, lh) {
        this.location = location;
        this.router = router;
        this.userService = userService;
        this.deviceService = deviceService;
        this.toast = toast;
        this.lh = lh;
        this.showHelp = false;
        this.user = userService.user;
        this.device = {
            ownerId: -1,
            name: '',
            id: '',
            image: ''
        };
        this.btnPreDel = {
            index: -1
        };
        this.devices = deviceService.devices;
        deviceService.updateDevices();
    }
    DeviceComponent.prototype.onShowHelp = function () {
        this.showHelp = !this.showHelp;
    };
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
        this.deviceService.onAddDevice(this.device)
            .then(function (d) {
            if (d && d.result == 'ok') {
                _this.reset();
            }
            else if (d && d.result === false && d.message == 'device exist') {
                _this.toast.show({
                    type: 'warning',
                    text: "Устройство зарегистрированно на другого пользователя"
                });
            }
        });
    };
    DeviceComponent.prototype.onDel = function (e, device) {
        var _this = this;
        this.deviceService.onDelDevice(device)
            .then(function (d) {
            console.log(d);
            _this.clearPredel();
        });
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
            ownerId: -1,
            name: '',
            id: '',
            image: ''
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
            pipes: [IsOwner],
            directives: [HelpContainer],
            styleUrls: [
                'device.component.css',
            ]
        }), 
        __metadata('design:paramtypes', [common_1.Location, router_1.Router, main_user_service_1.UserService, device_service_1.DeviceService, toast_component_1.ToastService, app_component_1.NavigationHistory])
    ], DeviceComponent);
    return DeviceComponent;
}());
exports.DeviceComponent = DeviceComponent;
//# sourceMappingURL=device.component.js.map