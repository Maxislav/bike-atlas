import {
    Component,
    EventEmitter,
    HostBinding,
    HostListener,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Output, ViewChild, ViewChildren
} from '@angular/core';
import {
    PopupButton,
    PopupInitialState,
    PopupInstance,
    PopupInterface,
    PopupService
} from 'src/app/modules/popup-module/popup.service';
import { printLine } from 'tslint/lib/verify/lines';
import { fadeInAnimation } from 'src/app/animation/animation';
import { popupItemAnimation } from 'src/app/modules/popup-module/popup-animation';

@Component({
    selector: 'popup-item-component',
    templateUrl: './popup-item.component.html',
    styleUrls: [
        './popup-item.component.less'
    ],
    animations: [popupItemAnimation]
})
export class PopupItemComponent implements OnInit, OnDestroy {
    myInjector: Injector;

    @HostBinding('@popupItemAnimation') fadeInAnimation = '';
    @HostBinding('class') get classes(): string {
        return this.popup.windowClass;
    }
    @Input() popup: PopupInterface;
    @Output() onClose = new EventEmitter<PopupInterface>();
    @Output() onMaskHide = new EventEmitter<PopupInterface>();


    private isClose: boolean;
    constructor(private injector: Injector, private popupService: PopupService) {

    }
    @HostListener('@popupItemAnimation.done', ['$event'])
    animationEnd(e){
        if(e.toState ==='void'){
              this.popupService.hideMask()
        }
    }
    ngOnInit(): void {

        this.myInjector =
            Injector.create({
                providers: [
                    {
                        provide: 'popupInitialParams',
                        deps: [],
                        useValue: this.popup.initialParams
                    }
                ], parent: this.injector
            });
    }

    click(button: PopupButton) {
        this.isClose = button.click(this);
        if (this.isClose) {
            this.onClose.emit(this.popup);
        }
    }

    ngOnDestroy(): void {

    }

    close(){
        this.onClose.emit(this.popup);
    }

}
