/**
 * Created by maxislav on 20.10.16.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class Mercator{
    public lng: number;
    public lat: number;
    public dy: number;
    Pi: number;
    constructor(){ 
        this.Pi = Math.PI;
        this.getXpixel
    }

    public getYpixel = (fi: number, z: number)=>{
        var pi : number = this.Pi;
        var t = Math.tan(   (pi/4)+this.toRad(fi)/2    );
        this.dy = (128/pi)*Math.pow(2,z)*( pi- Math.log(t));
        return Math.round(this.dy);
    };
    public getXpixel = (la: number, z: number)=>{
        var pi : number = this.Pi;
        return (128/pi)*Math.pow(2,z)*(this.toRad(la) + pi);
    };

    private toRad(degrees: number){
        return degrees * Math.PI / 180;
    }

}
