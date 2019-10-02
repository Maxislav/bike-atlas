import { Component, Injectable, OnInit, ViewContainerRef } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from './service/menu.service';
import {Track, TrackService } from './service/track.service';
import { MyMarkerService } from './service/my-marker.service';
import { Marker } from './service/marker.service';
import { MyMapMarker } from './service/my-marker.service';
import { PopupService } from 'src/app/modules/popup-module/popup.service';


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
export class AppComponent implements OnInit{
    title = 'Tour of Heroes';
    trackList: Array<Track>;
    markerList: Array<MyMapMarker>;
    constructor(private router: Router,
                nh: NavigationHistory,
                private menuService: MenuService,
                private track: TrackService,
                public myMarkerService: MyMarkerService,
    ) {
        this.router.events.subscribe((e) => {
            if (e instanceof NavigationEnd) {
                nh.history.push(e.url);
            }
        });
        this.trackList = track.trackList;
        this.markerList = myMarkerService.markerList;
    }

    ngOnInit(): void {
    }
}
