/**
 * Created by maxislav on 10.10.16.
 */

import { Component } from '@angular/core';
import { Directive, ElementRef, Input, Renderer } from '@angular/core';
@Directive({
    selector: 'leaflet-map'
})
export class HighlightDirective {
    constructor(el: ElementRef, renderer: Renderer) {
        console.log('ololool');
        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'yellow');
    }
}
