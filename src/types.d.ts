interface Set<T> {
    add(value: T): this;
    clear(): void;
    delete(value: T): boolean;
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    readonly size: number;
}
interface SetConstructor {
    new (): Set<any>;
    new <T>(values?: T[]): Set<T>;
    readonly prototype: Set<any>;
}
declare var Set: SetConstructor;

interface LngLat extends Array<number>{
    lng: number,
    lat: number
}

interface Marker{
    new(HTMLElement, options: Object)
}

interface MapGl{
    new(object): this
    addControl(any): this
    on(string, Function): this
    getZoom(): number
    setZoom(number): this
    getPitch(): number
    getCenter(): LngLat
    getBearing(): number
}

interface Popup{
    new (Object?): this
    setLngLat(lngLat: number[] | LngLat): this
    setHTML(string): this
    addTo(MapBoxGl): this
}

interface MapBoxGl{
    Popup: Popup,
    Map: MapGl
    Marker: Marker
}

//declare const mapboxgl: