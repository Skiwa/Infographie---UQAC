//Julien Haegman HAEJ09129709

//Question b i.   Theta est l'angle de rotation, on trouve son sin et cos pour l'ajouter dans la matrice.
//                thetaLoc reference la position de la variable theta, elle permet une interaction entre les fichiers.

//Question b ii.  gl.uniform3fv permet d'envoyer un vecteur (ici theta) dans le shader.
//                On précise sa position (ici thetaLoc).
//

var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var solidcolors = [];
var shadedcolors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axisR = 0;
var axisT = 0;
var axisE = 0;

var theta = [ 0, 0, 0 ];
var vDisplacement = [ 0, 0, 0];
var vScale = [ 1, 1, 1];

var vitesseRotation=0;
var vitesseTranslation=0;
var vitesseExpension=0;

var thetaLoc;
var vDisplacementLoc;
var vScaleLoc;

var vColorLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var solidcolorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, solidcolorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(solidcolors), gl.STATIC_DRAW);

    vColorLoc = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColorLoc );


    var shadedcolorsBuffer = gl.createBuffer();


    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");
    vDisplacementLoc = gl.getUniformLocation(program, "vDisplacement");
    vScaleLoc = gl.getUniformLocation(program, "vScale");


    //event listeners for buttons

    document.getElementById( "xRotate" ).onclick = function () {
        axisR = xAxis;
        vitesseRotation+=0.1;};
    document.getElementById( "xRotateNeg" ).onclick = function () {
        axisR = xAxis;
        vitesseRotation-=0.1;};
    document.getElementById( "yRotate" ).onclick = function () {
        axisR = yAxis;
        vitesseRotation+=0.1;};
    document.getElementById( "yRotateNeg" ).onclick = function () {
        axisR = yAxis;
        vitesseRotation-=0.1;};
    document.getElementById( "zRotate" ).onclick = function () {
        axisR = zAxis;
        vitesseRotation+=0.1;};
    document.getElementById( "zRotateNeg" ).onclick = function () {
        axisR = zAxis;
        vitesseRotation-=0.1;};


    document.getElementById( "xTranslate" ).onclick = function () {
        axisT = xAxis;
        vitesseTranslation+=0.001;
    };
    document.getElementById( "xTranslateNeg" ).onclick = function () {
        axisT = xAxis;
        vitesseTranslation-=0.001;
    };
    document.getElementById( "yTranslate" ).onclick = function () {
        axisT = yAxis;
        vitesseTranslation+=0.001;
    };
    document.getElementById( "yTranslateNeg" ).onclick = function () {
        axisT = yAxis;
        vitesseTranslation-=0.001;
    };
    document.getElementById( "zTranslate" ).onclick = function () {
        axisT = zAxis;
        vitesseTranslation+=0.001;
    };
    document.getElementById( "zTranslateNeg" ).onclick = function () {
        axisT = zAxis;
        vitesseTranslation-=0.001;
    };


    document.getElementById( "xExpand" ).onclick = function () {
        axisE = xAxis;
        vitesseExpension+=0.001;
    };
    document.getElementById( "xExpandNeg" ).onclick = function () {
        axisE = xAxis;
        vitesseExpension-=0.001;
    };
    document.getElementById( "yExpand" ).onclick = function () {
        axisE = yAxis;
        vitesseExpension+=0.001;
    };
    document.getElementById( "yExpandNeg" ).onclick = function () {
        axisE = yAxis;
        vitesseExpension-=0.001;
    };
    document.getElementById( "zExpand" ).onclick = function () {
        axisE = zAxis;
        vitesseExpension+=0.001;
    };
    document.getElementById( "zExpandNeg" ).onclick = function () {
        axisE = zAxis;
        vitesseExpension-=0.001;
    };


    document.getElementById("ShadedButton").onclick = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, shadedcolorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(shadedcolors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColorLoc);
    };
    document.getElementById("SolidButton").onclick = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, solidcolorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(solidcolors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColorLoc);
    };

    render();
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d)
{
    var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.8, 0.8, 0.8, 1.0 ],  // gray
        [ 0.0, 1.0, 1.0, 1.0 ]   // cyan
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );

            // for solid colored faces use
            solidcolors.push(vertexColors[a]);

            // for shaded colored faces use
            shadedcolors.push(vertexColors[indices[i]]);
    }

}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //expension=vScale
    //translation=vDisplacement
    theta[axisR] += vitesseRotation;
    vDisplacement[axisT] +=vitesseTranslation;
    vScale[axisE] += vitesseExpension;
    gl.uniform3fv(thetaLoc, theta);

    //cube base
    gl.uniform3fv(vDisplacementLoc, vDisplacement);
    gl.uniform3fv(vScaleLoc, vScale);


    //cube1
    var vScale2=[vScale[0]/4,vScale[1]/4,vScale[2]/4];
    var vDisplacement2=[vDisplacement[0]-vScale[0]/2,vDisplacement[1]-vScale[1]/2,vDisplacement[1]];
    gl.uniform3fv(vScaleLoc, vScale2);
    gl.uniform3fv(vDisplacementLoc, vDisplacement2);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    //cube2
    var vScale2=[vScale[0]/4,vScale[1]/4,vScale[2]/4];
    var vDisplacement2=[vDisplacement[0]-vScale[0]/2,vDisplacement[1]+vScale[1]/2,vDisplacement[1]];
    gl.uniform3fv(vScaleLoc, vScale2);
    gl.uniform3fv(vDisplacementLoc, vDisplacement2);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    //cube3
    var vScale2=[vScale[0]/4,vScale[1]/4,vScale[2]/4];
    var vDisplacement2=[vDisplacement[0]+vScale[0]/2,vDisplacement[1]+vScale[1]/2,vDisplacement[1]];
    gl.uniform3fv(vScaleLoc, vScale2);
    gl.uniform3fv(vDisplacementLoc, vDisplacement2);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    //cube4
    var vScale2=[vScale[0]/4,vScale[1]/4,vScale[2]/4];
    var vDisplacement2=[vDisplacement[0]+vScale[0]/2,vDisplacement[1]-vScale[1]/2,vDisplacement[1]];
    gl.uniform3fv(vScaleLoc, vScale2);
    gl.uniform3fv(vDisplacementLoc, vDisplacement2);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );





    //rectangles
    //rec1
    var vScale2=[vScale[0],vScale[1]/8,vScale[2]/8];
    var vDisplacement2=[vDisplacement[0],vDisplacement[1]-vScale[1]/2,vDisplacement[1]];
    gl.uniform3fv(vScaleLoc, vScale2);
    gl.uniform3fv(vDisplacementLoc, vDisplacement2);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    //rec2
    var vScale2=[vScale[0]/8,vScale[1],vScale[2]/8];
    var vDisplacement2=[vDisplacement[0]-vScale[0]/2,vDisplacement[1],vDisplacement[1]];
    gl.uniform3fv(vScaleLoc, vScale2);
    gl.uniform3fv(vDisplacementLoc, vDisplacement2);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    //rec3
    var vScale2=[vScale[0],vScale[1]/8,vScale[2]/8];
    var vDisplacement2=[vDisplacement[0],vDisplacement[1]+vScale[1]/2,vDisplacement[1]];
    gl.uniform3fv(vScaleLoc, vScale2);
    gl.uniform3fv(vDisplacementLoc, vDisplacement2);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    //rec4
    var vScale2=[vScale[0]/8,vScale[1],vScale[2]/8];
    var vDisplacement2=[vDisplacement[0]+vScale[0]/2,vDisplacement[1],vDisplacement[1]];
    gl.uniform3fv(vScaleLoc, vScale2);
    gl.uniform3fv(vDisplacementLoc, vDisplacement2);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );








    requestAnimFrame( render );
}
