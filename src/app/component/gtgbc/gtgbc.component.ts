import { Component } from '@angular/core';
import {ngIfAnimation} from '../../animation/animation'
import { MapService } from '../../service/map.service';
@Component({
    moduleId: module.id,
    templateUrl: './gtgbc.component.html',
    styleUrls: ['./gtgbc.component.css'],
    animations: [ngIfAnimation]
})
export class GtgbcComponent {

    constructor(private mapService: MapService){
        mapService.onLoad
            .then(map => {
                map
            })
    }
    onClose(){

    }
}
