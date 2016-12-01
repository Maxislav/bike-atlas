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
var track_1 = require("app/service/track");
var TrackList = (function () {
    function TrackList(track) {
        this.track = track;
        this.list = track.trackList;
    }
    TrackList.prototype.hideTrack = function (track) {
        track.hide();
    };
    TrackList.prototype.onGo = function (tr) {
        var map = this.track.map;
        var i = 0;
        // map.setPitch(60);
        //map.rotateTo(tr.piints[i].bearing,{} )
        flyTo(tr.coordinates[i]);
        /* map.easeTo({
             center: tr.coordinates[0],
             pitch: 60,
             bearing: tr.points[i].bearing,
             easing: function (t) {
                 console.log(t)
                 return t;
             }
         })
 */
        //flyTo(tr.coordinates[0])
        function flyTo(center) {
            map.easeTo({
                center: tr.coordinates[i],
                pitch: 60,
                zoom: 16,
                duration: 100,
                animate: true,
                //bearing: tr.points[i].bearing,
                easing: function (t) {
                    //console.log(t)
                    if (t == 1) {
                        setTimeout(function () {
                            map.rotateTo(tr.points[i].bearing, { duration: 20, easing: function (t) {
                                    if (t == 1 && i < tr.points.length - 1) {
                                        setTimeout(function () {
                                            i++;
                                            flyTo(tr.coordinates[i]);
                                        }, 1);
                                    }
                                    return t;
                                } });
                        }, 1);
                    }
                    return t;
                }
            });
            //tr.points[i].bearing && map.setBearing(tr.points[i].bearing)
            if (i < tr.coordinates.length) {
            }
        }
    };
    TrackList = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'track-list',
            //template: "<div>Список</div><ul><li *ngFor='let track of list; let i = index'>{{i}}: {{track.distance}} km<div class='del' (click)='hideTrack(track)'>x</div></li></ul>",
            templateUrl: "./track-list.html",
            styleUrls: ['./track-list.css']
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof track_1.Track !== 'undefined' && track_1.Track) === 'function' && _a) || Object])
    ], TrackList);
    return TrackList;
    var _a;
}());
exports.TrackList = TrackList;
//# sourceMappingURL=track-list.component.js.map