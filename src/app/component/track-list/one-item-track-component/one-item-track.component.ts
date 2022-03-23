import { Component, Input, OnInit } from '@angular/core';
import { Point } from '../../../service/track.var';
import { Track, TrackService } from '../../../service/track.service';
import { MapService } from '../../../service/map.service';
import { Util } from '../../../service/util';
import { StravaService } from '../../../service/strava.service';
import { Router } from '@angular/router';
import * as R from 'ramda';
import { MapArea as Area } from '../../../../types/global';
import { distance } from '../../../util/distance';
import dateformat from 'dateformat/lib/dateformat.js';
import { TElement } from '../../../util/at-element';
import {ToastService} from '../../../shared-module/toast-module/toast.service';


@Component({
    selector: 'one-item-track-component',
    templateUrl: './one-item-track.component.html',
    styleUrls: ['./one-item-track.component.less']
})
export class OneItemTrackComponent implements OnInit {

    @Input() track: Track;
    private util: Util;
    stop: Function;
    private map: any;
    public maxSpeed: number;
    private isAuthStrava: boolean;
    private static layerIds: Array<string> = [];
    private mouseMapDown: Function;
    private mouseMapUp: Function;
    private mouseMove: Function;

    constructor(private trackService: TrackService,
                private mapService: MapService,
                private toast: ToastService,
                private router: Router,
                public stravaService: StravaService
    ) {
        this.util = new Util();
        //this.isAuthStrava = !!stravaService.athlete;
    }

    ngOnInit(): void {
        console.log(this.track);
        const arrSpeed = R.pluck('speed')(this.track.points);
        this.maxSpeed = Math.max.apply(null, arrSpeed);
        this.mapService.onLoad.then(map => {
            this.map = map;
            this.mapEventInit();
        });

        class LngLat extends Array {
            lng: number;
            lat: number;

            constructor() {
                super();
            }

            setValue(lngLat: { lng: number, lat: number }): LngLat {
                this.lat = lngLat.lat;
                this.lng = lngLat.lng;
                this[0] = this.lng;
                this[1] = this.lat;
                return this;
            }
        };


        const center = new LngLat();

        let area, pointsForDel;

        this.mouseMove = (e) => {
            if (e.originalEvent.ctrlKey) {
                e.originalEvent.stopPropagation();
                const dist = distance([
                    center.lng,
                    center.lat,
                ], [
                    e.lngLat.lng,
                    e.lngLat.lat
                ]);
                if (!area) {
                    area = this.createArea({
                        radius: dist,
                        lng: center.lng,
                        lat: center.lat
                    });
                } else {
                    area.update(center, dist);
                }

                pointsForDel = this.track.points.filter(p => {
                    return distance([
                        center.lng,
                        center.lat,
                    ], [
                        p.lng,
                        p.lat
                    ]) < dist;
                });

                //console.log(pointsForDel)

            }
        };

        this.mouseMapDown = (e: { lngLat: LngLat }) => {
            center.setValue(e.lngLat);
            this.map.on('mousemove', this.mouseMove);
        };

        this.mouseMapUp = () => {
            this.map.off('mousemove', this.mouseMove);
            if (area) {
                area.remove();
                area = null;
                if (pointsForDel.length) {
                    this.trackService.delPoints(this.track.id, pointsForDel);
                }
            }
        };
    }


    createArea(area: { radius: number, lng: number, lat: number, id?: number | null }): Area {
        const layerId = OneItemTrackComponent.getNewLayerId();
        const radius = area.radius || 0.5;
        const map = this.map;

        this.map.addSource(layerId,
            {
                type: 'geojson',
                data: createGeoJSONCircle([area.lng, area.lat], radius)
            });

        this.map.addLayer({
            'id': layerId,
            'type': 'fill',
            'source': layerId,
            'layout': {},
            'paint': {
                'fill-color': 'red',
                'fill-opacity': 0.3
            }
        });

        function createGeoJSONCircle(center, radiusInKm, points?: number) {
            if (!points) points = 64;

            const coords = {
                latitude: center[1],
                longitude: center[0]
            };

            const km = radiusInKm;

            const ret = [];
            let distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
            let distanceY = km / 110.574;

            let theta, x, y;
            for (let i = 0; i < points; i++) {
                theta = (i / points) * (2 * Math.PI);
                x = distanceX * Math.cos(theta);
                y = distanceY * Math.sin(theta);
                ret.push([coords.longitude + x, coords.latitude + y]);
            }
            ret.push(ret[0]);

            return {
                'type': 'FeatureCollection',
                'features': [{
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [ret]
                    }
                }]
            };
        };


        return {
            id: area.id || null,
            layerId: layerId,
            lng: area.lng,
            lat: area.lat,
            radius: radius,
            update: function ([lng, lat], r?: number) {
                this.lng = lng;
                this.lat = lat;
                map.getSource(layerId)
                    .setData(createGeoJSONCircle([lng, lat], r));
                return this;
            },
            remove: function () {
                map.removeLayer(layerId);
                map.removeSource(layerId);
                return this;
            }
        };
    }


    mapEventInit() {
        this.map.on('mousedown', this.mouseMapDown);
        this.map.on('mouseup', this.mouseMapUp);
    }

    hideTrack() {
        this.stop && this.stop();

        this.trackService.removeTrack(this.track);
        //this.track.remove();

    }

    saveChange() {
        if (this.track.xmlDoc) {
            this.trackService.downloadTrack(this.track)
                .then(d => {
                    if (d && d.result == 'ok') {
                        this.toast.show({
                            type: 'success',
                            text: 'Трек успешно загружен в базу'
                        });
                    } else if (d && !d.result) {

                        if (d.message == 'point exist') {
                            this.toast.show({
                                type: 'error',
                                text: 'Некоторые точки из днного трека были сохранены ранее'
                            });
                        }
                    }
                    console.log(d);
                });
        } else {
            this.trackService.saveChange();
        }

    }

    onGo(_tr: Track) {
        this.stop && this.stop();
        const $this = this;
        const map = this.mapService.map;
        const points = this.fillTrack(_tr.points);
        const marker = this.trackService.marker(points[0]);//this.track.showSpriteMarker(points[0]);
        /**
         * todo
         */
            // return;

        let timeout;

        let i = 0;
        let step = 1;
        flyTo();

        function flyTo() {
            if (points[i]) {
                map.setCenter([points[i].lng, points[i].lat]);
                marker.update(points[i]);
            }

            if (i < points.length - 2) {
                timeout = setTimeout(() => {
                    i += step;
                    flyTo();
                }, 40);
            } else {
                stop();
            }
        }

        map.on('moveend', moveend);

        function moveend() {
            switch (true) {
                case  map.getZoom() < 10:
                    step = 40;
                    break;
                case map.getZoom() < 18:
                    step = 5 * parseInt('' + (18 - map.getZoom()));
                    break;
                default:
                    step = 1;
            }

        }

        function stop() {
            $this.stop();
            map.off('moveend', moveend);
        }

        this.stop = function () {
            clearTimeout(timeout);
            marker.remove();
        };

    }


    fillTrack(points: Array<Point>) {
        let fillTrack: Array<Point> = [];
        const F = parseFloat;

        points.forEach((point, i) => {
            if (i < points.length - 1) {
                let distBetween = parseInt(this.util.distanceBetween2(point, points[i + 1]) + '');
                let arr = fill(point, points[i + 1], distBetween);
                fillTrack = fillTrack.concat(arr);
                //console.log(distBetween)
            }
        });

        function fill(point1, point2, steps) {
            const arr: Point[] = [];
            let lngStep = (point2.lng - point1.lng) / steps;
            let latStep = (point2.lat - point1.lat) / steps;
            if (1 < steps) {
                for (let i = 0; i < steps; i++) {
                    const p = new Point(point1.lng + (lngStep * i), point1.lat + (latStep * i), point2.bearing);
                    arr.push(p);
                    if (i == steps - 1) {
                        arr[i] = point2;
                    }
                }
            } else {
                arr.push(point1);
                arr.push(point2);
            }
            return arr;
        }

        return fillTrack;
    }

    onDownload() {
        const xmlDoc: Document = this.track.xmlDoc;
        const points: Array<Point> = this.track.points;
        if (!xmlDoc) {
            this.createXmlDoc(points)
                .then((xmlDoc: TElement) => {
                    this.track.setXmlDoc(xmlDoc);
                    return this.download(xmlDoc);
                })
                .then(() => {

                })
                .catch(err => {
                    console.warn(err);
                });
            return;
        }
        // this.download(xmlDoc);

    }

    private createXmlDoc(points: Array<Point>): Promise<TElement> {
        return new Promise((resolve, reject) => {

            const root = new TElement('gpx');
            root.setAttribute('xmlns', 'http://www.topografix.com/GPX/1/0')
                .setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
                .setAttribute('version', '1.0')
                .setAttribute('creator', 'Bike-Atlas');

            const time = new TElement('time');
            time.innerText = new Date().toISOString();
            root.appendChild(time);
            const trk = new TElement('trk');
            root.appendChild(trk);
            const trkseg = new TElement('trkseg');
            trk.appendChild(trkseg);
            points.forEach((point: Point) => {
                const trkpt = new TElement('trkpt');
                trkpt.setAttribute('lat', point.lat.toString());
                trkpt.setAttribute('lon', point.lng.toString());
                const time = new TElement('time');
                time.innerText = new Date(point.date).toISOString();
                trkpt.appendChild(time);
                const speed = new TElement('speed');
                speed.innerText = (point.speed / 3.6).toString();
                trkpt.appendChild(speed);
                trkseg.appendChild(trkpt);
            });
            resolve(root);
        });
    }

    private download(xmlDoc: TElement) {
        const time = xmlDoc.getElementsByTagName('time')[0];
        download(dateformat(new Date(time.innerText), 'yyyy-mm-dd_HH_MM_ss') + '.gpx', xmlDoc.toString());

        function download(filename, text) {
            const pom = document.createElement('a');
            pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            pom.setAttribute('download', filename);

            if (document.createEvent) {
                const event = document.createEvent('MouseEvents');
                event.initEvent('click', true, true);
                pom.dispatchEvent(event);
            }
            else {
                pom.click();
            }
        }

        return Promise.resolve(true);
    }

    stravaExport() {
        this.stravaService.addToExport(this.track);
        this.router.navigate(['/auth/map/strava-invite']);
    }

    ngOnDestroy() {
        this.map.off('mousedown', this.mouseMapDown);
        this.map.off('mouseup', this.mouseMapUp);
        this.map.off('mousemove', this.mouseMove);
    }


    static getNewLayerId(): string {
        const min = 0, max = 10000;
        let rand = (min + Math.random() * (max - min));
        const newId = ('area-track' + Math.round(rand)).toString();
        if (-1 < this.layerIds.indexOf(newId)) {
            return this.getNewLayerId();
        } else {
            this.layerIds.push(newId);
            return newId;
        }

    }

}
