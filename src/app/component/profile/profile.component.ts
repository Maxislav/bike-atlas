import {Component, ElementRef, AfterViewInit} from "@angular/core";
import {Location} from '@angular/common';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {NavigationHistory} from "../../app.component";



@Component({
    moduleId: module.id,
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements AfterViewInit{
    private imageurl: string;
    private inputEl: Element;
    private name: string;
    constructor(private location: Location,
                private elRef: ElementRef,
                as: AuthService,
                private router:Router,
                private lh: NavigationHistory){
        this.imageurl = 'src/img/no-avatar.gif';
        this.name = as.userName;
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

    }

}

