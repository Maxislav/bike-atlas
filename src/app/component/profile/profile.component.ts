import {Component, ElementRef, AfterViewInit} from "@angular/core";
import {Location} from '@angular/common';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {NavigationHistory} from "../../app.component";
import {Io} from "../../service/socket.oi.service";
import {ToastService} from "../toast/toast.component";
import {UserService, User} from "../../service/main.user.service";
import {PrivateAreaService} from "../../service/private.area.service";
import {hashgeneral} from "../../util/hash";

declare const module: any;
declare const System: any;
interface MyNode extends Node{
    click: Function
}

@Component({
    moduleId: module.id,
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements AfterViewInit{


    private imageurl: string;
    private inputEl: MyNode;
    private name: string;
    private socket: any;
    private user: User;
    private setting;

    constructor(private location: Location,
                private elRef: ElementRef,
                private router:Router,
                private lh: NavigationHistory,
                private io : Io,
                private toast: ToastService,
                private areaService: PrivateAreaService,
                userService: UserService
    ){
        this.user = userService.user;
        this.setting = userService.user.setting;
        this.socket = io.socket;
    }

    saveLock(val){
        this.areaService.saveLock(val);
    }
    
    ngAfterViewInit():void{
        const el =this.elRef.nativeElement;
        const inputEl = this.inputEl = el.getElementsByTagName("input")[1];
        inputEl.addEventListener('change', ()=>{
            console.log(inputEl.files);
            const file = inputEl.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const the_url = event.target.result;
                //this.imageurl = the_url
                this.crop(the_url)
            };
            reader.readAsDataURL(file);
        });
    }

    crop(base64) {
        const $this = this;
        const imageObj = new Image();
        imageObj.style.display = 'none';
        const elCanvas = document.createElement('canvas');
        elCanvas.width = 100;
        elCanvas.height = 100;
        const context = elCanvas.getContext('2d');
        function drawClipped(context, myImage) {
            context.save();
            context.beginPath();
            context.arc(50, 50, 50, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.drawImage(myImage, 0, 0, 100, 100);
            context.restore();
            $this.user.image =   elCanvas.toDataURL()
            imageObj.parentElement.removeChild(imageObj)
        };
        imageObj.onload = function () {
            drawClipped(context, imageObj);
        };
        imageObj.src = base64;
        document.body.appendChild(imageObj)
    }

    onClose(){
        if(this.lh.is){
            this.location.back()
        }else{
            this.router.navigate(['/auth/map']);
        }

    }
    onOpenImage(){
        this.inputEl.click()
    }
    onSave(){

        if(!this.user.name){
            this.toast.show({
                type: 'warning',
                text: 'Войдите под своим пользователем'
            });
            return
        }

        if(!this.user.image){
            this.toast.show({
                type: 'warning',
                text: 'Пустое изображение'
            });
            return;
        }

        this.socket.$emit('onImage', this.user.image)
            .then(d=>{
                console.log(d)
                if(d && d.result == 'ok'){
                    this.toast.show({
                        type: 'success',
                        text: 'Профиль сохранен'
                    });
                    //this.user.image = this.i
                }
            })
    }


}

