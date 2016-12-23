import { Component, Injectable} from '@angular/core';

interface Message{
    type?: string;
    text: string
};

@Injectable()
export class ToastService{
    public messages: Array<Message>;
    constructor(){
        this.messages = [];
    }

    push(message: Message){
        this.messages.push(message);
        
        const res = {
            remove:  () => {
                const index = this.messages.indexOf(message);
                this.messages.splice(index, 1)
            }
        };
        
        setTimeout(()=>{
            res.remove();
        }, 5000);
        return res
    }

}


@Component({
    selector: 'toast-component',
    templateUrl: 'dist/app/component/toast/toast-component.html',
    styleUrls: [
        'dist/app/component/toast/toast.component.css',
    ]
})
export class ToastComponent{
    public messages: Array<Message>;
    constructor(private ts: ToastService){
        this.messages = ts.messages;
    }


};


