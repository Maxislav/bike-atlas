/**
 * Created by mars on 2/29/16.
 */
import {Injectable} from 'angular2/core'
@Injectable()
export class LatLngService {

    setLng(value:number) {
        this.lng = value;
    }
    public lat: number = 102;
    public lng: number =9302;


}