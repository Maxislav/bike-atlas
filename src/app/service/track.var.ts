
export class Point extends Array<number>{
    get bearing(): number {
        return this._bearing;
    }

    set bearing(value: number) {
        this._bearing = value;
    }
    set lat(value: number) {
        this._lat = value;
    }

    private _lng:number;
    private _lat:number;
    private _azimuth:number;
    private _bearing:number;

    constructor(...args){
        super(...args);
        //this.push(...args);
        this.lng = args[0]
        this.lat = args[1]
        this.bearing = this.azimuth = args[2]
    }

    set lng(val){
        this._lng = val;
    }
    get lng() {
        return this._lng;
    }
    get lat() {
        return this[1]
    }
    set azimuth(val) {
        this._azimuth = val;
    }
    get azimuth() {
        return this._azimuth;
    }


}




export interface Coordinate extends Array<number>{
    
}

export  interface Track {
    id: string;
    show: Function;
    hide: Function;
    coordinates: Array<Coordinate>;
    points: Array<Point>,
    color: String,
    distance: number
}


