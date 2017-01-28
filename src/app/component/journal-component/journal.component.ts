/**
 * Created by max on 05.01.17.
 */
import {Component, Injectable, ElementRef, OnInit} from "@angular/core";
import {Location} from '@angular/common';
import {Resolve, ActivatedRoute} from "@angular/router";
import {OneTrack} from "./one-track.component/one-track.component";
import {JournalService} from "../../service/journal.service";
import {Point} from "../../service/track.var";

declare var System: any;

@Injectable()
export class LeafletResolver implements Resolve<any>{
    L: any
    resolve():Promise<any> {



        return System.import('lib/leaflet/leaflet.css')
            .then((css)=>{
            return  System.import("lib/leaflet/leaflet-src.js")
                .then(L=>{
                    this.L = L;
                    return L
                })
            })


    }
}




@Component({
    //noinspection TypeScriptUnresolvedVariable
    moduleId: module.id,
    templateUrl: './journal.component.html',
    styleUrls: ['./journal.component.css'],
    //providers: [OneTrack]
})

export class JournalComponent implements  OnInit{
    ngOnInit(): void {
        this.el.nativeElement.getElementsByClassName('scroll')[0].style.maxHeight = window.innerHeight-200+'px'
    }
    list: Array<any>;
    private offset: number =  0;
    selectDate: Date;

    constructor(private location: Location, public route:ActivatedRoute,  private journalService: JournalService, private el:ElementRef){



        console.log(route.snapshot.data['L'])
        this.list = [ ];
        const d = new Date();


        this.selectDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        //this.getTrack(from, to);
        this.stepGo(0)

    }

    stepGo(stap: number){
        const d = this.selectDate;
        this.selectDate = new Date(d.getFullYear(), d.getMonth(), d.getDate()+stap);
        let from =  this.selectDate
        let to =  new Date(this.selectDate.getFullYear(), this.selectDate.getMonth(), this.selectDate.getDate()+1)
        this.getTrack(from, to);
        console.log(from, to)
    }






    getTrack(from: Date, to: Date){
        this.journalService.getTrack(from, to)
            .then(d=>{
                if(d){
                    for(let key in d){
                        const points: Array<Point> = [];
                        d[key].forEach(p=>{
                            const point  = new Point(p.lng, p.lat, p.azimuth);
                            point.date = p.date;
                            point.speed = p.speed;
                            point.id = p.id
                            points.push(point);

                        });
                        if(points.length){
                            this.list.unshift(points)
                        }

                    }
                }
            })
    }


    onClose(){
        this.location.back()
    }
}