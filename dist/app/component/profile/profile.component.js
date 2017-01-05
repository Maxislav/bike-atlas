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
var common_1 = require('@angular/common');
var auth_service_1 = require("../../service/auth.service");
var ProfileComponent = (function () {
    function ProfileComponent(location, elRef, as) {
        this.location = location;
        this.elRef = elRef;
        this.imageurl = 'src/img/no-avatar.gif';
        this.name = as.userName;
    }
    ProfileComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var el = this.elRef.nativeElement;
        var inputEl = this.inputEl = el.getElementsByTagName("input")[0];
        inputEl.addEventListener('change', function () {
            console.log(inputEl.files);
            var file = inputEl.files[0];
            var reader = new FileReader();
            reader.onload = function (event) {
                var the_url = event.target.result;
                _this.imageurl = the_url;
            };
            reader.readAsDataURL(file);
        });
    };
    ProfileComponent.prototype.onClose = function () {
        this.location.back();
    };
    ProfileComponent.prototype.onOpen = function () {
        this.inputEl.click();
    };
    ProfileComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: './profile.component.html',
            styleUrls: ['./profile.component.css'],
        }), 
        __metadata('design:paramtypes', [common_1.Location, core_1.ElementRef, auth_service_1.AuthService])
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
//# sourceMappingURL=profile.component.js.map