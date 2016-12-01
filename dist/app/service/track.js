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
var _Tracks = (function () {
    function _Tracks() {
    }
    return _Tracks;
}());
var Track = (function () {
    function Track() {
        this._trackList = [];
        this.layerIds = [];
    }
    Track.prototype.setMap = function (map) {
        this.map = map;
    };
    Track.prototype.showTrack = function (data) {
        var $this = this;
        var coordinates = [];
        var trackList = this.trackList;
        data.forEach(function (item) {
            coordinates.push([item.lng, item.lat]);
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
                "line-color": "#FF058A",
                "line-width": 8,
                "line-opacity": 0.5
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
            coordinates: coordinates
        };
        trackList.push(tr);
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