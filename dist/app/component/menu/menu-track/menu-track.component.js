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
///<reference path="../../../../../node_modules/@angular/compiler/src/ml_parser/ast.d.ts"/>
var core_1 = require('@angular/core');
var menu_service_1 = require("app/service/menu.service");
var socket_oi_service_1 = require("app/service/socket.oi.service");
var track_service_1 = require("app/service/track.service");
var ss = require('node_modules/socket.io-stream/socket.io-stream.js');
var log = console.log;
var MENU = [
    {
        value: 'load',
        text: "Загрузить",
        enctype: "multipart/form-data",
    },
    {
        value: 'import',
        text: "Импорт from Google KML"
    },
    {
        value: 'view',
        text: "Просмотреть"
    }
];
var MenuTrackComponent = (function () {
    function MenuTrackComponent(ms, io, trackService) {
        this.ms = ms;
        this.io = io;
        this.trackService = trackService;
        this.menu = MENU;
        this.loadBtn = 0;
        this.socket = io.socket;
    }
    MenuTrackComponent.prototype.onSelect = function (item, $event) {
        $event.preventDefault();
        $event.stopPropagation();
        switch (item.value) {
            case 'load':
                this.loadFile($event);
                break;
            case 'import':
                this.importFile($event);
                break;
            default:
                return null;
        }
    };
    MenuTrackComponent.prototype.loadFile = function (e) {
        var _this = this;
        this.loadBtn++;
        console.log(this.loadBtn);
        var elFile = e.target.parentElement.getElementsByTagName('input')[1];
        elFile.addEventListener('change', function () {
            goStrem.call(_this);
        });
        if (this.loadBtn == 2) {
            goStrem.call(this);
        }
        elFile.addEventListener('click', function (e) {
            e.stopPropagation();
        });
        elFile.click();
        function goStrem() {
            this.ms.menuOpen = false;
            this.loadBtn = 0;
            var FReader = new FileReader();
            FReader.onload = function (e) {
                console.log(e);
            };
            var file = elFile.files[0];
            var stream = ss.createStream();
            ss(this.socket).emit('file', stream, { size: file.size });
            ss.createBlobReadStream(file).pipe(stream);
            this.ms.menuLoadOpen = false;
        }
    };
    MenuTrackComponent.prototype.importFile = function (e) {
        var trackService = this.trackService;
        this.ms.menuOpen = false;
        var elFile = e.target.parentElement.getElementsByTagName('input')[1];
        elFile.addEventListener('change', function () {
            var file = elFile.files;
            upload(file[0]);
        });
        elFile.addEventListener('click', function (e) {
            e.stopPropagation();
        });
        elFile.click();
        function upload(file) {
            var xhr = new XMLHttpRequest();
            xhr.upload.onprogress = function (event) {
                console.log(event.loaded + ' / ' + event.total);
            };
            xhr.onload = xhr.onerror = function () {
                if (this.status == 200) {
                    trackService.showGpxTrack(this.response);
                    download(file.name.replace(/kml$/, 'gpx'), this.response);
                }
                else {
                    log("error " + this.status);
                }
            };
            xhr.open("POST", "/import/kml-data", true);
            var formData = new FormData();
            formData.append('file', file);
            xhr.send(formData);
        }
        function download(filename, text) {
            var pom = document.createElement('a');
            pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            pom.setAttribute('download', filename);
            if (document.createEvent) {
                var event = document.createEvent('MouseEvents');
                event.initEvent('click', true, true);
                pom.dispatchEvent(event);
            }
            else {
                pom.click();
            }
        }
    };
    MenuTrackComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'menu-track',
            templateUrl: './menu-track.html',
            styleUrls: ['./menu-track.css'],
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof menu_service_1.MenuService !== 'undefined' && menu_service_1.MenuService) === 'function' && _a) || Object, (typeof (_b = typeof socket_oi_service_1.Io !== 'undefined' && socket_oi_service_1.Io) === 'function' && _b) || Object, (typeof (_c = typeof track_service_1.TrackService !== 'undefined' && track_service_1.TrackService) === 'function' && _c) || Object])
    ], MenuTrackComponent);
    return MenuTrackComponent;
    var _a, _b, _c;
}());
exports.MenuTrackComponent = MenuTrackComponent;
//# sourceMappingURL=menu-track.component.js.map