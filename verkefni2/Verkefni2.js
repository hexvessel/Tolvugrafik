var canvas; 
var gl;

var vBuffer;

var NumBody = 6;
var NumPecs = 3;
var NumTail = 3;

var vertices = [
    // líkami
    vec4( -0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.2,  0.2, 0.0, 1.0 ),
	vec4(  0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.2, -0.15, 0.0, 1.0 ),
	vec4( -0.5,  0.0, 0.0, 1.0 ),
    //uggar
    vec4( 0.2, 0.0, 0.0, 1.0),
    vec4( 0.1, 0.0, 0.1, 1.0),
    vec4( 0.0, 0.0, 0.0, 1.0),
    vec4( 0.2, 0.0, 0.0, 1.0),
    vec4( 0.1, 0.0, -0.1, 1.0),
    vec4( 0.0, 0.0, 0.0, 1.0),
	// sporður
    vec4( -0.5,  0.0, 0.0, 1.0 ),
    vec4( -0.65,  0.15, 0.0, 1.0 ),
    vec4( -0.65, -0.15, 0.0, 1.0 )
];
var vertices2 = [
    // líkami
    vec4( -0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.2,  0.2, 0.0, 1.0 ),
	vec4(  0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.2, -0.15, 0.0, 1.0 ),
	vec4( -0.5,  0.0, 0.0, 1.0 ),
    //uggar
    vec4( 0.2, 0.0, 0.0, 1.0),
    vec4( 0.1, 0.0, 0.1, 1.0),
    vec4( 0.0, 0.0, 0.0, 1.0),
    vec4( 0.2, 0.0, 0.0, 1.0),
    vec4( 0.1, 0.0, -0.1, 1.0),
    vec4( 0.0, 0.0, 0.0, 1.0),
	// sporður
    vec4( -0.34,  0.0, 0.0, 1.0 ),
    vec4( -0.65,  0.15, 0.0, 1.0 ),
    vec4( -0.65, -0.15, 0.0, 1.0 )
];

var movement = false; 
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var rotTail = 0.0;
var incTail = 2.0;

var zView = 2.0;          

var proLoc;
var mvLoc;
var colorLoc;

var fish_pos_1 = vec3(Math.random(),Math.random(),Math.random());
var fish_col_1 = vec4(Math.random(),Math.random(),Math.random(),1.0);
var fish_speed_1 = Math.random()*0.002;
var fish_dir_1 = vec3(fish_speed_1,fish_speed_1,fish_speed_1);

var fish_pos_2 = vec3(Math.random(),Math.random(),Math.random());
var fish_col_2 = vec4(Math.random(),Math.random(),Math.random(),1.0);
var fish_speed_2 = Math.random()*0.002;
var fish_dir_2 = vec3(fish_speed_2,fish_speed_2,fish_speed_2);

var fish_pos_3 = vec3(Math.random(),Math.random(),Math.random());
var fish_col_3 = vec4(Math.random(),Math.random(),Math.random(),1.0);
var fish_speed_3 = Math.random()*0.002;
var fish_dir_3 = vec3(fish_speed_3,fish_speed_3,fish_speed_3);

var fish_pos_4 = vec3(Math.random(),Math.random(),Math.random());
var fish_col_4 = vec4(Math.random(),Math.random(),Math.random(),1.0);
var fish_speed_4 = Math.random()*0.002;
var fish_dir_4 = vec3(fish_speed_4,fish_speed_4,fish_speed_4);

var fish_pos_5 = vec3(Math.random(),Math.random(),Math.random());
var fish_col_5 = vec4(Math.random(),Math.random(),Math.random(),1.0);
var fish_speed_5 = Math.random()*0.002;
var fish_dir_5 = vec3(fish_speed_5,fish_speed_5,fish_speed_5);

var fish_pos_6 = vec3(Math.random(),Math.random(),Math.random());
var fish_col_6 = vec4(Math.random(),Math.random(),Math.random(),1.0);
var fish_speed_6 = Math.random()*0.002;
var fish_dir_6 = vec3(fish_speed_6,fish_speed_6,fish_speed_6);

var fish_pos_7 = vec3(Math.random(),Math.random(),Math.random());
var fish_col_7 = vec4(Math.random(),Math.random(),Math.random(),1.0);
var fish_speed_7 = Math.random()*0.002;
var fish_dir_7 = vec3(fish_speed_7,fish_speed_7,fish_speed_7);

var fish_pos_8 = vec3(Math.random(),Math.random(),Math.random());
var fish_col_8 = vec4(Math.random(),Math.random(),Math.random(),1.0);
var fish_speed_8 = Math.random()*0.002;
var fish_dir_8 = vec3(fish_speed_8,fish_speed_8,fish_speed_8);

var fish_pos_9 = vec3(Math.random(),Math.random(),Math.random());
var fish_col_9 = vec4(Math.random(),Math.random(),Math.random(),1.0);
var fish_speed_9 = Math.random()*0.002;
var fish_dir_9 = vec3(fish_speed_9,fish_speed_9,fish_speed_9);

var fish_pos_10 = vec3(Math.random(),Math.random(),Math.random());
var fish_col_10 = vec4(Math.random(),Math.random(),Math.random(),1.0);
var fish_speed_10 = Math.random()*0.002;
var fish_dir_10 = vec3(fish_speed_10,fish_speed_10,fish_speed_10);

window.onload = function init() 
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.95, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "fColor" );

    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );

    var proj = perspective( 90.0, 1.0, 0.1, 100.0 );
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));

     canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY += (e.offsetX - origX) % 360;
            spinX += (e.offsetY - origY) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );
    
     window.addEventListener("keydown", function(e){
         switch( e.keyCode ) {
            case 38:
                zView += 0.2;
                break;
            case 40:
                zView -= 0.2;
                break;
         }
     }  );  

     window.addEventListener("mousewheel", function(e){
         if( e.wheelDelta > 0.0 ) {
             zView += 0.2;
         } else {
             zView -= 0.2;
         }
     }  );  
    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mv = lookAt( vec3(0.0, 0.0, zView), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );
    mv = mult( mv, rotateX(spinX) );
    mv = mult( mv, rotateY(spinY) );

    rotTail += incTail;
    if( rotTail > 35.0  || rotTail < -35.0 )
        incTail *= -1;
    
    if (fish_pos_1[0] < -1.0 || fish_pos_1[0] > 1.0){
        fish_dir_1 = mult(fish_dir_1, vec3(-1.0,1.0,1.0))
    }
    if (fish_pos_1[1] < -1.0 || fish_pos_1[1] > 1.0){
        fish_dir_1 = mult(fish_dir_1, vec3(1.0,-1.0,1.0))
    }
    if(fish_pos_1[2] < -1.0 || fish_pos_1[2] > 1.0){
        fish_dir_1 = mult(fish_dir_1, vec3(1.0,1.0,-1.0))
    }
    
    fish_pos_1 = subtract(fish_pos_1, fish_dir_1);
    
	fish(mv, fish_pos_1, fish_col_1);

    if (fish_pos_2[0] < -1.0 || fish_pos_2[0] > 1.0){
        fish_dir_2 = mult(fish_dir_2, vec3(-1.0,1.0,1.0))
    }
    if (fish_pos_2[1] < -1.0 || fish_pos_2[1] > 1.0){
        fish_dir_2 = mult(fish_dir_2, vec3(1.0,-1.0,1.0))
    }
    if(fish_pos_2[2] < -1.0 || fish_pos_2[2] > 1.0){
        fish_dir_2 = mult(fish_dir_2, vec3(1.0,1.0,-1.0))
    }
    
    fish_pos_2 = subtract(fish_pos_2, fish_dir_2);
    
	fish(mv, fish_pos_2, fish_col_2);

    if (fish_pos_3[0] < -1.0 || fish_pos_3[0] > 1.0){
        fish_dir_3 = mult(fish_dir_3, vec3(-1.0,1.0,1.0))
    }
    if (fish_pos_3[1] < -1.0 || fish_pos_3[1] > 1.0){
        fish_dir_3 = mult(fish_dir_3, vec3(1.0,-1.0,1.0))
    }
    if(fish_pos_3[2] < -1.0 || fish_pos_3[2] > 1.0){
        fish_dir_3 = mult(fish_dir_3, vec3(1.0,1.0,-1.0))
    }
    
    fish_pos_3 = subtract(fish_pos_3, fish_dir_3);
    
	fish(mv, fish_pos_3, fish_col_3);
    
    if (fish_pos_4[0] < -1.0 || fish_pos_4[0] > 1.0){
        fish_dir_4 = mult(fish_dir_4, vec3(-1.0,1.0,1.0))
    }
    if (fish_pos_4[1] < -1.0 || fish_pos_4[1] > 1.0){
        fish_dir_4 = mult(fish_dir_4, vec3(1.0,-1.0,1.0))
    }
    if(fish_pos_4[2] < -1.0 || fish_pos_4[2] > 1.0){
        fish_dir_4 = mult(fish_dir_4, vec3(1.0,1.0,-1.0))
    }
    
    fish_pos_4 = subtract(fish_pos_4, fish_dir_4);
    
	fish(mv, fish_pos_4, fish_col_4);

    if (fish_pos_5[0] < -1.0 || fish_pos_5[0] > 1.0){
        fish_dir_5 = mult(fish_dir_5, vec3(-1.0,1.0,1.0))
    }
    if (fish_pos_5[1] < -1.0 || fish_pos_5[1] > 1.0){
        fish_dir_5 = mult(fish_dir_5, vec3(1.0,-1.0,1.0))
    }
    if(fish_pos_5[2] < -1.0 || fish_pos_5[2] > 1.0){
        fish_dir_5 = mult(fish_dir_5, vec3(1.0,1.0,-1.0))
    }
    
    fish_pos_5 = subtract(fish_pos_5, fish_dir_5);
    
	fish(mv, fish_pos_5, fish_col_5);

    if (fish_pos_6[0] < -1.0 || fish_pos_6[0] > 1.0){
        fish_dir_6 = mult(fish_dir_6, vec3(-1.0,1.0,1.0))
    }
    if (fish_pos_6[1] < -1.0 || fish_pos_6[1] > 1.0){
        fish_dir_6 = mult(fish_dir_6, vec3(1.0,-1.0,1.0))
    }
    if(fish_pos_6[2] < -1.0 || fish_pos_6[2] > 1.0){
        fish_dir_6 = mult(fish_dir_6, vec3(1.0,1.0,-1.0))
    }
    
    fish_pos_6 = subtract(fish_pos_6, fish_dir_6);
    
	fish(mv, fish_pos_6, fish_col_6);

    if (fish_pos_7[0] < -1.0 || fish_pos_7[0] > 1.0){
        fish_dir_7 = mult(fish_dir_7, vec3(-1.0,1.0,1.0))
    }
    if (fish_pos_7[1] < -1.0 || fish_pos_7[1] > 1.0){
        fish_dir_7 = mult(fish_dir_7, vec3(1.0,-1.0,1.0))
    }
    if(fish_pos_7[2] < -1.0 || fish_pos_7[2] > 1.0){
        fish_dir_7 = mult(fish_dir_7, vec3(1.0,1.0,-1.0))
    }
    
    fish_pos_7 = subtract(fish_pos_7, fish_dir_7);
    
	fish(mv, fish_pos_7, fish_col_7);

    if (fish_pos_8[0] < -1.0 || fish_pos_8[0] > 1.0){
        fish_dir_8 = mult(fish_dir_8, vec3(-1.0,1.0,1.0))
    }
    if (fish_pos_8[1] < -1.0 || fish_pos_8[1] > 1.0){
        fish_dir_8 = mult(fish_dir_8, vec3(1.0,-1.0,1.0))
    }
    if(fish_pos_8[2] < -1.0 || fish_pos_8[2] > 1.0){
        fish_dir_8 = mult(fish_dir_8, vec3(1.0,1.0,-1.0))
    }
    
    fish_pos_8 = subtract(fish_pos_8, fish_dir_8);
    
	fish(mv, fish_pos_8, fish_col_8);

    if (fish_pos_9[0] < -1.0 || fish_pos_9[0] > 1.0){
        fish_dir_9 = mult(fish_dir_9, vec3(-1.0,1.0,1.0))
    }
    if (fish_pos_9[1] < -1.0 || fish_pos_9[1] > 1.0){
        fish_dir_9 = mult(fish_dir_9, vec3(1.0,-1.0,1.0))
    }
    if(fish_pos_9[2] < -1.0 || fish_pos_9[2] > 1.0){
        fish_dir_9 = mult(fish_dir_9, vec3(1.0,1.0,-1.0))
    }
    
    fish_pos_9 = subtract(fish_pos_9, fish_dir_9);
    
	fish(mv, fish_pos_9, fish_col_9);

    if (fish_pos_10[0] < -1.0 || fish_pos_10[0] > 1.0){
        fish_dir_10 = mult(fish_dir_10, vec3(-1.0,1.0,1.0))
    }
    if (fish_pos_10[1] < -1.0 || fish_pos_10[1] > 1.0){
        fish_dir_10 = mult(fish_dir_10, vec3(1.0,-1.0,1.0))
    }
    if(fish_pos_10[2] < -1.0 || fish_pos_10[2] > 1.0){
        fish_dir_10 = mult(fish_dir_10, vec3(1.0,1.0,-1.0))
    }
    
    fish_pos_10 = subtract(fish_pos_10, fish_dir_10);
    
	fish(mv, fish_pos_10, fish_col_10);

    requestAnimFrame( render );
}

function fish(mv, pos, color){
    
    gl.uniform4fv( colorLoc, color );

    //mv = mult(mv, rotateX( -360*Math.atan(pos[2], pos[1])));
    mv = mult(mv, rotateY( 360*Math.atan(pos[2], pos[0])));
    //mv = mult(mv, rotateZ( -360*Math.atan(pos[1], pos[0])));

    mv = mult(mv, translate(pos));
    mv = mult(mv, scalem(0.2,0.2,0.2));

    var mv1 = mv;
    var mv2 = mv;

	// Líkami
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, NumBody );
    
    //Uggar
    mv = mult( mv, translate ( 0.0, -Math.random()*0.1, 0.0 ) );
    mv = mult( mv, rotateZ( -rotTail ) );
	mv = mult( mv, translate ( 0.0, Math.random()*0.1, 0.0 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, NumBody, NumPecs );

    mv2 = mult( mv2, translate ( 0.0, -Math.random()*0.1, 0.0 ) );
    mv2 = mult( mv2, rotateZ( rotTail ) );
	mv2 = mult( mv2, translate ( 0.0, -Math.random()*0.1, 0.0 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv2));
    gl.drawArrays( gl.TRIANGLES, NumBody+NumPecs, NumPecs );

    // Sporður
	mv1 = mult( mv1, translate ( -0.5, 0.0, 0.0 ) );
    mv1 = mult( mv1, rotateY( rotTail ) );
	mv1 = mult( mv1, translate ( 0.5, 0.0, 0.0 ) );
	
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, NumPecs+NumPecs+NumBody, NumTail );

}