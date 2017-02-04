
import {Component, Input, OnInit} from "@angular/core";
import {Track, Point} from "../../../../service/track.var";
import {TrackService} from "../../../../service/track.service";
import {MapService} from "../../../../service/map.service";
import {Util} from "../../../../service/util";
declare const module: any;
@Component({
    moduleId: module.id,
    selector:'one-item-track-component',
    templateUrl: "./one-item-track.component.html",
    styleUrls: ['./one-item-track.component.css']
})
export class OneItemTrackComponent implements OnInit{

    @Input() track: Track;
    private util: Util;
    stop: Function;
    constructor(  private trackService:TrackService, private mapService: MapService){
        this.util = new Util();

    }
    ngOnInit(): void {
        console.log(this.track)
    }

    hideTrack(){
        this.stop &&  this.stop()
        this.track.hide();
    }
    saveChange(){
        this.trackService.saveChange()
    }
    onGo(_tr: Track){
        this.stop &&  this.stop()
        //this.hideTrack();
        const $this = this;
        const map = this.mapService.map;
        const points = this.fillTrack(_tr.points);
        const marker = this.trackService.marker(points[0])//this.track.showSpriteMarker(points[0]);
        /**
         * todo
         */
            // return;

        let timeout;

        let i = 0;
        let step = 1;
        flyTo();
        function flyTo(){
            if(points[i]){
                map.setCenter([points[i].lng, points[i].lat]);
                marker.update(points[i]);
            }

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
            marker.remove()
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
                    const p = new Point(point1.lng + (lngStep * i),point1.lat + (latStep * i), point2.bearing)
                    arr.push(p);
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
