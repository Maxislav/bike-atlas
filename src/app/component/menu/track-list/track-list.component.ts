import {Component} from '@angular/core';
import {Track} from "app/service/track";
import {Track as TrackVar} from "app/service/track.var";

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
    hideTrack(track: TrackVar){
        track.hide()
    }
    onGo(tr: TrackVar){
        const map = this.track.map;
        let i = 0;
        flyTo(tr.coordinates[0])
        map.setPitch(60);


        function flyTo(center: Array<number>){
            map.flyTo({
                center: center,
                speed: 0.2,
                curve:1
            });
            if(i<tr.coordinates.length){
                setTimeout(()=>{
                    i++;
                    flyTo(tr.coordinates[i]);
                    tr.points[i].bearing && map.setBearing(tr.points[i].bearing)
                }, 300)
            }

        }

    }

}