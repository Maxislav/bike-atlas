import { Component, Injectable } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from './service/menu.service';
import { TrackService } from './service/track.service';
import { Track as Tr } from './service/track.var';
import { Marker, MyMarkerService } from './service/my-marker.service';

declare var module: { id: string };

@Injectable()
export class NavigationHistory {
    get is(): boolean {
        return 1 < this.history.length;
    }

    history: Array<string>;

    constructor() {
        this.history = [];
    }
}


@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html',
    // providers: [NavigationHistory, MenuService, TrackService],
    styleUrls: [
        'css/app.component.css',
    ],

})
export class AppComponent {
    title = 'Tour of Heroes';
    trackList: Array<Tr>;
    markerList: Array<Marker>;
    constructor(private router: Router,
                nh: NavigationHistory,
                private menuService: MenuService,
                private track: TrackService,
                public myMarkerService: MyMarkerService
    ) {
        this.router.events.subscribe((e) => {
            if (e instanceof NavigationEnd) {
                nh.history.push(e.url);
            }
        });
        this.trackList = track.trackList;
        this.markerList = myMarkerService.markerList;
    }
}
