/**
 * Created by maxislav on 30.11.16.
 */

import {Injectable, transition} from '@angular/core';
import * as R from '@ramda/ramda.min.js';
import {Util} from './util';
import {Io} from "./socket.oi.service";
import {MapService} from "./map.service";
import {Track as Tr, Point} from "./track.var";
import * as mapboxgl from "@lib/mapbox-gl/mapbox-gl.js";
const F = parseFloat;
const I = parseInt;

@Injectable()
export class TrackService {

    layerIds:Array<String>;

    private util: Util;
    private _trackList: Array<Tr> = [];
    private _map:any;
    private popupEdit: any;
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
        forEach.call(xmlDoc.getElementsByTagName('trkpt'), (item, i)=>{
            if(item.getAttribute('lon')){
                item.setAttribute('id',i)
                const ele = item.getElementsByTagName('ele') ? item.getElementsByTagName('ele')[0] : null;
                const point: Point = new Point(F(item.getAttribute('lon')), F(item.getAttribute('lat')), ele  ? F(ele.innerHTML): null);
                point.date = item.getElementsByTagName('time')[0].innerHTML;
                point.id = i;
                track.push(point)
            }
        });
        this.showTrack(track, xmlDoc)



    }

    setMap(map:any) {
        this.map = map
    }

    showTrack(points:Array<Point>, xmlDoc) {
        const $this = this;
        const coordinates = [];
        //const points: Array<Point> = []
        const trackList = this.trackList;
        const color = this._getColor();
        const map = this.mapService.map;


        points.forEach((point)=> {
            coordinates.push(point);
        });
        
        

        let layerId:string = this.getLayerId('track-')+'';

        const data =  {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": points
            }
        };


        map.addSource(layerId, {
            "type": "geojson",
            "data": data
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

        const update = (points: Array<Point>) => {
            data.geometry.coordinates = points;
            map.getSource(layerId).setData(data)

        };

        const srcPoints = this.addSrcPoints(points, xmlDoc, update);

        let tr: Tr = {
            hide: function () {
                map.removeLayer(layerId);
                map.removeSource(layerId);
                let index = R.findIndex(R.propEq('id', layerId))(trackList);
                trackList.splice(index, 1);


               
                
                
                console.log('delete track index', index)
                srcPoints.remove()
            },
            show:  () => {
                //return this.showTrack(points)
            },
            update: update,
            id: layerId,
            coordinates: coordinates,
            points: points,
            color:color,
            distance: 0,
            download: () =>{
                this.onDownload(xmlDoc)
            }
            //distance: (function() { return $this.util.distance(this)})()
        };

        tr.distance = this.util.distance(tr);
        this.util.bearing(tr.points);


        trackList.push(tr);
        console.log(tr);

        return tr
    }

    onDownload(xmlDoc){

      const time  = xmlDoc.getElementsByTagName('time')[0]



        download(time.innerHTML+'.gpx', xml2string(xmlDoc))

        function xml2string(node) {
            if (typeof(XMLSerializer) !== 'undefined') {
                var serializer = new XMLSerializer();
                return serializer.serializeToString(node);
            } else if (node.xml) {
                return node.xml;
            }
        }

        function download(filename, text) {
            var pom = document.createElement('a');
            pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            pom.setAttribute('download', filename);

            if (document.createEvent) {
                var event = document.createEvent('MouseEvents');
                event.initEvent('click', true, true);
                pom.dispatchEvent(event);
            }
            else {
                pom.click();
            }
        }
    }


    addSrcPoints(points:Array<Point>, xmlDoc, update: Function){
        const layers = [];
        const map = this.mapService.map;
        const layerId = this.getLayerId('cluster-');



        const getData =(points)=>{
          return  {
                "type": "FeatureCollection",
                "features": (()=>{
                const features = [];
                points.forEach((item,i)=>{
                    const f = {
                        properties: {
                            color: "Green",
                            point: item,
                            id: item.id,
                        },
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": item
                        }
                    };
                    features.push(f)
                });
                return features
            })()
            };
        };
        const data = getData(points)


        map.addSource(layerId,  {
            type: "geojson",
            data: data
        });


        map.addLayer({
            id: layerId,
            type: "circle",
            "paint": {
                "circle-color": {
                    "property": "color",
                    "stops": [
                        ["Red", "#f00"],
                        ["Green", "#0f0"],
                        ["Blue", "#00f"]
                    ],
                    "type": "categorical"
                },
                "circle-radius": 8
            },
            layout: {},
            source: layerId
        });

        map.on('click', (e)=>{
            var features = map.queryRenderedFeatures(e.point, {
                layers: [layerId],
            });
            if(features.length){
                const id = features[0].properties.id
                const p = points.find((item)=>{
                    return item.id == id
                });
                this.createPopupEdit(p, (e)=>{
                    let index =  R.findIndex(R.propEq('id', id))(points);
                    
                    points.splice(index,1);

                    var find = Array.prototype.find;

                    const trkpt =  find.call(xmlDoc.getElementsByTagName('trkpt'), (item=>{
                        return item.getAttribute('id') == id
                    }));
                    trkpt.parentNode.removeChild(trkpt);

                    
                    update(points);
                    const data = getData(points);
                    map.getSource(layerId).setData(data)

                })
            }

            //console.log(features)
        });


        return {
            remove: ()=>{
                 map.removeLayer(layerId);
            },
            update: (points:Array<Point>)=>{
                const data = {
                    "type": "FeatureCollection",
                    "features": (()=>{
                        const features = [];
                        points.forEach((item,i)=>{
                            const f = {
                                properties: {
                                    color: "Green",
                                    point: item,
                                    id: item.id,
                                },
                                "type": "Feature",
                                "geometry": {

                                    "type": "Point",
                                    "coordinates": item
                                }
                            };
                            features.push(f)
                        });
                        return features
                    })()
                };
                map.getSource(layerId).setdata(data)
            }
        }
    }

    createPopupEdit(point: Point, f: Function){
        const map = this.mapService.map;
        const mapboxgl = this.mapService.mapboxgl;
        const div = document.createElement('div');

        const btn = document.createElement('button');

        btn.innerHTML = 'Удалить';

        div.appendChild(btn);

        //div.innerHTML =   `${point.date}`;

        const popup = new mapboxgl.Popup({closeOnClick: false, offset: [0, -15], closeButton: false})
            .setLngLat(  new mapboxgl.LngLat(point.lng, point.lat))
            .setDOMContent(div)
            .addTo(map);

        btn.addEventListener('click',()=>{
            popup.remove()
            f();
        } );
        



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
    

    private getLayerId(prefix?: String) {
        prefix = prefix || '';
        const min = 0, max = 10000;

        const rand = prefix + Math.round(min + Math.random() * (max - min)).toLocaleString();

        if (-1<this.layerIds.indexOf(rand)) {
            return this.getLayerId(prefix)
        } else {
            this.layerIds.push(rand);
            return rand;
        }
    }

    getRandom(min, max, int) {
        var rand = min + Math.random() * (max - min);
        if (int) {
            rand = Math.round(rand)+''
        }
        return rand;

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