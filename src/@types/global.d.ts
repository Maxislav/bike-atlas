import { Marker } from '../app/service/marker.service';

interface Set<T> {
    add(value: T): this;

    clear(): void;

    delete(value: T): boolean;

    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;

    has(value: T): boolean;

    readonly size: number;
}

interface SetConstructor {
    new(): Set<any>;

    new<T>(values?: T[]): Set<T>;

    readonly prototype: Set<any>;
}

declare var Set: SetConstructor;

interface ModuleInterface {
    id: any;
}

declare var module: ModuleInterface;

export interface LngLat extends Array<number> {
    lng: number,
    lat: number
}

interface MapMarker {
    new(HTMLElement, options: Object)
    setLngLat(lngLat: Array<number> | LngLat): this
    remove(): this
}

export declare interface MapGl {
    new(object): this

    addControl(any): this

    on(string, Function): this

    getZoom(): number

    setZoom(number): this

    getPitch(): number

    getCenter(): LngLat

    getBearing(): number

    addLayer(Object): this

    addSource(string, Object): this

    getSource(string): any

    onLoad: Promise<this>

    on(string, Function): this
}

interface Popup {
    new(Object?): this

    setLngLat(lngLat: number[] | LngLat): this

    setHTML(string): this

    addTo(MapBoxGl): this

    remove(): this
}

interface MapBoxGl {
    Popup: Popup,
    Map: MapGl
    Marker: MapMarker
}


interface Device {
    id: string;
    name: string;
    image: string;
    ownerId: number,
    phone?: string,
    marker?: Marker;
    passed?: string;
    device_key?: string;
}


export interface MobileCell {
    mcc: number;
    mnc: number;
    lac: number;
    cellId: number;
}


export interface MyMarker {
    id: number,
    image_id: number,
    user_id: number,
    lng: number,
    lat: number,
    title: string
}

export interface User{
    id: number;
    name: string;
    image: string;
    deviceKeys?:Array<string>;
    setting?: any;
    devices?: Array<Device>;
    markers: Array<MyMarker>
}

