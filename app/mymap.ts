/**
 * Created by maxim on 2/27/16.
 */
import {Component, ElementRef, Renderer} from 'angular2/core';
import {ScreenSize} from '../app/screen.size';
import '../lib/leaflet/leaflet.js';
declare var L: any;

@Component({
    selector: '.my-map',
    templateUrl: 'app/template/map.html'
})
export class MyMap{

    private height: string;
    private width: string;
    private screenSize: ScreenSize;
    public map: any;
    public L: any;

    constructor(myElement: ElementRef, public renderer: Renderer) {
        this.screenSize = new ScreenSize();
        this.width = this.screenSize.width+'px';
        this.height = this.screenSize.height+ 'px';
        this.setSizeElement(myElement, renderer);
        this.initMap();
    }

    private  initMap(){
        var map = L.map('map').setView([51.505, -0.09], 13);
        this.map = map;
        this.L = L;

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

    private setSizeElement(myElement: ElementRef , renderer: Renderer  ){
        renderer.setElementStyle(myElement,'height', this.height);
    }

    public getMap(){
        return this.map;
    }
    public getL(){
        return this.L;
    }

}