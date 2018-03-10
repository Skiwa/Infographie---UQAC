var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 6;

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
        vec2(-1,-1),
        vec2(-1,1),
        vec2(1,1),
		    vec2(1,-1)
    ];

    divideSquare( vertices[0], vertices[1], vertices[2], vertices[3],
                    NumTimesToSubdivide);

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
    gl.vertexAttribPointer( vPositionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPositionLoc );

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

        /*console.log("ab1 = "+ab1);
        console.log("ab1 = "+ab2);

        console.log("bc1 = "+bc1);
        console.log("bc2 = "+bc2);

        console.log("cd1 = "+cd1);
        console.log("cd2 = "+cd2);

        console.log("da1 = "+da1);
        console.log("da2 = "+da2);
        */
        count--;

        var o1=vec2(bc1[0],ab1[1]);
        var o2=vec2(bc1[0],ab2[1]);

        var o3=vec2(bc2[0],cd1[1]);
        var o4=vec2(bc2[0],cd2[1]);


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


    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );

}
