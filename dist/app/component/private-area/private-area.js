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
var distance_1 = require("../../service/distance");
var PrivateArea = (function () {
    function PrivateArea(lh, location, router, distance, areaService) {
        var _this = this;
        this.lh = lh;
        this.location = location;
        this.router = router;
        this.distance = distance;
        this.areaService = areaService;
        this.clickCount = 0;
        this.areaService.onLoadMap
            .then(function (map) {
            _this.map = map;
        });
    }
    PrivateArea.prototype.onDrawArea = function () {
        var _this = this;
        this.clickCount++;
        var move = function (e) {
            //console.log(e.lngLat)
            var dist = _this.distance.distance([
                _this.myArea.lng,
                _this.myArea.lat,
            ], [
                e.lngLat.lng,
                e.lngLat.lat
            ]);
            _this.myArea.update([_this.myArea.lng, _this.myArea.lat], dist);
        };
        var click = function (e) {
            if (_this.clickCount == 1) {
                if (_this.myArea) {
                    _this.myArea.remove();
                }
                _this.myArea = _this.areaService.createArea([e.lngLat.lng, e.lngLat.lat]);
                _this.map.on('mousemove', move);
                _this.clickCount++;
            }
            else {
                console.log('dsd');
                _this.map.off('mousemove', move);
                _this.clickCount = 1;
            }
        };
        if (this.clickCount == 1) {
            this.areaService.onLoadMap
                .then(function (map) {
                map.on('click', click);
            });
        }
    };
    PrivateArea.prototype.onClose = function () {
        if (this.lh.is) {
            this.location.back();
        }
        else {
            this.router.navigate(['/auth/map']);
        }
    };
    PrivateArea.prototype.ngOnDestroy = function () {
    };
    PrivateArea = __decorate([
        core_1.Component({
            //noinspection TypeScriptUnresolvedVariable
            moduleId: module.id,
            templateUrl: './private-area.html',
            providers: [distance_1.Distance],
            styleUrls: ['./private-area.css']
        }), 
        __metadata('design:paramtypes', [app_component_1.NavigationHistory, common_1.Location, router_1.Router, distance_1.Distance, private_area_service_1.PrivateAreaService])
    ], PrivateArea);
    return PrivateArea;
}());
exports.PrivateArea = PrivateArea;
//# sourceMappingURL=private-area.js.map