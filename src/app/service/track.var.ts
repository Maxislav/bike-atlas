
export class Point extends Array<number>{

    constructor(...args){
        super(...args);
        this.push(...args);
    }

    get lng() {
        return this[0]
    }
    get lat() {
        return this[1]
    }
    set azimuth(val) {
        this[2] = val;
    }
    get azimuth() {
        return this[2];
    }
    set bearing(val) {
        this[2] = val;
    }
    get bearing() {
        return this[2];
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


