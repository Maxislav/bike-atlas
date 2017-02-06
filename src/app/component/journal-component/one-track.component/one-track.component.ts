
import {Component, Input, OnInit, ElementRef, AfterViewInit} from "@angular/core";
import {LeafletResolver} from "../journal.component";
import {JournalService} from "../../../service/journal.service";
import {LocalStorage} from "../../../service/local-storage.service";
import * as dateformat from "node_modules/dateformat/lib/dateformat.js";
import {TrackService} from "../../../service/track.service";
import {UserService} from "../../../service/main.user.service";
declare const module: any
@Component({
    //noinspection TypeScriptUnresolvedVariable
    selector: 'one-track',
    moduleId: module.id,
    templateUrl: './one-track.component.html',
    styleUrls: ['./one-track.component.css'],
})
export class OneTrack implements OnInit, AfterViewInit{
    L: any;
    mapEL: Node;
    trackDate: Date;
    image: String;


    ngAfterViewInit(): void {
        const L = this.L;
        const localStorageCenter = this.ls.mapCenter;
        this.mapEL = this.el.nativeElement.getElementsByClassName('map')[0];
        //console.log(this.mapEL)

        const map = L.map(this.mapEL).setView([localStorageCenter.lat ||50.3, localStorageCenter.lng || 30.3],  localStorageCenter.zoom || 8);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        if(!this.track.points.length){
           return
        }

        const latlngs = [];
        this.track.points.forEach(point=>{
            latlngs.push([point.lat, point.lng])
        });
        this.trackDate = new Date(this.track.points[0].date);
        const polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
        map.fitBounds(polyline.getBounds());

    }
    ngOnInit(): void {
        this.userService.getUserImageById(this.track.userId)
            .then(image=>{
                this.image = image;
            })
    }
    index: number;
    @Input() track: {points:Array<any>, userId: number};
    constructor(private el:ElementRef,
                private Leaflet: LeafletResolver,
                private ls:LocalStorage,
                private trackService: TrackService,
                private userService: UserService
    ){
        this.L = Leaflet.L;
    }
    showOnMap(){
        this.trackService.showTrack(this.track.points)
    }
}