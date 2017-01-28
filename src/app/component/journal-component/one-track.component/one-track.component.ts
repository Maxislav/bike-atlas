
import {Component, Input, OnInit, ElementRef, AfterViewInit} from "@angular/core";
import {LeafletResolver} from "../journal.component";
@Component({
    //noinspection TypeScriptUnresolvedVariable
    selector: 'one-track',
    moduleId: module.id,
    templateUrl: './one-track.component.html',
    styleUrls: ['./one-track.component.css'],
})
export class OneTrack implements OnInit, AfterViewInit{
    L: any;
    mapEL: Node

    ngAfterViewInit(): void {
        const L = this.L
        this.mapEL = this.el.nativeElement.getElementsByClassName('map')[0];
        console.log(this.mapEL)

        var map = L.map(this.mapEL).setView([51.505, -0.09], 13);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    }
    ngOnInit(): void {
        console.log(this.track)
    }
    index: number;
    @Input() track: any;
    constructor(private el:ElementRef, private Leaflet: LeafletResolver){
        this.L = Leaflet.L
    }
}