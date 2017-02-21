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
const socket_oi_service_1 = require("../../service/socket.oi.service");
let StravaAuthComponent = class StravaAuthComponent {
    constructor(router, io) {
        this.router = router;
        this.io = io;
        this.authInProgress = true;
        this.socket = io.socket;
        this.authInProgress = true;
    }
    ngOnInit() {
        this.router.routerState.root.queryParams.subscribe(data => {
            this.code = data['code'];
            if (this.code) {
                this.socket.$emit('stravaUpdateCode', this.code)
                    .then(d => {
                    console.log('stravaUpdateCode->', d);
                    this.stravaOauth(this.code);
                });
            }
            console.log(this.code);
        });
    }
    stravaOauth(stravaCode) {
        this.socket.$emit('stravaOauth', {
            stravaCode: stravaCode
        })
            .then(d => {
            if (d.result == 'ok') {
                const athlete = d.data.athlete;
                this.firstName = athlete.firstname;
                this.lastName = athlete.lastname;
                this.profile = athlete.profile;
                this.city = athlete.city;
            }
            console.log('stravaOauth->', d);
            this.authInProgress = false;
        });
    }
    goToAuth() {
        this.router.navigate(['/auth/map/strava-invite']);
    }
    onClose() {
        this.router.navigate(['/auth/map']);
    }
    goNext() {
        this.router.navigate(['/auth/map/strava-invite']);
    }
};
StravaAuthComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./strava-auth-component.html",
        styleUrls: ['./strava-component.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router,
        socket_oi_service_1.Io])
], StravaAuthComponent);
exports.StravaAuthComponent = StravaAuthComponent;
//# sourceMappingURL=strava-auth-component.js.map