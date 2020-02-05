import { Component, ElementRef, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { NavigationHistory } from '../../app.component';
import { Io } from '../../service/socket.oi.service';
import { ToastService } from '../toast/toast.component';
import { User, UserService } from '../../service/main.user.service';
import { PrivateAreaService } from '../../service/private.area.service';
import { hashgeneral } from '../../util/hash';
import { FormControl, FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { concat } from 'rxjs';
import { Observable } from 'rxjs/src/internal/Observable';
import { subscribeTo } from 'rxjs/internal-compatibility';
import { zip } from 'rxjs';
import { merge } from 'rxjs';
import { PassFormIs, ProfileService } from 'src/app/api/profile.service';

declare const module: any;
declare const System: any;

interface MyNode extends Node {
    click: Function
}


@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.less'],
})
export class ProfileComponent implements OnInit, AfterViewInit {


    private imageurl: string;
    private inputEl: MyNode;
    private name: string;
    private socket: any;
    public user: User;
    public setting;
    private oldPass: string;
    passForm: FormGroup;
    profileForm;

    passFormValue: PassFormIs = {
        currentPass: null,
        newPass: null,
        repeatNewPass: null
    };

    @ViewChild('nameForm') nameForm: any;
    model: { name: string } = {name: null};

    /*= new FormGroup({
           oldPass: new FormControl()
       })*/

    constructor(private location: Location,
                private elRef: ElementRef,
                private router: Router,
                private lh: NavigationHistory,
                private io: Io,
                private toast: ToastService,
                private areaService: PrivateAreaService,
                private fb: FormBuilder,
                private userService: UserService,
                private profileService: ProfileService
    ) {

        this.socket = io.socket;
        this.user = userService.getUser();

        this.setting = userService.getSetting();

        this.profileForm = this.fb.group({
            oldPass: ['', (control) => {
                console.log(control);
                return control.value.length ? null : {
                    'rew': 'oldo'
                };
            }] // <--- the FormControl called "name"
        });
    }

    saveLock(val) {
        this.areaService.saveLock(val);
    }

    ngAfterViewInit(): void {
        const el = this.elRef.nativeElement;
        const inputEl = this.inputEl = el.getElementsByTagName('input')[1];
        inputEl.addEventListener('change', () => {
            console.log(inputEl.files);
            const file = inputEl.files[0];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const the_url = event.target.result;
                //this.imageurl = the_url
                this.crop(the_url);
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
            $this.user.image = elCanvas.toDataURL();
            imageObj.parentElement.removeChild(imageObj);
        }

        imageObj.onload = function () {
            drawClipped(context, imageObj);
        };
        imageObj.src = base64;
        document.body.appendChild(imageObj);
    }

    onClose() {
        if (this.lh.is) {
            this.location.back();
        } else {
            this.router.navigate(['/auth/map']);
        }

    }

    onOpenImage() {
        this.inputEl.click();
    }

    onSave() {

        if (!this.user.name) {
            this.toast.show({
                type: 'warning',
                text: 'Войдите под своим пользователем'
            });
            return;
        }

        if (!this.user.image) {
            this.toast.show({
                type: 'warning',
                text: 'Пустое изображение'
            });
            return;
        }

        this.socket.$emit('onImage', this.user.image)
            .then(d => {
                console.log(d);
                if (d && d.result == 'ok') {
                    this.toast.show({
                        type: 'success',
                        text: 'Профиль сохранен'
                    });
                    //this.user.image = this.i
                }
            });
    }

    ngOnInit(): void {
        this.passForm = this.fb.group({
            'currentPass': [null, [this.passValidator.bind(this, 'currentPass')]],
            'newPass': [null, [this.passValidator.bind(this, 'newPass')]],
            'repeatNewPass': [null, [this.passValidator.bind(this, 'repeatNewPass')]]
        }, null);

        // this.passForm

        this.passForm.valueChanges.subscribe(value => {
            console.log(value);
        });

        merge(
            this.passForm.get('currentPass').valueChanges,
            this.passForm.get('newPass').valueChanges,
            this.passForm.get('repeatNewPass').valueChanges
        ).subscribe(val => {
            // console.log(val);
            console.log(this.passForm);
        });

        //console.log();
    }

    onChangePass() {
        this.profileService.updatePass(this.passForm.value)
            .then((res) => {
                if (res && !res.error) {
                    this.toast.show({
                        type: 'success',
                        text: 'Password successful changed'
                    });
                } else if (res && res.result === 'CURRENT_PASS_NOT_MATCH') {
                    this.toast.show({
                        type: 'warning',
                        text: res.error
                    });

                }
            });
    }

    private passValidator(eName: string, control: FormControl): ValidationErrors {
        this.passFormValue[eName] = control.value;
        switch (eName) {
            case 'currentPass': {
                if (!control.value || control.value.length < 3) {
                    return {invalidPassword: 'Length should be more then 3 char length '};
                }
                return null;
            }
            case 'newPass':
            case 'repeatNewPass': {
                if (!control.value || control.value.length < 3) {
                    return {invalidPassword: 'Length should be more then 3 char length '};
                }
                if (this.passFormValue.newPass !== this.passFormValue.repeatNewPass) {
                    return {invalidPassword: 'Old and New pass does not match'};
                }
                this.passForm.get('newPass').setErrors(null);
                this.passForm.get('repeatNewPass').setErrors(null);
                return null;
            }
        }
        return null;
    }

}

