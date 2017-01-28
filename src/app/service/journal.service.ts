import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {Point} from "./track.var";
@Injectable()
export class JournalService {


    socket: any;
    private _devices: {[id:string]:Array<any>}  = {};
    public list: Array<Array<Point>>;
    private _selectDate: Date;


    constructor(io: Io) {
        this.socket = io.socket;
        this.list = [];
        const d = new Date();
        this.selectDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    setSelectDate(value){
        this.selectDate = value;
        return value
    }

    stepGo(step: number):Date{
        const d = this.selectDate;
        this.selectDate = new Date(d.getFullYear(), d.getMonth(), d.getDate()+step);
        let from =  this.selectDate;
        let to =  new Date(this.selectDate.getFullYear(), this.selectDate.getMonth(), this.selectDate.getDate()+1)
        this.getTrack(from, to);
        return this.selectDate;
    }

    getTrack(from: Date, to: Date): Promise<any> {
        return this.socket
            .$emit('trackFromTo', {
                from,
                to
            })
            .then(d => {
                if(d && d.result == 'ok'){
                    this.devices = d.devices;
                    this.fillList(this.devices)

                    return this.devices;

                }else {
                    return null
                }

            })
    }

    getLastDate(){
       return this.socket
            .$emit('getLastDate', null)
            .then((d)=>{
                return d
            })
    }

    fillList(devices){
        for(let key in devices){
            const points: Array<Point> = [];
            devices[key].forEach(p=>{
                const point  = new Point(p.lng, p.lat, p.azimuth);
                point.date = p.date;
                point.speed = p.speed;
                point.id = p.id
                points.push(point);
            });
            if(points.length){
                this.list.unshift(points)
            }

        }
    }
]
    get selectDate(): Date {
        return this._selectDate;
    }

    set selectDate(value: Date) {
        this._selectDate = value;
    }


    get devices(): {[p: string]: Array<any>} {
        return this._devices;
    }

    set devices(value: {[p: string]: Array<any>}) {
        for (let key in value){
            this._devices[key] = value[key]
        }
    }


}
