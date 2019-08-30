import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {Md5} from "../../service/md5.service";
import {ToastService} from "../toast/toast.component";
import {Io} from "../../service/socket.oi.service";
import { AuthService } from '../../service/auth.service';
// import {LoginService} from "../../service/login.service";
@Component({
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.less'],
})
export class RegistrationComponent{

    private _name: string;
    private _pass1: string;
    private _pass2: string;
    private socket;


    constructor(private location: Location, private md5: Md5, private ts: ToastService, private io: Io, private authService: AuthService) {
        this.socket = io.socket;
    }
    onCancel(e){
        e.preventDefault();
        this.location.back();
    }
    onSubmit(e){
        e.preventDefault()

        console.log('olol')
    }
    onOk(e){
        e.preventDefault();
        if(!this.name){
            this.ts.show({
                type: 'warning',
                text: 'Поле "Имя"не заполнено'
            });
            return
        }else if(!this.pass1 || !this.pass2 ){
            this.ts.show({
                type: 'warning',
                text: 'Поле "Пароль" не заполнено'
            });
            return
        }else if(this.pass1!=this.pass2){
            this.ts.show({
                type: 'warning',
                text: 'Пароли не совпадают'
            });
        }
        else{
            this.onRegist();

        }
    }

    private onRegist(){
        const pass = this.md5.hash(this.pass1);
        const name = this.name;
        this.socket.$emit('onRegist', {name: name, pass: pass})
            .then((d)=>{
            if(d.result == 'ok'){
                this.ts.show({
                    type: 'success',
                    text: 'Регистрация Ок!'
                });
                this.authService.onEnter({
                    name,
                    pass
                });
                this.location.back();

            }else if(!d.result && d.message =='User exist'){
                this.ts.show({
                    type: 'danger',
                    text: 'Пользователь уже существует'
                });
            }
            },(err)=>{
                console.error(err)
            });
    }

    set pass1(val){
        //this._pass1 = this.md5.hash(val)
        this._pass1 = val
    }
    get pass1(){
        return this._pass1;
    }
    get name():string {
        return this._name;
    }
    get pass2():string {
        return this._pass2;
    }

    set pass2(value:string) {
        this._pass2 = value;
    }
    set name(value:string) {
        this._name = value;
    }
}