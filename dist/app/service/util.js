/**
 * Created by maxislav on 01.12.16.
 */
"use strict";
var Util = (function () {
    function Util() {
    }
    Util.prototype.distance = function (track) {
        var arrTrackFull = track.points;
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
    };
    return Util;
}());
exports.Util = Util;
//# sourceMappingURL=util.js.map