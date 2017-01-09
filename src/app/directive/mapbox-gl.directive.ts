import {Component, AfterViewInit, Injectable} from '@angular/core';
import {Directive, ElementRef, Input, Renderer} from '@angular/core';
//import any = jasmine.any;
import {MapService} from "../service/map.service";
import {PositionSize} from "../service/position-size.service";
import {LocalStorage} from '../service/local-storage.service';
import * as mapboxgl from "@lib/mapbox-gl/mapbox-gl.js";
import {Resolve} from "@angular/router";
import {AuthService, Setting} from "../service/auth.service";


declare var L:any;
declare var gl:any;
declare var mapboxgl:any;

@Injectable()
export class MapResolver implements Resolve<any> {
    private _resolver:Function;
    private _resPromise: Promise<any>;

    constructor() {
        this._resolver = null;
        this._resPromise =   new Promise((resolve, reject)=> {
            this._resolver = resolve;
        })
    }

    get onLoad() {
        return this._resolver
    }


    resolve():Promise<any> {
       return this._resPromise
    }
}
;

@Directive({
    selector: 'mapbox-gl',
})
export class MapboxGlDirective implements AfterViewInit, Resolve<any> {
    private setting:Setting | {};

    resolve():Promise<any> {
        return new Promise((resolve, reject)=> {

            setTimeout(()=> {
                resolve()
            }, 5000)
        });
    }

    get mapboxgl():any {
        return this._mapboxgl;
    }

    set mapboxgl(value:any) {
        this._mapboxgl = value;
    }

    renderer:Renderer;
    el:ElementRef;
    nativeElement:any;
    map:any;
    private center:number[];
    private mapService;
    private _mapboxgl:any;
    private styleSource:any;
    private layers:Array<{}>;

    ngAfterViewInit():void {

        var localStorageCenter = this.ls.mapCenter;

        let el = this.el;
        el.nativeElement.innerHTML = '';
        mapboxgl.accessToken = "pk.eyJ1IjoibWF4aXNsYXYiLCJhIjoiY2lxbmlsNW9xMDAzNmh4bms4MGQ1enpvbiJ9.SvLPN0ZMYdq1FFMn7djryA";
        this.map = new mapboxgl.Map({
            container: el.nativeElement,
            center: [localStorageCenter.lng || this.center[0], localStorageCenter.lat || this.center[1]],
            zoom: localStorageCenter.zoom || 8,
            style: 'mapbox://styles/mapbox/streets-v9',

            _style: {
                "version": 8,
                "name": "plastun",
                "sprite": "http://" + window.location.hostname + "/src/sprite/sprite",
                "sources": this.styleSource,
                "layers": this.layers
            }
        });

        this.map.addControl(new mapboxgl.NavigationControl({
            position: 'top-right',
            maxWidth: 80
        }));


        this.map.on('load', ()=> {
            this.mapResolver.onLoad(this.map);
            this.map.addSource('hill',
                {
                    "type": "raster",
                    "tiles": [
                        "hills/{z}/{x}/{y}.png"
                    ],
                    "tileSize": 256
                });

            this.map.addLayer({
                'id': 'urban-areas-fill',
                'type': 'raster',
                "minzoom": 7,
                "maxzoom": 14,
                'source': 'hill'

            })
        });

        this.mapService.setMap(this.map);

    };


    constructor(el:ElementRef,
                renderer:Renderer,
                mapService:MapService,
                positionSiz:PositionSize,
                private ls:LocalStorage,
                private as:AuthService,
                private mapResolver : MapResolver) {

        this.setting = as.setting;
        this.center = [30.5, 50.5];
        this.el = el;
        this.renderer = renderer;
        this.mapService = mapService;
        this.mapService.mapboxgl = mapboxgl;

        this.styleSource = {
            "google-default": {
                "type": "raster",
                "tiles": [
                    "http://mt0.googleapis.com/vt/lyrs=m@207000000&hl=ru&src=api&x={x}&y={y}&z={z}&s=Galile",
                ],
                "tileSize": 256
            },
            "hills": {
                "type": "raster",
                "tiles": [
                    "hills/{z}/{x}/{y}.png"
                ],
                "tileSize": 256
            },
            "osm": {
                "type": "raster",
                "tiles": [
                    "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png"
                ],
                "tileSize": 256
            }
        };

        const layers = {
            'osm': {
                "id": "osm",
                "source": "osm",
                "type": "raster"
            },
            'ggl': {
                "id": "google-default",
                "source": "google-default",
                "type": "raster"
            },
            hill: {
                "id": "hills",
                "source": "hills",
                "type": "raster",
                "minzoom": 7,
                "maxzoom": 14
            }
        };

        console.log(as.setting)
        this.layers = [];
        if (!as.setting.map || as.setting.map == 'ggl') {
            this.layers.push(layers.ggl)
        }
        if (as.setting.hill) {
            this.layers.push(layers.hill)
        }


        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'rgba(200,200,200, 1)');
        //renderer.setElementStyle(el.nativeElement, 'color', 'white');
        // renderer.setElementStyle(el.nativeElement, 'width', '100%');
        //renderer.setElementStyle(el.nativeElement, 'height', '100%');


        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'gray');


    }


}
