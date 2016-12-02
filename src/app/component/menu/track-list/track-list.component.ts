import {Component} from '@angular/core';
import {Track} from "app/service/track";
import {Track as TrackVar, Point} from "app/service/track.var";
import {Util} from "app/service/util";

@Component({
    moduleId: module.id,
    selector: 'track-list',
    //template: "<div>Список</div><ul><li *ngFor='let track of list; let i = index'>{{i}}: {{track.distance}} km<div class='del' (click)='hideTrack(track)'>x</div></li></ul>",
    templateUrl: "./track-list.html",
    styleUrls: ['./track-list.css']
})
export class TrackList {

    list:Array<any>;
    util: Util;

    constructor(private track:Track) {
        this.util = new Util();
        this.list = track.trackList
      
    }
    hideTrack(track: TrackVar){
        track.hide()
    }
    onGo(_tr: TrackVar){
        const map = this.track.map;
        const points = this.fillTrack(_tr.points)



        //return

        let i = 0;

        flyTo();


        function flyTo(){

            map.setCenter(points[i]);

            if(i<points.length-2){
                setTimeout(()=>{
                    i++;
                    flyTo()
                },10)
            }


        }

    }
    fillTrack(points: Array<Point>){
        let fillTrack: Array<Array<number>> = [];
        const F = parseFloat;

        points.forEach((point, i)=>{
            if(i<points.length-1){
                let distBetween = parseInt(this.util.distanceBetween2(point, points[i+1]));
                let arr = fill(point, points[i+1], distBetween/10)
                fillTrack = fillTrack.concat(arr);
                //console.log(distBetween)
            }
        });

        //console.log(fillTrack)


        function fill(point1, point2, steps){
            const arr = [];
                let lngStep = (point2.lng - point1.lng)/steps;
                let latStep = (point2.lat - point1.lat)/steps;

            for(let i = 0; i<steps; i++){
                arr.push([
                    point1.lng+(lngStep*i),
                    point1.lat+(latStep*i)
                ]);
                if(i==steps-1){
                    arr[i] = [];
                    arr[i][0] = point2.lng;
                    arr[i][1] = point2.lat
                }
            }
            return arr

        }

        return fillTrack


    }

}