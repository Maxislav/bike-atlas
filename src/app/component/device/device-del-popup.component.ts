import { Component, Inject, Input, OnInit } from '@angular/core';
import { DeviceComponent } from 'src/app/component/device/device.component';
import { PopupInitialState } from 'src/app/modules/popup-module/popup.service';

@Component({
    selector: 'device-del-popup-component',
    template: '<div>Delete device: {{name}}</div>',
    styleUrls: [
        './device-del-popup.component.less'
    ]

})
export class DeviceDelPopupComponent implements OnInit{
    name: string;

    constructor(@Inject('popupInitialParams') popupInitialParams: any ) {
        this.name = popupInitialParams.name
    }

    ngOnInit(): void {

    }
}

