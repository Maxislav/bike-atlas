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
const toast_component_1 = require("../toast/toast.component");
const main_user_service_1 = require("../../service/main.user.service");
const aes_cript_1 = require('../../service/aes-cript');
let StravaComponent = class StravaComponent {
    constructor(router, io, userService, stravaService, toast) {
        this.router = router;
        this.io = io;
        this.userService = userService;
        this.stravaService = stravaService;
        this.toast = toast;
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
        this.showHelp = false;
        this.docsFor = stravaService.docsFor;
        const aes1 = new aes_cript_1.Aes(16);
        const aes2 = new aes_cript_1.Aes(16);
        const myText = "Hello Crypt";
        console.log(myText);
        const encodeByte = aes1.encodeTextToByte(myText);
        const encodeByte2 = aes2.encodeByteToByte(encodeByte);
        const decodeByte1 = aes1.decodeByteToByte(encodeByte2);
        const decodeText = aes2.decodeByteToText(decodeByte1);
        console.log(decodeText);
        this.href = null;
        this.socket = io.socket;
        this.getStrava()
            .then(d => {
            return this.isAuthorize();
        })
            .then(d => {
            this.authInProgress = false;
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
    onShowHelp() {
        this.showHelp = !this.showHelp;
    }
    isAuthorize() {
        return this.stravaService.isAuthorize()
            .then(athlete => {
            this.athlete.firstName = athlete.firstName;
            this.athlete.lastName = athlete.lastName;
            this.athlete.profile = athlete.profile;
            this.athlete.city = athlete.city;
            this.authorization = athlete.authorization;
        });
    }
    getStrava() {
        return this.stravaService.getStrava()
            .then(d => {
            this.stravaClientId = d.stravaClientId;
            this.stravaClientSecret = d.stravaClientSecret;
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
            const aes = new aes_cript_1.Aes(16);
            const byte = aes.encodeTextToByte(this.stravaClientSecret);
            const byteArr = Array.from(byte);
            console.log(byte, byteArr);
            this.socket
                .$emit('onStravaCrypt', {
                n: 0,
                arr: byteArr
            })
                .then(d => {
                const enc2 = new Uint8Array(d.arr);
                return this.socket.$emit('onStravaCrypt', {
                    n: 1,
                    arr: Array.from(aes.decodeByteToByte(enc2)),
                    stravaClientId: this.stravaClientId,
                    atlasToken: this.token
                });
            })
                .then(d => {
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
            if (d && d.result == 'ok' && d.data.id) {
                this.toast.show({
                    type: 'success',
                    text: "Отправлен на обработку в Strava"
                });
                this.stravaService.removeTrack(track);
            }
        });
    }
    onDeauthorize() {
        this.stravaService.onDeauthorize()
            .then(d => {
            if (d && d.result == 'ok') {
                for (var opt in this.athlete) {
                    this.athlete[opt] = null;
                }
            }
        });
    }
};
StravaComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./strava-component.html",
        styleUrls: ['./strava-component.css'],
    }), 
    __metadata('design:paramtypes', [router_1.Router, socket_oi_service_1.Io, main_user_service_1.UserService, strava_service_1.StravaService, toast_component_1.ToastService])
], StravaComponent);
exports.StravaComponent = StravaComponent;
//# sourceMappingURL=strava-component.js.map