import { Component } from '@angular/core';
import {Hero} from './hero';

import {HeroService} from './hero.service';


@Component({
    moduleId: module.id,
    selector: 'my-app',
    //templateUrl: 'src/app/template/my-app.html',
    template: '' +
    '<nav>' +
    '<a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>' +
    '<a routerLink="/heroes" routerLinkActive="active">Heroes</a>    ' +
    '</nav>'+
    '<router-outlet></router-outlet>',
    styleUrls: [ '../../lib/leaflet/leaflet.css' ]
})


export class AppComponent {
    title = 'Tour of Heroes';


    constructor(){

    }



}
