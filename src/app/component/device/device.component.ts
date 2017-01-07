import {Component, Pipe, PipeTransform} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from "@angular/router";
import {DeviceService, Device} from "../../service/device.service";
import {NavigationHistory} from "../../app.component";
import {ToastService} from "../toast/toast.component";
import {UserService} from "../../service/main.user.service";


@Pipe({
    name: 'isOwner',
    pure: false
})
export class IsOwner implements PipeTransform  {
    constructor(private user: UserService){

    }
    transform(value, args?){


        return value.filter(item=>{
            return item.ownerId == this.user.user.id
        })
    }
}


@Component({
    moduleId: module.id,
    templateUrl:'device.component.html',
    pipes: [IsOwner],
    styleUrls: [
        'device.component.css',
    ]
})
export class DeviceComponent{

    private device: Device;
    private devices: Array<Device>;
    public btnPreDel: {index: number};

    constructor(private location: Location,
                private router:Router,
                private user: UserService,
                private ds: DeviceService,
                private toast: ToastService,
                private lh: NavigationHistory){
        this.device = {
            ownerId: -1,
            name: '',
            id: '',
            image: ''
        };
        this.btnPreDel = {
            index: -1
        };
        this.devices = ds.devices;
    }
    onAdd(e){
        e.preventDefault();


        this.device.name = this.device.name.replace(/^\s+/,'');
        this.device.id = this.device.id.replace(/^\s+/,'');

        console.log(this.device);
        if(!this.device.name || !this.device.id){
            this.toast.show({
                type: 'warning',
                text: "Имя или Идентификатор не заполнено"
            });
            return;
        }

        this.ds.onAddDevice(this.device)
            .then(d=>{
                if(d && d.result == 'ok'){
                    this.reset()
                }
            })
    }
    onDel(e, device){
        this.ds.onDelDevice(device)
            .then(d=>{
                console.log(d)
                this.clearPredel();
            });
    }
    preDel(e, i){
        e.stopPropagation();
        this.btnPreDel.index = i
    }
    clearPredel(){
        this.btnPreDel.index = -1
    }

    reset(){
        this.device = {
            name: '',
            id: ''
        };
    }


    onClose(){
        if(this.lh.is){
            this.location.back()
        }else{
            this.router.navigate(['/auth/map']);
        }
    }

}
