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
var menu_service_1 = require("app/service/menu.service");
var socket_oi_service_1 = require("app/service/socket.oi.service");
var ss = require('node_modules/socket.io-stream/socket.io-stream.js');
var Item = (function () {
    function Item() {
    }
    return Item;
}());
var MENU = [
    {
        value: 'load',
        text: "Загрузить"
    },
    {
        value: 'view',
        text: "Просмотреть"
    }
];
var MenuTrackComponent = (function () {
    function MenuTrackComponent(ms, io) {
        this.ms = ms;
        this.io = io;
        this.menu = MENU;
        this.socket = io.socket;
    }
    MenuTrackComponent.prototype.onSelect = function (item, $event) {
        switch (item.value) {
            case 'load':
                //console.log(t)
                $event.preventDefault();
                $event.stopPropagation();
                this.loadFile($event);
                //this.ms.menuLoadOpen = true;
                break;
            default:
                return null;
        }
    };
    MenuTrackComponent.prototype.loadFile = function (e) {
        var _this = this;
        this.ms.menuOpen = false;
        var elFile = e.target.parentElement.getElementsByTagName('input')[1];
        // console.log(elFile)
        elFile.addEventListener('change', function () {
            var FReader = new FileReader();
            FReader.onload = function (e) {
                console.log(e);
            };
            var file = elFile.files[0];
            var stream = ss.createStream();
            ss(_this.socket).emit('file', stream, { size: file.size });
            ss.createBlobReadStream(file).pipe(stream);
            _this.ms.menuLoadOpen = false;
        });
        elFile.addEventListener('click', function (e) {
            // e.preventDefault()
            e.stopPropagation();
        });
        elFile.click();
    };
    MenuTrackComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'menu-track',
            templateUrl: './menu-track.html',
            styleUrls: ['./menu-track.css'],
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof menu_service_1.MenuService !== 'undefined' && menu_service_1.MenuService) === 'function' && _a) || Object, (typeof (_b = typeof socket_oi_service_1.Io !== 'undefined' && socket_oi_service_1.Io) === 'function' && _b) || Object])
    ], MenuTrackComponent);
    return MenuTrackComponent;
    var _a, _b;
}());
exports.MenuTrackComponent = MenuTrackComponent;
//# sourceMappingURL=menu-track.component.js.map