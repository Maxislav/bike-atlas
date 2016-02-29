/**
 * Created by mars on 2/29/16.
 */
import {Component} from 'angular2/core';

@Component({
    selector: '.footer-menu',
    templateUrl: 'app/template/help-coordinate.html'
})

export class FooterHelp{
    public static lat: number = 0;
    public static lng: number = 0;
}