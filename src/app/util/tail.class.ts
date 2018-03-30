import {Point} from "../service/track.var";

export class Tail {

    static layerIds: string[] = [];
    private id: string;
    private points: Point[] = []

    constructor(private startPoint: Point,private map) {
        this.id = this.getNewLayer(0, 50000, true);
        this.update(startPoint)
    }

    update(lngLat: Point):Tail {
       this.points.push(lngLat)
       return this
    }

    private getNewLayer(min, max, int) {
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand = 'tail' + Math.round(rand)
        }
        if (-1 < Tail.layerIds.indexOf(rand)) {
            return this.getNewLayer(min, max, int)
        } else {
            return rand;
        }
    }



}