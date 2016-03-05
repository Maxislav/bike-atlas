/**
 * Created by maxim on 2/27/16.
 */
import {Component, ElementRef, Renderer ,Inject, OnChanges} from 'angular2/core';
import {ScreenSize} from '../app/screen.size';
import {FooterHelp} from './footer.help';
import {MymapEvents} from './services/service.map.events';


import '../lib/leaflet/leaflet.js';
declare var L: any;

@Component({
    selector: '.my-map',
    templateUrl: 'app/template/map.html',
})

export class MyMap{

    private height: string;
    private width: string;
    private screenSize: ScreenSize;
    public map: any;
    public L: any;
    public startLatLng: Array<number> = [50.45, 30.47];
    public tilesDomain: string = 'http://a.tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png';
    public startZoom: number =  10;
    public footerHelp: FooterHelp;
    private scope = this;



    constructor(myElement: ElementRef, public renderer: Renderer, mymapEvents : MymapEvents) {
        this.screenSize = new ScreenSize();
        this.width = this.screenSize.width+'px';
        this.height = this.screenSize.height+ 'px';
        this.setSizeElement(myElement, renderer);
        this.initMap();
        mymapEvents.init(this.map);
    }

    private  initMap(){
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

        L.Icon.Default.imagePath = 'lib/leaflet/images';
        L.marker(startLatLng).addTo(map)
            .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
        L.circle(startLatLng, 500, {
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

        /*map.on('mousemove', function(e){
            latLngService.lat = e.latlng.lat.toFixed(6) ;
            latLngService.lng = e.latlng.lng.toFixed(6) ;

        });*/

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