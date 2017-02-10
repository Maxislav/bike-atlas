import {Component, Input, OnChanges} from "@angular/core";
import {Router} from "@angular/router";
import {hashgeneral} from "../../util/hash";
//import {module} from "@angular/upgrade/src/angular_js";
declare const module: any;
@Component({
    moduleId: module.id,
    templateUrl: "./strava-component.html",
    styleUrls: ['./strava-component.css'],
})
export class StravaComponent  implements OnChanges {

    private _href: string;
    private _userId: number = null;
    private token: string = hashgeneral();


    constructor(private router: Router) {
        this.href = null

    }

    get href(): string {
        return this._href;
    }

    set href(value: string) {
        this._href = value;
    }

    set userId(value: number){
        this._userId = value;
        this.href =
                'https://www.strava.com/oauth/authorize?'+
                'client_id='+this.userId+
                '&response_type=code'+
                '&redirect_uri=http://localhost/'+ this.token+
                '&scope=write'+
                '&state=strava'+
                '&approval_prompt=auto'

    }
    get userId(){
        return this._userId
    }


    ngOnChanges(changes:any) {
        console.log(changes)
    }

    onClose() {
        this.router.navigate(['/auth/map']);
    }
}
