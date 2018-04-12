import {
    Component, Pipe, PipeTransform, TemplateRef, ViewContainerRef, Directive, ElementRef,
    Renderer
} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from "@angular/router";
import {DeviceService, Device} from "../../service/device.service";
import {NavigationHistory} from "../../app.component";
import {ToastService} from "../toast/toast.component";
import {UserService, User} from "../../service/main.user.service";


@Directive({
    selector: 'help-container',
})
export class HelpContainer {
    constructor(el:ElementRef, renderer:Renderer) {

        let w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;


        renderer.setElementStyle(el.nativeElement, 'height', y - 300 + 'px');
    }
}
declare const module:{
    id:any
}


@Pipe({
    name: 'isOwner',
    pure: false
})
export class IsOwner implements PipeTransform {
    constructor(private user:UserService) {

    }

    transform(value, args?) {

        // console.log('fds')
        return value.filter(item=> {
            return item.ownerId == this.user.user.id
        })
    }
}


@Component({
    moduleId: module.id,
    templateUrl: 'device.component.html',
    styleUrls: [
        'device.component.css',
    ]
})
export class DeviceComponent {

    private device:Device;
    private devices:Array<Device>;
    public btnPreDel:{index:number};
    private user:User;
    private showHelp:boolean = false;


    constructor(private location:Location,
                private router:Router,
                private userService:UserService,
                private deviceService: DeviceService,
                private toast:ToastService,
                private lh:NavigationHistory) {

        this.user = userService.user;

        this.device = {
            ownerId: -1,
            name: '',
            id: '',
            image: ''
        };
        this.btnPreDel = {
            index: -1
        };
        this.devices = deviceService.devices;
        deviceService.updateDevices()
    }

    ngOnChanges(a){
        console.log('ngOnChanges->', a)
    }
    onShowHelp() {
        this.showHelp = !this.showHelp
    }

    onAdd(e) {
        e.preventDefault();


        this.device.name = this.device.name.replace(/^\s+/, '');
        this.device.id = this.device.id.replace(/^\s+/, '');

        console.log(this.device);
        if (!this.device.name || !this.device.id) {
            this.toast.show({
                type: 'warning',
                text: "Имя или Идентификатор не заполнено"
            });
            return;
        }

        this.deviceService.onAddDevice(this.device)
            .then(d=> {
                if (d && d.result == 'ok') {
                    this.reset()
                }else if(d && d.result === false && d.message == 'device exist'){
                    this.toast.show({
                        type: 'warning',
                        text: "Устройство зарегистрированно на другого пользователя"
                    });
                }
            })
    }

    onDel(e, device) {
        this.deviceService.onDelDevice(device)
            .then(d=> {
                console.log(d);
                this.clearPredel();
            });
    }

    preDel(e, i) {
        e.stopPropagation();
        this.btnPreDel.index = i
    }

    clearPredel() {
        this.btnPreDel.index = -1
    }

    reset() {
        this.device = {
            ownerId: -1,
            name: '',
            id: '',
            image: ''
        };
    }

    ngDoCheck(){

    }

    getF(f){
        console.log(f)
    }

    onClose() {
        if (this.lh.is) {
            this.location.back()
        } else {
            this.router.navigate(['/auth/map']);
        }
    }

}
