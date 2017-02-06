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
const common_1 = require("@angular/common");
const md5_service_1 = require("../../service/md5.service");
const toast_component_1 = require("../toast/toast.component");
const socket_oi_service_1 = require("../../service/socket.oi.service");
const login_service_1 = require("../../service/login.service");
let RegistrationComponent = class RegistrationComponent {
    constructor(location, md5, ts, io, loginService) {
        this.location = location;
        this.md5 = md5;
        this.ts = ts;
        this.io = io;
        this.loginService = loginService;
        this.socket = io.socket;
    }
    onCancel(e) {
        e.preventDefault();
        this.location.back();
    }
    onSubmit(e) {
        e.preventDefault();
        console.log('olol');
    }
    onOk(e) {
        e.preventDefault();
        if (!this.name) {
            this.ts.show({
                type: 'warning',
                text: 'Поле "Имя"не заполнено'
            });
            return;
        }
        else if (!this.pass1 || !this.pass2) {
            this.ts.show({
                type: 'warning',
                text: 'Поле "Пароль" не заполнено'
            });
            return;
        }
        else if (this.pass1 != this.pass2) {
            this.ts.show({
                type: 'warning',
                text: 'Пароли не совпадают'
            });
        }
        else {
            this.onRegist();
        }
    }
    onRegist() {
        const pass = this.md5.hash(this.pass1);
        const name = this.name;
        this.socket.$emit('onRegist', { name: name, pass: pass })
            .then((d) => {
            if (d.result == 'ok') {
                this.ts.show({
                    type: 'success',
                    text: 'Регистрация Ок!'
                });
                this.loginService.onEnter({
                    name,
                    pass
                });
                this.location.back();
            }
            else if (!d.result && d.message == 'User exist') {
                this.ts.show({
                    type: 'danger',
                    text: 'Пользователь уже существует'
                });
            }
        }, (err) => {
            console.error(err);
        });
    }
    set pass1(val) {
        //this._pass1 = this.md5.hash(val)
        this._pass1 = val;
    }
    get pass1() {
        return this._pass1;
    }
    get name() {
        return this._name;
    }
    get pass2() {
        return this._pass2;
    }
    set pass2(value) {
        this._pass2 = value;
    }
    set name(value) {
        this._name = value;
    }
};
RegistrationComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: './registration.component.html',
        styleUrls: ['./registration.component.css'],
    }),
    __metadata("design:paramtypes", [common_1.Location, md5_service_1.Md5, toast_component_1.ToastService, socket_oi_service_1.Io, login_service_1.LoginService])
], RegistrationComponent);
exports.RegistrationComponent = RegistrationComponent;
//# sourceMappingURL=registration.component.js.map