import {Component} from '@angular/core';
import {TrackService} from "app/service/track.service";
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
    stop: Function;

    constructor(private track:TrackService) {
        this.util = new Util();
        this.list = track.trackList;
        //this.permitMovie = true
      
    }
    hideTrack(track?: TrackVar){
        track && track.hide();
        if(this.stop){
            this.stop()
        }
    }

    onGo(_tr: TrackVar){
        this.hideTrack();
        const $this = this;
        const map = this.track.map;
        const points = this.fillTrack(_tr.points);
        const marker = this.track.showSpriteMarker(points[0]);
        let timeout;

        let i = 0;
        let step = 1;
        flyTo();
        function flyTo(){
            map.setCenter([points[i].lng, points[i].lat]);
            marker.setCenter(points[i], points[i].bearing)
            if(i<points.length-2){
                timeout = setTimeout(()=>{
                    i+=step;
                    flyTo()
                },40)
            }else{
                stop()
            }
        }

        map.on('moveend' , moveend);

        function moveend(){
            switch (true){
                case  map.getZoom()<10:
                    step = 40;
                    break;
                case map.getZoom()<18:
                    step = 5*parseInt(''+(18 - map.getZoom()));
                    break;
                default:
                    step = 1;
            }

        }

        function stop(){
            $this.stop();
            map.off('moveend' , moveend);
        }

        this.stop = function () {
            clearTimeout(timeout);
            marker.hide()
        }

    }
    fillTrack(points: Array<Point>){
        let fillTrack: Array<Point> = [];
        const F = parseFloat;

        points.forEach((point, i)=>{
            if(i<points.length-1){
                let distBetween = parseInt(this.util.distanceBetween2(point, points[i+1]));
                let arr = fill(point, points[i+1], distBetween)
                fillTrack = fillTrack.concat(arr);
                //console.log(distBetween)
            }
        });



        function fill(point1, point2, steps){
            const arr: Point[] = [];
                let lngStep = (point2.lng - point1.lng)/steps;
                let latStep = (point2.lat - point1.lat)/steps;
            if(1<steps){
                for(let i = 0; i<steps; i++){
                    arr.push({
                        lng: point1.lng + (lngStep * i),
                        lat: point1.lat + (latStep * i),
                        bearing: point2.bearing
                    });
                    if(i==steps-1){
                        arr[i] = point2;
                    }
                }
            }else{
                arr.push(point1);
                arr.push(point2);
            }


            return arr

        }

        return fillTrack


    }

}