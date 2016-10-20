/**
 * Created by maxislav on 20.10.16.
 */
import { Injectable, Input } from '@angular/core';
import { SimpleChanges, OnChanges } from '@angular/core';

@Injectable()
export class MapService {

    public map: any;
    public lat: number;
    public lng: number;
    public zoom: number;
    
    foo: Function;
    setMap(map: any){
        this.map = map;
        this.zoom = map.getZoom();

        map.on('mousemove', (e)=>{
            this.lat = e.latlng.lat;
            this.lng = e.latlng.lng;
            this.foo && this.foo(this.lat, this.lng, this.zoom)
        });
        map.on("zoom", (e)=>{
            this.zoom = map.getZoom();
            this.foo && this.foo(this.lat, this.lng, this.zoom)
        })

    }
    registerChanges(foo: Function){
        this.foo = foo;
    }



}