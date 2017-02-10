"use strict";
exports.hashgeneral = () => {
    function getRandom(min, max, int) {
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand = Math.round(rand);
        }
        return rand;
    }
    const $possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let hash = '';
    for (let i = 0; i < 32; i++) {
        hash += '' + $possible[getRandom(0, 61, true)];
    }
    return hash;
};
//# sourceMappingURL=hash.js.map