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
var TrackList = (function () {
    function TrackList(track) {
        this.track = track;
        this.util = new util_1.Util();
        this.list = track.trackList;
        //this.permitMovie = true
    }
    TrackList.prototype.hideTrack = function (track) {
        track.hide();
        if (this.stop) {
            this.stop();
        }
    };
    TrackList.prototype.onGo = function (_tr) {
        var $this = this;
        var map = this.track.map;
        var points = this.fillTrack(_tr.points);
        var marker = this.track.showSpriteMarker(points[0]);
        var timeout;
        var i = 0;
        flyTo();
        function flyTo() {
            map.setCenter([points[i].lng, points[i].lat]);
            marker.setCenter(points[i], points[i].bearing);
            if (i < points.length - 2) {
                timeout = setTimeout(function () {
                    i++;
                    flyTo();
                }, 10);
            }
            else {
                stop();
            }
        }
        function stop() {
            $this.stop();
        }
        this.stop = function () {
            clearTimeout(timeout);
            marker.hide();
        };
    };
    TrackList.prototype.fillTrack = function (points) {
        var _this = this;
        var fillTrack = [];
        var F = parseFloat;
        points.forEach(function (point, i) {
            if (i < points.length - 1) {
                var distBetween = parseInt(_this.util.distanceBetween2(point, points[i + 1]));
                var arr = fill(point, points[i + 1], distBetween / 2);
                fillTrack = fillTrack.concat(arr);
            }
        });
        //console.log(fillTrack)
        function fill(point1, point2, steps) {
            var arr = [];
            var lngStep = (point2.lng - point1.lng) / steps;
            var latStep = (point2.lat - point1.lat) / steps;
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
        __metadata('design:paramtypes', [(typeof (_a = typeof track_service_1.TrackService !== 'undefined' && track_service_1.TrackService) === 'function' && _a) || Object])
    ], TrackList);
    return TrackList;
    var _a;
}());
exports.TrackList = TrackList;
//# sourceMappingURL=track-list.component.js.map