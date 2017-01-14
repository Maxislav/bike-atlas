"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var TimerService = (function () {
    function TimerService() {
    }
    TimerService.prototype.elapse = function (d) {
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
    return TimerService;
}());
TimerService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], TimerService);
exports.TimerService = TimerService;
;
//# sourceMappingURL=timer.service.js.map