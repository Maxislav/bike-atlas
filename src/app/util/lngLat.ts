export class LngLat extends Array {
    lng: number;
    lat: number;

    constructor(lng?: number, lat?: number) {
        super();
        if (typeof lng === 'number' && typeof lat === 'number') {
            this.setValue({
                lng,
                lat
            });
        }
    }

    setValue(lngLat: { lng: number, lat: number }): LngLat {
        this.lat = lngLat.lat;
        this.lng = lngLat.lng;
        this[0] = this.lng;
        this[1] = this.lat;
        return this;
    }

    toString(): string {
        return this.join(";")
    }
    toArray(): Array<number>{
        return [this[0], this[1]]
    }
}
