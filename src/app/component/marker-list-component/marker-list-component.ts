import { Component, HostListener } from '@angular/core';
import { MyMarkerService } from 'app/service/my-marker.service';

declare var module: { id: string };

@Component({
    moduleId: module.id,
    selector: 'marker-list-component',
    templateUrl: './marker-list-component.html',
    styleUrls: ['./marker-list-component.css']
})
export class MarkerListComponent {

    constructor(private myMarkerService: MyMarkerService) {

    }

    /*@HostListener('document:click', ['$event'])
    docClick() {
        this.myMarkerService.hide()
    }

    @HostListener('click', ['$event'])
    click(e) {
        e.stopPropagation();
    }
*/
    onClose(){
        this.myMarkerService.hide()
    }


}

