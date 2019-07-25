/**
 * Created by max on 05.01.17.
 */
import { Component, Injectable, ElementRef, OnInit, OnDestroy } from '@angular/core';
import {Location} from '@angular/common';
import {Resolve, ActivatedRoute} from "@angular/router";
import {OneTrack} from "./one-track.component/one-track.component";
import {JournalService} from "../../service/journal.service";
import {Point} from "../../service/track.var";
import { UserService } from '../../service/main.user.service';
import { Device } from '../../../@types/global';

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

declare const module: any;


@Component({
    //noinspection TypeScriptUnresolvedVariable
    moduleId: module.id,
    templateUrl: './journal.component.html',
    styleUrls: ['./journal.component.css'],
    //providers: [OneTrack]
})

export class JournalComponent implements  OnInit, OnDestroy{
    list: Array<any>;
    private offset: number =  0;
    selectDate: Date;
    public deviceList: Array<Device>;
    public deviceSelected: Device = null;

    ngOnInit(): void {
        this.el.nativeElement.getElementsByClassName('scroll')[0].style.maxHeight = window.innerHeight-200+'px';
    }


    constructor(
        private location: Location,
        public route:ActivatedRoute,
        private journalService: JournalService,
        private el:ElementRef,
        private userService: UserService
    ){

        this.deviceList = userService.user.devices;
        console.log('deviceList -> ',this.deviceList);
        this.list = journalService.list;
        this.selectDate = null;//this.journalService.selectDate;

    }

    onSelectDevice(device: Device){
        this.deviceSelected = device;
        this.journalService.getLastDeviceDate(device.device_key)
            .then(d=>{
                if(d.error) throw new Error(d.error);
                this.selectDate = this.dateRoundDay(new Date(d.date));

                this.getTrack(device.device_key);

            })
    }

    stepGo(step: number){
      if(0<step){
          this.selectDate = this.stepForwardDate(this.selectDate)
      }
      if(step<0){
          this.selectDate = this.stepBackDate(this.selectDate)
      }
      this.getTrack(this.deviceSelected.device_key)
    }

    getTrack(device_key){

        const from = this.selectDate;
        const to = this.stepForwardDate( this.selectDate);

        this.journalService.getTrack(device_key, from, to)
            .then(data=>{
                console.log(data)
            })
    }


    onClose(){
        this.location.back()
    }

    ngOnDestroy(): void {
        this.journalService.cleadData();
    }

    private stepBackDate(d: Date): Date{
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()-1)
    }

    private stepForwardDate(d: Date): Date{
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()+1)
    }


    private dateRoundDay(d: Date): Date{

        return new Date(d.getFullYear(), d.getMonth(), d.getDate())

    }
}