export interface DeviceRow {
    'id': number,
    'user_id': number,
    'device_key': string,
    'name': string,
    'phone': string
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
    type: 'POINT' | 'BS'
}

export interface LoggerBsRow extends LoggerRow{
    bs: Array<LoggerRow>
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