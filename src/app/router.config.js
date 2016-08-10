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
var app_states_1 = require("./app.states");
var core_1 = require("@angular/core");
/**
 * Create your own UIRouterConfig class
 *
 * This class should be added to the Angular 2 bootstrap() providers and is injected by the
 * UIRouter provider.  The UIRouter provider will then invoke this classes configure()
 * function and pass in the UIRouter instance, which we configure.  After configuration,
 * UIRouter syncs up with the current URL.
 */
var MyUIRouterConfig = (function () {
    function MyUIRouterConfig(injector) {
        this.injector = injector;
    }
    MyUIRouterConfig.prototype.configure = function (uiRouter) {
        // Register each state definition (from app.states.ts) with the StateRegistry
        app_states_1.INITIAL_STATES.forEach(function (state) { return uiRouter.stateRegistry.register(state); });
        // Define a default behavior, for when the URL matched no routes
        uiRouter.urlRouterProvider.otherwise(function () { return uiRouter.stateService.go("app", null, null) && null; });
    };
    MyUIRouterConfig = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.Injector])
    ], MyUIRouterConfig);
    return MyUIRouterConfig;
}());
exports.MyUIRouterConfig = MyUIRouterConfig;
//# sourceMappingURL=router.config.js.map