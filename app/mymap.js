System.register(['angular2/core', '../app/screen.size', './services/service.map.events', "../lib/a2/local_storage", '../lib/leaflet/leaflet.js'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, screen_size_1, service_map_events_1, local_storage_1;
    var MyMap;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (screen_size_1_1) {
                screen_size_1 = screen_size_1_1;
            },
            function (service_map_events_1_1) {
                service_map_events_1 = service_map_events_1_1;
            },
            function (local_storage_1_1) {
                local_storage_1 = local_storage_1_1;
            },
            function (_1) {}],
        execute: function() {
            MyMap = (function () {
                function MyMap(myElement, renderer, mymapEvents) {
                    this.renderer = renderer;
                    this.startLatLng = [50.45, 30.47];
                    // public tilesDomain: string = 'http://a.tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png';
                    this.tilesDomain = 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png';
                    this.startZoom = 10;
                    this.scope = this;
                    this.localStorage = new local_storage_1.LocalStorage();
                    this.screenSize = new screen_size_1.ScreenSize();
                    this.width = this.screenSize.width + 'px';
                    this.height = this.screenSize.height + 'px';
                    this.setSizeElement(myElement, renderer);
                    this.initMap();
                    mymapEvents.init(this.map);
                }
                MyMap.prototype.initMap = function () {
                    this.startLatLng = [
                        parseFloat(this.localStorage.get('mapLat')) || this.startLatLng[0],
                        parseFloat(this.localStorage.get('mapLng')) || this.startLatLng[1]
                    ];
                    this.startZoom = parseFloat(this.localStorage.get('mapZoom')) || this.startZoom;
                    var startLatLng = this.startLatLng;
                    var map = L.map('map').setView(startLatLng, this.startZoom);
                    this.map = map;
                    this.L = L;
                    var scope = this;
                    L.tileLayer(this.tilesDomain, {
                        maxZoom: 18,
                        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                        id: 'mapbox.streets'
                    }).addTo(map);
                    var reliefLayer = L.tileLayer('http://hills.gpsies.com/{z}/{x}/{y}.png');
                    map.addLayer(reliefLayer);
                    L.Icon.Default.imagePath = 'lib/leaflet/images';
                    /* L.marker(startLatLng).addTo(map)
                         .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
                     L.circle(startLatLng, 500, {
                         color: 'red',
                         fillColor: '#f03',
                         fillOpacity: 0.5
                     }).addTo(map).bindPopup("I am a circle.");*/
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
                    /*map.on('mousemove', function(e){
                        latLngService.lat = e.latlng.lat.toFixed(6) ;
                        latLngService.lng = e.latlng.lng.toFixed(6) ;
            
                    });*/
                };
                MyMap.prototype.setSizeElement = function (myElement, renderer) {
                    renderer.setElementStyle(myElement, 'height', this.height);
                };
                MyMap.prototype.getMap = function () {
                    return this.map;
                };
                MyMap.prototype.getL = function () {
                    return this.L;
                };
                MyMap = __decorate([
                    core_1.Component({
                        selector: '.my-map',
                        templateUrl: 'app/template/map.html',
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer, service_map_events_1.MymapEvents])
                ], MyMap);
                return MyMap;
            })();
            exports_1("MyMap", MyMap);
        }
    }
});
//# sourceMappingURL=mymap.js.map