// This code comes from http://math.hws.edu/eck/cs424/notes2013/19_GLSL.html
//
//  It has been modified by Daniel Audet to be compatible with the "MV.js" library developped
//  for the book "Interactive Computer Graphics" by Edward Angel and Dave Shreiner.
//
//
//  Some comments were also inserted to better explain what is actually performed.
//  They can be easily located as they are preceeded by //---

"use strict";

var gl;   // The webgl context.

var aCoords;           // Location of the coords attribute variable in the shader program.
var aNormal;
var aTexCoord;

var uProjection;       // Location of the projection uniform matrix in the shader program.
var uModelview;
var uNormalMatrix;
var uTexture;

var projection;   //--- projection matrix
var modelview;    // modelview matrix
var flattenedmodelview;    //--- flattened modelview matrix

var normalMatrix = mat3();  //--- create a 3X3 matrix that will affect normals

var rotator;   // A SimpleRotator object to enable rotation by mouse dragging.

var texID;  // texture identifier
var model;

var ntextures_tobeloaded=0;
var ntextures_loaded=0;

function render() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    projection = perspective(60.0, 1.0, 1.0, 100.0);
    gl.uniformMatrix4fv(uProjection, false, flatten(projection));

    //--- Get the rotation matrix obtained by the displacement of the mouse
    //---  (note: the matrix obtained is already "flattened" by the function getViewMatrix)
    flattenedmodelview = rotator.getViewMatrix();
    modelview = unflatten(flattenedmodelview);

    //--- Now extract the matrix that will affect normals (3X3).
    //--- It is achieved by simply taking the upper left portion (3X3) of the modelview matrix
    //--- (since normals are not affected by translations, only by rotations). 

    normalMatrix = extractNormalMatrix(modelview);

    if (ntextures_loaded == ntextures_tobeloaded)  // if all texture images have been loaded
        model.render();

}

function matrixinvert(matrix) {

    var result = mat3();

    var det = modelview[0][0] * (modelview[1][1] * modelview[2][2] - modelview[2][1] * modelview[1][2]) -
                 modelview[0][1] * (modelview[1][0] * modelview[2][2] - modelview[1][2] * modelview[2][0]) +
                 modelview[0][2] * (modelview[1][0] * modelview[2][1] - modelview[1][1] * modelview[2][0]);

    var invdet = 1 / det;

    // inverse of matrix m
    result[0][0] = (modelview[1][1] * modelview[2][2] - modelview[2][1] * modelview[1][2]) * invdet;
    result[0][1] = (modelview[0][2] * modelview[2][1] - modelview[0][1] * modelview[2][2]) * invdet;
    result[0][2] = (modelview[0][1] * modelview[1][2] - modelview[0][2] * modelview[1][1]) * invdet;
    result[1][0] = (modelview[1][2] * modelview[2][0] - modelview[1][0] * modelview[2][2]) * invdet;
    result[1][1] = (modelview[0][0] * modelview[2][2] - modelview[0][2] * modelview[2][0]) * invdet;
    result[1][2] = (modelview[1][0] * modelview[0][2] - modelview[0][0] * modelview[1][2]) * invdet;
    result[2][0] = (modelview[1][0] * modelview[2][1] - modelview[2][0] * modelview[1][1]) * invdet;
    result[2][1] = (modelview[2][0] * modelview[0][1] - modelview[0][0] * modelview[2][1]) * invdet;
    result[2][2] = (modelview[0][0] * modelview[1][1] - modelview[1][0] * modelview[0][1]) * invdet;

    return result;
}

function extractNormalMatrix(matrix) { // This function computes the transpose of the inverse of 
    // the modelview matrix (see http://www.lighthouse3d.com/tutorials/glsl-tutorial/the-normal-matrix/ )

    var result = mat3();

    result - transpose(matrixinvert(matrix));

    //result[0][0] = matrix[0][0];  // if no scaling is performed, one can simply use the upper left
    //result[1][0] = matrix[1][0];  // part (3X3) of the modelview matrix
    //result[2][0] = matrix[2][0];

    //result[0][1] = matrix[0][1];
    //result[1][1] = matrix[1][1];
    //result[2][1] = matrix[2][1];

    //result[0][2] = matrix[0][2];
    //result[1][2] = matrix[1][2];
    //result[2][2] = matrix[2][2];

    return result;
}

function unflatten(matrix) {
    var result = mat4();
    result[0][0] = matrix[0]; result[1][0] = matrix[1]; result[2][0] = matrix[2]; result[3][0] = matrix[3];
    result[0][1] = matrix[4]; result[1][1] = matrix[5]; result[2][1] = matrix[6]; result[3][1] = matrix[7];
    result[0][2] = matrix[8]; result[1][2] = matrix[9]; result[2][2] = matrix[10]; result[3][2] = matrix[11];
    result[0][3] = matrix[12]; result[1][3] = matrix[13]; result[2][3] = matrix[14]; result[3][3] = matrix[15];

    return result;
}

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	ntextures_loaded++;
    render();  // Call render function when the image has been loaded (to insure the model is displayed)

    gl.bindTexture(gl.TEXTURE_2D, null);
}


function initTexture() {
    texID = gl.createTexture();

    texID.image = new Image();
    texID.image.onload = function () {
        handleLoadedTexture(texID)
    }

    texID.image.src = "SA2011_black.gif";
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
//        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
//        gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.uniformMatrix4fv(uModelview, false, flatten(modelview));    //--- load flattened modelview matrix
        gl.uniformMatrix3fv(uNormalMatrix, false, flatten(normalMatrix));  //--- load flattened normal matrix

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texID);
        // Send texture to sampler
        gl.uniform1i(uTexture, 0);

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
        var vertexShaderSource = getTextContent("vshader");
        var fragmentShaderSource = getTextContent("fshader");
        var prog = createProgram(gl, vertexShaderSource, fragmentShaderSource);
        gl.useProgram(prog);

        initTexture();

        aCoords = gl.getAttribLocation(prog, "vcoords");
        aNormal = gl.getAttribLocation(prog, "vnormal");
        aTexCoord = gl.getAttribLocation(prog, "vtexcoord");

        uModelview = gl.getUniformLocation(prog, "modelview");
        uProjection = gl.getUniformLocation(prog, "projection");
        uNormalMatrix = gl.getUniformLocation(prog, "normalMatrix");

        uTexture = gl.getUniformLocation(prog, "texture");

        gl.enableVertexAttribArray(aCoords);
 //       gl.enableVertexAttribArray(aNormal);
        gl.enableVertexAttribArray(aTexCoord);

        gl.enable(gl.DEPTH_TEST);

        rotator = new SimpleRotator(canvas, render);
        rotator.setView([0, 0, 1], [0, 1, 0], 40);

        // You can create basic models using one of the following lines

                model = createModel(teapotModel);
        //        model = createModel(ring(5.0, 10.0, 25.0));
        //        model = createModel(uvSphere(10.0, 25.0, 25.0));
        //        model = createModel(uvTorus(15.0, 5.0, 25.0, 25.0));
        //        model = createModel(uvCylinder(10.0, 20.0, 25.0, true, false));
        //        model = createModel(uvCone(10.0, 20.0, 25.0, true));
        //        model = createModel( cube(10.0) );

    }
    catch (e) {
        document.getElementById("message").innerHTML =
             "Could not initialize WebGL: " + e;
        return;
    }

    setInterval(render, 1000);   

}



