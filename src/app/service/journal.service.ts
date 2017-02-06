import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {Point} from "./track.var";

interface Track{
    userId: number,
    points: Array<any>,
    name: String
}

@Injectable()
export class JournalService  {


    socket: any;
    private _devices: {[id:string]:Array<any>}  = {};
    public list: Array<Track>;
    private _selectDate: Date;
    private dateCache: Array<string> = [];


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
        const fromTo = new Date(from).toISOString()+new Date(to).toISOString();
        if(-1<this.dateCache.indexOf(fromTo)){
            return
        }
        this.dateCache.push(fromTo);

        return this.socket
            .$emit('trackFromTo', {
                from,
                to
            })
            .then(d => {
                console.log(d)
                
                if(d && d.result == 'ok'){
                    //this.devices = d.devices;
                    this.fillList(d.list);
                   
                    return d;

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

    fillList(list){

        list.forEach((obj: Track)=>{
            if(obj.points.length) {
                const points: Array<Point> = [];
                obj.points.forEach(p=>{
                    const point  = new Point(p.lng, p.lat, p.azimuth);
                    point.date = p.date;
                    point.speed = p.speed;
                    point.id = p.id
                    points.push(point);
                });
                obj.points = points;
                this.list.unshift(obj);
            }
        });

       /* for(let key in devices){
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

        }*/
    }
    
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
