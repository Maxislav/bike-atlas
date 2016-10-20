import { Component } from '@angular/core';
import {Mercator} from './mercator.service'
import {LeafletMapDirective} from "./directive/leaflet-map.directive";
import {HeroService} from "./hero.service";

@Component({
    //selector: 'my-heroesw',
    //templateUrl: 'src/app/template/my-app.html'
    template: '<leaflet-map> map loading...</leaflet-map>',
    styleUrls: ['src/app/css/auth.component.css'],
    directives: [LeafletMapDirective],
    providers: [HeroService]
})
export class MapComponent{
    private mercator: Mercator;
    private dy: number;
    constructor(mercator: Mercator){
        this.mercator = mercator;

        this.mercator.getYpixel(50, 1);
    }
    
    
}