
export interface  Point{
    lng: number;
    lat: number;
    bearing?: number;
}

export interface Coordinate extends Array<number>{
    
}

export  interface Track {
    id: string;
    show: Function;
    hide: Function;
    coordinates: Array<Coordinate>;
    points: Array<Point>
}


