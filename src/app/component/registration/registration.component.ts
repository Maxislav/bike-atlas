import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Md5} from "../../service/md5.service";
import {ToastService} from "../toast/toast.component";
import {Io} from "../../service/socket.oi.service";
import {AuthService} from '../../service/auth.service';
import {FormBuilder, FormControl, FormGroup, ValidationErrors} from "@angular/forms";
import {RegistrationFormIs, RegistrationService} from "../../api/registration.service";

// import {LoginService} from "../../service/login.service";
@Component({
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.less'],
})
export class RegistrationComponent implements OnInit {


    private socket;
    registerForm: FormGroup;

    registrationFormValue: RegistrationFormIs = {
            name: null,
            pass: null,
            repeatPass: null
    };

    constructor(private location: Location,
                private md5: Md5,
                private fb: FormBuilder,
                private ts: ToastService,
                private registrationService: RegistrationService
                ) {
    }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            name: [null, [this.passValidator.bind(this, 'name')]],
            pass: [null, [this.passValidator.bind(this, 'pass')]],
            repeatPass: [null, [this.passValidator.bind(this, 'repeatPass')]]
        })
    }

    private passValidator(eName: string, control: FormControl): ValidationErrors {
        this.registrationFormValue[eName] = control.value;
        switch (eName) {
            case 'name': {
                if (!control.value || control.value.length < 3) {
                    return {invalidPassword: 'Length should be more then 3 char length '};
                }
                return null;
            }
            case 'pass':
            case    'repeatPass': {
                if (!control.value || control.value.length < 3) {
                    return {invalidPassword: 'Length should be more then 3 char length '};
                }
                if (this.registrationFormValue.pass !== this.registrationFormValue.repeatPass) {
                    return {invalidPassword: 'Old and New pass does not match'};
                }
                this.registerForm.get('pass').setErrors(null);
                this.registerForm.get('repeatPass').setErrors(null);
            }
            default: {
                return null
            }
        }
    }

    hasError(groupName: string): boolean{
       return  !!this.registerForm.get(groupName).getError('invalidPassword')
    }

    onCancel(e) {
        e.preventDefault();
        this.location.back();
    }



    onOk(e) {
        e.preventDefault();
        this.registrationService.onRegister(this.registerForm.value)
            .then(data => {
                console.log(data)
            })

    }



}
