import {Component, Injectable} from '@angular/core';

import {Router, NavigationEnd} from "@angular/router";
import {MenuService} from './service/menu.service';
import {TrackService} from './service/track.service';
import {routeAnimation} from  './animation/animation'


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
    templateUrl:'app.component.html',
    providers : [NavigationHistory, MenuService, TrackService],
    styleUrls: [
        'css/app.component.css',
    ],

})


export class AppComponent {
    title = 'Tour of Heroes';

    constructor(private router: Router, nh: NavigationHistory, private menuService: MenuService,  private track:TrackService){
        this.router.events.subscribe((e) => {
            if(e instanceof NavigationEnd){
                nh.history.push(e.url)
            }
        });
        this.trackList = track.trackList;
    }
}
