import {
    AfterViewInit,
    ApplicationRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import { MyMarkerService } from 'app/service/my-marker.service';

declare const module:any;

@Component({
    moduleId: module.id,
    selector: 'my-input-popup-component',
    template: '<input class="input" type="text" [(ngModel)]="title" ' +
    '(ngModelChange)="onChange()"' +
        '(focusout)="focusOut()"'+
    '/>',
    styleUrls: ['./my-input-popup-component.css']
})
export class MyInputPopupComponent implements OnInit, AfterViewInit{

    @Input() title: string;

    @Output() onSave:  EventEmitter<MyInputPopupComponent> = new EventEmitter<MyInputPopupComponent>();
    constructor(
        private elRef: ElementRef,
        public ref: ApplicationRef,
    ){
    }

    ngOnInit(): void {
        console.log('init')
    }

    ngAfterViewInit(): void {
        this.elRef.nativeElement.getElementsByTagName('input')[0].focus()
    }


    onChange(){
        this.ref.tick()
    }

    focusOut(){
        this.onSave.emit(this)
    }







}

