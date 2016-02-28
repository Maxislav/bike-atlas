System.register(['angular2/core', '../app/screen.size', '../lib/leaflet/leaflet.js'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, screen_size_1;
    var MyMap;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (screen_size_1_1) {
                screen_size_1 = screen_size_1_1;
            },
            function (_1) {}],
        execute: function() {
            MyMap = (function () {
                function MyMap(myElement, renderer) {
                    this.renderer = renderer;
                    this.width = new screen_size_1.ScreenSize().width + 'px';
                    this.height = new screen_size_1.ScreenSize().height + 'px';
                    renderer.setElementStyle(myElement, 'height', this.height);
                    var map = L.map('map').setView([51.505, -0.09], 13);
                    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
                        maxZoom: 18,
                        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                        id: 'mapbox.streets'
                    }).addTo(map);
                    L.Icon.Default.imagePath = 'lib/leaflet/images';
                    L.marker([51.5, -0.09]).addTo(map)
                        .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
                    L.circle([51.508, -0.11], 500, {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5
                    }).addTo(map).bindPopup("I am a circle.");
                    L.polygon([
                        [51.509, -0.08],
                        [51.503, -0.06],
                        [51.51, -0.047]
                    ]).addTo(map).bindPopup("I am a polygon.");
                    var popup = L.popup();
                    function onMapClick(e) {
                        popup
                            .setLatLng(e.latlng)
                            .setContent("You clicked the map at " + e.latlng.toString())
                            .openOn(map);
                    }
                    map.on('click', onMapClick);
                }
                MyMap = __decorate([
                    core_1.Component({
                        selector: '.my-map',
                        templateUrl: 'app/template/map.html'
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
                ], MyMap);
                return MyMap;
            })();
            exports_1("MyMap", MyMap);
        }
    }
});
//# sourceMappingURL=mymap.js.map