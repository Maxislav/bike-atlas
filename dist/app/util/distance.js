"use strict";
exports.distance = function (_a, _b) {
    var lng = _a[0], lat = _a[1];
    var lng2 = _b[0], lat2 = _b[1];
    var arrTrackFull = [{
            lng: lng,
            lat: lat
        }, {
            lng: lng2,
            lat: lat2
        }];
    var dist_sum = 0;
    var R = 6372795; //радиус Земли
    var _lat1, _lat2, _lng1, _lng2;
    for (var i = 0; i < (arrTrackFull.length - 1); i++) {
        _lat1 = arrTrackFull[i].lat;
        _lng1 = arrTrackFull[i].lng;
        _lat2 = arrTrackFull[i + 1].lat;
        _lng2 = arrTrackFull[i + 1].lng;
        //перевод коордитат в радианы
        _lat1 *= Math.PI / 180;
        _lat2 *= Math.PI / 180;
        _lng1 *= Math.PI / 180;
        _lng2 *= Math.PI / 180;
        //вычисление косинусов и синусов широт и разницы долгот
        var cl1 = Math.cos(_lat1);
        var cl2 = Math.cos(_lat2);
        var sl1 = Math.sin(_lat1);
        var sl2 = Math.sin(_lat2);
        var delta = _lng2 - _lng1;
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
//# sourceMappingURL=distance.js.map