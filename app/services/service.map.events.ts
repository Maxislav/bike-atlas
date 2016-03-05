import {Injectable} from 'angular2/core';
import {MyMap} from "../mymap";
import {LatLngService} from "./service.lat.lng";


@Injectable()
export class MymapEvents{
    public mouseLat: number;
    public mouseLng: number;
    public map: any;


    init(map){
        function setLatLng(e){

            this.mouseLng = e.latlng.lat.toFixed(6);
            this.mouseLat = e.latlng.lng.toFixed(6);
        }
        map.on('mousemove', setLatLng.bind(this))
    }



}