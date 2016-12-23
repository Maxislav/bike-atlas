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
var RegistrationComponent = (function () {
    function RegistrationComponent(location, md5, ts) {
        this.location = location;
        this.md5 = md5;
        this.ts = ts;
    }
    RegistrationComponent.prototype.onCancel = function () {
        this.location.back();
    };
    RegistrationComponent.prototype.onOk = function () {
        this.ts.push({
            text: 'Тест'
        });
        this.location.back();
    };
    Object.defineProperty(RegistrationComponent.prototype, "pass1", {
        set: function (val) {
            this._pass1 = this.md5.hash(val);
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
        __metadata('design:paramtypes', [common_1.Location, md5_service_1.Md5, toast_component_1.ToastService])
    ], RegistrationComponent);
    return RegistrationComponent;
}());
exports.RegistrationComponent = RegistrationComponent;
//# sourceMappingURL=registration.component.js.map