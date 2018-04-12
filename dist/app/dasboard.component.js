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
 * Created by maxislav on 07.10.16.
 */
/**
 * Created by maxislav on 05.10.16.
 */
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
let DashboardComponent = class DashboardComponent {
    constructor(router) {
        this.router = router;
    }
    goToDetail(heroId) {
        let link = ['/dashboard/', heroId];
        this.router.navigate(link);
    }
};
DashboardComponent = __decorate([
    core_1.Component({
        //selector: 'router-outlet',
        //templateUrl: 'src/app/template/my-app.html'
        //template: '<div>My dashboard</div>'
        templateUrl: 'src/app/template/dashboard.component.html'
    }),
    __metadata("design:paramtypes", [router_1.Router])
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dasboard.component.js.map