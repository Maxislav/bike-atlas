import {Injectable} from "@angular/core";
import {MapService} from "./map.service";
import {DeviceData} from "./log.service";
import {TimerService, Timer} from "./timer.service";
import {User} from "./main.user.service";
import {elapsedStatus} from "../util/elapsed-status";
import {Point} from "./track.var";
import {TailClass} from './tail.class'
import {distance} from "../util/distance";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import {MapMarker} from "../../types";

export interface MarkerInterface {
    id:string;
    image: string;
    lng: number;
    lat: number;
    name: string;
    popup:any;
    azimuth: number;
    status:string;
    elapsed:string;
    speed: number;
    date: string;
    device_key?:string;
    deviceData: DeviceData;
    hide:Function;
    rotate:Function;
    update:Function;
    remove: Function;
    ownerId?: number;
    updateSetImage: Function,
    tail: TailClass,
    updateMarker():void;
}




class Marker implements DeviceData {

    id: string;
    alt: number;
    name: string;
    azimuth: number;
    date: string;
    lat: number;
    lng: number;
    speed: number;
    src: string;
    image: string;
    tail: TailClass;
    speedSubject: Observable<number>;

    private speedBehaviorSubject: BehaviorSubject<number>
    static layerIds: Set<String> = new Set();
    private layerId: string;
    private icoContainer: HTMLElement;
    private popup: Popup;
    private iconMarker: MapMarker;
    private elapsed: string;
    private status: string = 'white';
    private intervalUpdateMarker: number;
    private timer: Timer;


    constructor(devData: DeviceData, private user: User, private mapboxgl: MapBoxGl, private map: MapGl, private timerService: TimerService) {
        Object.keys(devData).forEach(key => {
            this[key] = devData[key]
        });
        this.speedBehaviorSubject = new BehaviorSubject<number>(0)
        this.speedSubject = this.speedBehaviorSubject.asObservable();
        this.timer = new Timer();
        this.layerId = Marker.getNewLayer(0, 5000000, true) + '';
        const icoContainer = document.createElement('div');
        icoContainer.classList.add("user-icon");
        const img = new Image();
        img.src = this.user.image || 'src/img/no-avatar.gif';
        icoContainer.appendChild(img);
        this.icoContainer = icoContainer;

        this.popup = new mapboxgl.Popup({closeOnClick: false, offset: [0, -15], closeButton: false})
            .setLngLat([devData.lng, devData.lat])
            .setHTML('<div>' + devData.name + '</div>')
            .addTo(map);

        this.iconMarker = new mapboxgl.Marker(icoContainer, {offset: [-20, -20]})
            .setLngLat([devData.lng, devData.lat])
            .addTo(map);

        this.image = user.image || 'src/img/no-avatar.gif';

        this.elapsed = '...';

        this.tail = new TailClass(this.layerId, this.map)

        this.intervalUpdateMarker = setInterval(() => {
            this.updateMarker();
        }, 1000);

    }

    update(devData: DeviceData): Marker {
        const prevLngLat: Point = new Point(this.lng, this.lat);
        const t = this.timer.tick();
        for (let opt in devData) {
            this[opt] = devData[opt]
        }
        const nextLngLat: Point = new Point(this.lng, this.lat);
        this.speed = 3600 * 1000 * distance(prevLngLat, nextLngLat)/t; //km/h
        this.speedBehaviorSubject.next(this.speed)

        this.popup.setLngLat([this.lng, this.lat]);
        this.status = elapsedStatus(this);
        this.iconMarker.setLngLat([this.lng, this.lat]);
        this.icoContainer.setAttribute('status', this.status);
        this.tail.update(new Point(devData.lng, devData.lat))
        return this
    }

    updateMarker(): Marker {

        this.status = elapsedStatus(this);
        this.icoContainer.setAttribute('status', this.status);
        this.elapsed = this.timerService.elapse(this.date)
        return this
    }

    remove(): void {
        this.popup.remove();
        console.log('delete marker id', this.layerId);
        this.iconMarker.remove();
        this.intervalUpdateMarker && clearInterval(this.intervalUpdateMarker);
    };

    static getNewLayer(min, max, int): string {
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand = 'marker' + Math.round(rand)
        }
        if (Marker.layerIds.has(rand)) {
            return Marker.getNewLayer(min, max, int)
        }
        Marker.layerIds.add(rand)
        return rand
    }
}

@Injectable()
export class MarkerService {
    constructor(private mapService: MapService, private timer: TimerService) {}

    marker(devData:DeviceData, user: User):Marker {
        return new Marker(devData, user, this.mapService.mapboxgl, this.mapService.map, this.timer);
    }
}
