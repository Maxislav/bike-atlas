/**
 * Created by mars on 2/29/16.
 */
import {Component} from 'angular2/core';
import {LatLngService} from './services/service.lat.lng';

@Component({
    selector: '.footer-menu',
    templateUrl: 'app/template/help-coordinate.html'
})

export  class FooterHelp{
    public latLng: LatLngService;
    constructor(latLngService: LatLngService){
        this.latLng = latLngService;

    }



}