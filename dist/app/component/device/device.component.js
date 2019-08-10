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
const device_service_1 = require("../../service/device.service");
const app_component_1 = require("../../app.component");
const toast_component_1 = require("../toast/toast.component");
const main_user_service_1 = require("../../service/main.user.service");
let HelpContainer = class HelpContainer {
    constructor(el, renderer) {
        let w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], x = w.innerWidth || e.clientWidth || g.clientWidth, y = w.innerHeight || e.clientHeight || g.clientHeight;
        renderer.setElementStyle(el.nativeElement, 'height', y - 300 + 'px');
    }
};
HelpContainer = __decorate([
    core_1.Directive({
        selector: 'help-container',
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer])
], HelpContainer);
exports.HelpContainer = HelpContainer;
let IsOwner = class IsOwner {
    constructor(user) {
        this.user = user;
    }
    transform(value, args) {
        // console.log('fds')
        return value.filter(item => {
            return item.ownerId == this.user.user.id;
        });
    }
};
IsOwner = __decorate([
    core_1.Pipe({
        name: 'isOwner',
        pure: false
    }),
    __metadata("design:paramtypes", [main_user_service_1.UserService])
], IsOwner);
exports.IsOwner = IsOwner;
let DeviceComponent = class DeviceComponent {
    constructor(location, router, userService, deviceService, toast, lh, el) {
        this.location = location;
        this.router = router;
        this.userService = userService;
        this.deviceService = deviceService;
        this.toast = toast;
        this.lh = lh;
        this.el = el;
        this.showHelp = false;
        this.inputList = new Set();
        this.user = userService.user;
        this.device = {
            ownerId: -1,
            name: '',
            id: '',
            image: ''
        };
        this.btnPreDel = {
            index: -1
        };
        this.devices = deviceService.devices;
        deviceService.updateDevices();
    }
    ngOnChanges(a) {
        console.log('ngOnChanges->', a);
    }
    onShowHelp() {
        this.showHelp = !this.showHelp;
    }
    onAdd(e) {
        e.preventDefault();
        this.device.name = this.device.name.replace(/^\s+/, '');
        this.device.id = this.device.id.replace(/^\s+/, '');
        console.log(this.device);
        if (!this.device.name || !this.device.id) {
            this.toast.show({
                type: 'warning',
                text: 'Имя или Идентификатор не заполнено'
            });
            return;
        }
        this.deviceService.onAddDevice(this.device)
            .then(d => {
            if (d && d.result == 'ok') {
                this.reset();
            }
            else if (d && d.result === false && d.message == 'device exist') {
                this.toast.show({
                    type: 'warning',
                    text: 'Устройство зарегистрированно на другого пользователя'
                });
            }
        });
    }
    onDel(e, device) {
        this.deviceService.onDelDevice(device)
            .then(d => {
            console.log(d);
            this.clearPredel();
        });
    }
    preDel(e, i) {
        e.stopPropagation();
        this.btnPreDel.index = i;
    }
    clearPredel() {
        this.btnPreDel.index = -1;
    }
    reset() {
        this.device = {
            ownerId: -1,
            name: '',
            id: '',
            image: ''
        };
    }
    onLoadImage(device, i) {
        const el = Array.from(this.el.nativeElement.getElementsByTagName('input')).find((item) => {
            return item.id === 'input-img-' + i;
        });
        this.initEl(el, device);
    }
    initEl(el, device) {
        if (!this.inputList.has(el)) {
            this.inputList.add(el);
            el.addEventListener('change', () => {
                const file = el.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    const the_url = event.target.result;
                    device.image = this.crop(the_url);
                    this.onAddDeviceImage(device);
                };
                reader.readAsDataURL(file);
            });
        }
        el.click();
    }
    onAddDeviceImage(device) {
        this.deviceService.onAddDeviceImage(device)
            .then(d => {
            console.log(d);
        });
    }
    crop(base64) {
        //const $this = this;
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
            //$this.user.image =   elCanvas.toDataURL();
            //imageObj.parentElement.removeChild(imageObj)
        }
        imageObj.onload = function () {
            drawClipped(context, imageObj);
        };
        imageObj.src = base64;
        return base64;
        //document.body.appendChild(imageObj)
    }
    ngDoCheck() {
    }
    getF(f) {
        console.log(f);
    }
    onClose() {
        if (this.lh.is) {
            this.location.back();
        }
        else {
            this.router.navigate(['/auth/map']);
        }
    }
    ngAfterViewInit() {
        console.log(this.el.nativeElement.getElementsByTagName('input'));
    }
};
DeviceComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'device.component.html',
        styleUrls: [
            'device.component.css',
        ]
    }),
    __metadata("design:paramtypes", [common_1.Location,
        router_1.Router,
        main_user_service_1.UserService,
        device_service_1.DeviceService,
        toast_component_1.ToastService,
        app_component_1.NavigationHistory,
        core_1.ElementRef])
], DeviceComponent);
exports.DeviceComponent = DeviceComponent;
//# sourceMappingURL=device.component.js.map