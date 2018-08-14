import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector } from '@angular/core';
import { MapService } from 'app/service/map.service';
import { LngLat, MapMarker, Popup } from 'src/@types/global';
import { MyInputPopupComponent } from 'app/component/my-marker-list-component/my-input-popup-component/my-input-popup-component';
import { Io } from 'app/service/socket.oi.service';

export interface MyMarker {
    id: number,
    marker: MapMarker;
    popup: Popup;
    scope: MyInputPopupComponent;

    remove(): void
}

@Injectable()
export class MyMarkerService {
    markerList: Array<MyMarker>;
    isShow: boolean = false;
    socket: any;

    constructor(
        private  io: Io,
        private mapService: MapService,
        private injector: Injector,
        private applicationRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver
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

    createMarker(lngLat: LngLat, opts: {
        title: string,
        id: number
    }) {
        const {mapboxgl, map} = this.mapService;
        const icoContainer = document.createElement('div');
        const img = new Image();
        img.src = 'src/img/my-marker.png';
        img.style.width = '100%';
        img.style.height = '100%';
        icoContainer.appendChild(img);
        icoContainer.style.width = '40px';
        icoContainer.style.height = '40px';

        const inputContainer = document.createElement('div');
        inputContainer.style.padding = '15px';
        // inputContainer.style.background = 'white';

        const popup = new mapboxgl.Popup({
            offset: [0, -40]
        })
            .setLngLat([lngLat.lng, lngLat.lat])
            .setDOMContent(inputContainer);

        const marker: MapMarker = new mapboxgl.Marker(icoContainer, {
            offset: [-20, -40],
            draggable: true
        });
        marker.setLngLat([lngLat.lng, lngLat.lat])
            .addTo(map)
            .setPopup(popup)
            .togglePopup();
        const inputPopupRef = this.createInputPopup(inputContainer, opts.title);

        const myMarker: MyMarker = {
            id: opts.id,
            marker: marker,
            popup: popup,
            scope: inputPopupRef.instance,
            remove: () => {
                marker.remove();
                popup.remove();
                this.applicationRef.detachView(inputPopupRef.hostView);
                inputPopupRef.destroy();
                this.markerList.splice(this.markerList.indexOf(myMarker), 1);
                this.applicationRef.tick();
            }
        };
        this.markerList.push(myMarker);
        console.log(myMarker);

    }

    private saveMarker(component: MyInputPopupComponent) {
        const myMarker: MyMarker = this.markerList.find(({scope}) => scope === component);
        console.log('save ->', myMarker);
        this.socket.$emit('saveMyMarker', {
            id: myMarker.id,
            title: component.title,
            lngLat: myMarker.marker.getLngLat()
        })
            .then(d => {
                myMarker.id = d.id
            })
            .catch(e=>{
                console.log('Error save marker -> ', e)
            })
    }

    private createInputPopup(el: HTMLElement, title: string): ComponentRef<MyInputPopupComponent> {
        const inputEl = document.createElement('my-input-popup-component');
        const factory = this.componentFactoryResolver.resolveComponentFactory(MyInputPopupComponent);
        const inputRef: MyInputPopupComponent = factory.create(this.injector, [], inputEl);
        inputRef.instance.title = title;
        inputRef.instance.onSave.subscribe(v => {
            this.saveMarker(v);
        });
        this.applicationRef.attachView(inputRef.hostView);
        el.appendChild(inputEl);
        return inputRef;
    }


}

