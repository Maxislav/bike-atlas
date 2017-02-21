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
const core_1 = require('@angular/core');
//import { Rp } from '@angular/core';
const menu_service_1 = require("app/service/menu.service");
const router_1 = require("@angular/router");
const socket_oi_service_1 = require("../../../service/socket.oi.service");
const md5_service_1 = require("../../../service/md5.service");
const local_storage_service_1 = require("../../../service/local-storage.service");
const auth_service_1 = require("../../../service/auth.service");
const toast_component_1 = require("../../toast/toast.component");
const device_service_1 = require("../../../service/device.service");
const login_service_1 = require("../../../service/login.service");
const log_service_1 = require("../../../service/log.service");
const friends_service_1 = require("../../../service/friends.service");
const main_user_service_1 = require("../../../service/main.user.service");
//import {RouterLink} from "@angular/router-deprecated";
let MenuLoginComponent = class MenuLoginComponent {
    constructor(router, ms, io, md5, ls, as, ds, ts, logService, friend, loginService, userService) {
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
    goToReg() {
        this.router.navigate(['/auth/map/registration']);
        this.ms.menuOpenLogin = false;
    }
    goToPrivateArea() {
        this.router.navigate(['/auth/map/privatearea']);
        this.ms.menuOpenLogin = false;
    }
    onEnter(e) {
        this.loginService
            .onEnter({
            name: this.name,
            pass: this.md5.hash(this.pass)
        });
    }
    goToProfile() {
        this.router.navigate(['/auth/map/profile']);
        this.ms.menuOpenLogin = false;
    }
    onExit(e) {
        this.loginService.onExit(e);
    }
    goToFriends() {
        this.ms.menuOpenLogin = false;
        this.router.navigate(['/auth/map/friends']);
    }
    goDevice() {
        this.router.navigate(['/auth/map/device']);
        this.ms.menuOpenLogin = false;
    }
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
exports.MenuLoginComponent = MenuLoginComponent;
var _a;
//# sourceMappingURL=menu-login.component.js.map