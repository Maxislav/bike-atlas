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
const track_var_1 = require("./track.var");
let JournalService = class JournalService {
    constructor(io) {
        this._devices = {};
        this.dateCache = [];
        this.socket = io.socket;
        this.list = [];
        const d = new Date();
        this.selectDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    setSelectDate(value) {
        this.selectDate = value;
        return value;
    }
    stepGo(step) {
        const d = this.selectDate;
        this.selectDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + step);
        let from = this.selectDate;
        let to = new Date(this.selectDate.getFullYear(), this.selectDate.getMonth(), this.selectDate.getDate() + 1);
        // this.getTrack(from, to);
        return this.selectDate;
    }
    getTrack(device_key, from, to) {
        const fromTo = String(new Date(from).toISOString()).concat(new Date(to).toISOString());
        return this.socket
            .$get('trackDeviceFromTo', {
            device_key,
            from,
            to
        })
            .then(d => {
            if (d && d.result == 'ok') {
                this.fillList(d.list, fromTo);
                return d;
            }
            else {
                return null;
            }
        });
    }
    getLastDate() {
        return this.socket.$get('getLastDate', null);
    }
    getLastDeviceDate(device_key) {
        return this.socket.$get('getLastDeviceDate', device_key);
    }
    fillList(list, rangeOfDate) {
        list.forEach((obj) => {
            if (obj.points.length) {
                const points = [];
                obj.points.forEach(p => {
                    const point = new track_var_1.Point(p.lng, p.lat, p.azimuth);
                    point.date = p.date;
                    point.speed = p.speed;
                    point.id = p.id;
                    points.push(point);
                });
                obj.points = points;
                obj.rangeOfDate = rangeOfDate;
                const index = this.list.findIndex((item) => {
                    return item.rangeOfDate == rangeOfDate;
                });
                if (-1 < index) {
                    this.list[index] = obj;
                }
                else {
                    this.list.unshift(obj);
                }
            }
        });
    }
    cleadData() {
        this.list.length = 0;
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