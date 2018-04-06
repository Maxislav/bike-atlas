import {Injectable} from "@angular/core";
import {MapService} from "./map.service";
import {Point} from "./track.var";
import {DeviceData} from "./log.service";
import {TimerService} from "./timer.service";
import {User} from "./main.user.service";
import {deepCopy} from "../util/deep-copy";
import {elapsedStatus} from "../util/elapsed-status";
import {Tail} from "../util/tail.class";
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
    tail: Tail,
    updateMarker():void;
}

class Marker implements DeviceData{
    id: string;
    alt: number;
    name: string;
    azimuth: number;
    date: string;
    lat: number;
    lng: number;
    speed: number;
    src: string;
    static layerIds: Set<String> = new Set();
    private layerId: string;

    private icoContainer: HTMLElement;


    constructor( devData: DeviceData, private user: User, private mapboxgl){
        Object.keys(devData).forEach(key => {
            this[key] = devData[key]
        });
        this.layerId = Marker.getNewLayer(0, 5000000, true) + '';
        const icoContainer = document.createElement('div');
        icoContainer.classList.add("user-icon")
        const img = new Image();
        img.src = this.user.image || 'src/img/no-avatar.gif';
        icoContainer.appendChild(img);
        this.icoContainer = icoContainer

    }

    updateMarker(): void {


    }

    static getNewLayer(min, max, int): string {
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand = 'marker' + Math.round(rand)
        }
        if( Marker.layerIds.has(rand)){
            return Marker.getNewLayer(min, max, int)
        }
        Marker.layerIds.add(rand)
        return rand

    }
}





@Injectable()
export class MarkerService {
    private layerIds:Array<string>;

    constructor(private mapService:MapService, private timer:TimerService) {
        this.layerIds = [];
    }


    marker(devData:DeviceData, user: User):Marker {
        const m = new Marker(devData, user, this.mapService.mapboxgl);



        const marker : Marker = deepCopy(devData);
        const map = this.mapService.map;
        const layerId: string = this.getNewLayer(0, 5000000, true) + '';
        const mapboxgl: MapBoxGl = this.mapService.mapboxgl;
        let mapBearing = map.getBearing();

        const icoContainer = document.createElement('div');
        icoContainer.classList.add("user-icon");

        icoContainer.setAttribute('status', elapsedStatus(devData));


        const img = new Image();
        img.src = user.image || 'src/img/no-avatar.gif';
        icoContainer.appendChild(img);

        const popup = new mapboxgl.Popup({closeOnClick: false, offset: [0, -15], closeButton: false})
            .setLngLat([devData.lng, devData.lat])
            .setHTML('<div>' + devData.name + '</div>')
            .addTo(map);

        const iconMarker = new mapboxgl.Marker(icoContainer, {offset: [-20, -20]})
            .setLngLat([devData.lng, devData.lat])
            .addTo(map);


        let intervalUpdateMarker = null;

        const timer = this.timer;

        marker.tail = new Tail(new Point(devData.lng, devData.lat), map);
        marker.updateSetImage = function (src : string) {
            src = src || 'src/img/no-avatar.gif';
            img.src = src;
            this.image = src;
        };
        marker.image = user.image || 'src/img/no-avatar.gif';
        marker.elapsed= '...';
        //TODO остановился тут
        marker.update = function (devData: DeviceData) {
            for (let opt in devData) {
                this[opt] = devData[opt]
            }
            this.tail.update(new Point(this.lng,this.lat ))
            console.log(this.tail)
            popup.setLngLat([this.lng, this.lat]);
            iconMarker.setLngLat([this.lng, this.lat]);
            this.status = elapsedStatus(this);
            icoContainer.setAttribute('status', this.status);
        };

        marker.updateMarker = function () {
            this.status = elapsedStatus(this);
            icoContainer.setAttribute('status', this.status);
            this.elapsed = timer.elapse(this.date)
        };

        marker.remove = function () {
            popup.remove();
            console.log('delete marker id', layerId);
            iconMarker.remove();
            intervalUpdateMarker && clearInterval(intervalUpdateMarker);
        };

        intervalUpdateMarker = setInterval(()=> {
            marker.updateMarker();
        }, 1000);
        
        

        return marker;
    }

    private getNewLayer(min, max, int) {
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand = 'marker' + Math.round(rand)
        }
        if (-1 < this.layerIds.indexOf(rand)) {
            return this.getNewLayer(min, max, int)
        } else {
            return rand;
        }

    }
}
