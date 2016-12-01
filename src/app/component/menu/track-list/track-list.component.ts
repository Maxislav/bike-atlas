import {Component} from '@angular/core';
import {Track} from "app/service/track";

@Component({
    moduleId: module.id,
    selector: 'track-list',
    //template: "<div>Список</div><ul><li *ngFor='let track of list; let i = index'>{{i}}: {{track.distance}} km<div class='del' (click)='hideTrack(track)'>x</div></li></ul>",
    templateUrl: "./track-list.html",
    styleUrls: ['./track-list.css']
})
export class TrackList {

    list:Array<any>;

    constructor(private track:Track) {
        this.list = track.trackList
      
    }

    hideTrack(track: any){
        track.hide()
    }

}