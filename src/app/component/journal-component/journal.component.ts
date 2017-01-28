/**
 * Created by max on 05.01.17.
 */
import {Component, Injectable} from "@angular/core";
import {Location} from '@angular/common';
import {Resolve, ActivatedRoute} from "@angular/router";
import {OneTrack} from "./one-track.component/one-track.component";

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

export class JournalComponent {
    list: Array<any>;

    constructor(private location: Location, public route:ActivatedRoute){
        console.log(route.snapshot.data['L'])
        this.list = [
            '1',
            '2'
        ]
    }


    onClose(){
        this.location.back()
    }
}