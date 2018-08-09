import { Component, HostListener, OnDestroy } from '@angular/core';
import { MyMarkerService } from 'app/service/my-marker.service';
import { MapService } from 'app/service/map.service';

declare var module: { id: string };

@Component({
    moduleId: module.id,
    selector: 'marker-list-component',
    templateUrl: './my-marker-list-component.html',
    styleUrls: ['./my-marker-list-component.css']
})
export class MyMarkerListComponent implements OnDestroy {
    active: boolean = false;

    constructor(
        private myMarkerService: MyMarkerService,
        private mapService: MapService) {
        this.omMapClick = this.omMapClick.bind(this);
    }

    onAddActive(e) {
        this.active = true;
        this.mapService.map.off('click', this.omMapClick);
        this.mapService.map.on('click', this.omMapClick);
    }

    onClose() {
        this.myMarkerService.hide();
    }

    private omMapClick(e) {
        console.log(e);
        this.mapService.map.off('click', this.omMapClick);
        this.active = false;
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
        inputContainer.style.background = 'white';


        const inputEl = document.createElement('input');
        inputEl.setAttribute("type", "text");
        inputContainer.appendChild(inputEl)

        class Marker extends mapboxgl.Marker{
            title: string;
            constructor(container, options){
                super(container, options)
            }
        }

        const popup = new mapboxgl.Popup({
            offset: [0, -40]
        })
            .setLngLat(e.lngLat)
            .setDOMContent(inputContainer)

        const marker = new Marker( icoContainer, {
            offset: [-20,-40]
        })
            .setLngLat([e.lngLat.lng, e.lngLat.lat])
            .addTo(map)
            .setPopup(popup)
            .togglePopup()
    }

    ngOnDestroy(): void {
        this.mapService.map.off('click', this.omMapClick);
    }


}

