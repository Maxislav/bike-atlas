

import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Io} from "../../service/socket.oi.service";
import {StravaService} from "../../service/strava.service";
declare const module: any;
declare const System: any;

@Component({
    moduleId: module.id,
    templateUrl: "./strava-auth-component.html",
    styleUrls: ['./strava-component.css'],
})
export class StravaAuthComponent implements OnInit{
    private socket: any;
    private code: string;
    private firstName: string;
    private lastName: string;
    private city: string;
    private profile: string;
    authInProgress: boolean = true;

    constructor(private router: Router,
                private io : Io,
                private stravaService:StravaService
    ){
        this.socket = io.socket;
        this.authInProgress = true
    }
    ngOnInit(): void {
        this.router.routerState.root.queryParams.subscribe(
            data =>{
                this.code = data['code'];
                if(this.code){
                    this.socket.$emit('stravaUpdateCode', this.code)
                        .then(d=>{
                            console.log('stravaUpdateCode->',d)
                            this.stravaOauth(this.code)
                        })
                }

                console.log(this.code)
            })

    }

    stravaOauth(stravaCode: string){

        this.stravaService.stravaOauth(stravaCode)
            .then(d=>{
                if(d.result =='ok'){
                    const athlete = d.data.athlete
                    this.firstName = athlete.firstname
                    this.lastName = athlete.lastname
                    this.profile = athlete.profile
                    this.city = athlete.city

                }
                this.authInProgress = false
            })

       /* this.socket.$emit('stravaOauth',{
            stravaCode: stravaCode
        })
            .then(d=>{
                if(d.result =='ok'){
                    const athlete = d.data.athlete
                     this.firstName = athlete.firstname
                     this.lastName = athlete.lastname
                     this.profile = athlete.profile
                     this.city = athlete.city

                }
                console.log('stravaOauth->', d)
                this.authInProgress = false
            })*/
    }
    goToAuth(){
        this.router.navigate(['/auth/map/strava-invite']);
    }
    onClose() {
        this.router.navigate(['/auth/map']);
    }
    goNext(){
        this.router.navigate(['/auth/map/strava-invite']);
    }

}