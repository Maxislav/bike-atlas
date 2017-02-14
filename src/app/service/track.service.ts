/**
 * Created by maxislav on 30.11.16.
 */

import {Injectable, transition} from '@angular/core';
import * as R from '@ramda/ramda.min.js';
import {Util} from './util';
import {Io} from "./socket.oi.service";
import {MapService} from "./map.service";
import {Track as Tr, Point} from "./track.var";
import {distance} from '../util/distance';
import * as mapboxgl from "@lib/mapbox-gl/mapbox-gl.js";

import * as dateformat from "node_modules/dateformat/lib/dateformat.js";
import {ToastService} from "../component/toast/toast.component";

import {Resolve} from "@angular/router";
//console.log(dateformat)
const F = parseFloat;
const I = parseInt;
declare var System: any;

@Injectable()
export class TrackService implements Resolve<any> {
    resolve(){
        return undefined;
    }

    layerIds:Array<String>;

    private util:Util;
    private _trackList:Array<Tr> = [];
    private _map:any;
    private arrayDelPoints: Array<number> = [];
    private socket: any;

    constructor(private io:Io, private mapService:MapService,  private ts: ToastService) {

        this.layerIds = [];
        this._trackList = [];
        this.util = new Util();


        const socket= this.socket = io.socket;

        socket.on('file', d=> {
            let xmlStr = '';
            const unit8Array = new Uint8Array(d);
            unit8Array.forEach(unit => {
                xmlStr += String.fromCharCode(unit)
            });
            this.showGpxTrack(xmlStr, 'load');
        });
    }

    showGpxTrack(xmlStr:string, src: string) {
        const track = [];
        const parser = new DOMParser();
        const xmlDoc: Document = parser.parseFromString(xmlStr, "text/xml");
        const forEach = Array.prototype.forEach;
        const arrTrkpt =[];
        forEach.call(xmlDoc.getElementsByTagName('trkpt'), (item, i)=>{
            arrTrkpt.push(item);
        });

        arrTrkpt.forEach((item, i)=> {
            if (item.getAttribute('lon')) {
                item.setAttribute('id', i);
                const ele = item.getElementsByTagName('ele') ? item.getElementsByTagName('ele')[0] : null;
                const point:Point = new Point(F(item.getAttribute('lon')), F(item.getAttribute('lat')), ele ? F(ele.innerHTML) : null);
                point.date = item.getElementsByTagName('time')[0].innerHTML;
                point.id = i;
                if(!item.getElementsByTagName('speed')[0] && 0<i ){

                    const speed = document.createElement('speed');
                    const point1:Point = new Point(F(arrTrkpt[i-1].getAttribute('lon')), F(arrTrkpt[i-1].getAttribute('lat')), ele ? F(ele.innerHTML) : null);
                    const point2:Point = new Point(F(item.getAttribute('lon')), F(item.getAttribute('lat')), ele ? F(ele.innerHTML) : null);
                    const dist = distance(point1, point2)*1000;
                    const t1 = new Date(arrTrkpt[i-1].getElementsByTagName('time')[0].innerHTML).getTime()/1000;
                    const t2 = new Date(item.getElementsByTagName('time')[0].innerHTML).getTime()/1000;
                    speed.innerHTML = dist/(t2-t1)+'';
                    item.appendChild(speed)
                }

                point.speed = item.getElementsByTagName('speed')[0] ? F(item.getElementsByTagName('speed')[0].innerHTML)*3.6 : 0;



                track.push(point)
            }
        });
        this.showTrack(track, xmlDoc)

    }

    setMap(map:any) {
        this.map = map
    }

    showTrack(points:Array<Point>, xmlDoc?) {
        const $this = this;
        const coordinates = [];
        const trackList = this.trackList;
        const color = this._getColor();
        const map = this.mapService.map;


        points.forEach((point)=> {
            coordinates.push(point);
        });


        let layerId:string = this.getLayerId('line-') + '';

        const data = {
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

        const updateLine = (points:Array<Point>) => {
            data.geometry.coordinates = points;
            map.getSource(layerId).setData(data)
        };

        let srcPoints; //= this.addSrcPoints(points, xmlDoc, update);
        let isShowPonts = false;

        let tr:Tr = {
            hide: function () {
                map.removeLayer(layerId);
                map.removeSource(layerId);
                let index = R.findIndex(R.propEq('id', layerId))(trackList);
                trackList.splice(index, 1);
                console.log('delete track index', index)
                srcPoints && srcPoints.remove()
            },
            showSrcPoint: () => {
                if (!!srcPoints) {
                    srcPoints.remove();
                    srcPoints = null;
                } else {
                    srcPoints = this.addSrcPoints(points, xmlDoc, updateLine);
                }

            },
            hideSrcPoint: () => {
                srcPoints && srcPoints.remove()
            },
            update: updateLine,
            id: layerId,
            coordinates: coordinates,
            points: points,
            color: color,
            distance: 0,
            date: points[0].date,
            xmlDoc: xmlDoc,

        };

        tr.distance = this.util.distance(tr);
        this.util.bearing(tr.points);


        trackList.push(tr);
        console.log(tr);

        return tr
    }



    private static getData(points){
        return {
            "type": "FeatureCollection",
            "features": (()=> {
                const features = [];
                points.forEach((item, i)=> {
                    const f = {
                        properties: {
                            color: item.color,
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
    }

    private colorWorker(points:Array<Point>): Promise<any>{

        let worker;
        if(System.baseURL.match(/178/)){
            worker = {
                postMessage: ()=>{
                    System.import('dist/app/util/get-color.js')
                        .then(({Color})=>{
                            const data = new Color().getColors(points);
                            worker.onmessage({data})
                        })
                },
                onmessage: null
            }


        }else {
            worker = new Worker(System.baseURL+'dist/app/worker/color-speed.js');
        }
        return new Promise((resolve, reject)=>{
            worker.postMessage([points]);
            worker.onmessage = resolve

        })
    }


    addSrcPoints(points:Array<Point>, xmlDoc, updateLine: Function) {
        const map = this.mapService.map;
        const layerId = this.getLayerId('cluster-');



        let sourceData;

        const updatePoints = (points:Array<Point>)=>{
            const data = TrackService.getData(points);
            map.getSource(layerId).setData(data);
            updateLine(points)
        };

        const delPoint = (id:number)=>{
            let index = R.findIndex(R.propEq('id', id))(points);
            if(-1<index) points.splice(index, 1);

            const find = Array.prototype.find;
            if(xmlDoc){
                const trkpt = find.call(xmlDoc.getElementsByTagName('trkpt'), (item=> {
                    return item.getAttribute('id') == id
                }));
                trkpt.parentNode.removeChild(trkpt);
            }else {
                this.arrayDelPoints.push(id)
            }
            this.colorWorker(points)
                .then(e=>{
                    let colorPoints = e.data[0];
                    updatePoints(colorPoints)
                });


            sourceData = TrackService.getData(points);
            map.getSource(layerId).setData(sourceData);
        }
        const mousemove = (e)=> {
            const features = map.queryRenderedFeatures(e.point, {
                layers: [layerId],
            });
            if (features.length) {
                const id = features[0].properties.id
                const p = points.find((item)=> {
                    return item.id == id
                });
                this.createPopupEdit(p, (e)=>{
                    delPoint(id)
                })
            }
        };

        this.colorWorker(points)
            .then(e=>{
                let colorPoints = e.data[0];
                let stops = e.data[1];
                sourceData = TrackService.getData(colorPoints);
                map.addSource(layerId, {
                    type: "geojson",
                    data: sourceData
                });
                map.addLayer({
                    id: layerId,
                    type: "circle",
                    "paint": {
                        "circle-color": {
                            "property": "color",
                            "stops": stops,
                            "type": "categorical"
                        },
                        "circle-radius": 8
                    },
                    layout: {},
                    source: layerId
                });

                map.on('mousemove', mousemove)

                map.on('click', mousemove);
            })




        return {
            remove: ()=> {
                map.off('click', mousemove);
                map.off('mousemove', mousemove);
                map.removeLayer(layerId);
            },
            update: updatePoints
        }
    }

    createPopupEdit(point:Point, f:Function) {
        const map = this.mapService.map;
        const mapboxgl = this.mapService.mapboxgl;
        const div = document.createElement('div');
        div.setAttribute('class', 'info-point');
        const btn = document.createElement('button');
        const content = `<div class="time">${dateformat(point.date, 'HH:MM:ss')}</div>`+
                        `<div>${point.speed.toFixed(1)+'km/h'}</div>`;
        div.innerHTML = content;
        btn.innerHTML = 'Удалить';
        div.appendChild(btn);
        const popup = new mapboxgl.Popup({closeOnClick: false, offset: [0, -15], closeButton: false})
            .setLngLat(new mapboxgl.LngLat(point.lng, point.lat))
            .setDOMContent(div)
            .addTo(map);

        const delClick = ()=>{
            popup.remove()
            f();
        };

        btn.addEventListener('click', delClick);

        setTimeout(()=>{
            btn.removeEventListener('click', delClick)
            popup.remove();
        }, 5000)

    }

    marker(point:Point) {
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
                let angle = this.bearing - this._mapBearing;
                icoEl.style.transform = "rotate(" + I(angle + '') + "deg)"
            },
            update: function (point:Point) {

                this.lng = point.lng
                this.lat= point.lat
                this.bearing= point.bearing

                if (point.bearing) {
                    this.rotate();
                }
                iconMarker.setLngLat([point.lng, point.lat])
            },
            remove: function () {
                iconMarker.remove();
                map.off('move', rotate)
            }
        };

        const rotate = ()=> {
            const mapBearing = map.getBearing();
            if (marker._mapBearing != mapBearing) {
                marker._mapBearing = mapBearing;
                marker.rotate();
            }

        };

        map.on('move', rotate);

        return marker;
    }


    private getLayerId(prefix?:String) {
        prefix = prefix || '';
        const min = 0, max = 10000;

        const rand = prefix + Math.round(min + Math.random() * (max - min)).toLocaleString();

        if (-1 < this.layerIds.indexOf(rand)) {
            return this.getLayerId(prefix)
        } else {
            this.layerIds.push(rand);
            return rand;
        }
    }

    getRandom(min, max, int) {
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand = Math.round(rand) + ''
        }
        return rand;

    }

    _getColor() {
        const I = parseInt;
        const colors:Array<string> = [];


        let c = ['0', '0', '0'];
        let k = I(this.getRandom(0, 2, true));

        c.forEach((r, i) => {
            if(i!=k){
                r = I(this.getRandom(0, 255, true)).toString(16);
            }else{
                r = (255).toString(16)
            }
            if (r.length < 2) {
                c[i] = '0' + r
            } else {
                c[i] = r
            }
        });


        return '#' + c.join('')
    }

    saveChange() {
        console.log(this.arrayDelPoints)
        if (this.arrayDelPoints.length) {
            this.socket.$emit('delPoints', this.arrayDelPoints)
                .then((d) => {
                    this.arrayDelPoints.length = 0;
                    if (d && d.result == 'ok') {
                        this.ts.show({
                            type: 'success',
                            text: 'Изменения сохранены'
                        })
                    }
                    console.log(d)
                });

        }else{
            this.ts.show({
                type: 'warning',
                text: 'Лог не существует в базе или нет изменений'
            })
        }
    }

    downloadTrack(points: Array<Point>){
       return this.socket.$emit('downloadTrack', this.formatBeforeSend(points))
            .then(d=>{
                console.log(d)
                return d
            })
        
    }
    private formatBeforeSend(points){
        return R.map(point=>{
            return {
                lng: point.lng,
                lat: point.lat,
                date:point.date,
                speed: point.speed
            }
        }, points)

    }
    

    set map(value:any) {
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