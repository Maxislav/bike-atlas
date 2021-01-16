/**
 * Created by maxislav on 10.10.16.
 */

import {Component, AfterViewInit} from '@angular/core';
import { Directive, ElementRef, Input } from '@angular/core';
import {MapService} from "../service/map.service";
import {PositionSize} from "../service/position-size.service";



declare var L: any;
declare var gl:any;
declare var mapboxgl:any;
class MyEl extends HTMLElement{
    constructor(id: string){
        super()
    }
    type: string
}

@Directive({
    selector: 'leaflet-map',
})
export class LeafletMapDirective implements AfterViewInit {
    el:ElementRef;
    nativeElement:any;
    map: any;
    private mapService;

    ngAfterViewInit():void {
        let el = this.el;
        el.nativeElement.innerHTML = '';
        mapboxgl.accessToken = "pk.eyJ1IjoibWF4aXNsYXYiLCJhIjoiY2lxbmlsNW9xMDAzNmh4bms4MGQ1enpvbiJ9.SvLPN0ZMYdq1FFMn7djryA";
        this.map = new mapboxgl.Map({
            container: el.nativeElement,
            center:[30.5, 50.5],
            zoom: 8,
            _style: 'mapbox://styles/mapbox/streets-v9',
            style: {
                "version": 8,
                "name": "plastun",
                "sprite": "mapbox://sprites/mapbox/streets-v8",
                "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
                "sources": {
                    "satelite-google": {
                        "type": "raster",
                        "tiles": [
                            "http://iis.contour.net:8081/map/g.h/{z}/{x}/{y}"
                        ],
                        "tileSize": 256
                    },

                    "google-default": {
                        "type": "raster",
                        "tiles":[
                            "http://mt0.googleapis.com/vt/lyrs=m@207000000&hl=ru&src=api&x={x}&y={y}&z={z}&s=Galile"
                        ],
                        "tileSize": 256
                    }
                },
                "layers": [{
                    "id": "google-default",
                    "source": "google-default",
                    "type": "raster"
                }]
            }
        });

        this.map.addControl(new mapboxgl.NavigationControl({
            position: 'top-right',
            maxWidth: 80
        }));

        /*console.log(L.map);
        this.map = L.map(el.nativeElement).setView([50.5, 30.5], 8);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);*/
        //this.mapService.setMap(this.map);
    };



    constructor(el: ElementRef, mapService: MapService, positionSiz: PositionSize) {
        
        
        this.el = el;
        this.mapService = mapService;
        const re = {
            setElementStyle: (el, key, value) => {
                el.style[key] = value
            }
        }

       re.setElementStyle(el.nativeElement, 'backgroundColor', 'rgba(200,200,200, 1)');
       re.setElementStyle(el.nativeElement, 'color', 'white');
       re.setElementStyle(el.nativeElement, 'width', '512px');
       re.setElementStyle(el.nativeElement, 'height', '512px');





        re.setElementStyle(el.nativeElement, 'backgroundColor', 'gray');



    }





}
