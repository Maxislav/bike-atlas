/**
 * Created by maxislav on 30.11.16.
 */
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
var R = require('@ramda/ramda.min.js');
var util_1 = require('./util');
var socket_oi_service_1 = require("./socket.oi.service");
var map_service_1 = require("./map.service");
var track_var_1 = require("./track.var");
var F = parseFloat;
var I = parseInt;
var TrackService = (function () {
    function TrackService(io, mapService) {
        var _this = this;
        this.io = io;
        this.mapService = mapService;
        this._trackList = [];
        this.layerIds = [];
        this._trackList = [];
        this.util = new util_1.Util();
        var socket = io.socket;
        socket.on('file', function (d) {
            var xmlStr = String.fromCharCode.apply(null, new Uint8Array(d));
            _this.showGpxTrack(xmlStr);
        });
    }
    TrackService.prototype.showGpxTrack = function (xmlStr) {
        var track = [];
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xmlStr, "text/xml");
        var forEach = Array.prototype.forEach;
        forEach.call(xmlDoc.getElementsByTagName('trkpt'), function (item) {
            if (item.getAttribute('lon')) {
                var point = new track_var_1.Point(F(item.getAttribute('lon')), F(item.getAttribute('lat')));
                track.push(point);
            }
        });
        this.showTrack(track);
    };
    TrackService.prototype.setMap = function (map) {
        this.map = map;
    };
    TrackService.prototype.showTrack = function (data) {
        var $this = this;
        var coordinates = [];
        var points = [];
        var trackList = this.trackList;
        var color = this._getColor();
        var map = this.mapService.map;
        data.forEach(function (_a) {
            var lng = _a.lng, lat = _a.lat;
            coordinates.push([lng, lat]);
            points.push(new track_var_1.Point(lng, lat));
        });
        var layerId = this.getLayerId('track-') + '';
        map.addSource(layerId, {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinates
                }
            }
        });
        map.addLayer({
            "id": layerId,
            "type": "line",
            "source": layerId,
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": color,
                "line-width": 8,
                "line-opacity": 0.8
            }
        });
        var srcPoints = this.addSrcPoints(data);
        var tr = {
            hide: function () {
                map.removeLayer(layerId);
                map.removeSource(layerId);
                var index = R.findIndex(R.propEq('id', layerId))(trackList);
                trackList.splice(index, 1);
                console.log('delete track index', index);
                srcPoints.remove();
            },
            show: function () {
                return $this.showTrack(data);
            },
            id: layerId,
            coordinates: coordinates,
            points: points,
            color: color,
            distance: 0
        };
        tr.distance = this.util.distance(tr);
        this.util.bearing(tr.points);
        trackList.push(tr);
        console.log(tr);
        return tr;
    };
    TrackService.prototype.addSrcPoints = function (points) {
        var layers = [];
        var map = this.mapService.map;
        var layerId = this.getLayerId('cluster-');
        var data = {
            "type": "FeatureCollection",
            "features": (function () {
                var features = [];
                points.forEach(function (item) {
                    var f = {
                        properties: {
                            color: "Green",
                            point: item
                        },
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": item
                        }
                    };
                    features.push(f);
                });
                return features;
            })()
        };
        map.addSource(layerId, {
            type: "geojson",
            data: data
        });
        map.addLayer({
            id: layerId,
            type: "circle",
            "paint": {
                "circle-color": {
                    "property": "color",
                    "stops": [
                        ["Red", "#f00"],
                        ["Green", "#0f0"],
                        ["Blue", "#00f"]
                    ],
                    "type": "categorical"
                },
                "circle-radius": 8
            },
            layout: {},
            source: layerId
        });
        map.on('click', function (e) {
            var features = map.queryRenderedFeatures(e.point, {
                layers: [layerId],
            });
            console.log(features);
        });
        return {
            remove: function () {
                map.removeLayer(layerId);
            },
            update: function (points) {
                var data = {
                    "type": "FeatureCollection",
                    "features": (function () {
                        var features = [];
                        points.forEach(function (item) {
                            var f = {
                                properties: {
                                    color: "Green",
                                    point: item
                                },
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": item
                                }
                            };
                            features.push(f);
                        });
                        return features;
                    })()
                };
                map.getSource(layerId).setdata(data);
            }
        };
    };
    TrackService.prototype.createPopupEdit = function (point) {
        var map = this.mapService.map;
        var mapboxgl = this.mapService.mapboxgl;
        var popup = new mapboxgl.Popup({ closeOnClick: false, offset: [0, -15], closeButton: false })
            .setLngLat(point)
            .setHTML('<div>' + 'Удалить' + '</div>')
            .addTo(map);
    };
    TrackService.prototype.marker = function (point) {
        var map = this.mapService.map;
        var mapboxgl = this.mapService.mapboxgl;
        var icoContainer = document.createElement('div');
        icoContainer.classList.add("track-icon");
        var icoEl = document.createElement('div');
        icoContainer.appendChild(icoEl);
        var iconMarker = new mapboxgl.Marker(icoContainer, { offset: [-10, -10] })
            .setLngLat([point.lng, point.lat])
            .addTo(map);
        var marker = {
            lng: point.lng,
            lat: point.lat,
            bearing: point.bearing,
            _mapBearing: map.getBearing(),
            rotate: function () {
                var angle = this.bearing - this._mapBearing;
                icoEl.style.transform = "rotate(" + I(angle + '') + "deg)";
            },
            update: function (point) {
                for (var opt in point) {
                    this[opt] = point[opt];
                }
                if (point.bearing) {
                    this.rotate();
                }
                iconMarker.setLngLat([this.lng, this.lat]);
            },
            remove: function () {
                iconMarker.remove();
                map.off('move', rotate);
            }
        };
        var rotate = function () {
            var mapBearing = map.getBearing();
            if (marker._mapBearing != mapBearing) {
                marker._mapBearing = mapBearing;
                marker.rotate();
            }
        };
        map.on('move', rotate);
        return marker;
    };
    TrackService.prototype.getLayerId = function (prefix) {
        prefix = prefix || '';
        var min = 0, max = 10000;
        var rand = prefix + Math.round(min + Math.random() * (max - min)).toLocaleString();
        if (-1 < this.layerIds.indexOf(rand)) {
            return this.getLayerId(prefix);
        }
        else {
            this.layerIds.push(rand);
            return rand;
        }
    };
    TrackService.prototype.getRandom = function (min, max, int) {
        var rand = min + Math.random() * (max - min);
        if (int) {
            rand = Math.round(rand) + '';
        }
        return rand;
    };
    TrackService.prototype._getColor = function () {
        var _this = this;
        var I = parseInt;
        var colors = [];
        var c = ['0', '0', '0'];
        c.forEach(function (r, i) {
            r = I(_this.getRandom(100, 200, true)).toString(16);
            if (r.length < 2) {
                c[i] = '0' + r;
            }
            else {
                c[i] = r;
            }
        });
        return '#' + c.join('');
    };
    Object.defineProperty(TrackService.prototype, "map", {
        get: function () {
            return this._map;
        },
        set: function (value) {
            //console.log(value)
            this._map = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TrackService.prototype, "trackList", {
        get: function () {
            return this._trackList;
        },
        set: function (value) {
            this._trackList = value;
        },
        enumerable: true,
        configurable: true
    });
    TrackService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [socket_oi_service_1.Io, map_service_1.MapService])
    ], TrackService);
    return TrackService;
}());
exports.TrackService = TrackService;
//# sourceMappingURL=track.service.js.map