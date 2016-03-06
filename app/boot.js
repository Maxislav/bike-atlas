System.register(['angular2/platform/browser', './app.component', "./services/service.map.events"], function(exports_1) {
    var browser_1, app_component_1, service_map_events_1;
    var appPromise;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (service_map_events_1_1) {
                service_map_events_1 = service_map_events_1_1;
            }],
        execute: function() {
            appPromise = browser_1.bootstrap(app_component_1.AppComponent, [service_map_events_1.MymapEvents]);
        }
    }
});
//# sourceMappingURL=boot.js.map