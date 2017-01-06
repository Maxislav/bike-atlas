import {Component, Injectable} from '@angular/core';
import {Hero} from './hero';

import {HeroService} from './hero.service';
import {Router, NavigationEnd} from "@angular/router";



@Injectable()
export class NavigationHistory{
    get is(): boolean {
        return 1<this.history.length;
    }
    history: Array<string>;
    constructor(){
        this.history = []
    }
}


@Component({
    moduleId: module.id,
    selector: 'my-app',
    //templateUrl: 'src/app/template/my-app.html',
    template:'<toast-component></toast-component><router-outlet></router-outlet>',
    providers : [NavigationHistory],
    styleUrls: [
        'css/app.component.css',
    ]
})


export class AppComponent {
    title = 'Tour of Heroes';
    constructor(private router: Router, nh: NavigationHistory){
        this.router.events.subscribe((e) => {
            if(e instanceof NavigationEnd){
                nh.history.push(e.url)
            }
        });
    }
}
