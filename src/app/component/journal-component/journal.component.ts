/**
 * Created by max on 05.01.17.
 */
import {Component} from "@angular/core";
import {Location} from '@angular/common';

@Component({
    //noinspection TypeScriptUnresolvedVariable
    moduleId: module.id,
    templateUrl: './journal.component.html',
    styleUrls: ['./journal.component.css'],
})
export class JournalComponent{

    constructor(private location: Location){

    }
    onClose(){
        this.location.back()
    }
}