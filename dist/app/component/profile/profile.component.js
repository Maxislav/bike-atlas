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
var router_1 = require("@angular/router");
var app_component_1 = require("../../app.component");
var socket_oi_service_1 = require("../../service/socket.oi.service");
var toast_component_1 = require("../toast/toast.component");
var main_user_service_1 = require("../../service/main.user.service");
var private_area_service_1 = require("../../service/private.area.service");
var ProfileComponent = (function () {
    function ProfileComponent(location, elRef, router, lh, io, toast, areaService, userService) {
        this.location = location;
        this.elRef = elRef;
        this.router = router;
        this.lh = lh;
        this.io = io;
        this.toast = toast;
        this.areaService = areaService;
        this.user = userService.user;
        this.setting = userService.user.setting;
        this.socket = io.socket;
    }
    ProfileComponent.prototype.saveLock = function (val) {
        this.areaService.saveLock(val);
    };
    ProfileComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var el = this.elRef.nativeElement;
        var inputEl = this.inputEl = el.getElementsByTagName("input")[1];
        inputEl.addEventListener('change', function () {
            console.log(inputEl.files);
            var file = inputEl.files[0];
            var reader = new FileReader();
            reader.onload = function (event) {
                var the_url = event.target.result;
                //this.imageurl = the_url
                _this.crop(the_url);
            };
            reader.readAsDataURL(file);
        });
    };
    ProfileComponent.prototype.crop = function (base64) {
        var $this = this;
        var imageObj = new Image();
        imageObj.style.display = 'none';
        var elCanvas = document.createElement('canvas');
        elCanvas.width = 100;
        elCanvas.height = 100;
        var context = elCanvas.getContext('2d');
        function drawClipped(context, myImage) {
            context.save();
            context.beginPath();
            context.arc(50, 50, 50, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.drawImage(myImage, 0, 0, 100, 100);
            context.restore();
            $this.user.image = elCanvas.toDataURL();
            imageObj.parentElement.removeChild(imageObj);
        }
        ;
        imageObj.onload = function () {
            drawClipped(context, imageObj);
        };
        imageObj.src = base64;
        document.body.appendChild(imageObj);
    };
    ProfileComponent.prototype.onClose = function () {
        if (this.lh.is) {
            this.location.back();
        }
        else {
            this.router.navigate(['/auth/map']);
        }
    };
    ProfileComponent.prototype.onOpenImage = function () {
        this.inputEl.click();
    };
    ProfileComponent.prototype.onSave = function () {
        var _this = this;
        if (!this.user.name) {
            this.toast.show({
                type: 'warning',
                text: 'Войдите под своим пользователем'
            });
            return;
        }
        if (!this.user.image) {
            this.toast.show({
                type: 'warning',
                text: 'Пустое изображение'
            });
            return;
        }
        this.socket.$emit('onImage', this.user.image)
            .then(function (d) {
            console.log(d);
            if (d && d.result == 'ok') {
                _this.toast.show({
                    type: 'success',
                    text: 'Профиль сохранен'
                });
            }
        });
    };
    ProfileComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: './profile.component.html',
            styleUrls: ['./profile.component.css'],
        }), 
        __metadata('design:paramtypes', [common_1.Location, core_1.ElementRef, router_1.Router, app_component_1.NavigationHistory, socket_oi_service_1.Io, toast_component_1.ToastService, private_area_service_1.PrivateAreaService, main_user_service_1.UserService])
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
//# sourceMappingURL=profile.component.js.map