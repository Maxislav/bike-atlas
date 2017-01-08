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
//import { Rp } from '@angular/core';
var menu_service_1 = require("app/service/menu.service");
var router_1 = require("@angular/router");
var socket_oi_service_1 = require("../../../service/socket.oi.service");
var md5_service_1 = require("../../../service/md5.service");
var local_storage_service_1 = require("../../../service/local-storage.service");
var auth_service_1 = require("../../../service/auth.service");
var toast_component_1 = require("../../toast/toast.component");
var device_service_1 = require("../../../service/device.service");
var login_service_1 = require("../../../service/login.service");
var log_service_1 = require("../../../service/log.service");
var friends_service_1 = require("../../../service/friends.service");
var main_user_service_1 = require("../../../service/main.user.service");
//import {RouterLink} from "@angular/router-deprecated";
var MenuLoginComponent = (function () {
    function MenuLoginComponent(router, ms, io, md5, ls, as, ds, ts, logService, friend, loginService, userService) {
        this.router = router;
        this.ms = ms;
        this.io = io;
        this.md5 = md5;
        this.ls = ls;
        this.as = as;
        this.ds = ds;
        this.ts = ts;
        this.logService = logService;
        this.friend = friend;
        this.loginService = loginService;
        this.userService = userService;
        this.user = userService.user;
        this.socket = io.socket;
    }
    MenuLoginComponent.prototype.goToReg = function () {
        this.router.navigate(['/auth/map/registration']);
        this.ms.menuOpenLogin = false;
    };
    MenuLoginComponent.prototype.onEnter = function (e) {
        this.loginService
            .onEnter({
            name: this.name,
            pass: this.md5.hash(this.pass)
        });
    };
    MenuLoginComponent.prototype.goToProfile = function () {
        this.router.navigate(['/auth/map/profile']);
        this.ms.menuOpenLogin = false;
    };
    MenuLoginComponent.prototype.onExit = function (e) {
        this.loginService.onExit(e);
    };
    MenuLoginComponent.prototype.goToFriends = function () {
        this.ms.menuOpenLogin = false;
        this.router.navigate(['/auth/map/friends']);
    };
    MenuLoginComponent.prototype.goDevice = function () {
        this.router.navigate(['/auth/map/device']);
        this.ms.menuOpenLogin = false;
    };
    MenuLoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'menu-login',
            //directives: [RouterLink],
            templateUrl: './menu-login.component.html',
            styleUrls: ['./menu-login.css'],
        }), 
        __metadata('design:paramtypes', [router_1.Router, (typeof (_a = typeof menu_service_1.MenuService !== 'undefined' && menu_service_1.MenuService) === 'function' && _a) || Object, socket_oi_service_1.Io, md5_service_1.Md5, local_storage_service_1.LocalStorage, auth_service_1.AuthService, device_service_1.DeviceService, toast_component_1.ToastService, log_service_1.LogService, friends_service_1.FriendsService, login_service_1.LoginService, main_user_service_1.UserService])
    ], MenuLoginComponent);
    return MenuLoginComponent;
    var _a;
}());
exports.MenuLoginComponent = MenuLoginComponent;
//# sourceMappingURL=menu-login.component.js.map