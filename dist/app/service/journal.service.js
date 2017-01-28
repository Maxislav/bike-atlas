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
const track_var_1 = require("./track.var");
let JournalService = class JournalService {
    constructor(io) {
        this._devices = {};
        this.socket = io.socket;
        this.list = [];
        const d = new Date();
        this.selectDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    stepGo(step) {
        const d = this.selectDate;
        this.selectDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + step);
        let from = this.selectDate;
        let to = new Date(this.selectDate.getFullYear(), this.selectDate.getMonth(), this.selectDate.getDate() + 1);
        this.getTrack(from, to);
        return this.selectDate;
    }
    getTrack(from, to) {
        return this.socket
            .$emit('trackFromTo', {
            from,
            to
        })
            .then(d => {
            if (d && d.result == 'ok') {
                this.devices = d.devices;
                this.fillList(this.devices);
                return this.devices;
            }
            else {
                return null;
            }
        });
    }
    fillList(devices) {
        for (let key in devices) {
            const points = [];
            devices[key].forEach(p => {
                const point = new track_var_1.Point(p.lng, p.lat, p.azimuth);
                point.date = p.date;
                point.speed = p.speed;
                point.id = p.id;
                points.push(point);
            });
            if (points.length) {
                this.list.unshift(points);
            }
        }
    }
    get selectDate() {
        return this._selectDate;
    }
    set selectDate(value) {
        this._selectDate = value;
    }
    get devices() {
        return this._devices;
    }
    set devices(value) {
        for (let key in value) {
            this._devices[key] = value[key];
        }
    }
};
JournalService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [socket_oi_service_1.Io])
], JournalService);
exports.JournalService = JournalService;
//# sourceMappingURL=journal.service.js.map