
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    // Three Vertices
    
    var vertices1 = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    var vertices2 = [
        vec2( -0.25, -0.5 ),
        vec2(  0.5,  0.5 ),
        vec2(  0.75, -0.5 )
    ];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // locate vPosition in the shaders

    var vPositionLoc = gl.getAttribLocation(program, "vPosition");

    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices1), gl.STATIC_DRAW);

    // Now render

    gl.enableVertexAttribArray(vPositionLoc);  // activate vertex array for vPosition

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);  // select buffer to be used
    gl.vertexAttribPointer(vPositionLoc, 2, gl.FLOAT, false, 0, 0);  // define data format

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    // Load new data in buffer (defined by the last bind)

    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW );

    gl.drawArrays( gl.TRIANGLES, 0, 3 );

};

