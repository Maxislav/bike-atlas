import { Component } from '@angular/core';
import {Hero} from './hero';

import {HeroService} from './hero.service';


@Component({
    moduleId: module.id,
    selector: 'my-app',
    //templateUrl: 'src/app/template/my-app.html',
    template:'<router-outlet></router-outlet>',
    styleUrls: [
        'css/app.component.css',
    ]
})


export class AppComponent {
    title = 'Tour of Heroes';


    constructor(){

    }



}
