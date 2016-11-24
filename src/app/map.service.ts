/**
 * Created by maxislav on 20.10.16.
 */
import { Injectable, Input } from '@angular/core';
import { SimpleChanges, OnChanges } from '@angular/core';


@Injectable()
export class MapService {

    private events: Object;
    public map: any;
    public lat: number;
    public lng: number;
    public zoom: number;
    public foo: Function;

    constructor(){

    }

    setMap(map: any){
        this.map = map;

        map.on('mousemove', (e)=>{
            this.lat = e.lngLat.lat.toFixed(4);
            this.lng = e.lngLat.lng.toFixed(4);
        });
        /*this.zoom = map.getZoom();

        map.on('mousemove', (e)=>{
            this.lat = e.latlng.lat;
            this.lng = e.latlng.lng;
            this.foo && this.foo(this.lat, this.lng, this.zoom)
        });
        map.on("zoom", (e)=>{
            this.zoom = map.getZoom();
            this.foo && this.foo(this.lat, this.lng, this.zoom)
        })*/

    }



    registerChanges(foo: Function){
        this.foo = foo;
    }



}