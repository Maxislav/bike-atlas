"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepCopy = void 0;
const deepCopy = (oldObj) => {
    var newObj = oldObj;
    if (oldObj && typeof oldObj === "object") {
        newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
        for (var i in oldObj) {
            newObj[i] = (0, exports.deepCopy)(oldObj[i]);
        }
    }
    return newObj;
};
exports.deepCopy = deepCopy;
//# sourceMappingURL=deep-copy.js.map