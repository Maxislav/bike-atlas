"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    return hex.length == 1 ? '0' + hex : hex;
}
function rgbToHex(r, g, b) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
const getRgbColor2 = (speed, limit, hue) => {
    hue = hue !== undefined ? (255 - 255 * hue / 100) : 0;
    hue = parseInt(hue);
    var _limit = limit || 150;
    var step = _limit / 5;
    speed = f(speed);
    var c, s;
    if (speed < step) { //(0, 0, 255) ->(0, 255, 255) синий   -> голубой
        c = (255 / step) * speed;
        c = c.toFixed(0);
        return [0, fc(c, hue), 255];
    }
    else if (speed < 2 * step) { //   (0, 255, 255)голубой ->   (0, 255,0 ) зеленый
        s = speed - step;
        c = 255 - ((255 / step) * s);
        c = c.toFixed(0);
        return [hue, 255, fc(c + hue)];
    }
    else if (speed < 3 * step) { // (0, 255,0 ) зеленый -> (255, 255,0 ) желтый
        s = speed - 2 * step;
        c = ((255 / step) * s).toFixed(0);
        return [fc(c, hue), 255, hue];
    }
    else if (speed < 4 * step) { //(255, 255,0 ) желтый ->(255, 0,0 )красный
        s = speed - 3 * step;
        c = (255 - ((255 / step) * s)).toFixed(0);
        return [255, fc(c, hue), hue];
    }
    else if (speed < 5 * step) { //(255, 0,0 )красный -> (255, 0,255 ) фиолетовый
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
    constructor(points) {
        this.points = points;
    }
    getColors() {
        // points = e.data[0];
        const points = this.points;
        // const result = R.sortBy(R.prop('speed'))(points);
        const max = this._getSpeedMax(); //    result[result.length - 1].speed;
        points.forEach(point => {
            point.color = getHexColor(point.speed, max);
        });
        const colors = new Set(points.map(item => item.color));
        const resColors = [];
        Array.from(colors).forEach(item => {
            resColors.push([item, item]);
        });
        return [points, resColors];
    }
    _getSpeedMax() {
        let max = 0;
        this.points.forEach((p) => {
            if (max < p.speed) {
                max = p.speed;
            }
        });
        return max;
    }
}
exports.Color = Color;
//# sourceMappingURL=get-color.js.map