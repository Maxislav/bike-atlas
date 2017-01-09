import {Injectable} from "@angular/core";
import {MapService} from "./map.service";



@Injectable()
export class PrivateAreaService{
    public map : any;
    constructor(private mapService: MapService){

        mapService.onLoad.then(_map=>{
            console.log(_map)
            this.map = _map
        })
    }

}