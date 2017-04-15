
import {Component, Input, OnInit} from "@angular/core";
import {Track, Point} from "../../../../service/track.var";
import {TrackService} from "../../../../service/track.service";
import {MapService} from "../../../../service/map.service";
import {Util} from "../../../../service/util";
import {ToastService} from "../../../toast/toast.component";
import {StravaService} from "../../../../service/strava.service";
import {Router} from "@angular/router";
import * as R from "@ramda/ramda.min.js";
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
    private map: any;
    private maxSpeed: number;
    private isAuthStrava: boolean;

    private mouseMapDown: Function;
    constructor(  private trackService:TrackService,
                  private mapService: MapService,
                  private toast:ToastService,
                  private router: Router,
                  private stravaService: StravaService
    ){
        this.util = new Util();
        //this.isAuthStrava = !!stravaService.athlete;
    }
    ngOnInit(): void {
        console.log(this.track);
        const arrSpeed = R.pluck('speed')(this.track.points);
        this.maxSpeed = Math.max.apply(null,arrSpeed)

        this.mapService.onLoad.then(map=>{
            this.map = map;
            this.mapEventInit()
        });

        this.mouseMapDown = (e: Event)=>{
            console.log('mouse down')
        }


    }


    mapEventInit(){
        this.map.on('mousedown',this.mouseMapDown )
    }

    hideTrack(){
        this.stop &&  this.stop()
        this.track.hide();
    }
    saveChange(){
        if(this.track.xmlDoc){
            this.trackService.downloadTrack(this.track.points)
                .then(d=>{
                    if(d && d.result=='ok'){
                        this.toast.show({
                            type: 'success',
                            text: "Трек успешно загружен в базу"
                        });
                    } else if(d && !d.result){

                      if(d.message == 'point exist'){
                          this.toast.show({
                              type: 'error',
                              text: "Некоторые точки из днного трека были сохранены ранее"
                          });
                      }
                    }
                    console.log(d)
                })
        }else {
            this.trackService.saveChange()
        }

    }
    onGo(_tr: Track){
        this.stop &&  this.stop();
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
                let distBetween = parseInt(this.util.distanceBetween2(point, points[i+1])+'');
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

    onDownload() {
        const xmlDoc: Document = this.track.xmlDoc;
        const points:Array<Point> = this.track.points;
        if(!xmlDoc){
            this.createXmlDoc(points)
                .then(this.download)
                .catch(err=>{
                    console.warn(err)
                });
            return
        }
        this.download(xmlDoc);

    }

    private createXmlDoc(points: Array<Point>): Promise<Document>{
        return new Promise((resolve, reject)=>{
            const parser = new DOMParser();
            const xmlDoc: Element = document.createElement('gpx');
            xmlDoc.setAttribute('xmlns', "http://www.topografix.com/GPX/1/0");
            xmlDoc.setAttribute('xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance");
            xmlDoc.setAttribute('version', "1.0");
            xmlDoc.setAttribute('creator', "Bike-Atlas");

            const time = document.createElement('time');
            time.innerText = new Date().toISOString();
            xmlDoc.appendChild(time);

            const trk   =  document.createElement('trk')
            xmlDoc.appendChild(trk);
            const trkseg = document.createElement('trkseg')
            trk.appendChild(trkseg);

            points.forEach((point: Point)=>{
               const trkpt = document.createElement('trkpt')
                trkpt.setAttribute('lat', point.lat.toString());
                trkpt.setAttribute('lon', point.lng.toString());

                const time = document.createElement('time');
                time.innerText = new Date(point.date).toISOString();
                trkpt.appendChild(time);

                const speed = document.createElement('speed');
                speed.innerText = point.speed.toString();
                trkpt.appendChild(speed);

                trkseg.appendChild(trkpt)
            });
            resolve(xmlDoc);
        })
    }

    private download(xmlDoc: Document){
        const time = xmlDoc.getElementsByTagName('time')[0];
        download(time.innerHTML + '.gpx', xml2string(xmlDoc));

        function xml2string(node) {
            if (typeof(XMLSerializer) !== 'undefined') {
                const serializer = new XMLSerializer();
                return serializer.serializeToString(node);
            } else if (node.xml) {
                return node.xml;
            }
        }

        function download(filename, text) {
            const pom = document.createElement('a');
            pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            pom.setAttribute('download', filename);

            if (document.createEvent) {
                const event = document.createEvent('MouseEvents');
                event.initEvent('click', true, true);
                pom.dispatchEvent(event);
            }
            else {
                pom.click();
            }
        }
    }
    stravaExport(){
        this.stravaService.addToExport(this.track);
        this.router.navigate(['/auth/map/strava-invite']);
    }

    ngOnDestroy(){
        this.map.off('mousedown',this.mouseMapDown )
    }

}
