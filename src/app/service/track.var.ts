
export class Point{
    lng: number;
    lat: number
}


export  class Track {
    id: string;
    show: Function;
    hide: Function;
    coordinates: Array<Array<number>>;
    points: Array<Point>
}
