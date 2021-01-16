"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInPrivate = exports.distance = void 0;
const lngLat_1 = require("./lngLat");
function distance(lngLat1, lngLat2) {
    const arrTrackFull = [{
            lng: lngLat1.lng,
            lat: lngLat1.lat
        }, {
            lng: lngLat2.lng,
            lat: lngLat2.lat
        }];
    var dist_sum = 0;
    var R = 6372795; //радиус Земли
    var lat1, lat2, long1, long2;
    for (var i = 0; i < (arrTrackFull.length - 1); i++) {
        lat1 = arrTrackFull[i].lat;
        long1 = arrTrackFull[i].lng;
        lat2 = arrTrackFull[i + 1].lat;
        long2 = arrTrackFull[i + 1].lng;
        //перевод коордитат в радианы
        lat1 *= Math.PI / 180;
        lat2 *= Math.PI / 180;
        long1 *= Math.PI / 180;
        long2 *= Math.PI / 180;
        //вычисление косинусов и синусов широт и разницы долгот
        var cl1 = Math.cos(lat1);
        var cl2 = Math.cos(lat2);
        var sl1 = Math.sin(lat1);
        var sl2 = Math.sin(lat2);
        var delta = long2 - long1;
        var cdelta = Math.cos(delta);
        var sdelta = Math.sin(delta);
        //вычисления длины большого круга
        var y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
        var x = sl1 * sl2 + cl1 * cl2 * cdelta;
        var ad = Math.atan2(y, x);
        var dist = ad * R; //расстояние между двумя координатами в метрах
        dist_sum = dist_sum + dist;
    }
    dist_sum = dist_sum / 1000;
    dist_sum = parseFloat(dist_sum.toFixed(3));
    return dist_sum;
}
exports.distance = distance;
function isInPrivate(areas, data) {
    for (let i = 0; i < areas.length; i++) {
        const area = areas[i];
        const areaRadius = area.radius;
        const dist = distance(new lngLat_1.LngLat(data.lng, data.lat), new lngLat_1.LngLat(area.lng, area.lat));
        if (dist < areaRadius) {
            return true;
        }
    }
    return false;
}
exports.isInPrivate = isInPrivate;
//# sourceMappingURL=distance.js.map