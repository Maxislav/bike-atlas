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
const hash_1 = require("../../util/hash");
let StravaComponent = class StravaComponent {
    constructor(router) {
        this.router = router;
        this._userId = null;
        this.token = hash_1.hashgeneral();
        this.href = null;
    }
    get href() {
        return this._href;
    }
    set href(value) {
        this._href = value;
    }
    set userId(value) {
        this._userId = value;
        this.href =
            'https://www.strava.com/oauth/authorize?' +
                'client_id=' + this.userId +
                '&response_type=code' +
                '&redirect_uri=' + System.baseURL + '/%23/' + this.token +
                '&scope=write' +
                '&state=strava' +
                '&approval_prompt=force';
    }
    get userId() {
        return this._userId;
    }
    ngDoCheck() {
        // console.log(++i)
    }
    ngOnChanges(changes) {
        console.log(changes);
    }
    onClose() {
        this.router.navigate(['/auth/map']);
    }
};
StravaComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./strava-component.html",
        styleUrls: ['./strava-component.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router])
], StravaComponent);
exports.StravaComponent = StravaComponent;
//# sourceMappingURL=strava-component.js.map