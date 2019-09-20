import { User } from '../service/main.user.service';
import { LngLat } from '../util/lngLat';
import { Device } from 'src/app/service/device.service';

export class Marker {

    id: string = null;
    alt: number = null;
    device: Device
    name: string = null;
    azimuth: number;
    date: string | Date;
    lat: number;
    lng: number;
    speed: number;
    src: string;
    image: string;

    constructor(map) {

    }


    setDevice(device: Device): this {
        this.device = device;
        this.name = device.name;
        return this;
    }

    set

    setLngLat(lngLat: LngLat){
        this.lng = lngLat.lng;
        this.lat = lngLat.lat;
    }





}