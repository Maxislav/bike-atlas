/**
 * Created by maxislav on 30.11.16.
 */

import {Injectable} from '@angular/core';
import * as R from '@ramda/ramda.min.js';
import {Track as Tr, Point, Coordinate} from 'app/service/track.var';
import {Util} from './util';
import {Io} from "./socket.oi.service";
import {MapService} from "./map.service";
const F = parseFloat;
const I = parseInt;

@Injectable()
export class TrackService {

    layerIds:Array<number>;

    private util: Util;
    private _trackList: Array<Tr> = [];
    private _map:any;

    constructor(private io:Io, private mapService: MapService) {
        this.layerIds = [];
        this._trackList = [];
        this.util = new Util();

        const socket = io.socket;

        socket.on('file', d=>{

            let xmlStr = String.fromCharCode.apply(null, new Uint8Array(d));
            this.showGpxTrack(xmlStr)

        });
    }

    showGpxTrack(xmlStr: string){
        const track = [];
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlStr, "text/xml");
        var forEach = Array.prototype.forEach;
        forEach.call(xmlDoc.getElementsByTagName('trkpt'), item=>{
            if(item.getAttribute('lon')){
                track.push({
                    lng:F(item.getAttribute('lon')),
                    lat:F(item.getAttribute('lat'))
                })
            }
        });
        this.showTrack(track)
    }

    setMap(map:any) {
        this.map = map
    }

    showTrack(data:Array<Point>) {
        const $this = this;
        const coordinates = [];
        const points: Array<Point> = []
        const trackList = this.trackList;
        const color = this._getColor();
        const map = this.mapService.map;



        data.forEach(({lng, lat})=> {
            coordinates.push([lng, lat])
            points.push({lng,lat})
        });
        
        

        let layerId:string = this.getRandom(0, 5000000, false)+'';

        map.addSource(layerId, {
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

        map.addLayer({
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
                map.removeLayer(layerId);
                map.removeSource(layerId);
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

    marker(point: Point){
        const map = this.mapService.map;
        const mapboxgl = this.mapService.mapboxgl;

        const icoContainer = document.createElement('div');
        icoContainer.classList.add("track-icon");
        const icoEl = document.createElement('div');
        icoContainer.appendChild(icoEl);
        
        
        const iconMarker = new mapboxgl.Marker(icoContainer, {offset: [-10, -10]})
            .setLngLat([point.lng, point.lat])
            .addTo(map);


        
        
        const marker = {
            lng: point.lng,
            lat: point.lat,
            bearing: point.bearing,
            _mapBearing: map.getBearing(),
            rotate: function () {
                let angle =this.bearing-this._mapBearing;
                icoEl.style.transform = "rotate("+I(angle+'')+"deg)"
            },
            update: function (point:Point) {
                for(let opt in point){
                    this[opt] = point[opt];
                }
                if(point.bearing){
                    this.rotate();
                }
                iconMarker.setLngLat([this.lng, this.lat])
            },
            remove: function () {
                iconMarker.remove();
                map.off('move', rotate)
            }
        };

        const rotate = ()=>{
            const mapBearing = map.getBearing();
            if(marker._mapBearing != mapBearing ){
                marker._mapBearing = mapBearing;
                marker.rotate();
            }

        };

        map.on('move', rotate);

        return marker;
    }
    
    showSpriteMarker(point: Point){
        var point = {
            "type": "Point",
            "coordinates": [point.lng, point.lat]
        };
        const map = this.map;
        const F = parseFloat;

        let layerId:string = this.getRandom(0, 5000000, false)+'';

        map.addSource(layerId, { type: 'geojson', data: point });

        map.addLayer({
            "id": layerId,
            "type": "symbol",
            "source": layerId,
            "layout": {
                "icon-image": "arrow"
            }
        });
      
        
        
        return {
            id: layerId,
            setCenter: function (_point: Point, bearing: number) {
                point.coordinates = [_point.lng, _point.lat];
                if(bearing){
                    map.setLayoutProperty(layerId, 'icon-rotate', bearing-map.getBearing());
                }
                map.getSource(layerId).setData(point);
            },
            hide: function () {
                map.removeLayer(layerId);
                map.removeSource(layerId);
                console.log('delete marker id', layerId)
            }
        }

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
        const colors: Array<string> = [

        ];


        let c = ['0','0','0'];

        c.forEach( (r, i) => {
            r = I(this.getRandom(100,200,true)).toString(16);
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