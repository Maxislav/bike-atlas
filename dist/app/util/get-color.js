"use strict";
const R = require("@ramda/ramda.min.js");
const f = parseFloat;
function fc() {
    let res = 0;
    let arr = arguments;
    Array.prototype.forEach.call(arguments, item => {
        res += getC(item);
    });
    function getC(v) {
        v = f(v);
        if (255 < v) {
            return 255;
        }
        else {
            return v;
        }
    }
    return getC(res);
}
;
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
const getRgbColor2 = (speed, limit, hue) => {
    hue = hue !== undefined ? (255 - 255 * hue / 100) : 0;
    hue = parseInt(hue);
    var _limit = limit || 150;
    var step = _limit / 5;
    speed = f(speed);
    var c, s;
    if (speed < step) {
        c = (255 / step) * speed;
        c = c.toFixed(0);
        return [0, fc(c, hue), 255];
    }
    else if (speed < 2 * step) {
        s = speed - step;
        c = 255 - ((255 / step) * s);
        c = c.toFixed(0);
        return [hue, 255, fc(c + hue)];
    }
    else if (speed < 3 * step) {
        s = speed - 2 * step;
        c = ((255 / step) * s).toFixed(0);
        return [fc(c, hue), 255, hue];
    }
    else if (speed < 4 * step) {
        s = speed - 3 * step;
        c = (255 - ((255 / step) * s)).toFixed(0);
        return [255, fc(c, hue), hue];
    }
    else if (speed < 5 * step) {
        s = speed - 4 * step;
        c = (((255 / step) * s)).toFixed(0);
        return [255, hue, fc(c, hue)];
    }
    else {
        return [255, hue, hue];
    }
};
function getHexColor(speed, limit, hue) {
    return rgbToHex.apply(this, getRgbColor2(speed, limit, hue));
}
class Color {
    constructor() {
    }
    getColors(points) {
        // points = e.data[0];
        const result = R.sortBy(R.prop('speed'))(points);
        const max = result[result.length - 1].speed;
        points.forEach(point => {
            point.color = getHexColor(point.speed, max);
        });
        const colors = R.uniq(R.pluck('color')(points));
        const resColors = [];
        colors.forEach(item => {
            resColors.push([item, item]);
        });
        return [points, resColors];
    }
}
exports.Color = Color;
//# sourceMappingURL=get-color.js.map