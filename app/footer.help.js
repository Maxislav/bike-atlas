System.register(['angular2/core', "./services/service.map.events"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, service_map_events_1;
    var FooterHelp;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (service_map_events_1_1) {
                service_map_events_1 = service_map_events_1_1;
            }],
        execute: function() {
            FooterHelp = (function () {
                function FooterHelp(mymapEvents) {
                    this.mymapEvents = mymapEvents;
                }
                FooterHelp = __decorate([
                    core_1.Component({
                        selector: '.footer-menu',
                        templateUrl: 'app/template/help-coordinate.html'
                    }), 
                    __metadata('design:paramtypes', [service_map_events_1.MymapEvents])
                ], FooterHelp);
                return FooterHelp;
            })();
            exports_1("FooterHelp", FooterHelp);
        }
    }
});
//# sourceMappingURL=footer.help.js.map