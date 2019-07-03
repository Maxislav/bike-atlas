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
 * Created by maxislav on 16.08.16.
 */
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const forms_1 = require("@angular/forms");
const animations_1 = require("@angular/platform-browser/animations");
const app_component_1 = require("./app.component");
const app_routing_1 = require("./app.routing");
const auth_component_1 = require("./component/auth-component/auth.component");
const map_component_1 = require("./map.component");
const info_position_component_1 = require("./component/info-position/info-position-component");
const menu_component_1 = require("./component/menu/menu.component");
const local_storage_service_1 = require("./service/local-storage.service");
const menu_track_component_1 = require("./component/menu/menu-track/menu-track.component");
const socket_oi_service_1 = require("./service/socket.oi.service");
const track_service_1 = require("./service/track.service");
const track_list_component_1 = require("./component/track-list/track-list.component");
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
const one_track_component_1 = require("./component/journal-component/one-track.component/one-track.component");
const journal_service_1 = require("./service/journal.service");
const all_user_component_1 = require("./component/all-user/all-user.component");
const chat_component_1 = require("./component/chat-component/chat.component");
const chat_room_component_1 = require("./component/chat-component/chat-room/chat-room.component");
const chat_service_1 = require("./service/chat.service");
const one_item_track_component_1 = require("./component/track-list/one-item-track-component/one-item-track.component");
const strava_component_1 = require("./component/strava-component/strava-component");
const strava_auth_component_1 = require("./component/strava-component/strava-auth-component");
const strava_service_1 = require("./service/strava.service");
const ng2_translate_1 = require("ng2-translate");
const http_1 = require("@angular/http");
const core_2 = require("@angular/core");
const menu_athlete_item_component_1 = require("./component/menu/menu-athlete/menu.athlete.item.component/menu.athlete.item.component");
const my_marker_list_component_1 = require("./component/my-marker-list-component/my-marker-list-component");
const menu_service_1 = require("./service/menu.service");
const my_marker_service_1 = require("./service/my-marker.service");
const my_input_popup_component_1 = require("./component/my-marker-list-component/my-input-popup-component/my-input-popup-component");
const shared_module_1 = require("app/shared-module/shared.module");
const gtgbc_component_1 = require("./component/gtgbc/gtgbc.component");
const gtgbc_service_1 = require("./api/gtgbc.service");
let JJ = class JJ {
};
JJ = __decorate([
    core_2.Component({
        //noinspection TypeScriptUnresolvedVariable
        template: '<div></div>',
    })
], JJ);
exports.JJ = JJ;
function createTranslateLoader(http) {
    return new ng2_translate_1.TranslateStaticLoader(http, System.baseURL + '/langs', '.json');
}
exports.createTranslateLoader = createTranslateLoader;
let AppModule = class AppModule {
    constructor(translate) {
        this.translate = translate;
        const userLang = navigator.language || navigator.userLanguage;
        const lang = userLang.match(/^\D{2}/)[0];
        switch (lang) {
            case 'ru':
                translate.setDefaultLang('ru');
                break;
            case 'en':
            default:
                translate.setDefaultLang('en');
        }
    }
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            app_routing_1.MyRouterModule,
            animations_1.BrowserAnimationsModule,
            ng2_translate_1.TranslateModule.forRoot({
                provide: ng2_translate_1.TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [http_1.Http]
            }),
            shared_module_1.SharedModule
        ],
        /**
         * Компоненты
         */
        declarations: [
            JJ,
            my_input_popup_component_1.MyInputPopupComponent,
            my_marker_list_component_1.MyMarkerListComponent,
            menu_athlete_item_component_1.MenuAthleteItemComponent,
            strava_auth_component_1.StravaAuthComponent,
            strava_component_1.StravaComponent,
            one_item_track_component_1.OneItemTrackComponent,
            chat_room_component_1.ChatRoomComponent,
            chat_component_1.ChatComponent,
            all_user_component_1.AllUserComponent,
            one_track_component_1.OneTrack,
            friends_component_1.UsersContainer,
            registration_component_1.RegistrationComponent,
            info_position_component_1.InfoPositionComponent,
            map_component_1.MapComponent,
            auth_component_1.AuthComponent,
            app_component_1.AppComponent,
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
            no_found_component_1.NoFoundComponent,
            gtgbc_component_1.GtgbcComponent
        ],
        /** Сервисы */
        providers: [
            //ConnectionBackend,
            ng2_translate_1.TranslateService,
            strava_service_1.StravaService,
            chat_service_1.ChatService,
            journal_service_1.JournalService,
            journal_component_1.LeafletResolver,
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
            private_area_service_1.PrivateAreaService,
            app_component_1.NavigationHistory,
            menu_service_1.MenuService,
            my_marker_service_1.MyMarkerService,
            gtgbc_service_1.GtgbcService
        ],
        entryComponents: [
            my_input_popup_component_1.MyInputPopupComponent
        ],
        bootstrap: [
            app_component_1.AppComponent
        ]
    }),
    __metadata("design:paramtypes", [ng2_translate_1.TranslateService])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map