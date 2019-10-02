import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import {
    PopupButton,
    PopupInitialState,
    PopupInstance,
    PopupInterface,
    PopupService
} from 'src/app/modules/popup-module/popup.service';
import { printLine } from 'tslint/lib/verify/lines';

@Component({
    selector: 'popup-item-component',
    templateUrl: './popup-item.component.html',
    styleUrls: [
        './popup-item.component.less'
    ]
})
export class PopupItemComponent implements OnInit {
    myInjector: Injector;

    @Input() popup: PopupInterface;
    @Output() onClose = new EventEmitter<PopupInterface>();

    constructor(private injector: Injector) {

    }

    ngOnInit(): void {
        console.log(this.popup);

        this.myInjector =
            Injector.create({
                providers: [
                    {
                        provide: 'PopupInitialState',
                        deps: [],
                        useValue: this.popup.initialState
                    }
                ], parent: this.injector
            });
    }

    click(button: PopupButton) {
        const isClose = button.click();
        if (isClose) {
            this.onClose.emit(this.popup);
        }
    }

}
