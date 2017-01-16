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
var track_service_1 = require("app/service/track.service");
var util_1 = require("app/service/util");
var map_service_1 = require("../../../service/map.service");
var TrackList = (function () {
    function TrackList(track, mapService) {
        this.track = track;
        this.mapService = mapService;
        this.util = new util_1.Util();
        this.list = track.trackList;
        //this.permitMovie = true
    }
    TrackList.prototype.hideTrack = function (track) {
        track && track.hide();
        if (this.stop) {
            this.stop();
        }
    };
    TrackList.prototype.onGo = function (_tr) {
        this.hideTrack();
        var $this = this;
        var map = this.mapService.map;
        var points = this.fillTrack(_tr.points);
        var marker = this.track.marker(points[0]); //this.track.showSpriteMarker(points[0]);
        /**
         * todo
         */
        // return;
        var timeout;
        var i = 0;
        var step = 1;
        flyTo();
        function flyTo() {
            if (points[i]) {
                map.setCenter([points[i].lng, points[i].lat]);
                marker.update(points[i]);
            }
            if (i < points.length - 2) {
                timeout = setTimeout(function () {
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
    };
    TrackList.prototype.fillTrack = function (points) {
        var _this = this;
        var fillTrack = [];
        var F = parseFloat;
        points.forEach(function (point, i) {
            if (i < points.length - 1) {
                var distBetween = parseInt(_this.util.distanceBetween2(point, points[i + 1]));
                var arr = fill(point, points[i + 1], distBetween);
                fillTrack = fillTrack.concat(arr);
            }
        });
        function fill(point1, point2, steps) {
            var arr = [];
            var lngStep = (point2.lng - point1.lng) / steps;
            var latStep = (point2.lat - point1.lat) / steps;
            if (1 < steps) {
                for (var i = 0; i < steps; i++) {
                    arr.push({
                        lng: point1.lng + (lngStep * i),
                        lat: point1.lat + (latStep * i),
                        bearing: point2.bearing
                    });
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
    };
    TrackList = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'track-list',
            //template: "<div>Список</div><ul><li *ngFor='let track of list; let i = index'>{{i}}: {{track.distance}} km<div class='del' (click)='hideTrack(track)'>x</div></li></ul>",
            templateUrl: "./track-list.html",
            styleUrls: ['./track-list.css']
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof track_service_1.TrackService !== 'undefined' && track_service_1.TrackService) === 'function' && _a) || Object, map_service_1.MapService])
    ], TrackList);
    return TrackList;
    var _a;
}());
exports.TrackList = TrackList;
//# sourceMappingURL=track-list.component.js.map