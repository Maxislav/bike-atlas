/**
 * Created by maxislav on 30.11.16.
 */

import {Injectable} from '@angular/core';

@Injectable()
export class Track {
    get map():any {
        return this._map;
    }


    layerIds:Array<number>;

    constructor() {
        this.layerIds = []
    }

    set map(value:any) {
        console.log(value)
        this._map = value;
    }

    private _map:any;

    setMap(map:any) {
        this.map = map
    }


    showTrack(data:Array<{lng:number, lat:number}>) {

        console.log(this);
        const coordinates = [];
        data.forEach(item=> {
            coordinates.push([item.lng, item.lat])
        });

        let layerId:any = this.getRandom(0, 5000000, false)+'';

        this.map.addSource(layerId, {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinates
                }
            }
        });

        this.map.addLayer({
            "id": layerId,
            "type": "line",
            "source": layerId,
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#FF058A",
                "line-width": 8,
                "line-opacity": 0.5
            }
        });

        //debugger


        return function () {

        }


    }

    getRandom(min, max, int) {
        var rand = min + Math.random() * (max - min);
        if (int) {
            rand = Math.round(rand)
        }
        if (-1<this.layerIds.indexOf(rand+'')) {
            return this.getRandom(min, max, int)
        } else {
            return rand;
        }

    }


}