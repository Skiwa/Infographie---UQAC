
var canvas;
var gl;
var display;

var NumVertices  = 288;

var points = [];
var solidcolors = [];
var shadedcolors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0];

var thetaLoc;
var vColorLoc;

var prevx, prevy;
var dragging = false;
var anglex = 0;
var angley = 0;
var matriceLoc;               //reserve espace pour matrice expension
var matrice = mat4();         //matrice expension

function doMouseDown(evt) {
    if (dragging)
        return;
    dragging = true;                                                 //clic enfoncé
    document.addEventListener("mousemove", doMouseDrag, false);
    document.addEventListener("mouseup", doMouseUp, false);
    var box = canvas.getBoundingClientRect();
    prevx = evt.clientX - box.left;
    prevy = canvas.height - (evt.clientY - box.top);
}
function doMouseDrag(evt) {
    if (!dragging)
        return;
    var box = canvas.getBoundingClientRect();
    var x = evt.clientX - box.left;
    var y = canvas.height - (evt.clientY - box.top);

    anglex = prevy- y;
    angley = x - prevx;

    display.innerHTML = "<div> anglex = " + anglex + " ***** angley = " + angley +" </div></br><div> mouseX = " + x + " ***** mouseY = " + y +" </div>";

    prevx = x;
    prevy = y;

    render();

}
function doMouseUp(evt) {
    if (dragging) {
        document.removeEventListener("mousemove", doMouseDrag, false);
        document.removeEventListener("mouseup", doMouseUp, false);
        dragging = false;
    }
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    display = document.getElementById("display");

    canvas.addEventListener("mousedown", doMouseDown, false);


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
    matriceLoc=gl.getUniformLocation(program, "matrice");

    //event listeners for buttons

    document.getElementById("ShadedButton").onclick = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, shadedcolorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(shadedcolors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColorLoc);
        render();
    };
    document.getElementById("SolidButton").onclick = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, solidcolorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(solidcolors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColorLoc);
        render();
    };

    render();
}

function colorCube()
{
    // var i=0;
    // for(i=0;i<NumVertices;i+=6){
    //   quad(i+0,i+1,i+2,i+3);
    //   quad(i+0,i+1,5,i+4);
    //   quad(i+3,i+2,i+6,i+7);
    //   quad(i+4,i+5,i+6,i+7);
    //   quad(i+1,i+5,i+6,i+2);
    //   quad(i+0,i+4,i+7,i+3);
    // }
    //bg
    quad(0,1,2,3);
    quad(0,1,5,4);
    quad(3,2,6,7);
    quad(4,5,6,7);
    quad(1,5,6,2);
    quad(0,4,7,3);

    //hg
    quad(8,9,10,11);
    quad(8,9,13,12);
    quad(11,10,14,15);
    quad(12,13,14,15);
    quad(9,13,14,10);
    quad(8,12,15,11);

    //hd
    quad(16,17,18,19);
    quad(16,17,21,20);
    quad(19,18,22,23);
    quad(20,21,22,23);
    quad(17,21,22,18);
    quad(16,20,23,19);

    //bd
    quad(24,25,26,27);
    quad(24,25,29,28);
    quad(27,26,30,31);
    quad(28,29,30,31);
    quad(25,29,30,26);
    quad(24,28,31,27);

    //rectangles
    //gauche
    quad(32,33,34,35);
    quad(32,33,37,36);
    quad(35,34,38,39);
    quad(36,37,38,39);
    quad(33,37,38,32);
    quad(32,36,39,35);
    //haut
    quad(40,41,42,43);
    quad(40,41,45,44);
    quad(43,42,46,47);
    quad(44,45,46,47);
    quad(41,45,46,42);
    quad(40,44,47,43);
    //droite
    quad(48,49,50,51);
    quad(48,49,53,52);
    quad(51,50,54,55);
    quad(52,53,54,55);
    quad(49,53,54,50);
    quad(48,52,55,51);
    //bas
    quad(56,57,58,59);
    quad(56,57,61,60);
    quad(59,58,62,63);
    quad(60,61,62,63);
    quad(57,61,62,58);
    quad(56,60,63,59);
}

function quad(a, b, c, d)
{
    var vertices = [
        //nouvelles coordonnées:

        //-- -- cube bg -- -- //
        //face
        vec3(-0.5,-0.5,.125),
        vec3(-0.5,-0.25,.125),
        vec3(-0.25,-0.25,.125),
        vec3(-0.25,-0.5,.125),
        //arriere
        vec3(-0.5,-0.5,-.125),                //
        vec3(-0.5,-0.25,-.125),
        vec3(-0.25,-0.25,-.125),
        vec3(-0.25,-0.5,-.125),


        //-- -- cube hg -- -- //
        //face
        vec3(-0.5,0.25,0.125),                //
        vec3(-0.5,0.5,0.125),
        vec3(-0.25,0.5,0.125),
        vec3(-0.25,0.25,0.125),
        //arriere
        vec3(-0.5,0.25,-0.125),               //
        vec3(-0.5,0.5,-0.125),
        vec3(-0.25,0.5,-0.125),
        vec3(-0.25,0.25,-0.125),


        //-- -- cube hd -- -- //
        //face
        vec3(0.25,0.25,0.125),                //
        vec3(0.25,0.5,0.125),
        vec3(0.5,0.5,0.125),
        vec3(0.5,0.25,0.125),
        //arriere
        vec3(0.25,0.25,-0.125),               //
        vec3(0.25,0.5,-0.125),
        vec3(0.5,0.5,-0.125),
        vec3(0.5,0.25,-0.125),


        //-- -- cube bd -- -- //
        //face
        vec3(0.25,-0.5,0.125),                //
        vec3(0.25,-0.25,0.125),
        vec3(0.5,-0.25,0.125),
        vec3(0.5,-0.5,0.125),
        //arriere
        vec3(0.25,-0.5,-0.125),                //
        vec3(0.25,-0.25,-0.125),
        vec3(0.5,-0.25,-0.125),
        vec3(0.5,-0.5,-0.125),


        //rectangles

        // -- -- -- gauche -- -- -- //
        //face
        vec3(-0.5 + 0.0625,-0.25,0.0625),
        vec3(-0.5 + 0.0625,0.25,0.0625),
        vec3(-0.25- 0.0625,0.25,0.0625),
        vec3(-0.25- 0.0625,-0.25,0.0625),
        //arriere
        vec3(-0.5 + 0.0625,-0.25,-0.0625),
        vec3(-0.5 + 0.0625,0.25,-0.0625),
        vec3(-0.25- 0.0625,0.25,-0.0625),
        vec3(-0.25- 0.0625,-0.25,-0.0625),


        // -- -- -- haut -- -- -- //
        //face
        vec3(-0.25,0.25+0.0625,0.0625),                //
        vec3(-0.25,0.5-0.0625,0.0625),
        vec3(0.25,0.5-0.0625,0.0625),
        vec3(0.25,0.25+0.0625,0.0625),
        //arriere
        vec3(-0.25,0.25+0.0625,-0.0625),               //
        vec3(-0.25,0.5-0.0625,-0.0625),
        vec3(0.25,0.5-0.0625,-0.0625),
        vec3(0.25,0.25+0.0625,-0.0625),

        // -- -- -- droite -- -- -- //
        //face
        vec3(0.25 + 0.0625,-0.25,0.0625),
        vec3(0.25 + 0.0625,0.25,0.0625),
        vec3(0.5  - 0.0625,0.25,0.0625),
        vec3(0.5  - 0.0625,-0.25,0.0625),
        //arriere
        vec3(0.25 + 0.0625,-0.25,-0.0625),
        vec3(0.25 + 0.0625,0.25,-0.0625),
        vec3(0.5  - 0.0625,0.25,-0.0625),
        vec3(0.5  - 0.0625,-0.25,-0.0625),


        // -- -- -- bas -- -- -- //
        //face
        vec3(-0.25,-0.5+0.0625,0.0625),                //
        vec3(-0.25,-0.25-0.0625,0.0625),
        vec3(0.25,-0.25-0.0625,0.0625),
        vec3(0.25,-0.5+0.0625,0.0625),
        //arriere
        vec3(-0.25,-0.5+0.0625,-0.0625),               //
        vec3(-0.25,-0.25-0.0625,-0.0625),
        vec3(0.25,-0.25-0.0625,-0.0625),
        vec3(0.25,-0.5+0.0625,-0.0625),

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
            solidcolors.push(vertexColors[a%7]);
            // for shaded colored faces use
            shadedcolors.push(vertexColors[indices[i]]);
    }

}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[0] = anglex/2.0; // /10.0
    theta[1] = angley/2.0; // /10.

    //rotations autour de x et y
    matrice = mult(rotate(theta[0], 1.0, 0.0, 0.0), matrice);
  	matrice = mult(rotate(theta[1], 0.0, 1.0, 0.0), matrice);


    //tentative d'implémentation de la translation:
    //var vecdep=(0.1,0,0);
    // matrice=translate(vecdep,matrice);
    //ne fonctionne pas comme voulu


    //envoi matrice
    gl.uniformMatrix4fv(matriceLoc, false, flatten(matrice));


    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
