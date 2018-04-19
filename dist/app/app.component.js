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
const router_1 = require("@angular/router");
const menu_service_1 = require("./service/menu.service");
const track_service_1 = require("./service/track.service");
let NavigationHistory = class NavigationHistory {
    constructor() {
        this.history = [];
    }
    get is() {
        return 1 < this.history.length;
    }
};
NavigationHistory = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], NavigationHistory);
exports.NavigationHistory = NavigationHistory;
let AppComponent = class AppComponent {
    constructor(router, nh, menuService, track) {
        this.router = router;
        this.menuService = menuService;
        this.track = track;
        this.title = 'Tour of Heroes';
        this.router.events.subscribe((e) => {
            if (e instanceof router_1.NavigationEnd) {
                nh.history.push(e.url);
            }
        });
        this.trackList = track.trackList;
    }
};
AppComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-app',
        templateUrl: 'app.component.html',
        providers: [NavigationHistory, menu_service_1.MenuService, track_service_1.TrackService],
        styleUrls: [
            'css/app.component.css',
        ],
    }),
    __metadata("design:paramtypes", [router_1.Router, NavigationHistory, menu_service_1.MenuService, track_service_1.TrackService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map