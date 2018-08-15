import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector } from '@angular/core';
import { MapService } from 'app/service/map.service';
import { LngLat, MapMarker, Popup } from 'src/@types/global';
import { MyInputPopupComponent } from 'app/component/my-marker-list-component/my-input-popup-component/my-input-popup-component';
import { Io } from 'app/service/socket.oi.service';
import { ToastService } from 'app/component/toast/toast.component';

export interface MyMarker {
    id: number,
    image_id: number,
    user_id: number,
    lng: number,
    lat: number,
    title: string
}

export interface MyMapMarker {
    id: number,
    marker: MapMarker;
    popup: Popup;
    scope: MyInputPopupComponent;

    remove(): void

    click(): void
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
        private toast: ToastService
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

    addMarkers(markers: Array<MyMarker>) {
        this.mapService.onLoad
            .then(() => {
                const {LngLat} = this.mapService.mapboxgl;
                markers.forEach(m => {
                    if (!this.markerList.find(({id}) => id === m.id)) {
                        this.createMarker(new LngLat(m.lng, m.lat), m);
                    }
                });
            });

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
                marker.remove();
                popup.remove();
                this.applicationRef.detachView(inputPopupRef.hostView);
                inputPopupRef.destroy();
                this.markerList.splice(this.markerList.indexOf(myMarker), 1);
                this.applicationRef.tick();
                this.removeMarker(myMarker);
            }
        };
        this.markerList.push(myMarker);
        console.log(myMarker);

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
        const myMarker: MyMapMarker = this.markerList.find(({scope}) => scope === component);
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
        const inputRef: MyInputPopupComponent = factory.create(this.injector, [], inputEl);
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

