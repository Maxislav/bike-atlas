import {Component, Input, OnChanges, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params, Route} from "@angular/router";
import {hashgeneral} from "../../util/hash";
import {Io} from "../../service/socket.oi.service";
//import {module} from "@angular/upgrade/src/angular_js";
declare const module: any;
declare const System: any;

interface Athlete{
    firstName: string;
    lastName: string;
    city: string;
    profile: string;
}


@Component({
    moduleId: module.id,
    templateUrl: "./strava-component.html",
    styleUrls: ['./strava-component.css'],
})
export class StravaComponent  implements OnChanges {


    private _href: string;

    private _stravaClientId: number = null;
    private _stravaClientSecret: string = null;
    private stravaHref: String = null;
    private token: String = hashgeneral();
    private socket: any;
    private code: string;
    private myLocation: string;
    private authInProgress: boolean;
    private athlete: Athlete = {
        firstName: null,
        lastName: null,
        city: null,
        profile: null
    };

    constructor(private router: Router,
                private io : Io
    ) {
        this.href = null;
        this.socket = io.socket;
        this.getStrava();

        this.authInProgress = true

        switch (true){
            case /maxislav/.test(window.location.hostname):
                this.myLocation = 'http://'+ window.location.hostname+'/bike-atlas/';
                break;
            default:
                this.myLocation = 'http://'+ window.location.hostname+'/';
        }
        this.isAuthorize()

    }

    isAuthorize(){
        this.socket.$emit('isAuthorizeStrava')
            .then(d=>{
                console.log(d)
                if(d.result && d.result == 'ok'){
                    const athlete = d.data.athlete;
                    this.athlete.firstName = athlete.firstname;
                    this.athlete.lastName = athlete.lastname;;
                    this.athlete.profile = athlete.profile;
                    this.athlete.city = athlete.city;
                }
                this.authInProgress = false
            })
    }



    getStrava(){
        this.socket.$emit('getStrava')
            .then(d=>{
                if(d && d.result =='ok' && d.data){
                    this.stravaClientId = d.data.stravaClientId;
                    this.stravaClientSecret = d.data.stravaClientSecret
                }
            })
    }

    get href(): string {
        return this._href;
    }

    set href(value: string) {
        this._href = value;
    }

    ngDoCheck(){
       // console.log(++i)
    }

    ngOnChanges(changes:any) {
        console.log(changes)
    }

    onClose() {
        this.router.navigate(['/auth/map']);
    }

    get stravaClientId(): number {
        return this._stravaClientId;
    }

    set stravaClientId(value: number) {
        this._stravaClientId = value;
        this.stravaHref =
            'https://www.strava.com/oauth/authorize?'+
            'client_id='+value+
            '&response_type=code'+
            '&redirect_uri='+this.myLocation +'%23/'+ 'auth/map/strava-invite/'+this.token+
            '&scope=write'+
            '&state=strava'+
            '&approval_prompt=force'
    }
    get stravaClientSecret(): string {
        return this._stravaClientSecret;
    }

    set stravaClientSecret(value: string) {
        this._stravaClientSecret = value;
    }
    goToStrava(){
        if (this.stravaClientId &&  this.stravaClientSecret){

            this.socket.$emit('onStrava', {
                stravaClientId: this.stravaClientId,
                stravaClientSecret: this.stravaClientSecret,
                atlasToken: this.token
            })
                .then(d=>{
                    console.log('goToStrava->', d)
                    if(d.result=='ok'){
                        window.location.href = this.stravaHref.toString()
                    }
                })
        }
    }
}
