/**
 * Created by maxislav on 10.10.16.
 */

import {Component, AfterViewInit} from '@angular/core';
import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import any = jasmine.any;
import {MapService} from "../map.service";

declare var L: any;
declare var gl:any;
class MyEl extends HTMLElement{
    constructor(id: string){
        super()
    }
    type: string
}

@Directive({
    selector: 'leaflet-map',
})
export class LeafletMapDirective implements AfterViewInit {
    renderer:Renderer;
    el:ElementRef;
    nativeElement:any;
    elCanvas:any;
    map: any;
    shaderProgram: any;
    gl:any;
    triangleVertexPositionBuffer: any;

    ngAfterViewInit():void {
        this.renderer.setText(this.el.nativeElement, '');
        this.nativeElement = this.el.nativeElement;

        var elCanvas = document.createElement('canvas');
        elCanvas.setAttribute('width', '512');
        elCanvas.setAttribute('height', '512');
        this.nativeElement.appendChild(elCanvas);
        var gl = this.initGL(elCanvas);
        gl.clearColor(0.9,0.9,0.8,1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var vertices = [-0.5, 0.5, -0.5, -0.5, 0.0, -0.5,];
        var vertex_buffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        var vertCode =
            'attribute vec2 coordinates;' +
            'void main(void) {' + ' gl_Position = vec4(coordinates,0.0, 1.0);' + '}';
        //Create a vertex shader object
        var vertShader = gl.createShader(gl.VERTEX_SHADER);

        //Attach vertex shader source code
        gl.shaderSource(vertShader, vertCode);
        //Compile the vertex shader
        gl.compileShader(vertShader);

        var fragCode = 'void main(void) {' + 'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' + '}';


        // Create fragment shader object
        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);


        // Attach fragment shader source code
        gl.shaderSource(fragShader, fragCode);

        // Compile the fragment shader
        gl.compileShader(fragShader);


        // Create a shader program object to store combined shader program
        var shaderProgram = gl.createProgram();


        // Attach a vertex shader
        gl.attachShader(shaderProgram, vertShader);


        // Attach a fragment shader
        gl.attachShader(shaderProgram, fragShader);

        // Link both programs
        gl.linkProgram(shaderProgram);

        // Use the combined shader program object
        gl.useProgram(shaderProgram);


        /* Step 4: Associate the shader programs to buffer objects */

        //Bind vertex buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

        //Get the attribute location
        var coord = gl.getAttribLocation(shaderProgram, "coordinates");

        //point an attribute to the currently bound VBO
        gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

        //Enable the attribute
        gl.enableVertexAttribArray(coord);


        /* Step5: Drawing the required object (triangle) */

        // Clear the canvas
        gl.clearColor(0.5, 0.5, 0.5, 0.9);

        // Enable the depth test
        gl.enable(gl.DEPTH_TEST);

        // Clear the color buffer bit
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Set the view port
        //gl.viewport(0,0,canvas.width,canvas.height);

        // Draw the triangle
        gl.drawArrays(gl.TRIANGLES, 0, 3);

    };


    constructor(el: ElementRef, renderer: Renderer, mapSevice: MapService) {
        this.el = el;
        this.renderer = renderer;

        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'rgba(200,200,200, 1)');
        renderer.setElementStyle(el.nativeElement, 'color', 'white');
        renderer.setElementStyle(el.nativeElement, 'width', '512px');
        renderer.setElementStyle(el.nativeElement, 'height', '512px');


    }

    initGL(canvas) {
        var gl = this.gl;
        try {
            gl = canvas.getContext("webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
            console.log(e)
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-( ");
        }
        return gl
    }



}
