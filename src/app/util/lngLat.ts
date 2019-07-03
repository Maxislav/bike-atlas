export class LngLat extends Array{
    lng:number;
    lat:number;
    constructor(){
        super()
    }
    setValue(lngLat: {lng: number, lat: number}): LngLat{
        this.lat = lngLat.lat;
        this.lng = lngLat.lng;
        this[0] = this.lng;
        this[1] = this.lat;
        return this
    }
};