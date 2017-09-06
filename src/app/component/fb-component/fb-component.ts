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
                 //this.coverUrl = `data:image/png;base64,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`;
                 this.coverUrl = `http://graph.facebook.com/v2.10/${res.authResponse.userID}/picture`;
                 FB.api('/me', (response)=> {
                     this.fbUser.name  = response.name;
                     this.authService
                         .setFacebookUser({
                             name: this.fbUser.name,
                             accessToken: authResponse.accessToken,
                             userID: authResponse.userID,
                             imageUrl: this.coverUrl

                         })
                         .then(d => {
                            // console.log(d)
                         })
                 });
                 break

         }
    }
}