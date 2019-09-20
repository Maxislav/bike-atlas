import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'device-icon-component',
    template: '<div class="ico-container" ><img [ngStyle]="{\'background\': backgroundColor}" [src]="src"/></div>',
    styleUrls: ['./device-icon-component.less']

})
export class DeviceIconComponent implements OnInit{
    public src: string;
    public dateSubject: Subject<Date> = new Subject<Date>();
    public backgroundColor: string = 'green';
    constructor() {
       this.dateSubject.subscribe((date) =>{
           console.log(date)
       })
    }


    ngOnInit(): void {
    }
}