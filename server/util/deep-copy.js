"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepCopy = void 0;
exports.deepCopy = (oldObj) => {
    var newObj = oldObj;
    if (oldObj && typeof oldObj === "object") {
        newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
        for (var i in oldObj) {
            newObj[i] = exports.deepCopy(oldObj[i]);
        }
    }
    return newObj;
};
//# sourceMappingURL=deep-copy.js.map