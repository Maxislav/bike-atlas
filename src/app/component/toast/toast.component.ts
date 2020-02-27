import {Component, Injectable} from '@angular/core';

type MESSAGE_TYPE = 'danger' | 'error' | 'warning' | 'success'

export class Message implements M {
    type: MESSAGE_TYPE;
    className: string;
    text: string;
    translate: string | undefined;

    constructor(type, className, text, translate?) {
        this.type = type || 'default';
        this.className = type || 'default';
        this.text = text;
        if (translate) this.translate = translate;
    }

    remove() {
    }
}


interface M {
    text: string;
    type?: MESSAGE_TYPE;
    className?: string;
    translate?: string;
}


@Injectable()
export class ToastService {
    public messages: Array<Message>;

    constructor() {
        this.messages = [];
    }


    show(options: M) {
        const mess: Message = new Message(options.type, options.className, options.text, options.translate);
        //message.className = message.type || 'default';

        const res = {
            remove: () => {
                const index = this.messages.indexOf(mess);
                if (-1 < index) {
                    this.messages.splice(index, 1);
                }
            }
        };

        mess.remove = res.remove;
        this.messages.push(mess);

        setTimeout(() => {
            res.remove();
        }, 5000);
        return res;
    }

}

@Component({
    selector: 'toast-component',
    templateUrl: './toast-component.html',
    styleUrls: [
        './toast.component.less',
    ]
})
export class ToastComponent {
    public messages: Array<Message>;
    private cl: string;

    constructor(private ts: ToastService) {
        this.messages = ts.messages;
    }


}


