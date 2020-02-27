import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
//import {Md5} from "../../service/md5.service";
import {ToastService} from "../toast/toast.component";
import {Io} from "../../service/socket.oi.service";
import {AuthService} from '../../service/auth.service';
import {FormBuilder, FormControl, FormGroup, ValidationErrors} from "@angular/forms";
import {RegistrationFormIs, RegistrationService} from "../../api/registration.service";
import {Md5} from '../../service/md5.service';
import {deepCopy} from '../../util/deep-copy';
import {Router} from '@angular/router';


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
                private router: Router,
                private ts: ToastService,
                private registrationService: RegistrationService,
                private authService: AuthService
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

    hasError(groupName: string): boolean {
        return !!this.registerForm.get(groupName).getError('invalidPassword')
            || !!this.registerForm.get(groupName).getError('invalidUser')
    }

    onCancel(e) {
        e.preventDefault();
        this.location.back();
    }


    onOk(e) {
        e.preventDefault();
        if (!this.registerForm.valid) {
            return this.ts.show({
                type: 'warning',
                text: 'Form invalid'
            })
        }

        const d: RegistrationFormIs = <RegistrationFormIs>deepCopy(this.registerForm.value);
        delete d.repeatPass;
        const reqData: {pass: string, name: string} = d;
        reqData.pass = this.md5.hash(reqData.pass);

        this.registrationService.onRegister(reqData)
            .then(data => {
               // console.log(data)
                switch (data.result) {
                    case 'success': {
                        this.ts.show({
                            type: 'success',
                            text: 'Registration success'
                        });
                        this.authService.onEnter(d);
                        this.router.navigate(['/auth/map']);
                        break;

                    }
                    default: {
                        this.registerForm.get('name').setErrors({invalidUser: 'User exist'});
                        this.ts.show({
                            type: 'error',
                            text: data.message
                        });
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })

    }


}
