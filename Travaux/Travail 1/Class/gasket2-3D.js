
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
      vec3(  0.0000,  0.0000, -1.0000 ),
      vec3(  0.0000,  0.9428,  0.3333 ),  
      vec3( -0.8165, -0.4714,  0.3333 ),
      vec3(  0.8165, -0.4714,  0.3333 )    

      ];


    divideTriangle( vertices[0], vertices[1], vertices[3],
                    NumTimesToSubdivide);
    divideTriangle( vertices[0], vertices[2], vertices[1],
                    NumTimesToSubdivide);
    divideTriangle( vertices[0], vertices[3], vertices[2],
                    NumTimesToSubdivide);
    divideTriangle( vertices[1], vertices[3], vertices[2],
                    NumTimesToSubdivide);
    //
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

    render();
};

function triangle( a, b, c )
{
    points.push( a, b, c );
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	
    gl.uniform4fv(colorLoc, flatten(BaseColors[4]));
    gl.drawArrays( gl.TRIANGLES, 0, points.length/4 );

    gl.uniform4fv(colorLoc, flatten(BaseColors[1]));
    gl.drawArrays( gl.TRIANGLES, points.length/4, points.length/4 );
	
    gl.uniform4fv(colorLoc, flatten(BaseColors[0]));
    gl.drawArrays( gl.TRIANGLES, 2*points.length/4, points.length/4 );
	
	gl.uniform4fv(colorLoc, flatten(BaseColors[3]));
    gl.drawArrays( gl.TRIANGLES, 3*points.length/4, points.length/4 );
}