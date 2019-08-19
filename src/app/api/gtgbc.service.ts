import { Injectable } from '@angular/core';
import { Io } from '../service/socket.oi.service';
import { MobileCell, LngLat } from '../../types/global';


@Injectable()
export class GtgbcService {
    private socket: any;
    constructor( private io: Io){
        this.socket = io.socket;
    }


    getLatLng(arr: Array<MobileCell>){
        console.log(arr)
        return this.socket.$get('onGtgbc', arr)
            .then(d =>{

                if(d.error){
                    return Promise.reject(d.error)
                }

               /* const resArr = d.result.map((str, i)=>{
                    const lat  = str.match(/Lat=-?[\d\.]+/)[0].replace(/^Lat=/, '');
                    const lng  = str.match(/Lon=-?[\d\.]+/)[0].replace(/^Lon=/, '');
                    return {
                        lat: Number(lat),
                        lng: Number(lng),
                        id: arr[i].cellId
                    }
                });*/
                return d.cells
            })
    }
}
