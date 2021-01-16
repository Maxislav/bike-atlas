import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {Subject} from 'rxjs';


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
