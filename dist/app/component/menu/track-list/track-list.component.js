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
const track_service_1 = require("app/service/track.service");
let TrackList = class TrackList {
    constructor(trackService) {
        this.trackService = trackService;
        this.list = trackService.trackList;
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
    __metadata("design:paramtypes", [typeof (_a = typeof track_service_1.TrackService !== "undefined" && track_service_1.TrackService) === "function" && _a || Object])
], TrackList);
exports.TrackList = TrackList;
var _a;
//# sourceMappingURL=track-list.component.js.map