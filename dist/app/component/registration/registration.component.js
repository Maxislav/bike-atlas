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
var md5_service_1 = require("../../service/md5.service");
var toast_component_1 = require("../toast/toast.component");
var socket_oi_service_1 = require("../../service/socket.oi.service");
var RegistrationComponent = (function () {
    function RegistrationComponent(location, md5, ts, io) {
        this.location = location;
        this.md5 = md5;
        this.ts = ts;
        this.io = io;
        this.socket = io.socket;
    }
    RegistrationComponent.prototype.onCancel = function (e) {
        e.preventDefault();
        this.location.back();
    };
    RegistrationComponent.prototype.onSubmit = function (e) {
        e.preventDefault();
        console.log('olol');
    };
    RegistrationComponent.prototype.onOk = function (e) {
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
    };
    RegistrationComponent.prototype.onRegist = function () {
        var _this = this;
        var pass = this.md5.hash(this.pass1);
        var name = this.name;
        this.socket.$emit('onRegist', { name: name, pass: pass })
            .then(function (d) {
            if (d.result == 'ok') {
                _this.ts.show({
                    type: 'success',
                    text: 'Регистрация Ок!'
                });
                _this.location.back();
            }
            else if (!d.result && d.message == 'User exist') {
                _this.ts.show({
                    type: 'danger',
                    text: 'Пользователь уже существует'
                });
            }
        }, function (err) {
            console.error(err);
        });
    };
    Object.defineProperty(RegistrationComponent.prototype, "pass1", {
        get: function () {
            return this._pass1;
        },
        set: function (val) {
            //this._pass1 = this.md5.hash(val)
            this._pass1 = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationComponent.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegistrationComponent.prototype, "pass2", {
        get: function () {
            return this._pass2;
        },
        set: function (value) {
            this._pass2 = value;
        },
        enumerable: true,
        configurable: true
    });
    RegistrationComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: './registration.component.html',
            styleUrls: ['./registration.component.css'],
        }), 
        __metadata('design:paramtypes', [common_1.Location, md5_service_1.Md5, toast_component_1.ToastService, socket_oi_service_1.Io])
    ], RegistrationComponent);
    return RegistrationComponent;
}());
exports.RegistrationComponent = RegistrationComponent;
//# sourceMappingURL=registration.component.js.map