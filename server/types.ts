export interface DeviceRow {
    'id': number,
    'user_id': number,
    'device_key': string,
    'name': string,
    'phone': string,
    image: string
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
    bs?: Array<{lng: number, lat: number, range: number}>,
    accuracy?: number
}

export interface PointWithSrc extends Point{
    src: string
}


export interface LoggerRow {
    alt: number;
    azimuth: number;
    date: Date;
    device_key: string;
    id: number;
    lng: number;
    lat: number;
    speed: number;
    src: string;
    type: 'POINT' | 'BS',
    accuracy: number,
    bs: Array<LoggerRow>
}
/*

export interface LoggerBsRow extends LoggerRow{
    bs: Array<LoggerRow>
}
*/

export interface SettingRow {
    id: number,
    user_id: number,
    map: 'ggl' | 'sat',
    hill: 0 | 1
    lock: 0 | 1

}

export interface User {
    id: number,
    name: string,
    image: string,
    devices: Array<DeviceRow>,
    markers: Array<any>,
    friends: Array<User>,
    hash: string,
    setting: { [key: string]: any }
}