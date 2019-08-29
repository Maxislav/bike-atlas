

export interface BaseStationPoint {
    lng: number;
    lat: number;
    id: number;
    range: number;
    rxLevel: number;
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
    bs?: Array<{lng: number, lat: number, range: number, rxLevel: number}>
    accuracy?: number
}

export interface CountryNetworkCode {
    mcc: number;
    mnc: number;
}



export interface MCell {
    lac: number;
    cellId: number;
}



export interface MACell {
    lac: number;
    cid: number;
    rxLevel?: number;
}



export interface MobileCellArray extends CountryNetworkCode{
    cells: Array<MACell>;
}

export interface MobileCell {
    mcc: number;
    mnc: number;
    lac: number;
    cellId: number;
    rxLevel?: number;
}

export interface MobileCellWithDevice extends MobileCell{
    deviceId: string;
    date: Date
}