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
var router_1 = require("@angular/router");
var app_component_1 = require("../../app.component");
var socket_oi_service_1 = require("../../service/socket.oi.service");
var toast_component_1 = require("../toast/toast.component");
var ProfileComponent = (function () {
    function ProfileComponent(location, elRef, as, router, lh, io, toast) {
        this.location = location;
        this.elRef = elRef;
        this.as = as;
        this.router = router;
        this.lh = lh;
        this.io = io;
        this.toast = toast;
        this.imageurl = as.userImage;
        this.name = as.userName;
        this.socket = io.socket;
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
            $this.imageurl = elCanvas.toDataURL();
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
        if (!this.imageurl) {
            this.toast.show({
                type: 'warning',
                text: 'Пустое изображение'
            });
            return;
        }
        this.socket.$emit('onImage', this.imageurl)
            .then(function (d) {
            console.log(d);
            if (d && d.result == 'ok') {
                _this.as.userImage = _this.imageurl;
            }
        });
    };
    ProfileComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: './profile.component.html',
            styleUrls: ['./profile.component.css'],
        }), 
        __metadata('design:paramtypes', [common_1.Location, core_1.ElementRef, auth_service_1.AuthService, router_1.Router, app_component_1.NavigationHistory, socket_oi_service_1.Io, toast_component_1.ToastService])
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
//# sourceMappingURL=profile.component.js.map