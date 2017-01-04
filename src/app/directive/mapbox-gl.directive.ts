
import {Component, AfterViewInit} from '@angular/core';
import { Directive, ElementRef, Input, Renderer } from '@angular/core';
//import any = jasmine.any;
import {MapService} from "../service/map.service";
import {PositionSize} from "../service/position-size.service";
import { LocalStorage } from '../service/local-storage.service';
import * as mapboxgl from "@lib/mapbox-gl/mapbox-gl.js";
import {Resolve} from "@angular/router";
import {AuthService} from "../service/auth.service";

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
    selector: 'mapbox-gl',
})
export class MapboxGlDirective implements AfterViewInit, Resolve<any> {
    resolve(): Promise<any> {
        return new Promise((resolve, reject)=>{

            setTimeout(()=>{
                resolve()
            }, 5000)
        });
    }
    get mapboxgl(): any {
        return this._mapboxgl;
    }

    set mapboxgl(value: any) {
        this._mapboxgl = value;
    }
    renderer:Renderer;
    el:ElementRef;
    nativeElement:any;
    map: any;
    private center: number[];
    private mapService;
    private _mapboxgl: any;

    ngAfterViewInit():void {

        var localStorageCenter = this.ls.mapCenter;

        let el = this.el;
        el.nativeElement.innerHTML = '';
        mapboxgl.accessToken = "pk.eyJ1IjoibWF4aXNsYXYiLCJhIjoiY2lxbmlsNW9xMDAzNmh4bms4MGQ1enpvbiJ9.SvLPN0ZMYdq1FFMn7djryA";
        this.map = new mapboxgl.Map({
            container: el.nativeElement,
            center:[localStorageCenter.lng || this.center[0], localStorageCenter.lat || this.center[1]],
            zoom: localStorageCenter.zoom || 8,
            //"sprite": "http://localhost:8080/src/img/milsymbol",
           // _style: 'mapbox://styles/mapbox/streets-v9',
            style: {
                "version": 8,
                "name": "plastun",
               // "sprite": "mapbox://sprites/mapbox/streets-v8",
               // "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
                "sprite": "http://"+window.location.hostname+"/src/sprite/sprite",
                "sources": {
                    "google-default": {
                        "type": "raster",
                        "tiles":[
                            "http://mt0.googleapis.com/vt/lyrs=m@207000000&hl=ru&src=api&x={x}&y={y}&z={z}&s=Galile",
                        ],
                        "tileSize": 256
                    },
                    "hills": {
                        "type": "raster",
                        "tiles":[
                            "hills/{z}/{x}/{y}.png"
                        ],
                        "tileSize": 256
                    },
                    "osm": {
                        "type": "raster",
                        "tiles":[
                            "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        ],
                        "tileSize": 256
                    },

                },
                "layers": [{
                    "id": "google-default",
                    "source": "osm",
                    //"source": "google-default",
                    "type": "raster"
                }, {
                    "id": "hills",
                    "source": "hills",
                    "type": "raster",
                    "minzoom": 7,
                    "maxzoom": 14
                }]
            }
        });

        this.map.addControl(new mapboxgl.NavigationControl({
            position: 'top-right',
            maxWidth: 80
        }));

        this.mapService.setMap(this.map);

    };



    constructor(el: ElementRef, renderer: Renderer, mapService: MapService, positionSiz: PositionSize, private ls: LocalStorage, private as: AuthService) {
        console.log(as.userName);
        this.center = [30.5, 50.5];
        this.el = el;
        this.renderer = renderer;
        this.mapService = mapService;
        this.mapService.mapboxgl = mapboxgl;


        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'rgba(200,200,200, 1)');
        //renderer.setElementStyle(el.nativeElement, 'color', 'white');
       // renderer.setElementStyle(el.nativeElement, 'width', '100%');
        //renderer.setElementStyle(el.nativeElement, 'height', '100%');





        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'gray');



    }





}
