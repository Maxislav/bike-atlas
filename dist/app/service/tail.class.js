"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TailClass {
    constructor(markerId, map) {
        this.markerId = markerId;
        this.map = map;
        this.layerId = "tail-" + markerId;
        this.sourceId = 'source-' + markerId;
        this.data = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [[]]
            }
        };
        this.map.onLoad
            .then(() => {
            map.addSource(this.sourceId, {
                "type": "geojson",
                "data": this.data
            });
            this.map.addLayer({
                "id": this.layerId,
                "type": "line",
                "source": this.sourceId,
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "rgba(255, 0,0 ,0.3)",
                    "line-width": 8,
                    "line-opacity": 0.8
                }
            });
        });
    }
    update(point) {
        if (!this.data.geometry.coordinates)
            return this;
        this.map.onLoad
            .then(() => {
            if (!this.data.geometry.coordinates[0][0]) {
                this.data.geometry.coordinates[0] = point;
            }
            else {
                this.data.geometry.coordinates.push(point);
            }
            while (10 < this.data.geometry.coordinates.length) {
                this.data.geometry.coordinates.splice(0, 1);
            }
            this.map.getSource(this.sourceId).setData(this.data);
        });
        return this;
    }
    remove() {
    }
}
exports.TailClass = TailClass;
//# sourceMappingURL=tail.class.js.map