"use strict";
exports.elapsedStatus = function (device) {
    var dateLong = new Date(device.date).getTime();
    var passed = new Date().getTime() - dateLong;
    if (passed < 10 * 60 * 1000) {
        if (device.speed < 0.1) {
            return 'green';
        }
        else {
            return 'arrow';
        }
    }
    else if (passed < 3600 * 12 * 1000) {
        return 'yellow';
    }
    else {
        return 'white';
    }
};
//# sourceMappingURL=elapsed-status.js.map