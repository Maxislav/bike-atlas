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
 * Created by maxislav on 16.08.16.
 */
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var app_component_1 = require('./app.component');
var my_hero_detail_component_1 = require('./my-hero-detail.component');
var app_routing_1 = require('./app.routing');
var heroes_component_1 = require("./heroes.component");
//import {DashboardComponent} from "./dasboard.component";
var transaction_resolve_1 = require("./transaction.resolve");
var auth_component_1 = require("./component/auth-component/auth.component");
var map_component_1 = require("./map.component");
var info_position_component_1 = require("./component/info-position/info-position-component");
var menu_component_1 = require("./component/menu/menu.component");
var local_storage_service_1 = require("./service/local-storage.service");
var menu_track_component_1 = require("./component/menu/menu-track/menu-track.component");
var socket_oi_service_1 = require("./service/socket.oi.service");
var track_service_1 = require("./service/track.service");
var track_list_component_1 = require("./component/menu/track-list/track-list.component");
var menu_login_component_1 = require("./component/menu/menu-login/menu-login.component");
var registration_component_1 = require("./component/registration/registration.component");
var md5_service_1 = require("./service/md5.service");
var toast_component_1 = require("./component/toast/toast.component");
var device_component_1 = require("./component/device/device.component");
var auth_service_1 = require("./service/auth.service");
var device_service_1 = require("./service/device.service");
var log_service_1 = require("./service/log.service");
var marker_service_1 = require("./service/marker.service");
var map_service_1 = require("./service/map.service");
var login_service_1 = require("./service/login.service");
var menu_athlete_component_1 = require("./component/menu/menu-athlete/menu.athlete.component");
var profile_component_1 = require("./component/profile/profile.component");
var journal_component_1 = require("./component/journal-component/journal.component");
var friends_component_1 = require("./component/friends-component/friends-component");
var friends_service_1 = require("./service/friends.service");
var main_user_service_1 = require("./service/main.user.service");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                app_routing_1.routing
            ],
            /**
             * Компоненты
             */
            declarations: [
                //LeafletMapDirective,
                //DashboardComponent,
                registration_component_1.RegistrationComponent,
                info_position_component_1.InfoPositionComponent,
                map_component_1.MapComponent,
                auth_component_1.AuthComponent,
                app_component_1.AppComponent,
                my_hero_detail_component_1.HeroDetailComponent,
                heroes_component_1.HeroesComponent,
                menu_component_1.MenuComponent,
                menu_track_component_1.MenuTrackComponent,
                menu_login_component_1.MenuLoginComponent,
                track_list_component_1.TrackList,
                toast_component_1.ToastComponent,
                device_component_1.DeviceComponent,
                menu_athlete_component_1.MenuAthleteComponent,
                profile_component_1.ProfileComponent,
                journal_component_1.JournalComponent,
                friends_component_1.FriendsComponent
            ],
            bootstrap: [
                app_component_1.AppComponent
            ],
            providers: [
                transaction_resolve_1.TransactionResolver,
                menu_component_1.MenuComponent,
                local_storage_service_1.LocalStorage,
                socket_oi_service_1.Io,
                track_service_1.TrackService,
                md5_service_1.Md5,
                toast_component_1.ToastService,
                auth_service_1.AuthService,
                device_service_1.DeviceService,
                log_service_1.LogService,
                map_service_1.MapService,
                marker_service_1.MarkerService,
                login_service_1.LoginService,
                friends_service_1.FriendsService,
                main_user_service_1.UserService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map