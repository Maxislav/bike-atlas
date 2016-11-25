/**
 * Created by maxislav on 25.11.16.
 */
import {Injectable} from "@angular/core";

@Injectable()
export class LocalStorage{
    

    private _mapCenter: {
        lng: number,
        lat:number
    };

    constructor(){
        this._mapCenter = {
            lng: null,
            lat: null
        };
        var strMapCenter =  JSON.stringify(this._mapCenter);
        if(!localStorage.getItem('mapCenter')){
            localStorage.setItem('mapCenter', strMapCenter)
        }else{
            this.mapCenter = JSON.parse(localStorage.getItem('mapCenter'))
        }

    }

    get mapCenter():{lng:number; lat:number} {
        return this._mapCenter;
    }

    set mapCenter(value:{lng:number; lat:number}) {
        localStorage.setItem('mapCenter', JSON.stringify(value));
        this._mapCenter = value;
    }
    //get mapCenter



}