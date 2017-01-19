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
//import any = jasmine.any;
var menu_service_1 = require("app/service/menu.service");
var track_service_1 = require("../../service/track.service");
var track_list_component_1 = require("./track-list/track-list.component");
var auth_service_1 = require("../../service/auth.service");
var router_1 = require("@angular/router");
var friends_service_1 = require("../../service/friends.service");
var main_user_service_1 = require("../../service/main.user.service");
var toast_component_1 = require("../toast/toast.component");
var map_service_1 = require("../../service/map.service");
var MenuComponent = (function () {
    function MenuComponent(menuService, track, authService, router, friend, userService, mapService, toast) {
        this.menuService = menuService;
        this.track = track;
        this.authService = authService;
        this.router = router;
        this.friend = friend;
        this.userService = userService;
        this.mapService = mapService;
        this.toast = toast;
        this.user = userService.user;
        this.invites = friend.invites;
        this.trackList = track.trackList;
    }
    MenuComponent.prototype.onOpen = function () {
        this.menuService.menuOpen = !this.menuService.menuOpen;
    };
    MenuComponent.prototype.onOpenLogin = function () {
        this.menuService.menuOpenLogin = !this.menuService.menuOpenLogin;
    };
    MenuComponent.prototype.onOpenAthlete = function () {
        if (!this.user.name && !this.userService.other.devices.length) {
            this.toast.show({
                type: 'warning',
                text: 'Нет онлайн пользователей'
            });
        }
        else {
            this.menuService.menuAthlete = !this.menuService.menuAthlete;
        }
    };
    MenuComponent.prototype.onWeather = function () {
        if (this.weatherLayer) {
            this.weatherLayer.remove();
        }
        else {
            this.weatherLayer = this.addWeatherLayer();
        }
    };
    MenuComponent.prototype.addWeatherLayer = function () {
        var _this = this;
        var map = this.mapService.map;
        map.addSource('borispol', {
            "type": "image",
            'url': 'borisbolukbb?date=' + new Date().toISOString(),
            "coordinates": [
                [27.9, 52.14],
                [33.89, 52.14],
                [33.89, 48.35],
                [27.9, 48.35]
            ]
        });
        map.addLayer({
            id: 'borispol',
            source: 'borispol',
            "type": "raster",
            "paint": { "raster-opacity": 0.7 }
        });
        return {
            remove: function () {
                map.removeLayer('borispol');
                map.removeSource('borispol');
                _this.weatherLayer = null;
            }
        };
    };
    MenuComponent.prototype.removeWeatherLayer = function () {
    };
    MenuComponent.prototype.goToProfile = function () {
        if (this.authService.userName) {
            this.router.navigate(['/auth/map/profile']);
        }
    };
    MenuComponent.prototype.goToFriends = function () {
        this.router.navigate(['/auth/map/friends']);
    };
    MenuComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'menu',
            templateUrl: './menu.component.html',
            styleUrls: ['./menu.component.css'],
            providers: [menu_track_component_1.MenuTrackComponent, menu_service_1.MenuService, track_list_component_1.TrackList]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof menu_service_1.MenuService !== 'undefined' && menu_service_1.MenuService) === 'function' && _a) || Object, track_service_1.TrackService, auth_service_1.AuthService, router_1.Router, friends_service_1.FriendsService, main_user_service_1.UserService, map_service_1.MapService, toast_component_1.ToastService])
    ], MenuComponent);
    return MenuComponent;
    var _a;
}());
exports.MenuComponent = MenuComponent;
//# sourceMappingURL=menu.component.js.map