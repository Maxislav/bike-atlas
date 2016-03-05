/**
 * Created by mars on 2/29/16.
 */
import {Component} from 'angular2/core';
import {MymapEvents} from "./services/service.map.events";

@Component({
    selector: '.footer-menu',
    templateUrl: 'app/template/help-coordinate.html'
})

export  class FooterHelp{
    public mymapEvents: MymapEvents;
    constructor(mymapEvents: MymapEvents){
        this.mymapEvents = mymapEvents;
    }

}