import { Component, Injectable } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from './service/menu.service';
import { TrackService } from './service/track.service';
import { Track as Tr } from './service/track.var';
import { MyMarkerService } from './service/my-marker.service';
import { Marker } from './service/marker.service';
import { MyMapMarker } from './service/my-marker.service';


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
    selector: 'my-app',
    templateUrl: 'app.component.html',
    styleUrls: [
        'css/app.component.less',
    ],

})
export class AppComponent {
    title = 'Tour of Heroes';
    trackList: Array<Tr>;
    markerList: Array<MyMapMarker>;
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
