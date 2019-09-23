import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { interval } from 'rxjs/internal/observable/interval';
import { Observable } from 'rxjs/Observable';
import { race } from 'rxjs/internal/observable/race';
import { merge } from 'rxjs';
import { mergeAll } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { LngLat } from 'src/app/util/lngLat';
import { Timer } from 'src/app/service/timer.service';
import { el } from '@angular/platform-browser/testing/src/browser_util';
import { LogData } from 'src/types/global';
import { nearer } from 'q';

class ColorSpeed {
    move: string = '#1E90FF';
    stop: string = '#7ddc74';
    rest: string = '#ffff00';
    dead: string = '#FFFFFF';

    DEAD_TIME = 12 * 3600 * 1000;
    MOVE_TIME = 60 * 1000;

    background: string;

    constructor(){
        this.background = this.dead;
    }

    calculate(elapseTime: number): string {
        return this.background = '#FFFFFF'
    }
}

@Component({
    selector: 'device-icon-component',
    template: '<div class="ico-container" ><img [ngStyle]="{\'background\': color.background}" [src]="src"/></div>',
    styleUrls: ['./device-icon-component.less']

})
export class DeviceIconComponent implements OnInit, OnDestroy {
    private readonly TIME_LIMIT = 10 * 60 * 1000;
    public name: string;
    public src: string;
    public color: ColorSpeed;
    private timerSubject: Subject<Date> = new Subject<Date>();
    private intervalID: any;
    private timer: Timer = new Timer();
    private markerDate: Date;

    public logDataSubject: Subject<LogData> = new Subject<LogData>();

    date: Date;
    speed: number;
    lngLat: string;

    elapseTime: number;

    isMove = false;

    constructor() {
        this.color = new ColorSpeed();

        this.logDataSubject.subscribe((logData: LogData) =>{
            this.markerDate = new Date(logData.date);
            const l = new LngLat(logData.lng, logData.lat).toString();
            if(this.lngLat && this.lngLat !== l){
                this.isMove = true;
            }
            this.lngLat = l;
            this.elapseTime =  new Date().getTime() - this.markerDate.getTime();
        });

        this.intervalID = setInterval(() => {
            this.timerSubject.next(new Date());
        },1000);

        this.timerSubject.subscribe((date) => {
           this.elapseTime = date.getTime() - this.markerDate.getTime();
        });

        merge(this.logDataSubject, this.timerSubject).subscribe(val => {
            if(this.elapseTime < this.color.MOVE_TIME && this.isMove){
                this.color.background =  this.color.move
            }else if(this.elapseTime < this.color.MOVE_TIME){
                this.color.background = this.color.stop;
            }else if( this.color.DEAD_TIME < this.elapseTime){
                this.color.background = this.color.dead
            }else {
                this.color.background = this.color.rest
            }
        })
    }


    ngOnInit(): void {

    }



    ngOnDestroy(): void {
        clearInterval(this.intervalID);
    }
}