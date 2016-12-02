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
        flyTo();
        function flyTo(){
            map.easeTo({
                center: tr.coordinates[i],
                pitch: 60,
                zoom:16,
                duration: 100,
                animate: true,
                easing: function (t) {
                    //console.log(t)
                    if(t==1){
                        setTimeout(()=>{
                            map.rotateTo(tr.points[i].bearing,
                                {duration: 70, easing: function (t) {
                                    if(t==1 && i<tr.points.length-1){
                                        setTimeout(()=>{
                                            i++;
                                            flyTo()
                                        }, 1)
                                    }
                                    return t
                                }});
                        }, 1)
                    }
                    return t;
                }
            });
        }

    }

}