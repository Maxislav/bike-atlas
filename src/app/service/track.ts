/**
 * Created by maxislav on 30.11.16.
 */

import {Injectable} from '@angular/core';
import * as R from '@ramda/ramda.min.js';
import {Track as Tr, Point} from 'app/service/track.var';
import {Util} from './util';


@Injectable()
export class Track {



    layerIds:Array<number>;

    private util: Util;
    private _trackList: Array<Tr> = [];
    private _map:any;

    constructor() {
        this.layerIds = [];
        this._trackList = [];
        this.util = new Util();

    }

    setMap(map:any) {
        this.map = map
    }

    showTrack(data:Array<Point>) {

        const $this = this;
        const coordinates = [];
        const points: Array<Point> = []

        const trackList = this.trackList;

        const color = this._getColor()
        console.log(color);



        data.forEach(({lng, lat})=> {
            coordinates.push([lng, lat])
            points.push({lng,lat})
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
                "line-color": color,
                "line-width": 8,
                "line-opacity": 0.8
            }
        });

        let tr: Tr = {
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
            coordinates: coordinates,
            points: points,
            color:color
            //distance: (function() { return $this.util.distance(this)})()
        };

        tr.distance = this.util.distance(tr);
        this.util.bearing(tr.points);


        trackList.push(tr);
        console.log(tr);

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
    _getColor(){
        const I = parseInt;
        let c = ['0','0','0'];

        c.forEach( (r, i) => {
            r = I(this.getRandom(100,255,true)).toString(16);
            if(r.length<2){
                c[i]='0'+r
            }else{
                c[i]= r
            }
        });


        return '#' + c.join('')
    }

    set map(value:any) {
        //console.log(value)
        this._map = value;
    }
    get map():any {
        return this._map;
    }

    get trackList():Array<Tr> {
        return this._trackList;
    }

    set trackList(value:Array<Tr>) {
        this._trackList = value;
    }

}