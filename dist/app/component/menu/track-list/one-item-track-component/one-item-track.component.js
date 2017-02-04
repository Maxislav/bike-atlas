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
const core_1 = require("@angular/core");
const track_var_1 = require("../../../../service/track.var");
const track_service_1 = require("../../../../service/track.service");
const map_service_1 = require("../../../../service/map.service");
const util_1 = require("../../../../service/util");
let OneItemTrackComponent = class OneItemTrackComponent {
    constructor(trackService, mapService) {
        this.trackService = trackService;
        this.mapService = mapService;
        this.util = new util_1.Util();
    }
    ngOnInit() {
        console.log(this.track);
    }
    hideTrack() {
        this.stop && this.stop();
        this.track.hide();
    }
    saveChange() {
        this.trackService.saveChange();
    }
    onGo(_tr) {
        this.stop && this.stop();
        //this.hideTrack();
        const $this = this;
        const map = this.mapService.map;
        const points = this.fillTrack(_tr.points);
        const marker = this.trackService.marker(points[0]); //this.track.showSpriteMarker(points[0]);
        /**
         * todo
         */
        // return;
        let timeout;
        let i = 0;
        let step = 1;
        flyTo();
        function flyTo() {
            if (points[i]) {
                map.setCenter([points[i].lng, points[i].lat]);
                marker.update(points[i]);
            }
            if (i < points.length - 2) {
                timeout = setTimeout(() => {
                    i += step;
                    flyTo();
                }, 40);
            }
            else {
                stop();
            }
        }
        map.on('moveend', moveend);
        function moveend() {
            switch (true) {
                case map.getZoom() < 10:
                    step = 40;
                    break;
                case map.getZoom() < 18:
                    step = 5 * parseInt('' + (18 - map.getZoom()));
                    break;
                default:
                    step = 1;
            }
        }
        function stop() {
            $this.stop();
            map.off('moveend', moveend);
        }
        this.stop = function () {
            clearTimeout(timeout);
            marker.remove();
        };
    }
    fillTrack(points) {
        let fillTrack = [];
        const F = parseFloat;
        points.forEach((point, i) => {
            if (i < points.length - 1) {
                let distBetween = parseInt(this.util.distanceBetween2(point, points[i + 1]));
                let arr = fill(point, points[i + 1], distBetween);
                fillTrack = fillTrack.concat(arr);
            }
        });
        function fill(point1, point2, steps) {
            const arr = [];
            let lngStep = (point2.lng - point1.lng) / steps;
            let latStep = (point2.lat - point1.lat) / steps;
            if (1 < steps) {
                for (let i = 0; i < steps; i++) {
                    const p = new track_var_1.Point(point1.lng + (lngStep * i), point1.lat + (latStep * i), point2.bearing);
                    arr.push(p);
                    if (i == steps - 1) {
                        arr[i] = point2;
                    }
                }
            }
            else {
                arr.push(point1);
                arr.push(point2);
            }
            return arr;
        }
        return fillTrack;
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], OneItemTrackComponent.prototype, "track", void 0);
OneItemTrackComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'one-item-track-component',
        templateUrl: "./one-item-track.component.html",
        styleUrls: ['./one-item-track.component.css']
    }),
    __metadata("design:paramtypes", [track_service_1.TrackService, map_service_1.MapService])
], OneItemTrackComponent);
exports.OneItemTrackComponent = OneItemTrackComponent;
//# sourceMappingURL=one-item-track.component.js.map