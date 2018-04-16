"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Point extends Array {
    constructor(...args) {
        super(...args);
    }
    get lng() {
        return this[0];
    }
    get lat() {
        return this[1];
    }
    get azimuth() {
        return this[2];
    }
    get bearing() {
        return this[2];
    }
    set bearing(val) {
        this[2] = val;
    }
    get date() {
        return this._date;
    }
    set date(value) {
        this._date = new Date(value);
    }
}
exports.Point = Point;
//# sourceMappingURL=track.var.js.map