"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var OneItemTrackComponent_1;
const core_1 = require("@angular/core");
const track_var_1 = require("../../../service/track.var");
const track_service_1 = require("../../../service/track.service");
const map_service_1 = require("../../../service/map.service");
const util_1 = require("../../../service/util");
const toast_component_1 = require("../../toast/toast.component");
const strava_service_1 = require("../../../service/strava.service");
const router_1 = require("@angular/router");
const R = require("ramda");
const distance_1 = require("../../../util/distance");
let OneItemTrackComponent = OneItemTrackComponent_1 = class OneItemTrackComponent {
    constructor(trackService, mapService, toast, router, stravaService) {
        this.trackService = trackService;
        this.mapService = mapService;
        this.toast = toast;
        this.router = router;
        this.stravaService = stravaService;
        this.util = new util_1.Util();
        //this.isAuthStrava = !!stravaService.athlete;
    }
    ngOnInit() {
        console.log(this.track);
        const arrSpeed = R.pluck('speed')(this.track.points);
        this.maxSpeed = Math.max.apply(null, arrSpeed);
        this.mapService.onLoad.then(map => {
            this.map = map;
            this.mapEventInit();
        });
        class LngLat extends Array {
            constructor() {
                super();
            }
            setValue(lngLat) {
                this.lat = lngLat.lat;
                this.lng = lngLat.lng;
                this[0] = this.lng;
                this[1] = this.lat;
                return this;
            }
        }
        ;
        const center = new LngLat();
        let area, pointsForDel;
        this.mouseMove = (e) => {
            if (e.originalEvent.ctrlKey) {
                e.originalEvent.stopPropagation();
                const dist = distance_1.distance([
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
                }
                else {
                    area.update(center, dist);
                }
                pointsForDel = this.track.points.filter(p => {
                    return distance_1.distance([
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
        this.mouseMapDown = (e) => {
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
    createArea(area) {
        const layerId = OneItemTrackComponent_1.getNewLayerId();
        const radius = area.radius || 0.5;
        const map = this.map;
        this.map.addSource(layerId, {
            type: "geojson",
            data: createGeoJSONCircle([area.lng, area.lat], radius)
        });
        this.map.addLayer({
            "id": layerId,
            "type": "fill",
            "source": layerId,
            "layout": {},
            "paint": {
                "fill-color": "red",
                "fill-opacity": 0.3
            }
        });
        function createGeoJSONCircle(center, radiusInKm, points) {
            if (!points)
                points = 64;
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
                "type": "FeatureCollection",
                "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [ret]
                        }
                    }]
            };
        }
        ;
        return {
            id: area.id || null,
            layerId: layerId,
            lng: area.lng,
            lat: area.lat,
            radius: radius,
            update: function ([lng, lat], r) {
                this.lng = lng;
                this.lat = lat;
                map.getSource(layerId)
                    .setData(createGeoJSONCircle([lng, lat], r));
            },
            remove: function () {
                map.removeLayer(layerId);
                map.removeSource(layerId);
            }
        };
    }
    mapEventInit() {
        this.map.on('mousedown', this.mouseMapDown);
        this.map.on('mouseup', this.mouseMapUp);
    }
    hideTrack() {
        this.stop && this.stop();
        this.track.hide();
    }
    saveChange() {
        if (this.track.xmlDoc) {
            this.trackService.downloadTrack(this.track.points)
                .then(d => {
                if (d && d.result == 'ok') {
                    this.toast.show({
                        type: 'success',
                        text: "Трек успешно загружен в базу"
                    });
                }
                else if (d && !d.result) {
                    if (d.message == 'point exist') {
                        this.toast.show({
                            type: 'error',
                            text: "Некоторые точки из днного трека были сохранены ранее"
                        });
                    }
                }
                console.log(d);
            });
        }
        else {
            this.trackService.saveChange();
        }
    }
    onGo(_tr) {
        this.stop && this.stop();
        const $this = this;
        const map = this.mapService.map;
        const points = this.fillTrack(_tr.points);
        const marker = this.trackService.marker(points[0]); //this.track.showSpriteMarker(points[0]);
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
            }
            else {
                stop();
            }
        }
        map.on('moveend', moveend);
        function moveend() {
            switch (true) {
                case map.getZoom() < 10:
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
    fillTrack(points) {
        let fillTrack = [];
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
            const arr = [];
            let lngStep = (point2.lng - point1.lng) / steps;
            let latStep = (point2.lat - point1.lat) / steps;
            if (1 < steps) {
                for (let i = 0; i < steps; i++) {
                    const p = new track_var_1.Point(point1.lng + (lngStep * i), point1.lat + (latStep * i), point2.bearing);
                    arr.push(p);
                    if (i == steps - 1) {
                        arr[i] = point2;
                    }
                }
            }
            else {
                arr.push(point1);
                arr.push(point2);
            }
            return arr;
        }
        return fillTrack;
    }
    onDownload() {
        const xmlDoc = this.track.xmlDoc;
        const points = this.track.points;
        if (!xmlDoc) {
            this.createXmlDoc(points)
                .then(this.download)
                .catch(err => {
                console.warn(err);
            });
            return;
        }
        this.download(xmlDoc);
    }
    createXmlDoc(points) {
        return new Promise((resolve, reject) => {
            const parser = new DOMParser();
            const xmlDoc = document.createElement('gpx');
            xmlDoc.setAttribute('xmlns', "http://www.topografix.com/GPX/1/0");
            xmlDoc.setAttribute('xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance");
            xmlDoc.setAttribute('version', "1.0");
            xmlDoc.setAttribute('creator', "Bike-Atlas");
            const time = document.createElement('time');
            time.innerText = new Date().toISOString();
            xmlDoc.appendChild(time);
            const trk = document.createElement('trk');
            xmlDoc.appendChild(trk);
            const trkseg = document.createElement('trkseg');
            trk.appendChild(trkseg);
            points.forEach((point) => {
                const trkpt = document.createElement('trkpt');
                trkpt.setAttribute('lat', point.lat.toString());
                trkpt.setAttribute('lon', point.lng.toString());
                const time = document.createElement('time');
                time.innerText = new Date(point.date).toISOString();
                trkpt.appendChild(time);
                const speed = document.createElement('speed');
                speed.innerText = point.speed.toString();
                trkpt.appendChild(speed);
                trkseg.appendChild(trkpt);
            });
            resolve(xmlDoc);
        });
    }
    download(xmlDoc) {
        const time = xmlDoc.getElementsByTagName('time')[0];
        download(time.innerHTML + '.gpx', xml2string(xmlDoc));
        function xml2string(node) {
            if (typeof (XMLSerializer) !== 'undefined') {
                const serializer = new XMLSerializer();
                return serializer.serializeToString(node);
            }
            else if (node.xml) {
                return node.xml;
            }
        }
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
    static getNewLayerId() {
        const min = 0, max = 10000;
        let rand = (min + Math.random() * (max - min));
        const newId = ('area-track' + Math.round(rand)).toString();
        if (-1 < this.layerIds.indexOf(newId)) {
            return this.getNewLayerId();
        }
        else {
            this.layerIds.push(newId);
            return newId;
        }
    }
};
OneItemTrackComponent.layerIds = [];
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], OneItemTrackComponent.prototype, "track", void 0);
OneItemTrackComponent = OneItemTrackComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'one-item-track-component',
        templateUrl: "./one-item-track.component.html",
        styleUrls: ['./one-item-track.component.css']
    }),
    __metadata("design:paramtypes", [track_service_1.TrackService,
        map_service_1.MapService,
        toast_component_1.ToastService,
        router_1.Router,
        strava_service_1.StravaService])
], OneItemTrackComponent);
exports.OneItemTrackComponent = OneItemTrackComponent;
//# sourceMappingURL=one-item-track.component.js.map