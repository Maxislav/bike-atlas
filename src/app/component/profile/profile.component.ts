import {Component, ElementRef, AfterViewInit} from "@angular/core";
import {Location} from '@angular/common';
import {AuthService} from "../../service/auth.service";



@Component({
    moduleId: module.id,
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements AfterViewInit{
    private imageurl: string;
    private inputEl: Element;
    private name: string;

    ngAfterViewInit():void{
        const el =this.elRef.nativeElement;
        const inputEl = this.inputEl = el.getElementsByTagName("input")[0];
        inputEl.addEventListener('change', ()=>{
            console.log(inputEl.files);
            const file = inputEl.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const the_url = event.target.result;
                this.imageurl =the_url
            };
            reader.readAsDataURL(file);
        });
    }
    constructor(private location: Location, private elRef: ElementRef, as: AuthService){
        this.imageurl = 'src/img/no-avatar.gif';
        this.name = as.userName;
    }
    onClose(){
        this.location.back()
    }
    onOpen(){
        this.inputEl.click()
    }

}

