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
/**
 * Created by maxislav on 22.11.16.
 */
const core_1 = require("@angular/core");
const menu_track_component_1 = require("./menu-track/menu-track.component");
//import any = jasmine.any;
const menu_service_1 = require("../../service/menu.service");
const track_service_1 = require("../../service/track.service");
const auth_service_1 = require("../../service/auth.service");
const router_1 = require("@angular/router");
const friends_service_1 = require("../../service/friends.service");
const main_user_service_1 = require("../../service/main.user.service");
const toast_component_1 = require("../toast/toast.component");
const map_service_1 = require("../../service/map.service");
const chat_service_1 = require("../../service/chat.service");
const animation_1 = require("../../animation/animation");
let MenuComponent = class MenuComponent {
    constructor(menuService, track, authService, router, friend, userService, mapService, toast, chatService) {
        this.menuService = menuService;
        this.track = track;
        this.authService = authService;
        this.router = router;
        this.friend = friend;
        this.userService = userService;
        this.mapService = mapService;
        this.toast = toast;
        this.chatService = chatService;
        this.isShowMenuAthlete = false;
        this.user = userService.user;
        this.invites = friend.invites;
        this.unViewedIds = chatService.unViewedIds;
    }
    onOpen() {
        this.menuService.menuOpen = !this.menuService.menuOpen;
    }
    onOpenLogin() {
        this.menuService.menuOpenLogin = !this.menuService.menuOpenLogin;
    }
    onOpenAthlete() {
        if (!this.user.name && !this.userService.other.devices.length) {
            this.toast.show({
                type: 'warning',
                text: 'Нет онлайн пользователей'
            });
        }
        else {
            this.isShowMenuAthlete = true;
            //this.menuService.menuAthlete = !this.menuService.menuAthlete;
        }
    }
    onCloseMenuAthlete(e) {
        this.isShowMenuAthlete = e;
    }
    onWeather() {
        if (this.weatherLayer) {
            this.weatherLayer.remove();
        }
        else {
            this.weatherLayer = this.addWeatherLayer();
        }
    }
    addWeatherLayer() {
        const map = this.mapService.map;
        map.addSource('borispol', {
            "type": "image",
            'url': System.baseURL + 'borisbolukbb?date=' + new Date().toISOString(),
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
            remove: () => {
                map.removeLayer('borispol');
                map.removeSource('borispol');
                this.weatherLayer = null;
            }
        };
    }
    removeWeatherLayer() {
    }
    goToProfile() {
        if (this.userService.user && this.userService.user.name) {
            this.router.navigate(['/auth/map/profile']);
        }
    }
    goToFriends() {
        this.router.navigate(['/auth/map/friends']);
    }
};
MenuComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'menu',
        templateUrl: './menu.component.html',
        styleUrls: ['./menu.component.css'],
        providers: [menu_track_component_1.MenuTrackComponent, menu_service_1.MenuService],
        animations: [animation_1.fadeAnimation]
    }),
    __metadata("design:paramtypes", [menu_service_1.MenuService,
        track_service_1.TrackService,
        auth_service_1.AuthService,
        router_1.Router,
        friends_service_1.FriendsService,
        main_user_service_1.UserService,
        map_service_1.MapService,
        toast_component_1.ToastService,
        chat_service_1.ChatService])
], MenuComponent);
exports.MenuComponent = MenuComponent;
//# sourceMappingURL=menu.component.js.map