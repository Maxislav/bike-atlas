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
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const app_component_1 = require("../../app.component");
const common_1 = require('@angular/common');
const private_area_service_1 = require("../../service/private.area.service");
const main_user_service_1 = require("../../service/main.user.service");
const distance_1 = require("../../util/distance");
let PrivateArea = class PrivateArea {
    constructor(lh, location, router, userService, areaService) {
        this.lh = lh;
        this.location = location;
        this.router = router;
        this.userService = userService;
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
        this.setting = userService.user.setting;
        this.areaService.onLoadMap
            .then(map => {
            this.map = map;
            this.areaService.showArea();
        });
    }
    saveLock(val) {
        this.areaService.saveLock(val);
    }
    get lng() {
        return this.myArea.lng ? parseFloat(this.myArea.lng.toFixed(5)) : null;
    }
    get lat() {
        return this.myArea.lat ? parseFloat(this.myArea.lat.toFixed(5)) : null;
    }
    get rad() {
        return this.myArea.radius ? parseFloat(this.myArea.radius.toFixed(5)) : null;
    }
    onDrawArea() {
        this.clickCount++;
        const move = (e) => {
            const dist = distance_1.distance([
                this.myArea.lng,
                this.myArea.lat,
            ], [
                e.lngLat.lng,
                e.lngLat.lat
            ]);
            this.myArea.update([this.myArea.lng, this.myArea.lat], this.myArea.radius = dist);
        };
        const click = (e) => {
            if (this.clickCount == 1) {
                if (this.myArea.layerId) {
                    this.myArea.remove();
                }
                this.myArea.lng = e.lngLat.lng;
                this.myArea.lat = e.lngLat.lat;
                this.myArea = this.areaService.createArea(this.myArea);
                this.map.on('mousemove', move);
                this.clickCount++;
            }
            else {
                this.map.off('mousemove', move);
                this.clickCount = 1;
                this.onFinish = () => {
                    this.map.off('click', click);
                    this.clickCount = 0;
                    this.onSave();
                };
            }
        };
        if (this.clickCount == 1) {
            this.areaService.onLoadMap
                .then(map => {
                map.on('click', click);
            });
        }
    }
    onFinish() {
    }
    onDel(area) {
        console.log(area);
        this.areaService.removeArea(area.id);
    }
    onOver(area) {
        this.map.panTo([area.lng, area.lat]);
    }
    onSave() {
        if (this.myArea.layerId) {
            this.areaService.onSave(this.myArea)
                .then(d => {
                if (d) {
                    this.myArea.remove();
                    this.myArea = {
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
    }
    onClose() {
        if (this.lh.is) {
            this.location.back();
        }
        else {
            this.router.navigate(['/auth/map']);
        }
    }
    ngOnDestroy() {
        if (this.myArea.layerId) {
            this.myArea.remove();
        }
        this.areaService.hideArea();
    }
};
PrivateArea = __decorate([
    core_1.Component({
        //noinspection TypeScriptUnresolvedVariable
        moduleId: module.id,
        templateUrl: './private-area.html',
        styleUrls: ['./private-area.css']
    }), 
    __metadata('design:paramtypes', [app_component_1.NavigationHistory, common_1.Location, router_1.Router, main_user_service_1.UserService, private_area_service_1.PrivateAreaService])
], PrivateArea);
exports.PrivateArea = PrivateArea;
//# sourceMappingURL=private-area.js.map