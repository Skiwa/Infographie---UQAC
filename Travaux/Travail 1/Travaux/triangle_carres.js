
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );	//init canvas
    
    gl = WebGLUtils.setupWebGL( canvas );					//assoc canvas
    if ( !gl ) { alert( "WebGL isn't available" ); }		//exception

    
    // Three Vertices
    
    var vertices = [					//Carres w/ triangles				
        vec2( -1, -1 ),
        vec2(  -1,  1 ),
		vec2(1,-1),
		vec2(1,-1),
        vec2( 1, 1 ),
		vec2(-1,1)
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
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Now render
    
    gl.enableVertexAttribArray(vPositionLoc);  // activate vertex array for vPositionLoc

    //    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId); // select buffer to be used
    // The previous line is not necessary because the correct buffer is already selected

    gl.vertexAttribPointer(vPositionLoc, 2, gl.FLOAT, false, 0, 0);  // define data format

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 6 );
}
