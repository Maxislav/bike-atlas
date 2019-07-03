import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { MenuService } from 'app/service/menu.service';
import { Io } from 'app/service/socket.oi.service';
import { TrackService } from 'app/service/track.service';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs/observable/fromEvent';
import * as ss from 'node_modules/socket.io-stream/socket.io-stream.js';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/src/Subscription';
import { Observer } from 'rxjs/Observer';
import { MyMarkerService } from 'app/service/my-marker.service';

const log = console.log;

interface Item {
    text: string;
    value: string;
    enctype?: string;

}

interface myElement extends Element {
    click(): void;

    files?: Array<File>
}

interface myEventTarget extends EventTarget {
    parentElement: myElement;
}

interface myEvent extends Event {
    target: myEventTarget
}

const MENU: Item[] = [
    {
        value: 'strava',
        text: 'Strava'
    },
    {
        value: 'journal',
        text: 'JOURNAL'
    },
    {
      value:'myMarker',
      text: 'MY_MARKER'
    },
    {
        value: 'load',
        text: 'DOWNLOAD_GPX',
        enctype: 'multipart/form-data',
    },
    {
        value: 'import',
        text: 'IMPORT_FROM_GOOGLE_KML'
    },
    {
        value: 'gl520',
        text: 'GL520BS'
    },

];

declare const module: any;

@Component({
    moduleId: module.id,
    selector: 'menu-track',
    templateUrl: './menu-track.html',
    styleUrls: ['./menu-track.css'],
    // providers: [MenuService]
})
export class MenuTrackComponent {
    menu = MENU;
    private socket: any;
    private clickLoad: number = 0;
    private subscription: any;
    @Output() onCloseMenuTrack: EventEmitter<boolean> = new EventEmitter();

    constructor(private ms: MenuService,
                private io: Io,
                private trackService: TrackService,
                private router: Router,
                private myMarkerService: MyMarkerService
    ) {
        this.socket = io.socket;


    }

    @HostListener('click', ['$event'])
    clickIn(e) {
        e.stopPropagation();
        this.onCloseMenuTrack.emit(false);
    }
    ngAfterViewInit() {
        const onClickObservable: Observable<MouseEvent> = fromEvent(document.body, 'click');
        setTimeout(() => {
            this.subscription = onClickObservable.subscribe(<PushSubscription>(e: MouseEvent) => {
                this.onCloseMenuTrack.emit(false);
            });
        }, 10);

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSelect(item, $event) {
       // $event.preventDefault();
       // $event.stopPropagation();

        switch (item.value) {
            case 'load':
                this.loadFile($event);
                break;
            case 'import':
                this.importFromGoogleKml($event);
                break;
            case 'journal':
                this.router.navigate(['/auth/map/journal']);
                // this.ms.menuOpen = false;
                break;
            case 'strava':
                this.router.navigate(['/auth/map/strava-invite']);
                // this.ms.menuOpen = false;
                break;

            case   'myMarker':
                this.myMarkerService.show();
                break;
            case 'gl520': {
                this.router.navigate(['/auth/map/', 'gtgbc']);
                break;
            }
            default:
                return null;
        }

    }

    loadFile(e: Event) {
        this.clickLoad++;
        const elFile: myElement = e.target.parentElement.getElementsByTagName('input')[1];
        elFile.addEventListener('change', () => {
            goStream.call(this);
        });

        if (this.clickLoad == 2) {
            goStream.call(this);
        }

        elFile.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        elFile.click();

        function goStream() {
            this.ms.menuOpen = false;
            this.clickLoad = 0;
            let FReader = new FileReader();
            FReader.onload = function (e) {
                console.log(e);
            };
            var file = elFile.files[0];
            var stream = ss.createStream();
            ss(this.socket).emit('file', stream, {size: file.size});
            ss.createBlobReadStream(file).pipe(stream);
        }
    }

    importFromGoogleKml(e: Event) {
        this.clickLoad++;
        const elFile: myElement = e.target.parentElement.getElementsByTagName('input')[1];
        elFile.addEventListener('change', () => {
            goStream.call(this);
        });

        if (this.clickLoad == 2) {
            goStream.call(this);
        }

        elFile.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        elFile.click();

        function goStream() {
            this.ms.menuOpen = false;
            this.clickLoad = 0;
            let FReader = new FileReader();
            FReader.onload = function (e) {
                console.log(e);
            };
            var file = elFile.files[0];
            var stream = ss.createStream();
            ss(this.socket).emit('importFromGoogleKml', stream, {size: file.size});
            ss.createBlobReadStream(file).pipe(stream);
        }
    }

    importFile(e: Event) {
        this.clickLoad++;

        const trackService = this.trackService;
        this.ms.menuOpen = false;
        const elFile: myElement = e.target.parentElement.getElementsByTagName('input')[1];

        elFile.addEventListener('change', goStream.bind(this));

        elFile.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        elFile.click();
        if (this.clickLoad == 2) {
            goStream.call(this);
        }

        function goStream() {
            this.clickLoad = 0;
            var file = elFile.files[0];
            var xhr = new XMLHttpRequest();
            xhr.upload.onprogress = function (event) {
                console.log(event.loaded + ' / ' + event.total);
            };
            xhr.onload = xhr.onerror = function () {
                if (this.status == 200) {
                    trackService.showGpxTrack(this.response);
                    download(file.name.replace(/kml$/, 'gpx'), this.response);
                } else {
                    log('error ' + this.status);
                }
            };

            xhr.open('POST', '/import/kml-data', true);
            var formData = new FormData();
            formData.append('file', file);
            xhr.send(formData);

        }


        function download(filename, text) {
            var pom = document.createElement('a');
            pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            pom.setAttribute('download', filename);

            if (document.createEvent) {
                var event = document.createEvent('MouseEvents');
                event.initEvent('click', true, true);
                pom.dispatchEvent(event);
            }
            else {
                pom.click();
            }
        }

    }
}
