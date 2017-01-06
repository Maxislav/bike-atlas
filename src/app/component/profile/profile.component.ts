import {Component, ElementRef, AfterViewInit} from "@angular/core";
import {Location} from '@angular/common';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {NavigationHistory} from "../../app.component";
import {Io} from "../../service/socket.oi.service";
import {ToastService} from "../toast/toast.component";



@Component({
    moduleId: module.id,
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements AfterViewInit{
    private imageurl: string;
    private inputEl: Element;
    private name: string;
    private socket: any;
    constructor(private location: Location,
                private elRef: ElementRef,
                private as: AuthService,
                private router:Router,
                private lh: NavigationHistory,
                private io : Io,
                private toast: ToastService
    ){
        this.imageurl = as.userImage;
        this.name = as.userName;
        this.socket = io.socket;
    }
    ngAfterViewInit():void{
        const el =this.elRef.nativeElement;
        const inputEl = this.inputEl = el.getElementsByTagName("input")[0];
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
        var context = elCanvas.getContext('2d');
        function drawClipped(context, myImage) {
            context.save();
            context.beginPath();
            context.arc(50, 50, 50, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.drawImage(myImage, 0, 0, 100, 100);
            context.restore();
            $this.imageurl =   elCanvas.toDataURL()
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
        if(!this.imageurl){
            this.toast.show({
                type: 'warning',
                text: 'Пустое изображение'
            });
            return;
        }

        this.socket.$emit('onImage', this.imageurl)
            .then(d=>{
                console.log(d)
                if(d && d.result == 'ok'){
                    this.as.userImage = this.imageurl
                }
            })
    }

}

