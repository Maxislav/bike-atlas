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
const journal_component_1 = require("../journal.component");
const local_storage_service_1 = require("../../../service/local-storage.service");
const track_service_1 = require("../../../service/track.service");
const main_user_service_1 = require("../../../service/main.user.service");
let OneTrack = class OneTrack {
    constructor(el, Leaflet, ls, trackService, userService) {
        this.el = el;
        this.Leaflet = Leaflet;
        this.ls = ls;
        this.trackService = trackService;
        this.userService = userService;
        this.L = Leaflet.L;
    }
    ngAfterViewInit() {
        const L = this.L;
        const localStorageCenter = this.ls.mapCenter;
        this.mapEL = this.el.nativeElement.getElementsByClassName('map')[0];
        //console.log(this.mapEL)
        const map = L.map(this.mapEL).setView([localStorageCenter.lat || 50.3, localStorageCenter.lng || 30.3], localStorageCenter.zoom || 8);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        if (!this.track.points.length) {
            return;
        }
        const latlngs = [];
        this.track.points.forEach(point => {
            latlngs.push([point.lat, point.lng]);
        });
        this.trackDate = new Date(this.track.points[0].date);
        const polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);
        map.fitBounds(polyline.getBounds());
    }
    ngOnInit() {
        this.userService.getUserImageById(this.track.userId)
            .then(image => {
            this.image = image;
        });
    }
    showOnMap() {
        this.trackService.showTrack(this.track.points);
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], OneTrack.prototype, "track", void 0);
OneTrack = __decorate([
    core_1.Component({
        //noinspection TypeScriptUnresolvedVariable
        selector: 'one-track',
        moduleId: module.id,
        templateUrl: './one-track.component.html',
        styleUrls: ['./one-track.component.css'],
    }),
    __metadata("design:paramtypes", [core_1.ElementRef,
        journal_component_1.LeafletResolver,
        local_storage_service_1.LocalStorage,
        track_service_1.TrackService,
        main_user_service_1.UserService])
], OneTrack);
exports.OneTrack = OneTrack;
//# sourceMappingURL=one-track.component.js.map