/**
 * Created by maxislav on 20.10.16.
 */
import {Injectable, ApplicationRef} from '@angular/core';
import {SimpleChanges, OnChanges} from '@angular/core';
import {LocalStorage} from '../service/local-storage.service';


@Injectable()
export class MapService {

  
    public _map:any;
    public lat:number;
    public lng:number;
    public lngMap:number;
    public latMap:number;
    public zoom:number;
    public foo:Function;
    public pitch:number;
    public bearing:number;
    private _onLoad: Promise<_map>;

    private _mapboxgl: any;
    private _resolve: Function
    socket:any;

    // public ls: LocalStorage
    //private ref: ApplicationRef


    constructor(private ref:ApplicationRef, private ls:LocalStorage) {
        this.events = {
            load: []
        };

        this._onLoad = new Promise((resolve, reject)=>{
            this._resolve = resolve;
        })
       
    }


    setMap(map:any) {
        this.map = map;
        //this.trackService.setMap(map);
        map.on('load', ()=> {
            this.pitch = map.getPitch().toFixed(0);
            this.bearing = map.getBearing().toFixed(1)
            this.zoom = map.getZoom().toFixed(1);
            let LngLat = map.getCenter();
            this.lngMap = LngLat.lng.toFixed(4);
            this.latMap = LngLat.lat.toFixed(4);
            this._resolve(map);
            this.ref.tick()
        });

        map.on('mousemove', (e)=> {
            this.lat = e.lngLat.lat.toFixed(4);
            this.lng = e.lngLat.lng.toFixed(4);
        });

        map.on('move', (e)=> {
            //console.log()
            this.pitch = map.getPitch().toFixed(0);
            this.bearing = map.getBearing().toFixed(1)
            this.zoom = map.getZoom().toFixed(1);
            let LngLat = map.getCenter();
            this.lngMap = LngLat.lng.toFixed(4);
            this.latMap = LngLat.lat.toFixed(4);

        });

        map.on('moveend', ()=> {
            let LngLat = map.getCenter();

            let opt = {
                lng: LngLat.lng,
                lat: LngLat.lat,
                zoom: map.getZoom()
            };

            this.ls.mapCenter = opt;
        })

    }

    registerEvent(name:string, f:Function) {

        this.events[name] = this.events[name] || [];
        this.events[name].push(f)
    }

    registerChanges(foo:Function) {
        this.foo = foo;
    }

    onTrack(arr:Array<Object>) {

    }

    get onLoad(): Promise<_map> {
        return this._onLoad;
    }
    get mapboxgl(): any {
        return this._mapboxgl;
    }

    set mapboxgl(value: any) {
        this._mapboxgl = value;
    }



    get map(): any {
        return this._map;
    }

    set map(value: any) {
        this._map = value;
    }

    public events:{
        load:Function[]
    };


}