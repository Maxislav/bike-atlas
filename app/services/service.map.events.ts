import {Injectable} from 'angular2/core';
import {MyMap} from "../mymap";


@Injectable()
export class MymapEvents{
    public mouseLat: number;
    public mouseLng: number;
    public mapLat: number;
    public mapLng: number;
    private map;


    init(map){
        function setLatLng(e){
            this.mouseLng = e.latlng.lat.toFixed(6);
            this.mouseLat = e.latlng.lng.toFixed(6);
        }
        map.on('mousemove', setLatLng.bind(this));

        function getCenter(){
            this.mapLat = map.getCenter().lat.toFixed(6);
            this.mapLng = map.getCenter().lng.toFixed(6);
        }
        getCenter.call(this);

        map.on('moveend', getCenter.bind(this))
    }



}