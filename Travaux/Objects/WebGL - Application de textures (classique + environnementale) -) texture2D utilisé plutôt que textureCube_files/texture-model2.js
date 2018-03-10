// This program was developped by Daniel Audet and uses sections of code  
// from http://math.hws.edu/eck/cs424/notes2013/19_GLSL.html
//
//  It has been adapted to be compatible with the "MV.js" library developped
//  for the book "Interactive Computer Graphics" by Edward Angel and Dave Shreiner.
//

"use strict";

var gl;   // The webgl context.

var aCoordsmap;      // Location of the attribute variables in the environment mapping shader program.
var aNormalmap;
var aTexCoordmap;

var uProjectionmap;     // Location of the uniform variables in the environment mapping shader program.
var uModelviewmap;
var uNormalMatrixmap;
var uSkybox;

var aCoords;       // Location of the coords attribute variable in the standard texture mappping shader program.
var aNormal;
var aTexCoord;

var uProjection;     // Location of the uniform variables in the standard texture mappping shader program.
var uModelview;
var uNormalMatrix;
var uTexture;


var projection;   //--- projection matrix
var modelview;    // modelview matrix
var flattenedmodelview;    //--- flattened modelview matrix

var normalMatrix = mat3();  //--- create a 3X3 matrix that will affect normals

var rotator;   // A SimpleRotator object to enable rotation by mouse dragging.

var texIDmap0;  // environmental texture identifier
var texID1, texID2, texID3, texID4;  // standard texture identifiers

var modela, modelb, modelc, modeld;  // model identifiers

var prog, progmap;  // shader program identifiers
  
var ct = 0;
var img = new Array(6);

var ntextures_tobeloaded=0;
var ntextures_loaded=0;

function render() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    projection = perspective(60.0, 1.0, 1.0, 100.0);

    //--- Get the rotation matrix obtained by the displacement of the mouse
    //---  (note: the matrix obtained is already "flattened" by the function getViewMatrix)
    flattenedmodelview = rotator.getViewMatrix();
    modelview = unflatten(flattenedmodelview);

    if (ntextures_loaded == ntextures_tobeloaded) {  // if all texture images have been loaded

        var initialmodelview = modelview;

        //  Draw first model using environmental mapping shader
        gl.useProgram(progmap);

        gl.uniformMatrix4fv(uProjectionmap, false, flatten(projection)); // send projection matrix to the new shader program

        gl.enableVertexAttribArray(aCoordsmap);
        gl.enableVertexAttribArray(aNormalmap);
        gl.disableVertexAttribArray(aTexCoordmap);  // texture coordinates not used (environmental mapping)

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texIDmap0);
        // Send texture to sampler
        gl.uniform1i(uSkybox, 0);

       //--- Now extract the matrix that will affect normals (3X3).
       //--- It is achieved by simply taking the upper left portion (3X3) of the modelview matrix
       //--- (since normals are not affected by translations, only by rotations). 

        normalMatrix = extractNormalMatrix(modelview);
	
        modela.render();  //  modelview and normalMatrix are sent to the shader in the "render()" method

        //  Now, change shader program to simply paste texture images onto models
        gl.useProgram(prog);

        gl.uniformMatrix4fv(uProjection, false, flatten(projection));  // send projection matrix to the new shader program

        gl.enableVertexAttribArray(aCoords);
        gl.disableVertexAttribArray(aNormal);  // normal array not used for the other objects
        gl.enableVertexAttribArray(aTexCoord);

        // select appropriate texture image
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texID1);
        // Send texture 1 to sampler
        gl.uniform1i(uTexture, 1);

        //  now, draw second model
        modelview = initialmodelview;
        modelview = mult(modelview, translate(10.0, 7.0, -15.0));
        normalMatrix = extractNormalMatrix(modelview);  // always extract the normalMatrix before scaling
        modelview = mult(modelview, scale(0.75, 0.75, 0.75));
        modelb.render();

        // select appropriate texture image
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, texID2);

        // Send texture 2 to sampler
        gl.uniform1i(uTexture, 2);

        //  now, draw third model
        modelview = initialmodelview;
        modelview = mult(modelview, translate(-12.0, 7.0, -10.0));
        normalMatrix = extractNormalMatrix(modelview);  // always extract the normalMatrix before scaling
        modelview = mult(modelview, scale(0.75, 0.75, 0.75));
        modelc.render();

        // select appropriate texture image
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, texID3);
        // Send texture 3 to sampler
        gl.uniform1i(uTexture, 3);

        //  now, draw fourth model
        modelview = initialmodelview;
        modelview = mult(modelview, translate(0.0, 20.0, -25.0));
        normalMatrix = extractNormalMatrix(modelview);  // always extract the normalMatrix before scaling
        modelview = mult(modelview, scale(0.85, 0.85, 0.85));
        modeld.render();

    }

}


function matrixinvert(matrix) {

    var result = mat3();

    var det = matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[2][1] * matrix[1][2]) -
                 matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
                 matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);

    var invdet = 1 / det;

    // inverse of matrix m
    result[0][0] = (matrix[1][1] * matrix[2][2] - matrix[2][1] * matrix[1][2]) * invdet;
    result[0][1] = (matrix[0][2] * matrix[2][1] - matrix[0][1] * matrix[2][2]) * invdet;
    result[0][2] = (matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1]) * invdet;
    result[1][0] = (matrix[1][2] * matrix[2][0] - matrix[1][0] * matrix[2][2]) * invdet;
    result[1][1] = (matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0]) * invdet;
    result[1][2] = (matrix[1][0] * matrix[0][2] - matrix[0][0] * matrix[1][2]) * invdet;
    result[2][0] = (matrix[1][0] * matrix[2][1] - matrix[2][0] * matrix[1][1]) * invdet;
    result[2][1] = (matrix[2][0] * matrix[0][1] - matrix[0][0] * matrix[2][1]) * invdet;
    result[2][2] = (matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1]) * invdet;

    return result;
}

function extractNormalMatrix(matrix) { // This function computes the transpose of the inverse of 
    // the upperleft part (3X3) of the modelview matrix (see http://www.lighthouse3d.com/tutorials/glsl-tutorial/the-normal-matrix/ )

    var result = mat3();
    var upperleft = mat3();
    var tmp = mat3();

    upperleft[0][0] = matrix[0][0];  // if no scaling is performed, one can simply use the upper left
    upperleft[1][0] = matrix[1][0];  // part (3X3) of the modelview matrix
    upperleft[2][0] = matrix[2][0];

    upperleft[0][1] = matrix[0][1];
    upperleft[1][1] = matrix[1][1];
    upperleft[2][1] = matrix[2][1];

    upperleft[0][2] = matrix[0][2];
    upperleft[1][2] = matrix[1][2];
    upperleft[2][2] = matrix[2][2];

    tmp = matrixinvert(upperleft);
    result = transpose(tmp);

    return result;
}

function unflatten(matrix) {
    var result = mat4();
    result[0][0] = matrix[0];  result[1][0] = matrix[1];  result[2][0] = matrix[2];  result[3][0] = matrix[3];
    result[0][1] = matrix[4];  result[1][1] = matrix[5];  result[2][1] = matrix[6];  result[3][1] = matrix[7];
    result[0][2] = matrix[8];  result[1][2] = matrix[9];  result[2][2] = matrix[10]; result[3][2] = matrix[11];
    result[0][3] = matrix[12]; result[1][3] = matrix[13]; result[2][3] = matrix[14]; result[3][3] = matrix[15];

    return result;
}

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

	ntextures_loaded++;
    render();  // Call render function when the image has been loaded (to insure the model is displayed)

    gl.bindTexture(gl.TEXTURE_2D, null);
}

function handleLoadedTextureMap(texture) {

    ct++;
    if (ct == 6) {
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        var targets = [
           gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
           gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
           gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
        ];
        for (var j = 0; j < 6; j++) {
            gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }
	ntextures_loaded++;
    render();  // Call render function when the image has been loaded (to insure the model is displayed)
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function initTexture() {

    var urls = [
       "park/posx.jpg", "park/negx.jpg",
       "park/posy.jpg", "park/negy.jpg",
       "park/posz.jpg", "park/negz.jpg"
    ];

    texIDmap0 = gl.createTexture();

    for (var i = 0; i < 6; i++) {
        img[i] = new Image();
        img[i].onload = function () {  // this function is called when the image download is complete

            handleLoadedTextureMap(texIDmap0);
        }
        img[i].src = urls[i];   // this line starts the image downloading thread
		ntextures_tobeloaded++;

    }

    texID1 = gl.createTexture();

    texID1.image = new Image();
    texID1.image.onload = function () {
        handleLoadedTexture(texID1)
    }
    texID1.image.src = "earthmap.jpg";
	ntextures_tobeloaded++;

    texID2 = gl.createTexture();

    texID2.image = new Image();
    texID2.image.onload = function () {
        handleLoadedTexture(texID2)
    }
    texID2.image.src = "brick.png";
	ntextures_tobeloaded++;
	
    texID3 = gl.createTexture();

    texID3.image = new Image();
    texID3.image.onload = function () {
        handleLoadedTexture(texID3)
    }
    texID3.image.src = "wood.jpg";
	ntextures_tobeloaded++;
}



function createModel(modelData) {
    var model = {};
    model.coordsBuffer = gl.createBuffer();
    model.normalBuffer = gl.createBuffer();
    model.textureBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexTextureCoords, gl.STATIC_DRAW);

    console.log(modelData.vertexPositions.length);
    console.log(modelData.indices.length);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);

    model.render = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(aCoords, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.uniformMatrix4fv(uModelview, false, flatten(modelview));    //--- load flattened modelview matrix
        gl.uniformMatrix3fv(uNormalMatrix, false, flatten(normalMatrix));  //--- load flattened normal matrix

        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
        console.log(this.count);
    }
    return model;
}

function createModelmap(modelData) {
    var model = {};
    model.coordsBuffer = gl.createBuffer();
    model.normalBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);

    console.log(modelData.vertexPositions.length);
    console.log(modelData.indices.length);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);

    model.render = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(aCoordsmap, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(aNormalmap, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.uniformMatrix4fv(uModelviewmap, false, flatten(modelview));    //--- load flattened modelview matrix
        gl.uniformMatrix3fv(uNormalMatrixmap, false, flatten(normalMatrix));  //--- load flattened normal matrix

        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
        console.log(this.count);
    }
    return model;
}

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    var vsh = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vsh, vertexShaderSource);
    gl.compileShader(vsh);
    if (!gl.getShaderParameter(vsh, gl.COMPILE_STATUS)) {
        throw "Error in vertex shader:  " + gl.getShaderInfoLog(vsh);
    }
    var fsh = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fsh, fragmentShaderSource);
    gl.compileShader(fsh);
    if (!gl.getShaderParameter(fsh, gl.COMPILE_STATUS)) {
        throw "Error in fragment shader:  " + gl.getShaderInfoLog(fsh);
    }
    var prog = gl.createProgram();
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw "Link error in program:  " + gl.getProgramInfoLog(prog);
    }
    return prog;
}


function getTextContent(elementID) {
    var element = document.getElementById(elementID);
    var fsource = "";
    var node = element.firstChild;
    var str = "";
    while (node) {
        if (node.nodeType == 3) // this is a text node
            str += node.textContent;
        node = node.nextSibling;
    }
    return str;
}


window.onload = function init() {
    try {
        var canvas = document.getElementById("glcanvas");
        gl = canvas.getContext("webgl");
        if (!gl) {
            gl = canvas.getContext("experimental-webgl");
        }
        if (!gl) {
            throw "Could not create WebGL context.";
        }

        // LOAD FIRST SHADER  (environmental mapping)
        var vertexShaderSourcemap = getTextContent("vshadermap");
        var fragmentShaderSourcemap = getTextContent("fshadermap");
        progmap = createProgram(gl, vertexShaderSourcemap, fragmentShaderSourcemap);

        gl.useProgram(progmap);

        // locate variables for further use
        aCoordsmap = gl.getAttribLocation(progmap, "vcoords");
        aNormalmap = gl.getAttribLocation(progmap, "vnormal");
        aTexCoordmap = gl.getAttribLocation(progmap, "vtexcoord");

        uModelviewmap = gl.getUniformLocation(progmap, "modelview");
        uProjectionmap = gl.getUniformLocation(progmap, "projection");
        uNormalMatrixmap = gl.getUniformLocation(progmap, "normalMatrix");

        uSkybox = gl.getUniformLocation(progmap, "skybox");

        gl.enableVertexAttribArray(aCoordsmap);
        gl.enableVertexAttribArray(aNormalmap);
        gl.disableVertexAttribArray(aTexCoordmap);   // texture coordinates not used (environmental mapping)

        // LOAD SECOND SHADER (standard texture mapping)
        var vertexShaderSource = getTextContent("vshader");
        var fragmentShaderSource = getTextContent("fshader");
        prog = createProgram(gl, vertexShaderSource, fragmentShaderSource);

        gl.useProgram(prog);

        // locate variables for further use
        aCoords = gl.getAttribLocation(prog, "vcoords");
        aNormal = gl.getAttribLocation(prog, "vnormal");
        aTexCoord = gl.getAttribLocation(prog, "vtexcoord");

        uModelview = gl.getUniformLocation(prog, "modelview");
        uProjection = gl.getUniformLocation(prog, "projection");
        uNormalMatrix = gl.getUniformLocation(prog, "normalMatrix");

        uTexture = gl.getUniformLocation(prog, "texture");

        gl.enableVertexAttribArray(aCoords);
        gl.disableVertexAttribArray(aNormal);
        gl.enableVertexAttribArray(aTexCoord);


        gl.enable(gl.DEPTH_TEST);

        initTexture();

        //  create a "rotator" monitoring mouse mouvement
        rotator = new SimpleRotator(canvas, render);
        //  set initial camera position at z=40, with an "up" vector aligne with y axis
        //   (this defines the initial value of the modelview matrix )
        rotator.setView([0, 0, 1], [0, 1, 0], 40);

        // You can use basic models using the following lines

                modela = createModelmap(teapotModel);
        //        model = createModel(ring(5.0, 10.0, 25.0));
                modelb = createModel(uvSphere(10.0, 25.0, 25.0));
                modeld = createModel(uvTorus(15.0, 5.0, 25.0, 25.0));
        //        model = createModel(uvCylinder(10.0, 20.0, 25.0, true, false));
        //        model = createModel(uvCone(10.0, 20.0, 25.0, true));
                modelc = createModel( cube(10.0) );

    }
    catch (e) {
        document.getElementById("message").innerHTML =
             "Could not initialize WebGL: " + e;
        return;
    }

    render();   
}


