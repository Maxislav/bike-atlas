/**
 * Created by maxislav on 30.11.16.
 */
import {MenuService} from 'app/service/menu.service'
import { Component} from "@angular/core"

@Component({
    moduleId: module.id,
    selector: 'menu-track-load',
    templateUrl: './menu-load-track.html',
    //styles: [':host{position: absolute; z-index: 2}']
    styleUrls: ['./menu-load-track.css']
})
export class LoadTrack{

   
    constructor(private ms: MenuService){
        
    }
    onSelect(e){
        e.preventDefault();
        e.stopPropagation();

        e.target.parentElement.getElementsByTagName('input')[1].click()
    }
}