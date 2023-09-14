
var canvas;
var gl;

var bufferFrog;
var bufferLanes;
var bufferCarOne;
var bufferCarTwo;
var bufferCarThree;

var frog = [];
var lanes = [];
var carOne = [];
var carTwo = [];
var carThree = [];
var carFour = [];
var carFive = [];
var carSix = [];

var maxX = 1.0;

var carOneSpeed = 0.01;
var carTwoSpeed = 0.012;
var carThreeSpeed = 0.01;
var carFourSpeed = 0.02;
var carFiveSpeed = 0.012;
var carSixSpeed = 0.011;

var colorLoc;
var vPosition;

var frogUp = true;

var reachedTop = false;
var scoreInc = false;
var score = 0;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    frog = [
        vec2(0.00, -0.85), vec2(-0.05, -0.90), vec2(0.05, -0.90)
    ];

    lanes = [
        vec2(-1.0, 0.6), vec2(-1.0, 0.4), vec2(1.0, 0.6), vec2(1.0, 0.6), vec2(1.0, 0.4), vec2(-1.0, 0.4),
        vec2(-1.0, 0.2), vec2(-1.0, 0.0), vec2(1.0, 0.2), vec2(1.0, 0.2), vec2(1.0, 0.0), vec2(-1.0, 0.0),
        vec2(-1.0, -0.2), vec2(-1.0, -0.4), vec2(1.0, -0.2), vec2(1.0, -0.2), vec2(1.0, -0.4), vec2(-1.0, -0.4)
    ];

    carOne = [
        vec2(-1.0, 0.6), vec2(-1.0, 0.5), vec2(-0.8, 0.6),
        vec2(-0.8, 0.6), vec2(-0.8, 0.5), vec2(-1.0, 0.5)
    ];
    carTwo = [
        vec2(1.0, 0.5), vec2(1.0, 0.4), vec2(0.8, 0.5),
        vec2(0.8, 0.5), vec2(0.8, 0.4), vec2(1.0, 0.4)
    ];
    carThree = [
        vec2(1.0, 0.2), vec2(1.0, 0.1), vec2(0.8, 0.2),
        vec2(0.8, 0.2), vec2(0.8, 0.1), vec2(1.0, 0.1)
    ];
    carFour = [
        vec2(1.0, 0.1), vec2(1.0, 0.0), vec2(0.8, 0.1),
        vec2(0.8, 0.1), vec2(0.8, 0.0), vec2(1.0, 0.0)
    ];
    carFive = [
        vec2(-1.0, -0.2), vec2(-1.0, -0.3), vec2(-0.8, -0.2),
        vec2(-0.8, -0.2), vec2(-0.8, -0.3), vec2(-1.0, -0.3)
    ];
    carSix = [
        vec2(1.0, -0.3), vec2(1.0, -0.4), vec2(0.8, -0.3),
        vec2(0.8, -0.3), vec2(0.8, -0.4), vec2(1.0, -0.4)
    ];
    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 0.5, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    bufferFrog = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferFrog);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(frog), gl.STATIC_DRAW);

    bufferCarOne = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarOne);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(carOne), gl.STATIC_DRAW);

    bufferCarTwo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarTwo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(carTwo), gl.STATIC_DRAW);

    bufferCarThree = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarThree);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(carThree), gl.STATIC_DRAW);

    bufferCarFour = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarFour);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(carFour), gl.STATIC_DRAW);

    bufferCarFive = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarFive);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(carFive), gl.STATIC_DRAW);

    bufferCarSix = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarSix);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(carSix), gl.STATIC_DRAW);

    bufferLanes = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferLanes);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(lanes), gl.STATIC_DRAW);
    // Associate out shader variables with our data buffer

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    colorLoc = gl.getUniformLocation(program, "fColor");


    //FROSKA-HREYFINGAR    
    window.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 37:	// vinstri ör
                frog[0][0] -= 0.04
                frog[1][0] -= 0.04
                frog[2][0] -= 0.04
                break;
            case 39:	// hægri ör
                frog[0][0] += 0.04
                frog[1][0] += 0.04
                frog[2][0] += 0.04
                break;
            case 38:	// upp ör
                if (frogUp) {
                    frog[0][1] += 0.04
                } else {
                    frog[0][1] += 0.16
                }
                frog[1][1] += 0.04
                frog[2][1] += 0.04
                frogUp = true;
                break;
            case 40:	// niður ör
                if (!frogUp) {
                    frog[0][1] -= 0.04
                } else {
                    frog[0][1] -= 0.16
                }
                frog[1][1] -= 0.04
                frog[2][1] -= 0.04
                frogUp = false;
                break;
            default:
                console.log("Arrow Keys")
        }

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(frog));
    });

    render();
};



function render() {

    gl.clear(gl.COLOR_BUFFER_BIT);

    window.requestAnimFrame(render);


    document.getElementById("score").textContent = score;

    //VEGIR
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferLanes);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLoc, flatten(vec4(1.0, 0.8, 0.0, 1.0)));
    gl.drawArrays(gl.TRIANGLES, 0, 18);


    //LÁTA BÍLA SKOPPA AF VEGGJUM
    bounce();

    //STIGAGJÖF
    checkScored();

    //ÁREKSTRAR
    collision();

    //TEIKNA BÍLA
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarOne);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(carOne), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLoc, flatten(vec4(1.0, 0.0, 0.0, 1.0)));
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarTwo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(carTwo), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLoc, flatten(vec4(0.0, 0.0, 1.0, 1.0)));
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarThree);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(carThree), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLoc, flatten(vec4(0.5, 0.5, 0.5, 1.0)));
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarFour);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(carFour), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLoc, flatten(vec4(0.3, 0.2, 0.2, 1.0)));
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarFive);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(carFive), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLoc, flatten(vec4(0.0, 0.7, 1.0, 1.0)));
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarSix);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(carSix), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLoc, flatten(vec4(1.0, 0.7, 1.0, 1.0)));
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    //TEIKNA FROSK
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferFrog);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLoc, flatten(vec4(0.0, 1.0, 0.0, 1.0)));
    gl.drawArrays(gl.TRIANGLES, 0, 3);


}

//FALL SEM FÆRIR BÍLA OG PASSAR AÐ ÞEIR SNÚI VIÐ EF ÞEIR ERU AÐ FARA ÚTAF RAMMANUM
function bounce() {
    if ((Math.abs(carOne[0][0]) > maxX) || (Math.abs(carOne[2][0]) > maxX)) carOneSpeed = -carOneSpeed;
    for (let i = 0; i < 6; i++) {
        carOne[i][0] += carOneSpeed;
    }

    if ((Math.abs(carTwo[0][0]) > maxX) || (Math.abs(carTwo[2][0]) > maxX)) carTwoSpeed = -carTwoSpeed;
    for (let i = 0; i < 6; i++) {
        carTwo[i][0] += carTwoSpeed;
    }

    if ((Math.abs(carThree[0][0]) > maxX) || (Math.abs(carThree[2][0]) > maxX)) carThreeSpeed = -carThreeSpeed;
    for (let i = 0; i < 6; i++) {
        carThree[i][0] += carThreeSpeed;
    }

    if ((Math.abs(carFour[0][0]) > maxX) || (Math.abs(carFour[2][0]) > maxX)) carFourSpeed = -carFourSpeed;
    for (let i = 0; i < 6; i++) {
        carFour[i][0] += carFourSpeed;
    }

    if ((Math.abs(carFive[0][0]) > maxX) || (Math.abs(carFive[2][0]) > maxX)) carFiveSpeed = -carFiveSpeed;
    for (let i = 0; i < 6; i++) {
        carFive[i][0] += carFiveSpeed;
    }
    if ((Math.abs(carSix[0][0]) > maxX) || (Math.abs(carSix[2][0]) > maxX)) carSixSpeed = -carSixSpeed;
    for (let i = 0; i < 6; i++) {
        carSix[i][0] += carSixSpeed;
    }
}

//FALL SEM SÉR UM STIGAGJÖF
function checkScored() {
    if (frog[1][1] > 0.6 && !reachedTop && !scoreInc) {
        score++;
        scoreInc = true;
        reachedTop = true;
    } else if (frog[1][1] < -0.4 && reachedTop && !scoreInc) {
        score++;
        scoreInc = true;
        reachedTop = false;
    } else if (frog[1][1] < 0.6 && reachedTop) {
        scoreInc = false;
    } else if (frog[1][1] > -0.4 && !reachedTop) {
        scoreInc = false;
    }
}

//FALL SEM SÉR UM ÁREKSTRA
function collision() {
    if ((frog[0][0] > carOne[0][0] && frog[0][0] < carOne[3][0]) &&
        frog[0][1] < carOne[0][1] && frog[1][1] > carOne[1][1]) {
        location.reload()
    }
    else if ((frog[0][0] < carTwo[0][0] && frog[0][0] > carTwo[3][0]) &&
        frog[0][1] < carTwo[0][1] && frog[1][1] > carTwo[1][1]) {
        location.reload()
    } else if ((frog[0][0] < carThree[0][0] && frog[0][0] > carThree[3][0]) &&
        frog[0][1] < carThree[0][1] && frog[1][1] > carThree[1][1]) {
        location.reload()
    } else if ((frog[0][0] < carFour[0][0] && frog[0][0] > carFour[3][0]) &&
        frog[0][1] < carFour[0][1] && frog[1][1] > carFour[1][1]) {
        location.reload()
    } else if ((frog[0][0] > carFive[0][0] && frog[0][0] < carFive[3][0]) &&
        frog[0][1] < carFive[0][1] && frog[1][1] > carFive[1][1]) {
        location.reload()
    } else if ((frog[0][0] < carSix[0][0] && frog[0][0] > carSix[3][0]) &&
        frog[0][1] < carSix[0][1] && frog[1][1] > carSix[1][1]) {
        location.reload()
    }
}