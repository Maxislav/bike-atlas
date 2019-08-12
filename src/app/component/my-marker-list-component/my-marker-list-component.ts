import {
    ApplicationRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    HostListener,
    Injector,
    OnDestroy
} from '@angular/core';
import { MyMarkerService } from '../../service/my-marker.service';
import { MapService } from '../../service/map.service';
import { MyInputPopupComponent } from '../../component/my-marker-list-component/my-input-popup-component/my-input-popup-component';
import { MyMapMarker } from '../../service/my-marker.service';
import { MenuItem } from '../../shared-module/menu-list-component/menu-list-component';
import { MyMarker } from '../../../types/global';

declare var module: { id: string };

@Component({
    moduleId: module.id,
    selector: 'marker-list-component',
    templateUrl: './my-marker-list-component.html',
    styleUrls: ['./my-marker-list-component.css']
})
export class MyMarkerListComponent implements OnDestroy {
    active: boolean = false;
    inputRef: ComponentRef<MyInputPopupComponent>;

    menu: Array<MenuItem>;

    constructor(
        private myMarkerService: MyMarkerService,
        private mapService: MapService,
    ) {
        this.omMapClick = this.omMapClick.bind(this);
        this.menu = [
            {
                text: 'remove',
                action: (item: MyMarker) => {
                    console.log(item)
                    item.remove();
                    return true
                }
            }
        ]
    }

    onMarkerClick(m: MyMapMarker){
        m.click()
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
        this.mapService.map.off('click', this.omMapClick);
        this.active = false;
        this.myMarkerService.createMarker(e.lngLat,
            {
                title: '',
                id: null
            });
    }

    ngOnDestroy(): void {
        this.mapService.map.off('click', this.omMapClick);
    }


}

