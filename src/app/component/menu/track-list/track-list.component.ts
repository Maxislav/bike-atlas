import {Component} from '@angular/core';
import {TrackService} from "app/service/track.service";
import {Track} from "app/service/track.var";
declare const module: any;
@Component({
    moduleId: module.id,
    selector: 'track-list',
    //template: "<div>Список</div><ul><li *ngFor='let track of list; let i = index'>{{i}}: {{track.distance}} km<div class='del' (click)='hideTrack(track)'>x</div></li></ul>",
    templateUrl: "./track-list.html",
    styleUrls: ['./track-list.css']
})
export class TrackList {

    list:Array<Track>;
    stop: Function;

    constructor(private trackService:TrackService) {
        this.list = trackService.trackList;
    }
}