/**
 * Created by maxislav on 20.10.16.
 */
import { Injectable, ApplicationRef } from '@angular/core';
import { SimpleChanges, OnChanges } from '@angular/core';
import { LocalStorage } from '../service/local-storage.service';
import { Deferred } from 'src/app/util/deferred';
import {MyMap} from '../directive/mapbox-gl.directive';


@Injectable()
export class MapService {

    public _map: MyMap;
    public lat: number;
    public lng: number;
    public lngMap: string ;
    public latMap: string ;
    public zoom: string;
    public foo: Function;
    public pitch: string;
    public bearing: string;
    private _mapboxgl: any;
    private onLoadDeferred: Deferred<any>;
    socket: any;
    public onLoad: Promise<any>;

    // public ls: LocalStorage
    //private ref: ApplicationRef


    constructor(private ref: ApplicationRef, private ls: LocalStorage) {
        this.events = {
            load: []
        };



        this.onLoadDeferred = new Deferred<any>();
        this.onLoad = this.onLoadDeferred.promise;

    }


    setMap(map: MyMap) {
        this.map = map;
        //this.trackService.setMap(map);
        map.on('load', () => {
            this.pitch = map.getPitch().toFixed(0);
            this.bearing = map.getBearing().toFixed(1);
            this.zoom = map.getZoom().toFixed(1);
            let LngLat = map.getCenter();
            this.lngMap = LngLat.lng.toFixed(4);
            this.latMap = LngLat.lat.toFixed(4);
            this.onLoadDeferred.resolve(this.map);
            this.ref.tick();
        });

        map.on('mousemove', (e) => {
            this.lat = e.lngLat.lat.toFixed(4);
            this.lng = e.lngLat.lng.toFixed(4);
            this.ref.tick();
        });

        map.on('move', (e) => {
            //console.log()
            this.pitch = map.getPitch().toFixed(0);
            this.bearing = map.getBearing().toFixed(1);
            this.zoom = map.getZoom().toFixed(1);
            let LngLat = map.getCenter();
            this.lngMap = LngLat.lng.toFixed(4);
            this.latMap = LngLat.lat.toFixed(4);
            this.ref.tick();
        });

        map.on('moveend', () => {
            let LngLat = map.getCenter();

            let opt = {
                lng: LngLat.lng,
                lat: LngLat.lat,
                zoom: map.getZoom()
            };

            this.ls.mapCenter = opt;
        });

    }

    registerEvent(name: string, f: Function) {

        this.events[name] = this.events[name] || [];
        this.events[name].push(f);
    }

    registerChanges(foo: Function) {
        this.foo = foo;
    }

    onTrack(arr: Array<Object>) {

    }



    get mapboxgl(): any {
        return this._mapboxgl;
    }

    set mapboxgl(value: any) {
        this._mapboxgl = value;
    }


    get map(): MyMap {
        return this._map;
    }

    set map(value: MyMap) {
        this._map = value;
    }

    public events: {
        load: Function[]
    };


}
