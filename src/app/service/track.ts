/**
 * Created by maxislav on 30.11.16.
 */

import {Injectable} from '@angular/core';
import * as R from '@ramda/ramda.min.js';

class _Tracks {
    id: string;
    show: Function;
    hide: Function;
    coordinates: Array<Array<number>>
}

@Injectable()
export class Track {


    layerIds:Array<number>;

    private _trackList: Array<_Tracks> = [];
    private _map:any;

    constructor() {
        this.layerIds = [];

    }

    setMap(map:any) {
        this.map = map
    }

    showTrack(data:Array<{lng:number, lat:number}>) {

        const $this = this;
        const coordinates = [];
        const trackList =  this.trackList;
        data.forEach(item=> {
            coordinates.push([item.lng, item.lat])
        });

        let layerId:string = this.getRandom(0, 5000000, false)+'';

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

        let tr: _Tracks = {
            hide: function () {
                $this.map.removeLayer(layerId);
                $this.map.removeSource(layerId);
                let index = R.findIndex(R.propEq('id', layerId))(trackList);
                trackList.splice(index, 1);
                console.log('delete track index', index)
            },
            show: function () {
                return $this.showTrack(data)
            },
            id: layerId,
            coordinates: coordinates
        };



        trackList.push(tr);

        return tr
    }

   

    getRandom(min, max, int) {
        var rand = min + Math.random() * (max - min);
        if (int) {
            rand = Math.round(rand)+''
        }
        if (-1<this.layerIds.indexOf(rand)) {
            return this.getRandom(min, max, int)
        } else {
            return rand;
        }

    }



    set map(value:any) {
        //console.log(value)
        this._map = value;
    }
    get map():any {
        return this._map;
    }
    get trackList():Array<_Tracks> {
        return this._trackList;
    }

    set trackList(value:Array<_Tracks>) {
        this._trackList = value;
    }



}