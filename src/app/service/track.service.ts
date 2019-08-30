/**
 * Created by maxislav on 30.11.16.
 */

import { Injectable } from '@angular/core';
import * as R from 'ramda/dist/ramda';
import { Util } from './util';
import { Io } from './socket.oi.service';
import { MapService } from './map.service';
import { Point } from './track.var';
import { distance } from '../util/distance';

import * as dateformat from 'dateformat/lib/dateformat.js';
import { ToastService } from '../component/toast/toast.component';

import { Resolve } from '@angular/router';
import { Color } from '../util/get-color';

const F = parseFloat;
const I = parseInt;

import * as mapboxgl from '../../lib/mapbox-gl/mapbox-gl.js';
import { Subject } from 'rxjs/Subject';
import { MapGl, Popup } from '../../types/global';
import { TElement } from '../util/at-element';

declare var System: any;


interface PointWithColor extends Point {
    color: number;
}

function autobind() {
    return (target, key, descriptor) => {
        let fn = descriptor.value;
        let definingProperty = false;
        return {
            configurable: true,
            get() {
                const boundFn = fn.bind(this);
                Object.defineProperty(this, key, {
                    configurable: true,
                    get() {
                        return boundFn;
                    },
                    set(value) {
                        fn = value;
                        delete this[key];
                    }
                });
                definingProperty = false;
                return boundFn;
            },
            set(value) {
                fn = value;
            }
        };
    };

}

function featureCollectionCreate(points: Array<PointWithColor>) {
    return {
        'type': 'FeatureCollection',
        'features': (() => {
            const features = [];
            points.forEach((item, i) => {
                const f = {
                    properties: {
                        color: item.color,
                        point: item,
                        id: item.id,
                    },
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': item
                    }
                };
                features.push(f);
            });
            return features;
        })()
    };
}

interface EditablePopup {
    update(): EditablePopup

    remove(): EditablePopup
}

class TrackSrcPoints {
    private featureCollectionData;
    private _popupHash: { [id: number]: EditablePopup } = {};
    public delPointSubject: Subject<number>;

    constructor(private points: Array<Point>, private  map: MapGl, public id: string) {
        this.delPointSubject = new Subject<number>();
        this.init();
    }

    private init() {
        const {map, id, points} = this;
        const data: { points: Array<PointWithColor>, resColors: Array<Array<string>> } = new Color(points).getColors();
        let stops = data.resColors;
        const p: Array<PointWithColor> = data.points;
        this.featureCollectionData = featureCollectionCreate(p);
        map.addSource(id, {
            type: 'geojson',
            data: featureCollectionCreate([])
        });
        map.addLayer({
            id: id,
            type: 'circle',
            'paint': {
                'circle-color': {
                    'property': 'color',
                    'stops': stops,
                    'type': 'categorical'
                },
                'circle-radius': 8
            },
            layout: {},
            source: id
        });
        map.on('mousemove', this.mouseMove);
        map.on('click', this.mouseMove);
    }

    show() {
        this.map.getSource(this.id).setData(this.featureCollectionData);
    }

    hide() {
        this.map.getSource(this.id).setData(featureCollectionCreate([]));
    }

    remove() {
        this.map.off('mousemove', this.mouseMove);
        this.map.off('click', this.mouseMove);
        this.map.removeLayer(this.id);
        this.map.removeSource(this.id);
    }

    @autobind()
    private mouseMove(e) {
        const features = this.map.queryRenderedFeatures(e.point, {
            layers: [this.id],
        });
        if (features.length) {
            const id = features[0].properties.id;
            const p = this.points.find((item) => {
                return item.id == id;
            });
            console.log(p);
            if (this._popupHash[id]) {
                this._popupHash[id].update();
            } else {
                this._popupHash[id] = this.createPopupEdit(p, id);
            }
        }
    }

    createPopupEdit(point, id: number): EditablePopup {
        const $this: TrackSrcPoints = this;
        const map = this.map;
        //const mapboxgl = this.mapService.mapboxgl;
        const div = document.createElement('div');
        div.setAttribute('class', 'info-point');
        const btn = document.createElement('button');
        const content = `<div class="time">${dateformat(point.date, 'HH:MM:ss')}</div>` +
            `<div>${point.speed.toFixed(1) + 'km/h'}</div>`;
        div.innerHTML = content;
        btn.innerHTML = 'Удалить';
        div.appendChild(btn);
        const popup: Popup = new mapboxgl.Popup({closeOnClick: false, offset: [0, -15], closeButton: false})
            .setLngLat(new mapboxgl.LngLat(point.lng, point.lat))
            .setDOMContent(div)
            .addTo(map);

        let time;
        const editablePopup: EditablePopup = {
            update() {
                if (time) {
                    clearTimeout(time);
                }
                time = setTimeout(() => {
                    editablePopup.remove();
                    delete $this._popupHash[id];
                }, 5000);
                return this;
            },
            remove() {
                popup.remove();

                return this;
            }
        };

        editablePopup.update();

        const delClick = () => {
            editablePopup.remove();
            this.remove();
            const index = this.points.findIndex(item => item.id === id);
            this.points.splice(index, 1);
            this.init();
            this.show();
            this.delPointSubject.next(id);
        };

        btn.addEventListener('click', delClick);

        return editablePopup;
    }
}


export class Track {
    private pontsVisible = false;
    public distance: string = '';
    public maxSpeed: string = '';
    private _trackSrcPoints: TrackSrcPoints;
    public xmlDoc;
    public date: string | Date;
    public data: {
        type: string,
        properties: { [key: string]: any },
        geometry: {
            type: string,
            coordinates: Array<Point>
        }
    };
    public color: string;

    constructor(public points: Array<Point>, private map, public id: string) {
        this.color = this.getRandomColor();


        this.data = {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': []
            }
        };

        this.map.addSource(this.id, {
            'type': 'geojson',
            'data': this.data
        });

        this.map.addLayer({
            'id': this.id,
            'type': 'line',
            'source': this.id,
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': this.color,
                'line-width': 8,
                'line-opacity': 0.8
            }
        });
    }

    show() {
        this.data.geometry.coordinates = this.points;
        this.calcDistance();
        this.calcMaxSpeed();
        this.date = this.points[0].date
        this.map.getSource(this.id).setData(this.data);
    }

    setTrackSrcPoints(trackSrcPoints: TrackSrcPoints): Track {
        this._trackSrcPoints = trackSrcPoints;
        return this;
    }

    hide() {
        this.data.geometry.coordinates = [];
        this.map.getSource(this.id).setData(this.data);
        this._trackSrcPoints.hide();
    }

    showSrcPoint() {
        if (this.pontsVisible) {
            this._trackSrcPoints.hide();
        } else {
            this._trackSrcPoints.show();
        }
        this.pontsVisible = !this.pontsVisible;
    }

    removePoint(id: number) {
        const index = this.points.findIndex(item => item.id === id);
        this.points.splice(index, 1);
        this.show();
    }

    remove() {
        this._trackSrcPoints.remove();
        this.map.removeLayer(this.id);
        this.map.removeSource(this.id);
    }


    setXmlDoc(xml: TElement): this {
        this.xmlDoc = xml;
        return this;
    }

    private calcMaxSpeed(){
        this.maxSpeed = Math.max.apply(null, this.points.map(item => item.speed)).toFixed(2);
    }

    private calcDistance() {

        const reducer = (prev, next, index) => {
            const current = this.points[index ? index -1 : index];
            const d = distance(current, next);
            return prev + d;
        };

        this.distance = this.points.reduce(reducer, 0).toFixed(2);
    }

    private getRandomColor() {
        const I = parseInt;
        const colors: Array<string> = [];
        let c = ['0', '0', '0'];
        let k = I(this.getRandom(0, 2, true));
        c.forEach((r, i) => {
            if (i != k) {
                r = I(this.getRandom(0, 255, true)).toString(16);
            } else {
                r = (255).toString(16);
            }
            if (r.length < 2) {
                c[i] = '0' + r;
            } else {
                c[i] = r;
            }
        });


        return '#' + c.join('');
    }

    private getRandom(min, max, int) {
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand = Math.round(rand) + '';
        }
        return rand;

    }
}


@Injectable()
export class TrackService implements Resolve<any> {
    resolve() {
        return undefined;
    }

    layerIds: Array<String>;

    private util: Util;
    private _trackList: Array<Track> = [];
    private _map: any;
    private arrayDelPoints: Array<number> = [];
    private socket: any;

    constructor(private io: Io, private mapService: MapService, private ts: ToastService) {

        this.layerIds = [];
        this._trackList = [];
        this.util = new Util();


        const socket = this.socket = io.socket;

        socket.on('file', d => {
            let xmlStr = '';
            const unit8Array = new Uint8Array(d);
            unit8Array.forEach(unit => {
                xmlStr += String.fromCharCode(unit);
            });
            this.showGpxTrack(xmlStr, 'load');
        });
    }

    showGpxTrack(xmlStr: string, src?: string) {
        const track = [];
        const parser = new DOMParser();
        const xmlDoc: Document = parser.parseFromString(xmlStr, 'text/xml');
        const errorList = xmlDoc.getElementsByTagName('parsererror');

        if (errorList && errorList.length) {
            Array.prototype.forEach.call(errorList, (item) => {
                console.error('Error in showGpxTrack parser -> ', item.textContent);
                this.ts.show({
                    type: 'error',
                    text: item.textContent
                });
            });
            return null;
        }


        const forEach = Array.prototype.forEach;

        const arrTrkpt = [];
        forEach.call(xmlDoc.getElementsByTagName('trkpt'), (item, i) => {
            arrTrkpt.push(item);
        });

        arrTrkpt.forEach((item, i) => {
            if (item.getAttribute('lon')) {
                item.setAttribute('id', i);
                const ele = item.getElementsByTagName('ele') ? item.getElementsByTagName('ele')[0] : null;
                const point: Point = new Point(F(item.getAttribute('lon')), F(item.getAttribute('lat')), ele ? F(ele.innerHTML) : null);
                point.date = item.getElementsByTagName('time')[0].innerHTML;
                point.id = i;
                if (!item.getElementsByTagName('speed')[0] && 0 < i) {

                    const speed = document.createElement('speed');
                    const point1: Point = new Point(F(arrTrkpt[i - 1].getAttribute('lon')), F(arrTrkpt[i - 1].getAttribute('lat')), ele ? F(ele.innerHTML) : null);
                    const point2: Point = new Point(F(item.getAttribute('lon')), F(item.getAttribute('lat')), ele ? F(ele.innerHTML) : null);
                    const dist = distance(point1, point2) * 1000;
                    const t1 = new Date(arrTrkpt[i - 1].getElementsByTagName('time')[0].innerHTML).getTime() / 1000;
                    const t2 = new Date(item.getElementsByTagName('time')[0].innerHTML).getTime() / 1000;
                    speed.innerHTML = dist / (t2 - t1) + '';
                    item.appendChild(speed);
                }

                point.speed = item.getElementsByTagName('speed')[0] ? F(item.getElementsByTagName('speed')[0].innerHTML) * 3.6 : 0;


                track.push(point);
            }
        });
        this.showTrack(track, xmlDoc);

    }

    setMap(map: any) {
        this.map = map;
    }

    removeTrack(track: Track) {
        const index = this.trackList.findIndex(item => item === track);
        track.remove();
        this.trackList.splice(index, 1);

    }

    showTrack(points: Array<Point>, xmlDoc?) {
        let layerId: string = this.getLayerId('line-') + '';
        const map = this.mapService.map;
        const track = new Track(points, map, layerId);

        const trackSrcPoints: TrackSrcPoints = new TrackSrcPoints(points, map, this.getLayerId('cluster-') + '');
        track.setTrackSrcPoints(trackSrcPoints);
        track.show();

        trackSrcPoints.delPointSubject.subscribe({
            next: (id) => {
                track.removePoint(id);
                this.arrayDelPoints.push(id);
            }
        });

        this.trackList.push(track);

    }

    delPoints(trackId: string, points: Array<Point>) {
        console.log(trackId, points);
    }

    marker(point: Point) {
        const map = this.mapService.map;

        const icoContainer = document.createElement('div');
        icoContainer.classList.add('track-icon');
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
                icoEl.style.transform = 'rotate(' + I(angle + '') + 'deg)';
            },
            update: function (point: Point) {

                this.lng = point.lng;
                this.lat = point.lat;
                this.bearing = point.bearing;

                if (point.bearing) {
                    this.rotate();
                }
                iconMarker.setLngLat([point.lng, point.lat]);
            },
            remove: function () {
                iconMarker.remove();
                map.off('move', rotate);
            }
        };

        const rotate = () => {
            const mapBearing = map.getBearing();
            if (marker._mapBearing != mapBearing) {
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

        if (-1 < this.layerIds.indexOf(rand)) {
            return this.getLayerId(prefix);
        } else {
            this.layerIds.push(rand);
            return rand;
        }
    }


    saveChange() {
        console.log(this.arrayDelPoints);
        if (this.arrayDelPoints.length) {
            this.socket.$emit('delPoints', this.arrayDelPoints)
                .then((d) => {
                    this.arrayDelPoints.length = 0;
                    if (d && d.result == 'ok') {
                        this.ts.show({
                            type: 'success',
                            text: 'Изменения сохранены'
                        });
                    }
                    console.log(d);
                });

        } else {
            this.ts.show({
                type: 'warning',
                text: 'Лог не существует в базе или нет изменений'
            });
        }
    }

    downloadTrack(track: Track) {
        const points: Array<Point> = track.points;
        return this.socket.$emit('downloadTrack', this.formatBeforeSend(points))
            .then(d => {
                console.log(d);
                return d;
            });

    }

    private formatBeforeSend(points) {
        return R.map(point => {
            return {
                lng: point.lng,
                lat: point.lat,
                date: point.date,
                speed: point.speed
            };
        }, points);

    }


    set map(value: any) {
        this._map = value;
    }

    get map(): any {
        return this._map;
    }

    get trackList(): Array<Track> {
        return this._trackList;
    }

    set trackList(value: Array<Track>) {
        this._trackList = value;
    }

}