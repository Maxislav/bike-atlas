System.register(['angular2/platform/browser', './app.component', './services/service.lat.lng'], function(exports_1) {
    var browser_1, app_component_1, service_lat_lng_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (service_lat_lng_1_1) {
                service_lat_lng_1 = service_lat_lng_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [service_lat_lng_1.LatLngService]);
        }
    }
});
//# sourceMappingURL=boot.js.map