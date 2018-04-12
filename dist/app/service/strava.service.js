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
const core_1 = require("@angular/core");
const socket_oi_service_1 = require("./socket.oi.service");
const create_xml_doc_1 = require("../util/create-xml-doc");
let StravaService = class StravaService {
    constructor(io) {
        this.io = io;
        this.stravaClientId = null;
        this.stravaClientSecret = null;
        this.socket = io.socket;
        this.docsFor = [];
    }
    addToExport(track) {
        this.docsFor.push(track);
    }
    sendTrackToStrava(track, authorization) {
        return create_xml_doc_1.pointsToXmlDoc(track.points)
            .then(xmlDpc => {
            const file = create_xml_doc_1.xml2string(xmlDpc);
            return this.socket.$emit('sendTrackToStrava', {
                file, authorization
            });
            //console.log(xmlDpc)
        });
    }
    stravaOauth(stravaCode) {
        return this.socket.$emit('stravaOauth', {
            stravaCode: stravaCode
        })
            .then(d => {
            if (d.result == 'ok') {
                const athlete = d.data.athlete;
                this.athlete = {
                    firstName: athlete.firstname,
                    lastName: athlete.lastname,
                    profile: athlete.profile,
                    city: athlete.city,
                    authorization: d.data.token_type + " " + d.data.access_token
                };
            }
            console.log('stravaOauth->', d);
            return d;
            //
            // this.authInProgress = false
        });
    }
    removeTrack(track) {
        if (-1 < this.docsFor.indexOf(track)) {
            this.docsFor.splice(this.docsFor.indexOf(track), 1);
        }
    }
    getStrava() {
        if (this.stravaClientId && this.stravaClientSecret) {
            return Promise.resolve({
                stravaClientId: this.stravaClientId,
                stravaClientSecret: this.stravaClientSecret
            });
        }
        else {
            return this.socket.$emit('getStrava')
                .then(d => {
                if (d && d.result == 'ok' && d.data) {
                    this.stravaClientId = d.data.stravaClientId;
                    this.stravaClientSecret = d.data.stravaClientSecret;
                    return {
                        stravaClientId: this.stravaClientId,
                        stravaClientSecret: this.stravaClientSecret
                    };
                }
                else {
                    return Promise.reject('no auth');
                }
            });
        }
    }
    isAuthorize() {
        if (this.athlete) {
            return Promise.resolve(this.athlete);
        }
        else {
            return this.socket.$emit('isAuthorizeStrava')
                .then(d => {
                console.log(d);
                if (d.result && d.result == 'ok') {
                    const athlete = d.data.athlete;
                    this.athlete = {
                        firstName: athlete.firstname,
                        lastName: athlete.lastname,
                        profile: athlete.profile,
                        city: athlete.city,
                        authorization: d.data.token_type + " " + d.data.access_token
                    };
                    return this.athlete;
                }
                else {
                    return Promise.reject(false);
                }
            });
        }
    }
    onDeauthorize() {
        return this.socket.$emit('onDeauthorizeStrava', this.athlete.authorization)
            .then(d => {
            if (d && d.result == 'ok') {
                this.athlete = undefined;
            }
            return d;
        });
    }
};
StravaService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [socket_oi_service_1.Io])
], StravaService);
exports.StravaService = StravaService;
//# sourceMappingURL=strava.service.js.map