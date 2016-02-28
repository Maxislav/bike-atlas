import {Component, View} from 'angular2/core';
import {MyMap} from './mymap'

@Component({
    selector: 'my-app'
})
@View({
    templateUrl: 'app/template/index.html',
    directives: [MyMap],
    styles: ['.root-head , .my-map{\
    width:100%;\
      position: absolute;\
      left: 0;\
      top: 0;\
      z-index: 1;\
    }\
    .my-map{z-index: 0;}\
  ']
})

export class AppComponent {
    public title = 'Menu';
}
