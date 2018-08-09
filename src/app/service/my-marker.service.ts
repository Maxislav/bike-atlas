import { Injectable } from '@angular/core';
import { MapService } from 'app/service/map.service';

export interface MyMarker{
    id: number;
    lng: number;
    lat: number;
    tile: string;
}

@Injectable()
export class MyMarkerService {
    markerList: Array<MyMarker>;
    isShow: boolean = false;
    constructor(private mapService: MapService){}

    show(){
        this.isShow = true
    }

    hide(){
        this.isShow = false
    }

    createMarker(lng: number, lat: number){

    }




}

