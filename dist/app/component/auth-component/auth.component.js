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
 * Created by maxislav on 10.10.16.
 */
const core_1 = require("@angular/core");
const mercator_service_1 = require("../../service/mercator.service");
const position_size_service_1 = require("../../service/position-size.service");
const info_position_component_1 = require("../info-position/info-position-component");
const menu_component_1 = require("../menu/menu.component");
const auth_service_1 = require("../../service/auth.service");
let AuthComponent = class AuthComponent {
    constructor(as) {
        this.as = as;
        this.as = as;
    }
};
AuthComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'auth.component.html',
        //providers: [Mercator, MapService, InfoPositionComponent, PositionSize, MenuComponent],
        providers: [mercator_service_1.Mercator, info_position_component_1.InfoPositionComponent, position_size_service_1.PositionSize, menu_component_1.MenuComponent],
        styleUrls: [
            'auth.component.css',
        ]
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthComponent);
exports.AuthComponent = AuthComponent;
//# sourceMappingURL=auth.component.js.map