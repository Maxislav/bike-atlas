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
const core_1 = require('@angular/core');
const platform_browser_1 = require('@angular/platform-browser');
const forms_1 = require('@angular/forms');
const app_component_1 = require('./app.component');
const app_routing_1 = require('./app.routing');
const heroes_component_1 = require("./heroes.component");
const transaction_resolve_1 = require("./transaction.resolve");
const auth_component_1 = require("./component/auth-component/auth.component");
const map_component_1 = require("./map.component");
const info_position_component_1 = require("./component/info-position/info-position-component");
const menu_component_1 = require("./component/menu/menu.component");
const local_storage_service_1 = require("./service/local-storage.service");
const menu_track_component_1 = require("./component/menu/menu-track/menu-track.component");
const socket_oi_service_1 = require("./service/socket.oi.service");
const track_service_1 = require("./service/track.service");
const track_list_component_1 = require("./component/menu/track-list/track-list.component");
const menu_login_component_1 = require("./component/menu/menu-login/menu-login.component");
const registration_component_1 = require("./component/registration/registration.component");
const md5_service_1 = require("./service/md5.service");
const toast_component_1 = require("./component/toast/toast.component");
const device_component_1 = require("./component/device/device.component");
const auth_service_1 = require("./service/auth.service");
const device_service_1 = require("./service/device.service");
const log_service_1 = require("./service/log.service");
const marker_service_1 = require("./service/marker.service");
const map_service_1 = require("./service/map.service");
const login_service_1 = require("./service/login.service");
const menu_athlete_component_1 = require("./component/menu/menu-athlete/menu.athlete.component");
const profile_component_1 = require("./component/profile/profile.component");
const journal_component_1 = require("./component/journal-component/journal.component");
const friends_component_1 = require("./component/friends-component/friends-component");
const friends_service_1 = require("./service/friends.service");
const main_user_service_1 = require("./service/main.user.service");
const timer_service_1 = require("./service/timer.service");
const private_area_1 = require("./component/private-area/private-area");
const mapbox_gl_directive_1 = require("./directive/mapbox-gl.directive");
const private_area_service_1 = require("./service/private.area.service");
const no_found_component_1 = require("./no-found.component");
const mapbox_gl_directive_2 = require("./directive/mapbox-gl.directive");
const device_component_2 = require("./component/device/device.component");
let AppModule = class AppModule {
};
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
            friends_component_1.UsersContainer,
            registration_component_1.RegistrationComponent,
            info_position_component_1.InfoPositionComponent,
            map_component_1.MapComponent,
            auth_component_1.AuthComponent,
            app_component_1.AppComponent,
            heroes_component_1.HeroesComponent,
            device_component_2.HelpContainer,
            menu_component_1.MenuComponent,
            menu_track_component_1.MenuTrackComponent,
            menu_login_component_1.MenuLoginComponent,
            mapbox_gl_directive_2.MapboxGlDirective,
            track_list_component_1.TrackList,
            toast_component_1.ToastComponent,
            device_component_1.DeviceComponent,
            menu_athlete_component_1.MenuAthleteComponent,
            profile_component_1.ProfileComponent,
            journal_component_1.JournalComponent,
            friends_component_1.FriendsComponent,
            private_area_1.PrivateArea,
            no_found_component_1.NoFoundComponent
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
            main_user_service_1.UserService,
            timer_service_1.TimerService,
            mapbox_gl_directive_1.MapResolver,
            private_area_service_1.PrivateAreaService
        ],
        bootstrap: [
            app_component_1.AppComponent
        ]
    }), 
    __metadata('design:paramtypes', [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map