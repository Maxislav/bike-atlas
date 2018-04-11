"use strict";
class Tail {
    constructor(startPoint, map) {
        this.startPoint = startPoint;
        this.map = map;
        this.points = [];
        this.id = this.getNewLayer(0, 50000, true);
        this.update(startPoint);
    }
    update(lngLat) {
        this.points.push(lngLat);
        return this;
    }
    getNewLayer(min, max, int) {
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand = 'tail' + Math.round(rand);
        }
        if (-1 < Tail.layerIds.indexOf(rand)) {
            return this.getNewLayer(min, max, int);
        }
        else {
            return rand;
        }
    }
}
Tail.layerIds = [];
exports.Tail = Tail;
//# sourceMappingURL=tail.class.js.map