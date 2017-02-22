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
export class LeafletResolver implements Resolve<any> {
    L:any;

    resolve():Promise<any> {
        return System.import(["lib/leaflet/leaflet-src.js", 'lib/leaflet/leaflet.css'])
            .then(([L])=> {
                this.L = L;
                return L
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
        this.list = journalService.list;
        this.selectDate = this.journalService.selectDate;
        if(!this.list.length){
            journalService.getLastDate()
                .then(d=>{
                    if(d && d.date){
                        this.selectDate = this.journalService.setSelectDate(new Date(d.date))
                        this.stepGo(0)
                    }
                })
        }
    }

    stepGo(step: number){
        this.selectDate = this.journalService.stepGo(step);
    }

    getTrack(from: Date, to: Date){
        this.journalService.getTrack(from, to);
    }


    onClose(){
        this.location.back()
    }
}