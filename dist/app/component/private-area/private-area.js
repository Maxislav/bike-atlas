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
        this.myArea = {
            layerId: null,
            lng: null,
            lat: null,
            radius: null,
            update: null,
            remove: null
        };
        this.areas = areaService.areas;
        this.areaService.onLoadMap
            .then(function (map) {
            _this.map = map;
            _this.areaService.showArea();
        });
    }
    Object.defineProperty(PrivateArea.prototype, "lng", {
        get: function () {
            return this.myArea.lng ? parseFloat(this.myArea.lng.toFixed(5)) : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrivateArea.prototype, "lat", {
        get: function () {
            return this.myArea.lat ? parseFloat(this.myArea.lat.toFixed(5)) : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrivateArea.prototype, "rad", {
        get: function () {
            return this.myArea.radius ? parseFloat(this.myArea.radius.toFixed(5)) : null;
        },
        enumerable: true,
        configurable: true
    });
    PrivateArea.prototype.onDrawArea = function () {
        var _this = this;
        this.clickCount++;
        var move = function (e) {
            var dist = _this.distance.distance([
                _this.myArea.lng,
                _this.myArea.lat,
            ], [
                e.lngLat.lng,
                e.lngLat.lat
            ]);
            _this.myArea.update([_this.myArea.lng, _this.myArea.lat], _this.myArea.radius = dist);
        };
        var click = function (e) {
            if (_this.clickCount == 1) {
                if (_this.myArea.layerId) {
                    _this.myArea.remove();
                }
                _this.myArea.lng = e.lngLat.lng;
                _this.myArea.lat = e.lngLat.lat;
                _this.myArea = _this.areaService.createArea(_this.myArea);
                _this.map.on('mousemove', move);
                _this.clickCount++;
            }
            else {
                console.log('dsd');
                _this.map.off('mousemove', move);
                _this.clickCount = 1;
                _this.onFinish = function () {
                    _this.map.off('click', click);
                    _this.clickCount = 0;
                    _this.onSave();
                };
            }
        };
        if (this.clickCount == 1) {
            this.areaService.onLoadMap
                .then(function (map) {
                map.on('click', click);
            });
        }
    };
    PrivateArea.prototype.onFinish = function () {
    };
    PrivateArea.prototype.onDel = function (area) {
        console.log(area);
        this.areaService.removeArea(area.id);
    };
    PrivateArea.prototype.onOver = function (area) {
        this.map.panTo([area.lng, area.lat]);
    };
    PrivateArea.prototype.onSave = function () {
        var _this = this;
        if (this.myArea.layerId) {
            this.areaService.onSave(this.myArea)
                .then(function (d) {
                if (d) {
                    _this.myArea.remove();
                    _this.myArea = {
                        layerId: null,
                        lng: null,
                        lat: null,
                        radius: null,
                        update: null,
                        remove: null
                    };
                }
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
        if (this.myArea.layerId) {
            this.myArea.remove();
        }
        this.areaService.hideArea();
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