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
var Track = (function () {
    function Track() {
        this._trackList = [];
        this.layerIds = [];
        this._trackList = [];
        this.util = new util_1.Util();
    }
    Track.prototype.setMap = function (map) {
        this.map = map;
    };
    Track.prototype.showTrack = function (data) {
        var $this = this;
        var coordinates = [];
        var points = [];
        var trackList = this.trackList;
        var color = this._getColor();
        console.log(color);
        data.forEach(function (_a) {
            var lng = _a.lng, lat = _a.lat;
            coordinates.push([lng, lat]);
            points.push({ lng: lng, lat: lat });
        });
        var layerId = this.getRandom(0, 5000000, false) + '';
        this.map.addSource(layerId, {
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
        this.map.addLayer({
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
        var tr = {
            hide: function () {
                $this.map.removeLayer(layerId);
                $this.map.removeSource(layerId);
                var index = R.findIndex(R.propEq('id', layerId))(trackList);
                trackList.splice(index, 1);
                console.log('delete track index', index);
            },
            show: function () {
                return $this.showTrack(data);
            },
            id: layerId,
            coordinates: coordinates,
            points: points,
            color: color
        };
        tr.distance = this.util.distance(tr);
        this.util.bearing(tr.points);
        trackList.push(tr);
        console.log(tr);
        return tr;
    };
    Track.prototype.getRandom = function (min, max, int) {
        var rand = min + Math.random() * (max - min);
        if (int) {
            rand = Math.round(rand) + '';
        }
        if (-1 < this.layerIds.indexOf(rand)) {
            return this.getRandom(min, max, int);
        }
        else {
            return rand;
        }
    };
    Track.prototype._getColor = function () {
        var _this = this;
        var I = parseInt;
        var c = ['0', '0', '0'];
        c.forEach(function (r, i) {
            r = I(_this.getRandom(100, 255, true)).toString(16);
            if (r.length < 2) {
                c[i] = '0' + r;
            }
            else {
                c[i] = r;
            }
        });
        return '#' + c.join('');
    };
    Object.defineProperty(Track.prototype, "map", {
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
    Object.defineProperty(Track.prototype, "trackList", {
        get: function () {
            return this._trackList;
        },
        set: function (value) {
            this._trackList = value;
        },
        enumerable: true,
        configurable: true
    });
    Track = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], Track);
    return Track;
}());
exports.Track = Track;
//# sourceMappingURL=track.js.map