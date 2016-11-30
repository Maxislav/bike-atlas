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
 * Created by maxislav on 30.11.16.
 */
var menu_service_1 = require('app/service/menu.service');
var core_1 = require("@angular/core");
var LoadTrack = (function () {
    function LoadTrack(ms) {
        this.ms = ms;
    }
    LoadTrack.prototype.onSelect = function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.parentElement.getElementsByTagName('input')[1].click();
    };
    LoadTrack = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'menu-track-load',
            templateUrl: './menu-load-track.html',
            //styles: [':host{position: absolute; z-index: 2}']
            styleUrls: ['./menu-load-track.css']
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof menu_service_1.MenuService !== 'undefined' && menu_service_1.MenuService) === 'function' && _a) || Object])
    ], LoadTrack);
    return LoadTrack;
    var _a;
}());
exports.LoadTrack = LoadTrack;
