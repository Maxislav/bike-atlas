/**
 * Created by maxislav on 25.11.16.
 */
import {Injectable} from "@angular/core";

@Injectable()
export class LocalStorage{
    

    private prefix: string;
    private _mapCenter: {
        lng: number,
        lat:number,
        zoom: number
    };

    constructor(){
        this.prefix = window.location.hostname;
        this._mapCenter = {
            lng: null,
            lat: null,
            zoom: null
        };
        var strMapCenter =  JSON.stringify(this._mapCenter);
        if(!localStorage.getItem(this.prefix+'-'+'map-center')){
            localStorage.setItem(this.prefix+'-'+'map-center', strMapCenter)
        }else{
            this.mapCenter = JSON.parse(localStorage.getItem(this.prefix+'-'+'map-center'))
        }

    }

    get mapCenter():{lng:number; lat:number; zoom:number} {
        return this._mapCenter;
    }

    set mapCenter(value:{lng:number; lat:number; zoom:number}) {
        localStorage.setItem(this.prefix+'-'+'map-center', JSON.stringify(value));
        this._mapCenter = value;
    }
    //get mapCenter



}