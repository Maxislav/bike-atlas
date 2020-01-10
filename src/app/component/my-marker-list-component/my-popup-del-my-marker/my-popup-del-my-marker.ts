import { Component, Inject } from '@angular/core';

@Component({
    selector: 'my-popup-del-my-marker',
    template: '<div>Delete marker: {{name}}</div>',
})
export class MyPopupDelMyMarker {
    name: string;
    constructor(@Inject('popupInitialParams') popupInitialParams: any){
        this.name = popupInitialParams.name;
    }
}