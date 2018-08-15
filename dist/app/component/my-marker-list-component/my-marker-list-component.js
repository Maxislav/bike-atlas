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
var _a, _b;
const core_1 = require("@angular/core");
const my_marker_service_1 = require("app/service/my-marker.service");
const map_service_1 = require("app/service/map.service");
let MyMarkerListComponent = class MyMarkerListComponent {
    constructor(myMarkerService, mapService) {
        this.myMarkerService = myMarkerService;
        this.mapService = mapService;
        this.active = false;
        this.omMapClick = this.omMapClick.bind(this);
        this.menu = [
            {
                text: 'remove',
                action: (item) => {
                    console.log(item);
                    item.remove();
                    return true;
                }
            }
        ];
    }
    onMarkerClick(m) {
        m.click();
    }
    onAddActive(e) {
        this.active = true;
        this.mapService.map.off('click', this.omMapClick);
        this.mapService.map.on('click', this.omMapClick);
    }
    onClose() {
        this.myMarkerService.hide();
    }
    omMapClick(e) {
        this.mapService.map.off('click', this.omMapClick);
        this.active = false;
        this.myMarkerService.createMarker(e.lngLat, {
            title: '',
            id: null
        });
    }
    ngOnDestroy() {
        this.mapService.map.off('click', this.omMapClick);
    }
};
MyMarkerListComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'marker-list-component',
        templateUrl: './my-marker-list-component.html',
        styleUrls: ['./my-marker-list-component.css']
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof my_marker_service_1.MyMarkerService !== "undefined" && my_marker_service_1.MyMarkerService) === "function" && _a || Object, typeof (_b = typeof map_service_1.MapService !== "undefined" && map_service_1.MapService) === "function" && _b || Object])
], MyMarkerListComponent);
exports.MyMarkerListComponent = MyMarkerListComponent;
//# sourceMappingURL=my-marker-list-component.js.map