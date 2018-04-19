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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const app_component_1 = require("../../app.component");
const socket_oi_service_1 = require("../../service/socket.oi.service");
const toast_component_1 = require("../toast/toast.component");
const main_user_service_1 = require("../../service/main.user.service");
const private_area_service_1 = require("../../service/private.area.service");
const forms_1 = require("@angular/forms");
let ProfileComponent = class ProfileComponent {
    constructor(location, elRef, router, lh, io, toast, areaService, fb, userService) {
        this.location = location;
        this.elRef = elRef;
        this.router = router;
        this.lh = lh;
        this.io = io;
        this.toast = toast;
        this.areaService = areaService;
        this.fb = fb;
        this.user = userService.user;
        this.setting = userService.user.setting;
        this.socket = io.socket;
        console.log(forms_1.Validators.required);
        this.profileForm = this.fb.group({
            oldPass: ['', (control) => {
                    console.log(control);
                    return control.value.length ? null : {
                        'rew': 'oldo'
                    };
                }] // <--- the FormControl called "name"
        });
    }
    saveLock(val) {
        this.areaService.saveLock(val);
    }
    ngAfterViewInit() {
        const el = this.elRef.nativeElement;
        const inputEl = this.inputEl = el.getElementsByTagName("input")[1];
        inputEl.addEventListener('change', () => {
            console.log(inputEl.files);
            const file = inputEl.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const the_url = event.target.result;
                //this.imageurl = the_url
                this.crop(the_url);
            };
            reader.readAsDataURL(file);
        });
    }
    crop(base64) {
        const $this = this;
        const imageObj = new Image();
        imageObj.style.display = 'none';
        const elCanvas = document.createElement('canvas');
        elCanvas.width = 100;
        elCanvas.height = 100;
        const context = elCanvas.getContext('2d');
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
    }
    onClose() {
        if (this.lh.is) {
            this.location.back();
        }
        else {
            this.router.navigate(['/auth/map']);
        }
    }
    onOpenImage() {
        this.inputEl.click();
    }
    onSave() {
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
            .then(d => {
            console.log(d);
            if (d && d.result == 'ok') {
                this.toast.show({
                    type: 'success',
                    text: 'Профиль сохранен'
                });
                //this.user.image = this.i
            }
        });
    }
};
ProfileComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: './profile.component.html',
        styleUrls: ['./profile.component.css'],
    }),
    __metadata("design:paramtypes", [common_1.Location,
        core_1.ElementRef,
        router_1.Router,
        app_component_1.NavigationHistory,
        socket_oi_service_1.Io,
        toast_component_1.ToastService,
        private_area_service_1.PrivateAreaService,
        forms_1.FormBuilder,
        main_user_service_1.UserService])
], ProfileComponent);
exports.ProfileComponent = ProfileComponent;
//# sourceMappingURL=profile.component.js.map