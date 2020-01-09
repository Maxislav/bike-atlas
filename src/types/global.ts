import { Marker } from '../app/service/marker.service';

interface Geometry {
    type: 'Polygon' | 'LineString',
    coordinates: Array<Array<number>>
}

export interface Feature {
    type: 'Feature';
    geometry: Geometry
}

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
    new(lng: number, lat: number): LngLat

    lng: number,
    lat: number
}
export interface BaseStation {
    lng: number;
    lat: number;
    range: number;
    rxLevel: number;
}


export interface LogData {
    id: string;
    device_key: string;
    speed: number;
    azimuth: number;
    alt: number;
    lng: number;
    lat: number;
    type: 'POINT' | 'BS';
    date: string;
    name: string,
    bs?: Array<BaseStation>,
    accuracy?: number
}


export interface MapMarker {
    new(HTMLElement, options: Object)

    setLngLat(lngLat: Array<number> | LngLat): this

    getLngLat(): LngLat

    addTo(map: any)

    remove(): this

    togglePopup()
}

export declare interface MapGl {
    new(object): this

    onLoad: Promise<this>

    addControl(any): this

    on(string, Function): this

    getZoom(): number

    setZoom(number): this

    getPitch(): number

    getCenter(): LngLat

    getBearing(): number

    addLayer(Object): this;

    removeLayer(id: string): this;

    removeSource(id: string): this;

    addSource(string, Object): this

    getSource(string): any

    on(string, callbackFn: (e?: any) => void): this

    off(string, callbackFn: (e?: any) => void): this;

    queryRenderedFeatures(e, params): Array<any>;
    fitBounds(l1:any, l2: any)
}

export interface Popup {
    new(props?: Object)

    setLngLat(lngLat: number[] | LngLat): this

    setHTML(string): this

    addTo(MapBoxGl): this

    setDOMContent(HTMLElement): this

    remove(): this
}

export interface MapBoxGl {
    Popup: Popup,
    Map: MapGl
    Marker: MapMarker;
    LngLat: LngLat
}


export interface Device {
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

    remove(): void
}


export interface DeviceLogData {
    id: string;
    alt: number;
    name: string;
    azimuth: number;
    date: string;
    lat: number,
    lng: number,
    speed: number,
    src: string;
    image?: string,
    device_key?: string;
    ownerId?: number;
    type: 'POINT' | 'BS',
    bs?: Array<{lng: number, lat: number, range: number, rxLevel}>,
}

export interface MapArea {
    id?: number;
    lng: number;
    lat: number;
    layerId?: string,
    radius: number;
    update: (data: any) => this;
    remove: () => this;
}

export interface MapAreaList {
    layerId: string,
    update: (data: any) => this;
    remove: () => this;
}

export interface Accuracy {
    layerId: string,
    update: (data: any) => this;
    remove: () => this;
}
