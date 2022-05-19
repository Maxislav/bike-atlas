import {
    Component, Pipe, PipeTransform, Directive, ElementRef,
    AfterViewInit, OnInit
} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Device, DeviceService} from '../../service/device.service';
import {NavigationHistory} from '../../app.component';
import {User, UserService} from '../../service/main.user.service';
import {environment} from '../../../environments/environment';
import {PopupButton, PopupInstance, PopupService} from 'src/app/modules/popup-module/popup.service';
import {DeviceDelPopupComponent} from 'src/app/component/device/device-del-popup.component';
import {autobind} from 'src/app/util/autobind';
import {LogService} from 'src/app/service/log.service';
import {PopupItemComponent} from 'src/app/modules/popup-module/popup-item.component';
import {ToastService} from '../../shared-module/toast-module/toast.service';
import {hashGenerate} from '../../util/hash';

function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return {top: _y, left: _x};
}


@Directive({
    selector: 'help-container',
})
export class HelpContainer implements AfterViewInit {
    private top = 0;
    private y;

    constructor(private el: ElementRef) {

        let w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth;
        this.y = w.innerHeight || e.clientHeight || g.clientHeight;


    }

    ngAfterViewInit(): void {
        this.top = getOffset(this.el.nativeElement).top + 180;
        this.el.nativeElement.style.height = this.y - this.top + 'px';
        // this.renderer.setElementStyle(this.el.nativeElement, 'height', this.y - this.top + 'px');
    }
}


@Pipe({
    name: 'isOwner',
    pure: false
})
export class IsOwner implements PipeTransform {
    constructor(private userService: UserService) {

    }

    transform(value, args?) {
        return value.filter(item => {
            return item.ownerId == this.userService.id;
        });
    }
}


@Component({
    templateUrl: 'device.component.html',
    styleUrls: [
        'device.component.less',
    ]
})
export class DeviceComponent implements AfterViewInit, OnInit {

    public device: Device;
    public devices: Array<Device>;
    public btnPreDel: { index: number };
    public user: User;
    public showHelp: boolean = false;
    public hostPrefix = environment.hostPrefix;

    private inputList: Set<any> = new Set();

    public get deviceNameSelected(): string {
        return this.deviceService.currentChildName;
    } ;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private deviceService: DeviceService,
        private toast: ToastService,
        private lh: NavigationHistory,
        private el: ElementRef,
        private popupService: PopupService,
        private logService: LogService
    ) {


        this.user = userService.getUser();
        this.device = deviceService.createDevice();

        this.btnPreDel = {
            index: -1
        };
        this.devices = deviceService.getDeviceList();
    }

    onShowHelp() {
        this.showHelp = !this.showHelp;
    }

    onAdd(e) {
        e.preventDefault();


        this.device.name = this.device.name.replace(/^\s+/, '');
        this.device.device_key = this.device.device_key.replace(/^\s+/, '');

        console.log(this.device);
        if (!this.device.name || !this.device.device_key) {
            this.toast.show({
                type: 'warning',
                text: 'Имя или Идентификатор не заполнено'
            });
            return;
        }


        this.deviceService.onAddDevice(this.device)
            .then((d) => {
                if (d && d.error) {
                    console.warn(d.error);
                    this.toast.show({
                        type: 'warning',
                        text: 'Устройство зарегистрированно на другого пользователя'
                    });

                }
                if (d && d.result == 'ok') {
                    this.reset();
                }
            });
    }


    preDel2(e, device) {


        this.popupService.show(
            {
                body: DeviceDelPopupComponent,
                title: 'Confirm',
                windowClass: 'popup-del-device',
                initialParams: {
                    name: device.name
                },
                buttons: [
                    {
                        label: 'Cancel',
                        windowClass: 'reject',
                        click: () => {
                            return true;
                        }
                    },
                    {
                        label: 'Delete',
                        windowClass: 'resolve',
                        click: (popupItemComponent: PopupItemComponent) => {
                            /*  setTimeout(() => {
                                  popupItemComponent.close()
                              }, 300);*/
                            this.deviceService.onDelDevice(device)
                                .then((d) => {
                                    popupItemComponent.close();
                                });

                            return false;
                        }
                    }
                ]
            });
    }

    @autobind()
    onDelete() {

    }

    preDel(e, i) {
        e.stopPropagation();
        this.btnPreDel.index = i;
    }

    clearPredel() {
        this.btnPreDel.index = -1;
    }

    public createSharedLink(event: Event, device: Device) {
        event.stopPropagation();
        device.sharedLink = hashGenerate()
    }

    reset() {
        this.device = this.deviceService.createDevice();
        this.deviceService.updateDevices()
            .then(() => {
                this.logService.emitLastPosition();
            });
    }


    onLoadImage(device: Device, i: number) {
        const el: any = Array.from(this.el.nativeElement.getElementsByTagName('input')).find((item: { id: string }) => {
            return item.id === 'input-img-' + i;
        });
        this.initEl(el, device);

    }


    navigateToHelp(deviceName: string) {

        this.router.navigate([deviceName], {relativeTo: this.activatedRoute});
    }


    private initEl(el: any, device: Device) {
        if (!this.inputList.has(el)) {
            this.inputList.add(el);
            el.addEventListener('change', () => {
                const file = el.files[0];
                const reader = new FileReader();
                reader.onload = (event: any) => {
                    const the_url = event.target.result;
                    device.image = this.crop(the_url);
                    this.onAddDeviceImage(device);

                };
                reader.readAsDataURL(file);
            });
        }
        el.click();
    }

    private onAddDeviceImage(device: Device) {
        this.deviceService.onAddDeviceImage(device)
            .then(d => {

                if (d && d.error) {
                    this.toast.show({
                        type: 'error',
                        text: d.error
                    });
                }
            });
    }

    private crop(base64) {
        //const $this = this;
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
            //$this.user.image =   elCanvas.toDataURL();
            //imageObj.parentElement.removeChild(imageObj)
        }

        imageObj.onload = function () {
            drawClipped(context, imageObj);
        };
        imageObj.src = base64;
        return base64;
        //document.body.appendChild(imageObj)
    }

    ngDoCheck() {

    }


    getF(f) {
        console.log(f);
    }

    onClose() {

        this.router.navigate(['/auth/map']);

    }

    ngAfterViewInit(): void {

        //this.rr
        /* this.activatedRoute.firstChild.params.subscribe((data) => {
             this.deviceNameSelected  = (data.device)

         })*/

        //  this.deviceHelpComponent
        //  console.log( this.el.nativeElement.getElementsByTagName('input'))
    }

    ngOnInit(): void {
        this.activatedRoute.snapshot.data;

    }

}
