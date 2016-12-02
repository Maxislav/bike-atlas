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
 * Created by maxislav on 22.11.16.
 */
var core_1 = require('@angular/core');
var menu_track_component_1 = require('./menu-track/menu-track.component');
var menu_service_1 = require("app/service/menu.service");
var load_1 = require("./menu-track/load/load");
var track_1 = require("../../service/track");
var track_list_component_1 = require("./track-list/track-list.component");
var MenuComponent = (function () {
    function MenuComponent(ms, track) {
        this.ms = ms;
        this.trackList = track.trackList;
        //this.menuOpen = ms.menuOpen
    }
    Object.defineProperty(MenuComponent.prototype, "menuOpenLogin", {
        get: function () {
            return this._menuOpenLogin;
        },
        set: function (value) {
            this._menuOpenLogin = value;
        },
        enumerable: true,
        configurable: true
    });
    MenuComponent.prototype.onOpen = function () {
        var click = onclick.bind(this);
        this.ms.menuOpen = !this.ms.menuOpen;
        if (this.ms.menuOpen) {
            setTimeout(function () {
                document.body.addEventListener('click', click);
            }, 100);
        }
        else {
            document.body.removeEventListener('click', click);
        }
        function onclick(e) {
            document.body.removeEventListener('click', click);
            this.ms.menuOpen = false;
        }
    };
    MenuComponent.prototype.onOpenLogin = function () {
        var click = onclick.bind(this);
        this.ms.menuOpenLogin = !this.ms.menuOpenLogin;
        if (this.ms.menuOpenLogin) {
            setTimeout(function () {
                document.body.addEventListener('click', click);
            }, 100);
        }
        else {
            document.body.removeEventListener('click', click);
        }
        function onclick(e) {
            document.body.removeEventListener('click', click);
            this.ms.menuOpenLogin = false;
        }
    };
    MenuComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'menu',
            templateUrl: './menu.component.html',
            styleUrls: ['./menu.component.css'],
            providers: [menu_track_component_1.MenuTrackComponent, menu_service_1.MenuService, load_1.LoadTrack, track_list_component_1.TrackList]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof menu_service_1.MenuService !== 'undefined' && menu_service_1.MenuService) === 'function' && _a) || Object, track_1.Track])
    ], MenuComponent);
    return MenuComponent;
    var _a;
}());
exports.MenuComponent = MenuComponent;
//# sourceMappingURL=menu.component.js.map