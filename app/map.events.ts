import {MyMap} from "./mymap";
import {LatLngService} from "./services/service.lat.lng";
import { Injector } from 'angular2/core';
/**
 * Created by mars on 3/1/16.
 */
export class MapEvents{
    public latLngService: LatLngService;
    constructor(){
        //console.log(this.latLngService)
        /*console.log(this.latLngService)
        map.on('mousemove', function(e){
         // console.log(e.latlng)
        })*/
    }
}