import {Component, Input, OnChanges, OnInit} from "@angular/core";
import {
    Router, ActivatedRoute, Params, Route, CanActivate, RouterStateSnapshot,
    ActivatedRouteSnapshot
} from "@angular/router";
import {hashgeneral} from "../../util/hash";
import {Io} from "../../service/socket.oi.service";
import {StravaService, StravaD} from "../../service/strava.service";
import {ToastService} from "../toast/toast.component";
import {UserService} from "../../service/main.user.service";



import {Aes} from '../../service/aes-cript';
import { Track } from '../../service/track.service';


interface Athlete{
    firstName: string;
    lastName: string;
    city: string;
    profile: string;
}


@Component({
    templateUrl: "./strava-component.html",
    styleUrls: ['./strava-component.less'],
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
    public authInProgress: boolean;
    public showHelp: boolean;
    public athlete: Athlete = {
        firstName: null,
        lastName: null,
        city: null,
        profile: null
    };
   
    private authorization: string;

    
    public docsFor: Array<Track>;

    constructor(private router: Router,
                private io : Io,
                private userService: UserService,
                private stravaService: StravaService,
                private toast:ToastService
    ) {
        this.showHelp = false;
        this.docsFor = stravaService.docsFor;

        const aes1 = new Aes(16);
        const aes2 = new Aes(16);

        const myText = "Hello Crypt";
        console.log(myText);
        const encodeByte = aes1.encodeTextToByte(myText);


        const encodeByte2 = aes2.encodeByteToByte(encodeByte);

        const  decodeByte1 =   aes1.decodeByteToByte(encodeByte2);

        const decodeText = aes2.decodeByteToText(decodeByte1);
        console.log(decodeText)


        this.href = null;
        this.socket = io.socket;



        this.getStrava()
            .then(d=>{
                return this.isAuthorize()
            })
            .then(d=>{
                this.authInProgress = false;
            })
            .catch(d=>{
                this.authInProgress = false;
            });

        this.authInProgress = true;

        switch (true){
            case /maxislav/.test(window.location.hostname):
                this.myLocation = 'http://'+ window.location.hostname+'/bike-atlas/';
                break;
            default:
                this.myLocation = 'http://'+ window.location.hostname+'/';
        }

    }
    onShowHelp(){
        this.showHelp=!this.showHelp
    }

    isAuthorize(){
        return this.stravaService.isAuthorize()
            .then(athlete=>{
                this.athlete.firstName = athlete.firstName;
                this.athlete.lastName = athlete.lastName;
                this.athlete.profile = athlete.profile;
                this.athlete.city = athlete.city;
                this.authorization = athlete.authorization
            })
    }



    getStrava(){
      return this.stravaService.getStrava()
           .then(d=>{
               this.stravaClientId = d.stravaClientId;
               this.stravaClientSecret = d.stravaClientSecret;
           });
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


            this.socket.$encrypt('onStravaCrypt', {
                stravaClientSecret: this.stravaClientSecret,
                stravaClientId: this.stravaClientId,
                atlasToken: this.token
            })
                .then(d=>{
                    if(d.result=='ok'){
                        window.location.href = this.stravaHref.toString()
                    }
                });


           /* this.socket
                .$emit('onStravaCrypt', {
                    n: 0,
                    arr: byteArr
                })
                .then(d=>{
                    const  enc2 =  new Uint8Array(d.arr);
                    return this.socket.$emit('onStravaCrypt',{
                        n:1,
                        arr: Array.from(aes.decodeByteToByte(enc2)),
                        stravaClientId: this.stravaClientId,
                        atlasToken: this.token
                    })
                })
                .then(d=>{
                    if(d.result=='ok'){
                        window.location.href = this.stravaHref.toString()
                    }
                });*/

        }
    }
    sendTrackToStrava(track: Track){
        
        this.stravaService.sendTrackToStrava(track, this.authorization )
            .then(d=>{
                console.log(d)
                if(d && d.result =='ok' && d.data.id){
                    this.toast.show({
                        type: 'success',
                        text: "Отправлен на обработку в Strava"
                    });
                    this.stravaService.removeTrack(track)
                }
            })
        
    }
    onDeauthorize(){
        this.stravaService.onDeauthorize()
            .then(d=>{
                if(d && d.result =='ok'){
                    for(var opt in this.athlete){
                        this.athlete[opt] =null
                    }
                }
            })
    }
}
