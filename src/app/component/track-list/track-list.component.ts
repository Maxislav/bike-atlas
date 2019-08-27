import {Component} from '@angular/core';
import {TrackService} from "../../service/track.service";
import { Track } from '../../service/track.var';
//import {Track} from "app/service/track.var";
@Component({
    selector: 'track-list',
    templateUrl: "./track-list.html",
    styleUrls: ['./track-list.less']
})
export class TrackList {

    list:Array<Track>;
    stop: Function;

    constructor(private trackService:TrackService) {
        this.list = trackService.trackList;
    }
}