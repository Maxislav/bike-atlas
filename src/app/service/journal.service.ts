import {Injectable} from '@angular/core';
import {Io} from './socket.oi.service';
import {Point} from './track.var';
import {Device} from './device.service';

export interface Track {
    userId: number,
    points: Array<any>,
    name: String,
    rangeOfDate: string,
    image: any
}

@Injectable()
export class JournalService {


    socket: any;
    private _devices: { [id: string]: Array<any> } = {};
    public list: Array<Track>;
    private _selectDate: Date;
    private dateCache: Array<string> = [];


    constructor(io: Io) {
        this.socket = io.socket;
        this.list = [];
        const d = new Date();
        this.selectDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }


    setSelectDate(value) {
        this.selectDate = value;
        return value;
    }

    stepGo(step: number): Date {
        const d = this.selectDate;
        this.selectDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + step);
        let from = this.selectDate;
        let to = new Date(this.selectDate.getFullYear(), this.selectDate.getMonth(), this.selectDate.getDate() + 1);
        // this.getTrack(from, to);
        return this.selectDate;
    }

    getTrack(device: Device, from: Date, to: Date): Promise<any> {
        const {device_key} = device;
        const fromTo = String(new Date(from).toISOString()).concat(new Date(to).toISOString());
        return this.socket
            .$get('trackDeviceFromTo', {
                device_key,
                from,
                to
            })
            .then((d: {
                result: string,
                list: Array<{
                    name: string,
                    userId: number,
                    points: any[]
                }>
            }) => {
                if (d && d.result == 'ok') {
                    const list = d.list.map( (l) => {
                        return {
                            ...l,
                            image: device.image
                        }
                    })

                    this.fillList(list, fromTo);
                    return d;
                } else {
                    return null;
                }
            });
    }

    public getLastDate(): Promise<Array<{ date: string, device_key: string }>> {
        return this.socket.$get('getLastDate', null)

    }

    public getLastDeviceDate(device_key: string) {
        return this.socket.$get('getLastDeviceDate', device_key)
    }

    fillList(list: Array<{
        name: string,
        userId: number,
        points: any[],
        image: any,
    }>, rangeOfDate: string) {

        list.forEach((obj) => {
            if (obj.points.length) {
                const points: Array<Point> = [];
                obj.points.forEach(p => {
                    const point = new Point(p.lng, p.lat, p.azimuth);
                    point.date = p.date;
                    point.speed = p.speed;
                    point.id = p.id;
                    points.push(point);
                });
                const track: Track = {
                    ...obj,
                    image: obj.image,
                    points,
                    userId: obj.userId,
                    name: obj.name,
                    rangeOfDate
                }

                const index = this.list.findIndex((item: Track) => {
                    return item.rangeOfDate == rangeOfDate;
                });
                if (-1 < index) {
                    this.list[index] = track;
                } else {
                    this.list.unshift(track);

                }
            }
        });


    }

    public cleadData(): void {
        this.list.length = 0
    }

    get selectDate(): Date {
        return this._selectDate;
    }

    set selectDate(value: Date) {
        this._selectDate = value;
    }


    get devices(): { [p: string]: Array<any> } {
        return this._devices;
    }

    set devices(value: { [p: string]: Array<any> }) {
        for (let key in value) {
            this._devices[key] = value[key];
        }
    }


}
