
var canvas;
var gl;

var points = [];
var colorLoc;


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    points = [
        vec2(0.00, -0.85),
        vec2(-0.05, -0.90),
        vec2(0.05, -0.90)
    ];

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor( 0.95, 1.0, 1.0, 1.0 );

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
    colorLoc = gl.getUniformLocation(program, "fColor");

    window.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 37:	// vinstri ör
                points[0][0] -= 0.04
                points[1][0] -= 0.04
                points[2][0] -= 0.04
                break;
            case 39:	// hægri ör
                points[0][0] += 0.04
                points[1][0] += 0.04
                points[2][0] += 0.04
                break;
            case 38:	// upp ör
                points[0][1] += 0.04
                points[1][1] += 0.04
                points[2][1] += 0.04
                break;
            case 40:	// niður ör
                points[0][1] -= 0.04
                points[1][1] -= 0.04
                points[2][1] -= 0.04
                break;    
            default:
                console.log("Arrow Keys")
        }

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    });

    render();
};



function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniform4fv(colorLoc, vec4(0.0, 1.0, 0.0, 1.0));
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
    window.requestAnimFrame(render);
}