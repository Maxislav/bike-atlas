
export class Point{
    lng: number;
    lat: number;
    bearing: number
}

export class Coordinate extends Array<number>{
    
}

export  class Track {
    id: string;
    show: Function;
    hide: Function;
    coordinates: Array<Array<number>>;
    points: Array<Point>
}


