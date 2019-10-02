import { Component, Inject, Input, OnInit } from '@angular/core';
import { DeviceComponent } from 'src/app/component/device/device.component';
import { PopupInitialState } from 'src/app/modules/popup-module/popup.service';

@Component({
    selector: 'device-del-popup-component',
    template: '<div>Delete device {{name}}</div>'

})
export class DeviceDelPopupComponent implements OnInit{
    name: string;

    @Input() dd: any
    constructor(@Inject('PopupInitialState') popupInitialState: any ) {
        this.name = popupInitialState.name
    }

    ngOnInit(): void {

        console.log(this.dd)
    }
}

