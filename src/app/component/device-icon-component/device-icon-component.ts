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

@Component({
    selector: 'device-icon-component',
    template: '<div class="ico-container" ><img [ngStyle]="{\'background\': background}" [src]="src"/></div>',
    styleUrls: ['./device-icon-component.less']

})
export class DeviceIconComponent implements OnInit, OnDestroy {
    private readonly TIME_LIMIT = 10 * 60 * 1000;
    public name: string;
    public src: string;
    public background: string = 'white';
    public colorSubject: Subject<string> = new Subject();




    constructor() {
        this.colorSubject.subscribe((color)=>{
           this.background = color
        })
    }


    ngOnInit(): void {

    }


    ngOnDestroy(): void {
    }
}