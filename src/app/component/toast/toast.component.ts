import { Component, Injectable} from '@angular/core';

interface Message{
    type?: string;
    className?: string;
    text: string;
    remove?: Function
};

@Injectable()
export class ToastService{
    public messages: Array<Message>;
    constructor(){
        this.messages = [];
    }


    show(message: Message){
        message.className = message.type || 'default';
        this.messages.push(message);
        const res = {
            remove:  () => {
                const index = this.messages.indexOf(message);
                if(-1<index){
                    this.messages.splice(index, 1)    
                }
            }
        };
        message.remove = res.remove;
        
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
    private cl: string;
    constructor(private ts: ToastService){
        this.messages = ts.messages;
    }


};


