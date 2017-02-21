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
const map_service_1 = require("../../../service/map.service");
const main_user_service_1 = require("../../../service/main.user.service");
let MenuAthleteComponent = class MenuAthleteComponent {
    constructor(user, mapService) {
        this.user = user;
        this.mapService = mapService;
        this.userDevices = user.user.devices;
        this.otherDevices = user.other.devices;
    }
    selectDevice(device) {
        if (device.marker) {
            this.mapService.map.flyTo({
                center: [device.marker.lng, device.marker.lat]
            });
        }
    }
    get friendDevices() {
        const devices = [];
        this.user.friends.forEach(friend => {
            friend.devices.forEach(dev => {
                devices.push(dev);
            });
        });
        return devices;
    }
    ngOnDestroy() {
        /* if(this.interval){
             clearInterval(this.interval)
         }*/
    }
};
MenuAthleteComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'menu-athlete',
        templateUrl: './menu.athlete.component.html',
        styleUrls: ['./menu.athlete.component.css'],
    }),
    __metadata("design:paramtypes", [main_user_service_1.UserService, map_service_1.MapService])
], MenuAthleteComponent);
exports.MenuAthleteComponent = MenuAthleteComponent;
//# sourceMappingURL=menu.athlete.component.js.map