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
/**
 * Created by maxislav on 20.10.16.
 */
var core_1 = require('@angular/core');
var local_storage_service_1 = require('../service/local-storage.service');
var socket_oi_service_1 = require("./socket.oi.service");
var track_1 = require("./track");
var MapService = (function () {
    // public ls: LocalStorage
    //private ref: ApplicationRef
    function MapService(ref, ls, io, trackService) {
        this.ref = ref;
        this.ls = ls;
        this.io = io;
        this.trackService = trackService;
        this.events = {
            load: []
        };
        var socket = io.socket;
        socket.on('file', function (d) {
            var track = [];
            var xml = String.fromCharCode.apply(null, new Uint8Array(d));
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xml, "text/xml");
            var forEach = Array.prototype.forEach;
            forEach.call(xmlDoc.getElementsByTagName('trkpt'), function (item) {
                //console.log(item.getAttribute('lat'), item.getAttribute('lon'))
                track.push({
                    lng: item.getAttribute('lon'),
                    lat: item.getAttribute('lat')
                });
            });
            var at = trackService.showTrack(track);
            setTimeout(function () {
                at.hide();
            }, 1000);
        });
    }
    MapService.prototype.setMap = function (map) {
        var _this = this;
        this.map = map;
        this.trackService.setMap(map);
        map.on('load', function () {
            _this.pitch = map.getPitch().toFixed(0);
            _this.bearing = map.getBearing().toFixed(1);
            _this.zoom = map.getZoom().toFixed(1);
            var LngLat = map.getCenter();
            _this.lngMap = LngLat.lng.toFixed(4);
            _this.latMap = LngLat.lat.toFixed(4);
            _this.ref.tick();
        });
        map.on('mousemove', function (e) {
            _this.lat = e.lngLat.lat.toFixed(4);
            _this.lng = e.lngLat.lng.toFixed(4);
        });
        map.on('move', function (e) {
            //console.log()
            _this.pitch = map.getPitch().toFixed(0);
            _this.bearing = map.getBearing().toFixed(1);
            _this.zoom = map.getZoom().toFixed(1);
            var LngLat = map.getCenter();
            _this.lngMap = LngLat.lng.toFixed(4);
            _this.latMap = LngLat.lat.toFixed(4);
        });
        map.on('moveend', function () {
            var LngLat = map.getCenter();
            var opt = {
                lng: LngLat.lng,
                lat: LngLat.lat,
                zoom: map.getZoom()
            };
            _this.ls.mapCenter = opt;
        });
    };
    MapService.prototype.registerEvent = function (name, f) {
        //console.log(this.events)
        // debugger
        this.events[name] = this.events[name] || [];
        this.events[name].push(f);
    };
    MapService.prototype.registerChanges = function (foo) {
        this.foo = foo;
    };
    MapService.prototype.onTrack = function (arr) {
    };
    MapService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.ApplicationRef, local_storage_service_1.LocalStorage, socket_oi_service_1.Io, track_1.Track])
    ], MapService);
    return MapService;
}());
exports.MapService = MapService;
//# sourceMappingURL=map.service.js.map