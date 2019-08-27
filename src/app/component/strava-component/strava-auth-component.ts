

import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Io} from "../../service/socket.oi.service";
import {StravaService} from "../../service/strava.service";

@Component({
    templateUrl: "./strava-auth-component.html",
    styleUrls: ['./strava-component.less']
})
export class StravaAuthComponent implements OnInit{
    private socket: any;
    public code: string;
    public firstName: string;
    public lastName: string;
    private city: string;
    private profile: string;
    public authInProgress = true;

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