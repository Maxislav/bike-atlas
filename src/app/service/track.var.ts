
export class Point extends Array<number>{



    private _date: Date;
   

    public id: number;
    public speed: number;


    constructor(...args){
        super(...args);
    }

    get lng() {
        return this[0]
    }
    get lat() {
        return this[1]
    }
    get azimuth() {
        return this[2]
    }
    get bearing(): number {
        return this[2]
    }

    set bearing(val: number){
        this[2] = val
    }
    get date():Date | String {
        return this._date;
    }
    set date(value: String | Date) {
        this._date = new Date(value);
    }

}




export interface Coordinate extends Array<number>{
    
}

export  interface Track {
    id: string;
    download: Function;
    showSrcPoint: Function;
    hideSrcPoint: Function;
    hide: Function;
    update: Function;
    coordinates: Array<Coordinate>;
    points: Array<Point>,
    color: String,
    distance: number
}


