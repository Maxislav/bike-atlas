"use strict";
exports.distance = ([lng, lat], [lng2, lat2]) => {
    const arrTrackFull = [{
            lng,
            lat
        }, {
            lng: lng2,
            lat: lat2
        }];
    let dist_sum = 0;
    const R = 6372795; //радиус Земли
    let _lat1, _lat2, _lng1, _lng2;
    for (let i = 0; i < (arrTrackFull.length - 1); i++) {
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
        const cl1 = Math.cos(_lat1);
        const cl2 = Math.cos(_lat2);
        const sl1 = Math.sin(_lat1);
        const sl2 = Math.sin(_lat2);
        const delta = _lng2 - _lng1;
        const cdelta = Math.cos(delta);
        const sdelta = Math.sin(delta);
        //вычисления длины большого круга
        const y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
        const x = sl1 * sl2 + cl1 * cl2 * cdelta;
        const ad = Math.atan2(y, x);
        const dist = ad * R; //расстояние между двумя координатами в метрах
        dist_sum = dist_sum + dist;
    }
    dist_sum = dist_sum / 1000;
    dist_sum = parseFloat(dist_sum.toFixed(3));
    return dist_sum; //km
};
//# sourceMappingURL=distance.js.map