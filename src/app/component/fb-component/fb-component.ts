import {Component} from "@angular/core";

import {Router} from "@angular/router";
import {Io} from "../../service/socket.oi.service";
import {AuthService, FBuser} from "../../service/auth.service";
declare const FB: any;
declare const module: any;


@Component({
    moduleId: module.id,
    templateUrl: './fb-component.html',
    styleUrls: ['./fb-component.css'],
})
export class FBComponent{

    private socket: any;
    private fbUser: FBuser = {userID: null, name: null};
    private coverUrl: string;

    constructor(private router: Router, private io : Io, private authService: AuthService){
         this.checkIsLogin();
    }

    onClose(){
        this.router.navigate(['/auth/map']);
    }
    checkIsLogin(){
        FB.getLoginStatus((response)=> {
            this.statusChangeCallback(response);
        })
    }

    onGetProfile(authResponse){

        this.socket.$emit('fbGetProfile', {
            clientID: authResponse.userID,
            clientSecret: '1963056210650118',
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos', 'email']
        })
            .then(d=>{

            })
    }




    onEnterFB(){
        FB.login((response)=>{
            console.log(response)
            this.statusChangeCallback(response)
        }, {scope: 'public_profile'})
    }

    onLogout(){
        FB.logout((response)=> {
            console.log(response)
            this.statusChangeCallback(response)
        });
    }

    private statusChangeCallback(res){
         switch (res.status){
             case "unknown":
             case "not_authorized":
                 this.fbUser.name = null;
                 this.fbUser.userID = null;
                 break;
             case "connected":
                 this.fbUser.userID = parseInt(res.authResponse.userID);
                 const authResponse: FBuser = res.authResponse;
                 this.coverUrl = `http://graph.facebook.com/v2.10/${res.authResponse.userID}/picture`;
                 FB.api('/me', (response)=> {
                     this.fbUser.name  = response.name;
                     this.authService
                         .setFacebookUser({
                             name: this.fbUser.name,
                             accessToken: authResponse.accessToken,
                             userID: authResponse.userID

                         })
                         .then(d => {
                             console.log(d)
                         })
                 });
                 break

         }
    }
}