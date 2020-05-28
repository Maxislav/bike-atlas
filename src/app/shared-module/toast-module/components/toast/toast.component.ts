import {Component} from '@angular/core';
import {forToastAnimation} from '../../../../animation/animation';
import {Message, ToastService} from '../../toast.service';

@Component({
    selector: 'toast-component',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.less'],
    animations: [forToastAnimation]
})
export class ToastComponent {
    public messages: Array<Message>;
    private cl: string;

    constructor(private ts: ToastService) {
        this.messages = ts.messages;
    }

}
