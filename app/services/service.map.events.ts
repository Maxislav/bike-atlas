import {Injectable} from 'angular2/core';
import {MyMap} from "../mymap";
import {LocalStorage} from "angular2-local-storage/local_storage";
import {ServiceMenu} from "./service.menu";

@Injectable()
export class MymapEvents{
    public mouseLat: number;
    public mouseLng: number;
    public mapLat: number;
    public mapLng: number;
    public mapZoom: number;
    serviceMenu: ServiceMenu;
    private map;
    localStorage : LocalStorage;
    constructor( serviceMenu: ServiceMenu){
        this.serviceMenu = serviceMenu;
        this.localStorage = new LocalStorage();
    }

    init(map){


        function setLatLng(e){
            this.mouseLng = e.latlng.lat.toFixed(6);
            this.mouseLat = e.latlng.lng.toFixed(6);
        }
        map.on('mousemove', setLatLng.bind(this));

        function getCenter(){
            this.mapLat = map.getCenter().lat.toFixed(6);
            this.mapLng = map.getCenter().lng.toFixed(6);
            this.localStorage.set( 'mapLat', this.mapLat) ;
            this.localStorage.set( 'mapLng', this.mapLng) ;

        }
        getCenter.call(this);

        map.on('moveend', getCenter.bind(this));

        function setZoomToStarage(){
            this.mapZoom = map.getZoom();
            this.localStorage.set( 'mapZoom', this.mapZoom) ;
        }

        map.on('zoomend', setZoomToStarage.bind(this));

        function hideMenu(){
            this.serviceMenu.show = false;
        }
        map.on('click', hideMenu.bind(this))

    }





}