import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector } from '@angular/core';
import { MapService } from '../service/map.service';
import { LngLat, MapMarker, MyMarker, Popup } from '../../types/global';
import { MyInputPopupComponent } from '../component/my-marker-list-component/my-input-popup-component/my-input-popup-component';
import { Io } from '../service/socket.oi.service';
import { environment} from '../../environments/environment'
import { PopupService } from 'src/app/modules/popup-module/popup.service';
import { MyPopupDelMyMarker } from 'src/app/component/my-marker-list-component/my-popup-del-my-marker/my-popup-del-my-marker';
import { PopupItemComponent } from 'src/app/modules/popup-module/popup-item.component';
import {ToastService} from '../shared-module/toast-module/toast.service';


export interface MyMapMarker {
    id: number,
    marker: MapMarker;
    popup: Popup;
    scope: MyInputPopupComponent;

    remove(): void

    click(): void;

    clear(): void
}

@Injectable()
export class MyMarkerService {
    markerList: Array<MyMapMarker>;
    isShow: boolean = false;
    socket: any;


    constructor(
        private  io: Io,
        private mapService: MapService,
        private injector: Injector,
        private applicationRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private toast: ToastService,
        private popupService: PopupService
    ) {
        this.markerList = [];
        this.socket = io.socket;
    }

    show() {
        this.isShow = true;
    }

    hide() {
        this.isShow = false;
    }

    requestMarkers(){
        const {LngLat} = this.mapService.mapboxgl;
        this.socket.$get('getMarkerList', null)
            .then((markers) => {
                console.log(markers)

                markers.forEach(m => {
                    const mr = this.createMarker(new LngLat(m.lng, m.lat), m);
                    this.markerList.push(mr)
                })
            })
    }

    addMarkers(markers: Array<MyMarker>) {
        this.mapService.onLoad
            .then(() => {
                const {LngLat} = this.mapService.mapboxgl;
                markers.forEach(m => {
                    if (!this.markerList.find(({id}) => id === m.id)) {
                        const mr = this.createMarker(new LngLat(m.lng, m.lat), m);
                        this.markerList.push(mr)
                    }
                });
            });

    }

    clearAll(){
        let i = 0;
        while (this.markerList.length){
            const [marker] = this.markerList.splice(0,1);
            marker.clear();
            i++;
        }
    }


    createByClick(lngLat: LngLat, opts: {
        title: string,
        id: number
    }){
        const mr = this.createMarker(lngLat, opts);
        this.markerList.push(mr);
    }

    createMarker(lngLat: LngLat, opts: {
        title: string,
        id: number
    }): MyMapMarker {
        const $this = this;
        const {mapboxgl, map} = this.mapService;
        const icoContainer = document.createElement('div');
        const img = new Image();
        img.src = environment.hostPrefix + 'img/my-marker.png';
        img.style.width = '100%';
        img.style.height = '100%';
        icoContainer.appendChild(img);
        icoContainer.style.width = '40px';
        icoContainer.style.height = '40px';

        const inputContainer = document.createElement('div');
       // inputContainer.style.padding = '15px';
        // inputContainer.style.background = 'white';

        const popup = new mapboxgl.Popup({
            offset: [0, -40]
        })
            .setLngLat([lngLat.lng, lngLat.lat])
            .setDOMContent(inputContainer);

        const marker: MapMarker = new mapboxgl.Marker(icoContainer, {
            offset: [0, -20],
            draggable: false
        });
        marker.setLngLat([lngLat.lng, lngLat.lat])
            .addTo(map)
            .setPopup(popup);
        if (!opts.id) {
            marker.togglePopup();

        }
        const inputPopupRef = this.createInputPopup(inputContainer, opts.title, opts.id);

        const myMarker: MyMapMarker = {
            id: opts.id,
            marker: marker,
            popup: popup,
            scope: inputPopupRef.instance,
            click: () => {

                map.flyTo(
                    {
                        center: [lngLat.lng, lngLat.lat],
                        zoom: map.getZoom() < 12 ? 12 : map.getZoom()
                    });
            },
            remove: () => {

                this.popupService.show({
                    body: MyPopupDelMyMarker,
                    title: 'Confirm',
                    windowClass: 'popup-del-device',
                    initialParams: {
                        name: inputPopupRef.instance.title
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
                                //return true;
                                marker.remove();
                                popup.remove();
                                this.applicationRef.detachView(inputPopupRef.hostView);
                                inputPopupRef.destroy();
                                this.markerList.splice(this.markerList.indexOf(myMarker), 1);
                                this.applicationRef.tick();
                                this.removeMarker(myMarker);
                                popupItemComponent.close();
                                return false;
                            }
                        }
                    ]
                })

               /* marker.remove();
                popup.remove();
                this.applicationRef.detachView(inputPopupRef.hostView);
                inputPopupRef.destroy();
                this.markerList.splice(this.markerList.indexOf(myMarker), 1);
                this.applicationRef.tick();
                this.removeMarker(myMarker);*/
            },
            clear:() =>{
                marker.remove();

            }
        };
        return myMarker;
       // this.markerList.push(myMarker);


    }

    private removeMarker(marker: MyMapMarker) {
        this.socket.$emit('removeMyMarker', {
            id: marker.id
        })
            .then((d) => {
                this.toast.show({
                    type: 'success',
                    text: 'Marker was removed'
                });
            })
            .catch(e => {
                console.log('Error remove marker -> ', e);
            });
    }

    private saveMarker(component: MyInputPopupComponent) {
        const myMarker: MyMapMarker = this.markerList.find((m) => m.scope === component);
        console.log('save ->', myMarker);
        this.socket.$emit('saveMyMarker', {
            id: myMarker.id,
            title: component.title,
            lngLat: myMarker.marker.getLngLat()
        })
            .then(d => {
                myMarker.id = d.id;
                this.toast.show({
                    type: 'success',
                    text: 'Marker was added'
                });
            })
            .catch(e => {
                console.log('Error save marker -> ', e);
            });
    }

    private createInputPopup(el: HTMLElement, title: string, id: number): ComponentRef<MyInputPopupComponent> {
        const inputEl = document.createElement('my-input-popup-component');
        const factory = this.componentFactoryResolver.resolveComponentFactory(MyInputPopupComponent);
        const inputRef: ComponentRef<any> = factory.create(this.injector, [], inputEl);
        inputRef.instance.title = title;
        inputRef.instance.id = id;
        inputRef.instance.onSave.subscribe(v => {
            this.saveMarker(v);
        });
        this.applicationRef.attachView(inputRef.hostView);
        el.appendChild(inputEl);
        return inputRef;
    }


}

