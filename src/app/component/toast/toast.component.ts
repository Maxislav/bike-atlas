import { Component, Injectable} from '@angular/core';


export class Message{
    type: string;
    className: string;
    text: string;
    translate: string | undefined;
    constructor(type, className, text, translate?){
        this.type = type || 'default';
        this.className = type || 'default';
        this.text = text;
        if(translate)  this.translate = translate;
    }
    remove(){}
}

interface  M{
    type?: string;
    className?: string;
    text?: string;
    translate?: string;
};

@Injectable()
export class ToastService{
    public messages: Array<Message>;
    constructor(){
        this.messages = [];
    }


    show(message: M){
        const  mess: Message = new Message(message.type, message.className, message.text, message.translate);
        //message.className = message.type || 'default';

        const res = {
            remove:  () => {
                const index = this.messages.indexOf(mess);
                if(-1<index){
                    this.messages.splice(index, 1)    
                }
            }
        };

        mess.remove = res.remove;
        this.messages.push(mess);
        
        setTimeout(()=>{
            res.remove();
        }, 5000);
        return res
    }

}


@Component({
    selector: 'toast-component',
    templateUrl: '/dist/app/component/toast/toast-component.html',
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


