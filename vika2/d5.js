"use strict";

var canvas;
var gl;

var points = [];
var colorLoc;
var NumTimesToSubdivide = 6;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2(-1, -1),
        vec2(-1, 1),
        vec2(1, -1),
        vec2(-1, 1),
        vec2(1, 1),
        vec2(1, -1)
    ];

    divideRec(vertices[0],
        vertices[1],
        vertices[2],
        vertices[3],
        vertices[4],
        vertices[5],
        NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    colorLoc = gl.getUniformLocation( program, "fColor" );
    render();
};

function rectangle(a, b, c, d, e, f) {
    points.push(a, b, c, d, e, f);
}

function divideRec(a, b, c, d, e, f, count) {

    // check for end of recursion

    if (count === 0) {
        rectangle(a, b, c, d, e, f);
    } else {
        //bisect the sides
        var ab = mix(a, b, 1 / 3);
        var ac = mix(a, c, 1 / 3);
        var ae = mix(a, e, 1 / 3);

        var ba = mix(b, a, 1 / 3);
        var be = mix(b, e, 1 / 3);
        var bc = mix(b, c, 1 / 3);

        var eb = mix(e, b, 1 / 3);
        var ec = mix(e, c, 1 / 3);
        var ea = mix(e, a, 1 / 3);

        var ca = mix(c, a, 1 / 3);
        var ce = mix(c, e, 1 / 3);
        var cb = mix(c, b, 1 / 3);
        --count;

        // three new triangles

        divideRec(a, ab, ac, ab, ae, ac, count);
        divideRec(ab, ba, ae, ba, bc, ae, count);
        divideRec(ba, b, bc, b, be, bc, count);
        divideRec(bc, be, ea, be, eb, ea, count);
        divideRec(ea, eb, ec, eb, e, ec, count);
        divideRec(cb, ea, ce, ea, ec, ce, count);
        divideRec(ca, cb, c, cb, ce, c, count);
        divideRec(ac, ae, ca, ae, cb, ca, count);
    }

}

function render() {
    
    gl.uniform4fv( colorLoc, vec4(Math.random(),Math.random(), Math.random(), 1.0) );
    gl.drawArrays( gl.TRIANGLES, 0, points.length);   
    
}