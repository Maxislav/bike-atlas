export interface LoggerRow{
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