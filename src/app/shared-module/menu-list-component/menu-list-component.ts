import { ApplicationRef, Component, HostListener, Input } from '@angular/core';


export interface MenuItem {
    text: string,
    action(e?: any): boolean
}

@Component({
    selector:'menu-list-component',
    templateUrl: './menu-list-component.html',
    styleUrls: [ './menu-list-component.less']
})
export class MenuListComponent {

    isShow: boolean;
    @Input() menu: Array<MenuItem>;
    @Input() item: any;

    constructor(private ref: ApplicationRef){
        this.isShow = false;
        this.menu = [];
        this.documentClick = this.documentClick.bind(this)
    }

    @HostListener('document:click')
    onClose(){
        //console.log('djsldj')
        //this.isShow = false
    }

    onOpen(){
        this.isShow = true;
        setTimeout(()=>{
            document.removeEventListener('click', this.documentClick)
            document.addEventListener('click', this.documentClick)
        },100)
        this.ref.tick()
    }

    private documentClick(){


        this.isShow = false;
        document.removeEventListener('click', this.documentClick)

    }

    onAction(e, item: MenuItem){
        console.log('djsdkl')
        e.stopPropagation();
        if(item.action(this.item)){
            this.isShow = false;
            document.removeEventListener('click', this.documentClick)
        }
    }

}

