var canvas;
var gl;

var colorLoc;

var points = [];

var NumTimesToSubdivide = 4;
var BaseColors = [
     vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
     vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
     vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
     vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
     vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
     vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
     vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
     vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
 ];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }



    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec3(-0.5,-0.5,-0.5),
        vec3(-0.5,0.5,-0.5),
        vec3(0.5,0.5,-0.5),
		    vec3(0.5,-0.5,-0.5),
        vec3(-0.5,-0.5,0.5),
        vec3(-0.5,0.5,0.5),
        vec3(0.5,0.5,0.5),
        vec3(0.5,-0.5,0.5),
    ];


// face
divideSquare( vertices[0], vertices[1], vertices[2], vertices[3],NumTimesToSubdivide);
// gauche
divideSquare( vertices[0], vertices[1], vertices[5], vertices[4],NumTimesToSubdivide);
// arriere
divideSquare( vertices[4], vertices[5], vertices[6], vertices[7],NumTimesToSubdivide);
// droite
divideSquare( vertices[3], vertices[2], vertices[6], vertices[7],NumTimesToSubdivide);
// dessous
divideSquare( vertices[0], vertices[4], vertices[7], vertices[3],NumTimesToSubdivide);
// dessus
divideSquare( vertices[1], vertices[5], vertices[6], vertices[2],NumTimesToSubdivide);

    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPositionLoc = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPositionLoc, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPositionLoc );

    colorLoc = gl.getUniformLocation( program, "color" );

    gl.enable(gl.DEPTH_TEST)


    //code copié
    var pMatrix = ortho(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);
    var projectionLoc = gl.getUniformLocation(program, "projection");
    gl.uniformMatrix4fv(projectionLoc, false, flatten(pMatrix));
    //

    render();
};

function triangle( a, b, c)
{
    points.push( a, b, c);
}

function divideSquare( a, b, c, d, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        triangle( a, b, c);
		    triangle( a, d, c);
    }
    else {


        //milieux des droites du carré sup
        var ab1 = mix( a, b, 2/3);
        var ab2 = mix( a, b, 1/3);

        var bc1 = mix( b, c, 2/3);
        var bc2 = mix( b, c, 1/3);

        var cd1 = mix( c, d, 2/3);
        var cd2 = mix( c, d, 1/3);

        var da1 = mix( d, a, 2/3);
        var da2 = mix( d, a, 1/3);

        count--;


        // var o1=vec2(bc1[0],ab1[1]);
        // var o2=vec2(bc1[0],ab2[1]);
        // var o3=vec2(bc2[0],cd1[1]);
        // var o4=vec2(bc2[0],cd2[1]);



        var o1 = mix( ab1, cd2, 2/3);
        var o3 = mix( ab2, cd1, 1/3);
        var o2 = mix( ab2, cd1, 2/3);
        var o4 = mix( ab1, cd2, 1/3);

        // var o1=vec2(-0.6667,-0.33333);
        // var o2=vec2(-0.66,0);
        // var o3=vec2(-0.3333,-0.15);
        // var o4=vec2(-0.3333,-0.5);

        //
        // console.log("o1 = "+o1);
        // console.log("o2 = "+o2);
        // console.log("o3 = "+o3);
        // console.log("o4 = "+o4);

    divideSquare( a   , ab1 , o1  , da2 , count);
		divideSquare( ab1 , ab2 , o2  , o1  , count);
		divideSquare( ab2 , b   , bc1 , o2  , count);
		divideSquare( o2  , bc1 , bc2 , o3  , count);
		divideSquare( o3  , bc2 , c   , cd1 , count);
		divideSquare( o4  , o3  , cd1 , cd2 , count);
		divideSquare( da1 , o4  , cd2 , d   , count);
		divideSquare( da2 , o1  , o4  , da1 , count);
    }
}

function render()
{



  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

  gl.uniform4fv(colorLoc, flatten(BaseColors[0]));
  gl.drawArrays( gl.TRIANGLES, 0, points.length/6 );

  gl.uniform4fv(colorLoc, flatten(BaseColors[1]));
  gl.drawArrays( gl.TRIANGLES, points.length/6, points.length/6 );

  gl.uniform4fv(colorLoc, flatten(BaseColors[2]));
  gl.drawArrays( gl.TRIANGLES, 2*points.length/6, points.length/6 );

  gl.uniform4fv(colorLoc, flatten(BaseColors[3]));
  gl.drawArrays( gl.TRIANGLES, 3*points.length/6, points.length/6 );

  gl.uniform4fv(colorLoc, flatten(BaseColors[4]));
  gl.drawArrays( gl.TRIANGLES, 4*points.length/6, points.length/6 );

  gl.uniform4fv(colorLoc, flatten(BaseColors[5]));
  gl.drawArrays( gl.TRIANGLES, 5*points.length/6, points.length/6 );
}
