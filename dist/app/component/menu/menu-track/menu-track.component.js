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
var _a, _b, _c, _d;
const core_1 = require("@angular/core");
const menu_service_1 = require("app/service/menu.service");
const socket_oi_service_1 = require("app/service/socket.oi.service");
const track_service_1 = require("app/service/track.service");
const router_1 = require("@angular/router");
const fromEvent_1 = require("rxjs/observable/fromEvent");
const ss = require("node_modules/socket.io-stream/socket.io-stream.js");
const my_marker_service_1 = require("app/service/my-marker.service");
const log = console.log;
const MENU = [
    {
        value: 'strava',
        text: 'Strava'
    },
    {
        value: 'journal',
        text: 'JOURNAL'
    },
    {
        value: 'myMarker',
        text: 'MY_MARKER'
    },
    {
        value: 'load',
        text: 'DOWNLOAD_GPX',
        enctype: 'multipart/form-data',
    },
    {
        value: 'import',
        text: 'IMPORT_FROM_GOOGLE_KML'
    },
    {
        value: 'gl520',
        text: 'GL520BS'
    },
];
let MenuTrackComponent = class MenuTrackComponent {
    constructor(ms, io, trackService, router, myMarkerService) {
        this.ms = ms;
        this.io = io;
        this.trackService = trackService;
        this.router = router;
        this.myMarkerService = myMarkerService;
        this.menu = MENU;
        this.clickLoad = 0;
        this.onCloseMenuTrack = new core_1.EventEmitter();
        this.socket = io.socket;
    }
    clickIn(e) {
        e.stopPropagation();
        this.onCloseMenuTrack.emit(false);
    }
    ngAfterViewInit() {
        const onClickObservable = fromEvent_1.fromEvent(document.body, 'click');
        setTimeout(() => {
            this.subscription = onClickObservable.subscribe((e) => {
                this.onCloseMenuTrack.emit(false);
            });
        }, 10);
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    onSelect(item, $event) {
        // $event.preventDefault();
        // $event.stopPropagation();
        switch (item.value) {
            case 'load':
                this.loadFile($event);
                break;
            case 'import':
                this.importFromGoogleKml($event);
                break;
            case 'journal':
                this.router.navigate(['/auth/map/journal']);
                // this.ms.menuOpen = false;
                break;
            case 'strava':
                this.router.navigate(['/auth/map/strava-invite']);
                // this.ms.menuOpen = false;
                break;
            case 'myMarker':
                this.myMarkerService.show();
                break;
            case 'gl520': {
                this.router.navigate(['/auth/map/', 'gtgbc']);
                break;
            }
            default:
                return null;
        }
    }
    loadFile(e) {
        this.clickLoad++;
        const elFile = e.target.parentElement.getElementsByTagName('input')[1];
        elFile.addEventListener('change', () => {
            goStream.call(this);
        });
        if (this.clickLoad == 2) {
            goStream.call(this);
        }
        elFile.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        elFile.click();
        function goStream() {
            this.ms.menuOpen = false;
            this.clickLoad = 0;
            let FReader = new FileReader();
            FReader.onload = function (e) {
                console.log(e);
            };
            var file = elFile.files[0];
            var stream = ss.createStream();
            ss(this.socket).emit('file', stream, { size: file.size });
            ss.createBlobReadStream(file).pipe(stream);
        }
    }
    importFromGoogleKml(e) {
        this.clickLoad++;
        const elFile = e.target.parentElement.getElementsByTagName('input')[1];
        elFile.addEventListener('change', () => {
            goStream.call(this);
        });
        if (this.clickLoad == 2) {
            goStream.call(this);
        }
        elFile.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        elFile.click();
        function goStream() {
            this.ms.menuOpen = false;
            this.clickLoad = 0;
            let FReader = new FileReader();
            FReader.onload = function (e) {
                console.log(e);
            };
            var file = elFile.files[0];
            var stream = ss.createStream();
            ss(this.socket).emit('importFromGoogleKml', stream, { size: file.size });
            ss.createBlobReadStream(file).pipe(stream);
        }
    }
    importFile(e) {
        this.clickLoad++;
        const trackService = this.trackService;
        this.ms.menuOpen = false;
        const elFile = e.target.parentElement.getElementsByTagName('input')[1];
        elFile.addEventListener('change', goStream.bind(this));
        elFile.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        elFile.click();
        if (this.clickLoad == 2) {
            goStream.call(this);
        }
        function goStream() {
            this.clickLoad = 0;
            var file = elFile.files[0];
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
                    log('error ' + this.status);
                }
            };
            xhr.open('POST', '/import/kml-data', true);
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
    }
};
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], MenuTrackComponent.prototype, "onCloseMenuTrack", void 0);
__decorate([
    core_1.HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MenuTrackComponent.prototype, "clickIn", null);
MenuTrackComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'menu-track',
        templateUrl: './menu-track.html',
        styleUrls: ['./menu-track.css'],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof menu_service_1.MenuService !== "undefined" && menu_service_1.MenuService) === "function" && _a || Object, typeof (_b = typeof socket_oi_service_1.Io !== "undefined" && socket_oi_service_1.Io) === "function" && _b || Object, typeof (_c = typeof track_service_1.TrackService !== "undefined" && track_service_1.TrackService) === "function" && _c || Object, router_1.Router, typeof (_d = typeof my_marker_service_1.MyMarkerService !== "undefined" && my_marker_service_1.MyMarkerService) === "function" && _d || Object])
], MenuTrackComponent);
exports.MenuTrackComponent = MenuTrackComponent;
//# sourceMappingURL=menu-track.component.js.map