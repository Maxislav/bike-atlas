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
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var app_component_1 = require("../../app.component");
var common_1 = require('@angular/common');
var private_area_service_1 = require("../../service/private.area.service");
var PrivateArea = (function () {
    function PrivateArea(lh, location, router, ps) {
        this.lh = lh;
        this.location = location;
        this.router = router;
        this.ps = ps;
    }
    PrivateArea.prototype.onClose = function () {
        if (this.lh.is) {
            this.location.back();
        }
        else {
            this.router.navigate(['/auth/map']);
        }
    };
    PrivateArea = __decorate([
        core_1.Component({
            //noinspection TypeScriptUnresolvedVariable
            moduleId: module.id,
            templateUrl: './private-area.html',
            styleUrls: ['./private-area.css']
        }), 
        __metadata('design:paramtypes', [app_component_1.NavigationHistory, common_1.Location, router_1.Router, private_area_service_1.PrivateAreaService])
    ], PrivateArea);
    return PrivateArea;
}());
exports.PrivateArea = PrivateArea;
//# sourceMappingURL=private-area.js.map