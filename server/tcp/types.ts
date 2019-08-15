

export interface BaseStationPoint {
    lng: number;
    lat: number;
    id: number;
}


export interface Point {
    id: string | number;
    device_key: string | number;
    speed: number;
    azimuth: number;
    alt: number;
    lng: number;
    lat: number;
    type: 'POINT' | 'BS';
    date: Date;
}
export interface CountryNetworkCode {
    mcc: number;
    mnc: number;
}
export interface MCell {
    lac: number;
    cellId: number;
}

export interface MobileCell {
    mcc: number;
    mnc: number;
    lac: number;
    cellId: number;
}

export interface MobileCellWithDevice extends MobileCell{
    deviceId: string;
    date: Date
}