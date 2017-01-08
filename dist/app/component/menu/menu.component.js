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
var track_service_1 = require("../../service/track.service");
var track_list_component_1 = require("./track-list/track-list.component");
var auth_service_1 = require("../../service/auth.service");
var router_1 = require("@angular/router");
var friends_service_1 = require("../../service/friends.service");
var main_user_service_1 = require("../../service/main.user.service");
var MenuComponent = (function () {
    function MenuComponent(ms, track, as, router, friend, user) {
        this.ms = ms;
        this.as = as;
        this.router = router;
        this.friend = friend;
        this.user = user;
        this.user = user;
        this.invites = friend.invites;
        this.trackList = track.trackList;
    }
    MenuComponent.prototype.onOpen = function () {
        this.ms.menuOpen = !this.ms.menuOpen;
    };
    MenuComponent.prototype.onOpenLogin = function () {
        this.ms.menuOpenLogin = !this.ms.menuOpenLogin;
    };
    MenuComponent.prototype.onOpenAthlete = function () {
        this.ms.menuAthlete = !this.ms.menuAthlete;
    };
    MenuComponent.prototype.goToProfile = function () {
        if (this.as.userName) {
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
        __metadata('design:paramtypes', [(typeof (_a = typeof menu_service_1.MenuService !== 'undefined' && menu_service_1.MenuService) === 'function' && _a) || Object, track_service_1.TrackService, auth_service_1.AuthService, router_1.Router, friends_service_1.FriendsService, main_user_service_1.UserService])
    ], MenuComponent);
    return MenuComponent;
    var _a;
}());
exports.MenuComponent = MenuComponent;
//# sourceMappingURL=menu.component.js.map