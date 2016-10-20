/**
 * Created by maxislav on 20.10.16.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class Mercator{
    public lng: number;
    public lat: number;
    public dy: number;

    getYpixel(fi: number, z: number){
        
        this.dy = 128/Math.PI;
        return 1;
    }
   
}
