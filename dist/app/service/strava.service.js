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
const socket_oi_service_1 = require("./socket.oi.service");
const create_xml_doc_1 = require("../util/create-xml-doc");
let StravaService = class StravaService {
    constructor(io) {
        this.io = io;
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
};
StravaService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [socket_oi_service_1.Io])
], StravaService);
exports.StravaService = StravaService;
//# sourceMappingURL=strava.service.js.map