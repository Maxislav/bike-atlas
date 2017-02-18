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
const socket_oi_service_1 = require("../../service/socket.oi.service");
const strava_service_1 = require("../../service/strava.service");
let StravaComponent = class StravaComponent {
    constructor(router, io, stravaService) {
        this.router = router;
        this.io = io;
        this.stravaService = stravaService;
        this._stravaClientId = null;
        this._stravaClientSecret = null;
        this.stravaHref = null;
        this.token = hash_1.hashgeneral();
        this.athlete = {
            firstName: null,
            lastName: null,
            city: null,
            profile: null
        };
        this.docsFor = stravaService.docsFor;
        this.href = null;
        this.socket = io.socket;
        this.getStrava()
            .then(d => {
            if (d.result && d.result == 'ok') {
                this.isAuthorize();
            }
        })
            .catch(d => {
            this.authInProgress = false;
        });
        this.authInProgress = true;
        switch (true) {
            case /maxislav/.test(window.location.hostname):
                this.myLocation = 'http://' + window.location.hostname + '/bike-atlas/';
                break;
            default:
                this.myLocation = 'http://' + window.location.hostname + '/';
        }
    }
    isAuthorize() {
        this.socket.$emit('isAuthorizeStrava')
            .then(d => {
            console.log(d);
            if (d.result && d.result == 'ok') {
                const athlete = d.data.athlete;
                this.athlete.firstName = athlete.firstname;
                this.athlete.lastName = athlete.lastname;
                this.athlete.profile = athlete.profile;
                this.athlete.city = athlete.city;
                this.authorization = d.data.token_type + " " + d.data.access_token;
            }
            this.authInProgress = false;
        });
    }
    getStrava() {
        return this.socket.$emit('getStrava')
            .then(d => {
            if (d && d.result == 'ok' && d.data) {
                this.stravaClientId = d.data.stravaClientId;
                this.stravaClientSecret = d.data.stravaClientSecret;
                return d;
            }
            else {
                return Promise.reject('no auth');
            }
        });
    }
    get href() {
        return this._href;
    }
    set href(value) {
        this._href = value;
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
    get stravaClientId() {
        return this._stravaClientId;
    }
    set stravaClientId(value) {
        this._stravaClientId = value;
        this.stravaHref =
            'https://www.strava.com/oauth/authorize?' +
                'client_id=' + value +
                '&response_type=code' +
                '&redirect_uri=' + this.myLocation + '%23/' + 'auth/map/strava-invite/' + this.token +
                '&scope=write' +
                '&state=strava' +
                '&approval_prompt=force';
    }
    get stravaClientSecret() {
        return this._stravaClientSecret;
    }
    set stravaClientSecret(value) {
        this._stravaClientSecret = value;
    }
    goToStrava() {
        if (this.stravaClientId && this.stravaClientSecret) {
            this.socket.$emit('onStrava', {
                stravaClientId: this.stravaClientId,
                stravaClientSecret: this.stravaClientSecret,
                atlasToken: this.token
            })
                .then(d => {
                console.log('goToStrava->', d);
                if (d.result == 'ok') {
                    window.location.href = this.stravaHref.toString();
                }
            });
        }
    }
    sendTrackToStrava(track) {
        this.stravaService.sendTrackToStrava(track, this.authorization)
            .then(d => {
            console.log(d);
        });
    }
};
StravaComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./strava-component.html",
        styleUrls: ['./strava-component.css'],
    }), 
    __metadata('design:paramtypes', [router_1.Router, socket_oi_service_1.Io, strava_service_1.StravaService])
], StravaComponent);
exports.StravaComponent = StravaComponent;
//# sourceMappingURL=strava-component.js.map