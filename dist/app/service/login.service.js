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
var local_storage_service_1 = require("./local-storage.service");
var auth_service_1 = require("./auth.service");
var device_service_1 = require("./device.service");
var toast_component_1 = require("../component/toast/toast.component");
/**
 * Created by max on 04.01.17.
 */
var LoginService = (function () {
    function LoginService(io, ls, as, ds, ts) {
        this.io = io;
        this.ls = ls;
        this.as = as;
        this.ds = ds;
        this.ts = ts;
        this.socket = io.socket;
    }
    LoginService.prototype.onEnter = function (_a) {
        var name = _a.name, pass = _a.pass;
        return this.socket
            .$emit('onEnter', {
            name: name,
            pass: pass
        })
            .then(this.setHashName.bind(this));
    };
    LoginService.prototype.setHashName = function (d) {
        console.log(d);
        switch (d.result) {
            case 'ok':
                this.ls.userKey = d.hash;
                this.as.userName = d.name;
                this.ds.updateDevices();
                break;
            case false:
                this.ts.show({
                    type: 'warning',
                    text: 'Невеное имя пользователя или пароль'
                });
        }
    };
    LoginService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [socket_oi_service_1.Io, local_storage_service_1.LocalStorage, auth_service_1.AuthService, device_service_1.DeviceService, toast_component_1.ToastService])
    ], LoginService);
    return LoginService;
}());
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map