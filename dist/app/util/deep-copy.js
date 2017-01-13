"use strict";
var _this = this;
exports.deepCopy = function (oldObj) {
    var newObj = oldObj;
    if (oldObj && typeof oldObj === "object") {
        newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
        for (var i in oldObj) {
            newObj[i] = _this.deepCopy(oldObj[i]);
        }
    }
    return newObj;
};
//# sourceMappingURL=deep-copy.js.map