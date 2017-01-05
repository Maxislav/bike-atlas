"use strict";
var Timer = (function () {
    function Timer() {
    }
    Timer.prototype.elapse = function (d) {
        var timeDiff = new Date().getTime() - new Date(d).getTime();
        // strip the ms
        timeDiff /= 1000;
        // get seconds (Original had 'round' which incorrectly counts 0:28, 0:29, 1:30 ... 1:59, 1:0)
        var seconds = Math.round(timeDiff % 60);
        // remove seconds from the date
        timeDiff = Math.floor(timeDiff / 60);
        // get minutes
        var minutes = Math.round(timeDiff % 60);
        // remove minutes from the date
        timeDiff = Math.floor(timeDiff / 60);
        // get hours
        var hours = Math.round(timeDiff % 24);
        // remove hours from the date
        timeDiff = Math.floor(timeDiff / 24);
        // the rest of timeDiff is number of days
        var days = timeDiff;
        var result = '';
        if (0 < days) {
            result += days + 'д ';
        }
        if (0 < hours) {
            result += hours + "ч ";
        }
        if (0 < minutes) {
            result += minutes + 'min ';
        }
        result += seconds + "s";
        return result;
    };
    return Timer;
}());
exports.Timer = Timer;
;
//# sourceMappingURL=elapse.time.js.map