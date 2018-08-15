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
var _a;
const core_1 = require("@angular/core");
const my_marker_service_1 = require("app/service/my-marker.service");
let MarkerListComponent = class MarkerListComponent {
    constructor(myMarkerService) {
        this.myMarkerService = myMarkerService;
    }
    /*@HostListener('document:click', ['$event'])
    docClick() {
        this.myMarkerService.hide()
    }

    @HostListener('click', ['$event'])
    click(e) {
        e.stopPropagation();
    }
*/
    onClose() {
        this.myMarkerService.hide();
    }
};
MarkerListComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'marker-list-component',
        templateUrl: './marker-list-component.html',
        styleUrls: ['./marker-list-component.css']
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof my_marker_service_1.MyMarkerService !== "undefined" && my_marker_service_1.MyMarkerService) === "function" && _a || Object])
], MarkerListComponent);
exports.MarkerListComponent = MarkerListComponent;
//# sourceMappingURL=marker-list-component.js.map