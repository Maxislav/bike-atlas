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
var auth_component_1 = require("./auth.component");
var map_component_1 = require("./map.component");
var info_position_component_1 = require("./component/info-position/info-position-component");
var menu_component_1 = require("./component/menu/menu.component");
var local_storage_service_1 = require("./service/local-storage.service");
var menu_track_component_1 = require("./component/menu/menu-track/menu-track.component");
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
            declarations: [
                //LeafletMapDirective,
                //DashboardComponent,
                info_position_component_1.InfoPositionComponent,
                map_component_1.MapComponent,
                auth_component_1.AuthComponent,
                app_component_1.AppComponent,
                my_hero_detail_component_1.HeroDetailComponent,
                heroes_component_1.HeroesComponent,
                menu_component_1.MenuComponent,
                menu_track_component_1.MenuTrackComponent
            ],
            bootstrap: [
                app_component_1.AppComponent
            ],
            providers: [transaction_resolve_1.TransactionResolver, menu_component_1.MenuComponent, local_storage_service_1.LocalStorage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map