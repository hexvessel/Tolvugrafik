/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Sýnir notkun á "mousedown" og "mousemove" atburðum
//
//    Hjálmtýr Hafsteinsson, september 2023
/////////////////////////////////////////////////////////////////
var canvas;
var gl;
var bufferId;
var vertices
var mouseX;             // Old value of x-coordinate  
var movement = false;   // Do we move the paddle?
var box;
var buffer_box;
var vPosition;

// Stefna (og hraði) fernings
var dX;
var dY;

// Svæðið er frá -maxX til maxX og -maxY til maxY
var maxX = 1.0;
var maxY = 1.0;

// Hálf breidd/hæð ferningsins
var boxRad = 0.05;

window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    // Gefa ferningnum slembistefnu í upphafi
    dX = Math.random() * 0.015;
    dY = Math.random() * 0.015;

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    box = [
        vec2(-0.05, -0.05),
        vec2(0.05, -0.05),
        vec2(0.05, 0.05),
        vec2(-0.05, 0.05)
    ];

    vertices = [
        vec2(-0.1, -0.8),
        vec2(-0.1, -0.76),
        vec2(0.1, -0.76),
        vec2(0.1, -0.8)
    ];

    // Load the data into the GPU
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);


    buffer_box = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_box);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(box), gl.DYNAMIC_DRAW);

    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Event listeners for mouse
    canvas.addEventListener("mousedown", function (e) {
        movement = true;
        mouseX = e.offsetX;
    });

    canvas.addEventListener("mouseup", function (e) {
        movement = false;
    });

    canvas.addEventListener("mousemove", function (e) {
        if (movement) {
            var xmove = 2 * (e.offsetX - mouseX) / canvas.width;
            mouseX = e.offsetX;
            for (i = 0; i < 4; i++) {
                vertices[i][0] += xmove;
            }
        }
    });

    render();
}


function render() {

    var x_mid = (box[0][0] + box[2][0]) / 2;
    var y_mid = (box[0][1] + box[2][1]) / 2;

    // Láta ferninginn skoppa af veggjunum
    if (Math.abs(x_mid + dX) > maxX - boxRad) dX = -dX;
    if (Math.abs(y_mid + dY) > maxY - boxRad) dY = -dY;


    if (((box[0][1] ) < vertices[0][1]) &&
        ((x_mid + dX) < vertices[2][0]) &&
        ((x_mid + dX) > vertices[0][0] ))
        dY = -dY;


    // Uppfæra staðsetningu
    for (let index = 0; index < 4; index++) {
        box[index][0] += dX;
    }
    for (let index = 0; index < 4; index++) {
        box[index][1] += dY;
    }

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_box);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(box), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    window.requestAnimFrame(render);
}
