"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LngLat = void 0;
class LngLat extends Array {
    constructor(lng, lat) {
        super();
        if (typeof lng === 'number' && typeof lat === 'number') {
            this.setValue({
                lng,
                lat
            });
        }
    }
    setValue(lngLat) {
        this.lat = lngLat.lat;
        this.lng = lngLat.lng;
        this[0] = this.lng;
        this[1] = this.lat;
        return this;
    }
    static fromArray(arr) {
        return new LngLat(...arr);
    }
    static fromObject(lngLat) {
        return new LngLat().setValue(lngLat);
    }
}
exports.LngLat = LngLat;
//# sourceMappingURL=lngLat.js.map