import {AfterViewInit, Injectable, NgZone} from '@angular/core';
import {Directive, ElementRef} from '@angular/core';
import {MapService} from '../service/map.service';
import {PositionSize} from '../service/position-size.service';
import {LocalStorage} from '../service/local-storage.service';
import mapboxgl from '../../lib/mapbox-gl/mapbox-gl';

import dateFormat from 'dateformat/lib/dateformat.js';

import {Resolve} from '@angular/router';
import {Setting, UserService} from '../service/main.user.service';

const getMin = (date: number): string => {
    let m = new Date(date).getMinutes();
    while (m % 10) {
        m -= 1
    }
    if (m < 10) {
        return `0${m}`
    }
    return `${m}`;
};

export class MyMap extends mapboxgl.Map {
    onLoad: Promise<this>;

    // noinspection JSAnnotator
    //on(type: string, listener: (ev: any) => void): this;
    //addControl: (any) => void;
    constructor(options) {
        super(options);
        this.onLoad = new Promise((resoleve) => {
            this.on('load', () => {
                resoleve(this);
            });
        });

    }

    // noinspection JSAnnotator
    on(type: any, listener: any) {
        return super.on(type, listener)
    }

    addControl(control, position?) {
        return super.addControl(control, position)
    }


}

@Injectable()
export class MapResolver implements Resolve<any> {
    public _resolver: Function;
    private _resPromise: Promise<any>;

    constructor() {
        this._resolver = null;
        this._resPromise = new Promise((resolve, reject) => {
            this._resolver = resolve;
        });
    }

    get onLoad() {
        return this._resolver;
    }


    resolve(): Promise<any> {
        return this._resPromise;
    }
}


@Directive({
    selector: 'mapbox-gl',
    host: {
        'map': 'map'
    }
})
export class MapboxGlDirective implements AfterViewInit {
    private setting: Setting;

    get mapboxgl(): any {
        return this._mapboxgl;
    }

    set mapboxgl(value: any) {
        this._mapboxgl = value;
    }

    nativeElement: any;
    map: MyMap;
    private center: number[];
    private mapService;
    private _mapboxgl: any;
    private styleSource: any;
    private layers: Array<{}> = [];

    constructor(private el: ElementRef,
                mapService: MapService,
                positionSiz: PositionSize,
                private ls: LocalStorage,
                private userService: UserService,
                public ngZone: NgZone,
                private mapResolver: MapResolver) {

        this.setting = userService.getSetting() || new Setting();
        this.center = [30.5, 50.5];
        this.mapService = mapService;
        this.mapService.mapboxgl = mapboxgl;

        this.styleSource = {
            'google-default': {
                'type': 'raster',
                'tiles': [
                    'http://mt0.googleapis.com/vt/lyrs=m@207000000&hl=ru&src=api&x={x}&y={y}&z={z}&s=Galile',
                ],
                'tileSize': 256
            },
            'hills': {
                'type': 'raster',
                'tiles': [
                    'hills/{z}/{x}/{y}.png'
                ],
                'tileSize': 256
            },
            'osm': {
                'type': 'raster',
                'tiles': [
                    'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png'
                ],
                'tileSize': 256
            }
        };

        const layers = {
            /* 'osm': {
                 'id': 'osm',
                 'source': 'osm',
                 'type': 'raster'
             },*/
            'ggl': {
                'id': 'google-default',
                'source': 'google-default',
                'type': 'raster'
            },
            hill: {
                'id': 'hills',
                'source': 'hills',
                'type': 'raster',
                'minzoom': 7,
                'maxzoom': 14
            }
        };

        console.log('setting->', this.setting);
        // this.layers = [];
        if (!this.setting.map || this.setting.map == 'ggl') {
            this.layers.push(layers.ggl);
        }
        if (this.setting.hill) {
            //this.layers.push(layers.hill);
        }

        const re = {
            setElementStyle: (el, key, value) => {
                el.style[key] = value
            }
        }

        re.setElementStyle(el.nativeElement, 'backgroundColor', 'rgba(200,200,200, 1)');
        //renderer.setElementStyle(el.nativeElement, 'color', 'white');
        // renderer.setElementStyle(el.nativeElement, 'width', '100%');
        //renderer.setElementStyle(el.nativeElement, 'height', '100%');


        re.setElementStyle(el.nativeElement, 'backgroundColor', '#dbd6cf');


    }

    ngAfterViewInit(): void {
        this.ngZone.runOutsideAngular(() => {
            const localStorageCenter = this.ls.mapCenter;
            let el = this.el;
            el.nativeElement.innerHTML = '';
            // const dd: any = MBGL
            mapboxgl.accessToken = 'pk.eyJ1IjoibWF4aXNsYXYiLCJhIjoiY2lxbmlsNW9xMDAzNmh4bms4MGQ1enpvbiJ9.SvLPN0ZMYdq1FFMn7djryA';


            this.map = new MyMap({
                container: el.nativeElement,
                center: [localStorageCenter.lng || this.center[0], localStorageCenter.lat || this.center[1]],
                zoom: localStorageCenter.zoom || 8,
                // style: 'mapbox://styles/mapbox/streets-v9',
                // style: 'https://maps.tilehosting.com/styles/hybrid/style.json?key=RAuP21B0giTgs7R7HXfl',

                /*style: {
                    "version": 8,
                    "name": "plastun",
                    // "sprite": "http://" + window.location.hostname + "/src/sprite/sprite",
                    "sources": this.styleSource,
                    "layers": this.layers
                }*/

                style: 'mapbox://styles/mapbox/traffic-day-v2'
            });


            this.map.addControl(new mapboxgl.NavigationControl({
                position: 'top-right',
                maxWidth: 80
            }));


            this.map.on('load', () => {
                let d = new Date();
                // const offset = (count - 1) * 10 * 60 * 1000 + 10 * 60 * 1000;
                const date = d.getTime() + d.getTimezoneOffset() * 60 * 1000 - 2 * 10 * 60 * 1000 + 10 * 60 * 1000;
                const day = dateFormat(date, 'yyyy-mm-dd').concat('T').concat(dateFormat(date, 'HH')).concat(':', getMin(date));
                this.mapResolver.onLoad(this.map);
                this.map.addSource('openrain', {
                    'type': 'raster',
                    'tiles': [
                        `https://c.sat.owm.io/maps/2.0/radar/{z}/{x}/{y}?appid=9de243494c0b295cca9337e1e96b00e2&day=${day}`
                    ],
                    'tileSize': 256
                })
                this.map.addLayer({
                    'id': 'openrain',
                    'type': 'raster',
                    'minzoom': 4,
                    'maxzoom': 15,
                    'source': 'openrain',
                    "paint": {
                        "raster-opacity": 0.5
                    }
                })
                /* this.map.addSource('hill',
                     {
                         'type': 'raster',
                         'tiles': [
                             System.baseURL + 'hills/{z}/{x}/{y}.png'
                         ],
                         'tileSize': 256
                     });*/

                /*this.map.addLayer({
                    'id': 'urban-areas-fill',
                    'type': 'raster',
                    'minzoom': 7,
                    'maxzoom': 14,
                    'source': 'hill'

                });*/
            });
            this.mapService.setMap(this.map);


        });

    };


}
