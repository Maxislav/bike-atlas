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
let StravaComponent = class StravaComponent {
    constructor(router, io, activatedRoute) {
        this.router = router;
        this.io = io;
        this.activatedRoute = activatedRoute;
        this._userId = null;
        this._stravaClientId = null;
        this._stravaClientSecret = null;
        this.stravaHref = null;
        this.token = hash_1.hashgeneral();
        this.href = null;
        this.socket = io.socket;
        this.getStrava();
    }
    ngOnInit() {
        this.router.routerState.root.queryParams.subscribe(data => {
            this.code = data['code'];
            if (this.code) {
                this.socket.$emit('stravaUpdateCode', this.code)
                    .then(d => {
                    console.log('stravaUpdateCode->', d);
                });
            }
            console.log(this.code);
        });
    }
    stravaOauth() {
        console.log('stravaOauth->');
        this.socket.$emit('stravaOauth', {
            stravaClientId: this.stravaClientId,
            stravaClientSecret: this.stravaClientSecret,
            stravaCode: this.code
        })
            .then(d => {
            console.log('stravaOauth->', d);
        });
    }
    getStrava() {
        this.socket.$emit('getStrava')
            .then(d => {
            if (d && d.result == 'ok' && d.data) {
                this.stravaClientId = d.data.stravaClientId;
                this.stravaClientSecret = d.data.stravaClientSecret;
            }
        });
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
    get stravaClientId() {
        return this._stravaClientId;
    }
    set stravaClientId(value) {
        this._stravaClientId = value;
        this.stravaHref =
            'https://www.strava.com/oauth/authorize?' +
                'client_id=' + value +
                '&response_type=code' +
                '&redirect_uri=' + System.baseURL + '%23/' + 'auth/map/strava-invite/' + this.token +
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
};
StravaComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./strava-component.html",
        styleUrls: ['./strava-component.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router,
        socket_oi_service_1.Io,
        router_1.ActivatedRoute])
], StravaComponent);
exports.StravaComponent = StravaComponent;
//# sourceMappingURL=strava-component.js.map