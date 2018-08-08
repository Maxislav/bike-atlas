import { Injectable } from '@angular/core';

export interface Marker{
    id: number;
    lng: number;
    lat: number;
    tile: string;
}

@Injectable()
export class MyMarkerService {
    markerList: Array<Marker>;
    isShow: boolean = false;
    constructor(){}

    show(){
        this.isShow = true
    }

    hide(){
        this.isShow = false
    }



}

