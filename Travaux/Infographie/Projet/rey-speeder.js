//Made by Julien Haegman HAEJ09129709
//UQAC - Autumn semester 2017
"use strict";

var gl; // The webgl context.

var CoordsLoc; // Location of the coords attribute variable in the standard texture mappping shader program.
var NormalLoc;
var TexCoordLoc;
var ProjectionLoc; // Location of the uniform variables in the standard texture mappping shader program.
var ModelviewLoc;
var NormalMatrixLoc;
var projection; //--- projection matrix
var modelview; // modelview matrix
var flattenedmodelview; //--- flattened modelview matrix
var normalMatrix = mat3(); //--- create a 3X3 matrix that will affect normals
var rotator; // A SimpleRotator object to enable rotation by mouse dragging.


var aCoords;       // Location of the coords attribute variable in the standard texture mappping shader program.
var aNormal;
var aTexCoord;

var alphaLoc;

// -- -- spaceship parts -- --//
var reactor_top, reactor_bottom;
var reactor_front_top, reactor_front_bottom;
var back_right_main, back_right_top, back_right_bottom;
var back_left_main, back_left_top, back_left_bottom;
var back_fix_mid, back_fix_left_bottom, back_fix_right_bottom, back_fix_left_top, back_fix_right_top;
var tube1_back, tube1_front, tube2, tube_top_main, tube_top_left, tube_top_right, tube_top_main2, tube_top_left2, tube_top_right2;
var tube_seat_main,tube_seat_back;

var seat_top, seat_main, seat_right_bottom_back, seat_right_bottom_main, seat_right_bottom_front;
var hull_back, hull_cylinder, hull_cylinder_grid, hull_cylinder_grid_tour;
var hull_back_top, hull_back_right_top, hull_back_left_top;
var hull_back_right_bottom_angle, hull_back_right_bottom;
var hull_main, hull_main_top, hull_main_left_top, hull_main_right_top;
var hull_front, hull_front2, hull_front_top, hull_front_bottom;
var hull_front_right_angle, hull_front_left_angle;
var hull_front_right_top_plate, hull_front_left_top_plate;
var hull_front_right_bottom_plate, hull_front_left_bottom_plate;
var hull_front_top, hull_front_top_left, hull_front_top_right;
var hull_front_top_left_angle, hull_front_top_right_angle;
var hull_front_left_angle, hull_front_right_angle;
var hull_ring, hull_grid;
var hull_back_right_bottom, hull_back_left_bottom;
var hull_main_bottom, hull_main_left_bottom, hull_main_right_bottom;
var hull_front_bottom, hull_front_bottom_left, hull_front_bottom_right;
var side_right_top, side_right_middle, side_right_bottom, side_right_angle;
var side_left_top, side_left_middle, side_left_bottom, side_left_angle;
var tube_structure_front, tube_structure_back, tube_structure_main;
var feet_axis, feet_axis_left, feet_axis_right;
var feet_plate_left, feet_plate_right;
var command_axis, command_bump, command_roll, command_plate_left, command_plate_right;
var small_tube1_left, small_tube2_left, big_tube1_left, big_tube2_left;
var small_tube1_right, small_tube2_right, big_tube1_right, big_tube2_right;
var terre,lune,mars,jupiter,translucide,reflechissant,sun;
// -- -- -- -- //
var prog; // shader program identifier
var lightPosition = vec4(20.0, 20.0, 100.0, 1.0);
var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialAmbient = vec4(1, 1, 1, 1.0);
var materialDiffuse = vec4(1, 1, 1, 1.0);
var materialSpecular = vec4(1, 1, 1, 1.0);
var materialShininess = 100.0;
var ambientProduct, diffuseProduct, specularProduct;

//Textures
var texture1, texture2, texture3, texture4, texture5,textureTerre,textureLune,textureMars,textureJupiter,textureSun,textureTranslucide,textureReflechissant;
var ntextures_tobeloaded = 0;
var ntextures_loaded = 0;

//spaceship
var uProjection;
var uModelview;
var uNormalMatrix;
var uTexture;


//Skybox
var texIDmap0,texIDmap1;
var envbox,envReflect;
var progbox,progReflect;
var img = new Array(6);
var imgReflect= new Array(6);
var ct=0;
var uModelviewbox;
var uProjectionbox;
var uNormalMatrixbox;
var uModelviewReflect;
var uProjectionReflect;
var uNormalMatrixReflect;
var uEnvbox, uEnvmap,uEnvReflect,uReflect;
var aCoordsbox;     // Location of the coords attribute variable in the shader program used for texturing the environment box.
var aNormalbox;
var aTexCoordbox;
var aCoordsReflect;     // Location of the coords attribute variable in the shader program used for texturing the environment box.
var aNormalReflect;
var aTexCoordReflect;

//Planetes
var planetsRota=0;
var sunRota=0;

//mouvement
var transX=0;
var rotaShip=0;

document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
				 transX++;
				render();
    }
    else if (e.keyCode == '40') {
        // down arrow
				transX--;
				render();
    }
    else if (e.keyCode == '37') {
       // left arrow
			 rotaShip++;
			 render();
    }
    else if (e.keyCode == '39') {
       // right arrow
			 rotaShip--;
			 render();
    }
}



//Fonctions textures
function handleLoadedTexture(texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	ntextures_loaded++;
	render(); // Call render function when the image has been loaded (to insure the model is displayed)
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

        texture.isloaded = true;

        render();  // Call render function when the image has been loaded (to insure the model is displayed)

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

function handleLoadedTextureReflect(texture) {
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
            gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgReflect[j]);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

        texture.isloaded = true;

        render();  // Call render function when the image has been loaded (to insure the model is displayed)

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

function initTexture() {
	//Skybox
	var urls = [
		"space/nebula_posx.png", "space/nebula_negx.png",
		"space/nebula_posy.png", "space/nebula_negy.png",
		"space/nebula_posz.png", "space/nebula_negz.png"
	];
  // var urlsReflect = [
	// 	"reflect/posx.png", "reflect/negx.png",
	// 	"reflect/posy.png", "reflect/negy.png",
	// 	"reflect/posz.png", "reflect/negz.png"
	// ];


	texIDmap0 = gl.createTexture();
	texIDmap0.isloaded = false;  // this class member is created only to check if the image has been loaded
  // texIDmap1 = gl.createTexture();
  // texIDmap1.isloaded = false;


  //skybox
	for (var i = 0; i < 6; i++) {
		img[i] = new Image();
		img[i].onload = function () {  // this function is called when the image download is complete

			handleLoadedTextureMap(texIDmap0);
		}
		img[i].src = urls[i];   // this line starts the image downloading thread
		ntextures_tobeloaded++;
	}

  // //reflechissant
  // for (var i = 0; i < 6; i++) {
	// 	imgReflect[i] = new Image();
	// 	imgReflect[i].onload = function () {  // this function is called when the image download is complete
  //
	// 		handleLoadedTextureReflect(texIDmap1);
	// 	}
	// 	imgReflect[i].src = urlsReflect[i];   // this line starts the image downloading thread
	// 	ntextures_tobeloaded++;
	// }

	texture1 = gl.createTexture();
	texture1.image = new Image();
	texture1.image.onload = function() {
		handleLoadedTexture(texture1);
	}

	texture1.image.src = "Textures/texture1.jpg";
	ntextures_tobeloaded++;
	//
	texture2 = gl.createTexture();
	texture2.image = new Image();
	texture2.image.onload = function() {
		handleLoadedTexture(texture2);
	}
	texture2.image.src = "Textures/texture2.jpg";
	ntextures_tobeloaded++;
	//
	texture3 = gl.createTexture();
	texture3.image = new Image();
	texture3.image.onload = function() {
		handleLoadedTexture(texture3);
	}
	texture3.image.src = "Textures/texture3.png";
	ntextures_tobeloaded++;
	//
	texture4 = gl.createTexture();
	texture4.image = new Image();
	texture4.image.onload = function() {
		handleLoadedTexture(texture4);
	}
	texture4.image.src = "Textures/texture4.jpg";
	ntextures_tobeloaded++;
	//
	texture5 = gl.createTexture();
	texture5.image = new Image();
	texture5.image.onload = function() {
		handleLoadedTexture(texture5);
	}
	texture5.image.src = "Textures/texture5.jpg";
	ntextures_tobeloaded++;
	//
	textureTerre = gl.createTexture();
	textureTerre.image = new Image();
	textureTerre.image.onload = function() {
		handleLoadedTexture(textureTerre);
	}
	textureTerre.image.src = "Textures/terre.jpg";
	ntextures_tobeloaded++;
	//
	textureLune = gl.createTexture();
	textureLune.image = new Image();
	textureLune.image.onload = function() {
		handleLoadedTexture(textureLune);
	}
	textureLune.image.src = "Textures/lune.png";
	ntextures_tobeloaded++;
	//
	textureMars = gl.createTexture();
	textureMars.image = new Image();
	textureMars.image.onload = function() {
		handleLoadedTexture(textureMars);
	}
	textureMars.image.src = "Textures/mars.png";
	ntextures_tobeloaded++;
	//
	textureJupiter = gl.createTexture();
	textureJupiter.image = new Image();
	textureJupiter.image.onload = function() {
		handleLoadedTexture(textureJupiter);
	}
	textureJupiter.image.src = "Textures/jupiter.jpg";
	ntextures_tobeloaded++;
	//
	textureSun = gl.createTexture();
	textureSun.image = new Image();
	textureSun.image.onload = function() {
		handleLoadedTexture(textureSun);
	}
	textureSun.image.src = "Textures/sun.jpg";
	ntextures_tobeloaded++;
	//
	textureTranslucide = gl.createTexture();
	textureTranslucide.image = new Image();
	textureTranslucide.image.onload = function() {
		handleLoadedTexture(textureTranslucide);
	}
	textureTranslucide.image.src = "Textures/translucide.png";
	ntextures_tobeloaded++;
	//
}

function setProperties(ambient1, ambient2, ambient3, diffuse1, diffuse2, diffuse3, shininess) {
	gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(mult(lightAmbient, vec4(ambient1, ambient2, ambient3, 1.0))));
	gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(mult(lightDiffuse, vec4(diffuse1, diffuse2, diffuse3, 1.0))));
	gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(mult(lightSpecular, vec4(1, 1, 1, 1.0))));
	gl.uniform1f(gl.getUniformLocation(prog, "shininess"), shininess);
}

function rusty() {
	//Acier rouillé rouge
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture1);
	gl.uniform1i(gl.getUniformLocation(prog, "texture"), 0);
	setProperties(0.61, 0.44, 0.49, 0.61, 0.44, 0.4, 10);
}

function brushedMetal() {
	//Metal réacteurs
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture2);
	gl.uniform1i(gl.getUniformLocation(prog, "texture"), 0);
	setProperties(0.17, 0.23, 0.25, 0.19, 0.23, 0.28, 25);
}

function blackMetal() {
	//Metal sombre
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture3);
	gl.uniform1i(gl.getUniformLocation(prog, "texture"), 0);
	setProperties(0.07, 0.123, 0.15, 0.09, 0.03, 0.18, 10);
}

function grid() {
	//Grille
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture4);
	gl.uniform1i(gl.getUniformLocation(prog, "texture"), 0);
	setProperties(0.03, 0.03, 0.03, 0.03, 0.03, 0.3, 0.5);
}

function brown() {
	//Marron 95 75 59
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture5);
	gl.uniform1i(gl.getUniformLocation(prog, "texture"), 0);
	setProperties(0.17, 0.09, 0.03, 0.17, 0.09, 0.03, 0.2);
}

setInterval(function(){planetsRota+=0.5;sunRota+=0.01}, 50);

function terreTex() {
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textureTerre);
	gl.uniform1i(uTexture, 0);
	setProperties(0.17, 0.09, 0.03, 0.17, 0.09, 0.03, 0.2);
}
function luneTex() {
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textureLune);
	gl.uniform1i(uTexture, 0);
	setProperties(0.17, 0.09, 0.03, 0.17, 0.09, 0.03, 0.2);
}
function jupiterTex() {
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textureJupiter);
	gl.uniform1i(uTexture, 0);
	setProperties(0.17, 0.09, 0.03, 0.17, 0.09, 0.03, 0.2);
}
function marsTex() {
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textureMars);
	gl.uniform1i(uTexture, 0);
	setProperties(0.17, 0.09, 0.03, 0.17, 0.09, 0.03, 0.2);
}
function sunTex(){
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureSun);
  gl.uniform1i(uTexture, 0);
  setProperties(1,1,1,1,1,1,1);
}

function cubeTranslucide(){
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.BLEND);
	gl.depthMask(false);
	setProperties(1,1,1,1,1,1,1);

	gl.activeTexture(gl.TEXTURE11);
	gl.bindTexture(gl.TEXTURE_2D, textureTranslucide);
	gl.uniform1i(uTexture, 11);
}

// function cubeReflechissant(){
//   gl.enableVertexAttribArray(aCoordsReflect);
//   gl.enableVertexAttribArray(aNormalReflect);
//   gl.disableVertexAttribArray(aTexCoordReflect);
//
//   gl.activeTexture(gl.TEXTURE1);
//   gl.bindTexture(gl.TEXTURE_CUBE_MAP, textureReflechissant);
//   // Send texture to sampler
//   gl.uniform1i(uEnvmap, 1);
// }


//-- -- -- //
function unflatten(matrix) {
	var result = mat4();
	result[0][0] = matrix[0];
	result[1][0] = matrix[1];
	result[2][0] = matrix[2];
	result[3][0] = matrix[3];
	result[0][1] = matrix[4];
	result[1][1] = matrix[5];
	result[2][1] = matrix[6];
	result[3][1] = matrix[7];
	result[0][2] = matrix[8];
	result[1][2] = matrix[9];
	result[2][2] = matrix[10];
	result[3][2] = matrix[11];
	result[0][3] = matrix[12];
	result[1][3] = matrix[13];
	result[2][3] = matrix[14];
	result[3][3] = matrix[15];

	return result;
}

function extractNormalMatrix(matrix) { // This function computes the transpose of the inverse of
	// the upperleft part (3X3) of the modelview matrix (see http://www.lighthouse3d.com/tutorials/glsl-tutorial/the-normal-matrix/ )

	var result = mat3();
	var upperleft = mat3();
	var tmp = mat3();

	upperleft[0][0] = matrix[0][0]; // if no scaling is performed, one can simply use the upper left
	upperleft[1][0] = matrix[1][0]; // part (3X3) of the modelview matrix
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

	//console.log(modelData.vertexPositions.length);
	//console.log(modelData.indices.length);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);

	model.render = function() {

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
		//console.log(this.count);
	}
	return model;
}

function createModelbox(modelData) {  // For creating the environment box.
    var model = {};
    model.coordsBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    console.log(modelData.vertexPositions.length);
    console.log(modelData.indices.length);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);
    model.render = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(aCoordsbox, 3, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(uModelviewbox, false, flatten(modelview));
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
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



// -- -- -- -- -- -- -- -- -- -- //
window.onload = function init() {
	var canvas = document.getElementById("glcanvas");
	gl = canvas.getContext("webgl");
	if (!gl) {
		gl = canvas.getContext("experimental-webgl");
	}
	if (!gl) {
		throw "Could not create WebGL context.";
	}




	// LOAD SHADER (for the skybox)
	var vertexShaderSourcebox = getTextContent("vshaderbox");
	var fragmentShaderSourcebox = getTextContent("fshaderbox");
	progbox = createProgram(gl, vertexShaderSourcebox, fragmentShaderSourcebox);

	gl.useProgram(progbox);

	aCoordsbox = gl.getAttribLocation(progbox, "vcoords");
	aNormalbox = gl.getAttribLocation(progbox, "vnormal");
	aTexCoordbox = gl.getAttribLocation(progbox, "vtexcoord");

	uModelviewbox = gl.getUniformLocation(progbox, "modelview");
	uProjectionbox = gl.getUniformLocation(progbox, "projection");
	uNormalMatrixbox = gl.getUniformLocation(progbox, "normalMatrix");

	uEnvbox = gl.getUniformLocation(progbox, "skybox");
  uReflect = gl.getUniformLocation(progbox, "reflechissant");

	gl.enableVertexAttribArray(aCoordsbox);
	gl.enableVertexAttribArray(aNormalbox);
	gl.disableVertexAttribArray(aTexCoordbox);

	// LOAD SHADER (standard texture mapping)
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
	alphaLoc = gl.getUniformLocation(prog, "alpha");

	uTexture = gl.getUniformLocation(prog, "texture");

	gl.enableVertexAttribArray(aCoords);
	gl.enableVertexAttribArray(aNormal);
	gl.enableVertexAttribArray(aTexCoord);

	gl.enable(gl.DEPTH_TEST);
	initTexture();
	////


	//  create a "rotator" monitoring mouse mouvement
	rotator = new SimpleRotator(canvas, render);
	//  set initial camera position at z=40, with an "up" vector aligned with y axis
	//   (this defines the initial value of the modelview matrix )
	rotator.setView([0, 0, 1], [0, 1, 0], 50);

	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	specularProduct = mult(lightSpecular, materialSpecular);

	gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
	gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));
	gl.uniform1f(gl.getUniformLocation(prog, "shininess"), materialShininess);

	gl.uniform4fv(gl.getUniformLocation(prog, "lightPosition"), flatten(lightPosition));






	// projection = perspective(70.0, 1.0, 1.0, 200.0);
	// gl.uniformMatrix4fv(ProjectionLoc, false, flatten(projection)); // send projection matrix to the shader program



	envbox = createModelbox(cube(2000.0));



	/* Speeder */


	// You can use basic models using the following lines
	//tetra = createModel(tetra(10.0));


	reactor_top = createModel(uvCylinder(8.0, 5.0, 25.0, false, false));
	reactor_bottom = createModel(uvCylinder(8.0, 5.0, 25.0, false, false));
	reactor_front_top = createModel(uvCylinder(12, 3.0, 25.0, false, false));
	reactor_front_bottom = createModel(uvCylinder(12, 3.0, 25.0, false, false));

	back_fix_mid = createModel(cube(10.0));
	back_fix_left_top = createModel(cube(10.0));
	back_fix_right_top = createModel(cube(10.0));
	back_fix_left_bottom = createModel(cube(10.0));
	back_fix_right_bottom = createModel(cube(10.0));


	back_left_main = createModel(cube(10.0));
	back_right_main = createModel(cube(10.0));

	back_left_top = createModel(cube(10.0));
	back_right_top = createModel(cube(10.0));
	back_left_bottom = createModel(cube(10.0));
	back_right_bottom = createModel(cube(10.0));

	tube1_back = createModel(uvCylinder(10, 5.0, 25.0, false, false));
	tube1_front = createModel(uvCylinder(12, 4.0, 25.0, false, false));
	tube2 = createModel(uvCylinder(10, 7.0, 25, false, false));

	hull_cylinder = createModel(uvCylinder(10, 5.0, 25.0, false, false));
	hull_cylinder_grid = createModel(uvCylinder(10, 5.0, 25.0, false, false));
	hull_cylinder_grid_tour = createModel(uvCylinder(10, 5.0, 25.0, false, false));
	hull_back = createModel(cube(10.0));
	hull_main = createModel(cube(10.0));
	hull_main_top = createModel(cube(10.0));
	hull_main_right_top = createModel(cube(10.0));
	hull_main_left_top = createModel(cube(10.0));

	hull_back_right_top = createModel(triangle(10.0));
	hull_back_left_top = createModel(triangle(10.0));

	hull_grid = createModel(cube(10.0));
	hull_front = createModel(cube(10.0));
	hull_front2 = createModel(cube(10.0));

	hull_front_left_angle = createModel(cube(10.0));
	hull_front_right_angle = createModel(cube(10.0));

	hull_front_left_top_plate = createModel(triangle(10.0));
	hull_front_right_top_plate = createModel(triangle(10.0));
	hull_front_left_bottom_plate = createModel(triangle(10.0));
	hull_front_right_bottom_plate = createModel(triangle(10.0));

	hull_front_top = createModel(cube(10.0));
	hull_front_top_left_angle = createModel(triangle(10.0));
	hull_front_top_right_angle = createModel(triangle(10.0));


	hull_front_top_left = createModel(triangle(10.0));
	hull_front_top_right = createModel(triangle(10.0));

	hull_main_bottom = createModel(cube(10.0));
	hull_main_left_bottom = createModel(cube(10.0));
	hull_main_right_bottom = createModel(cube(10.0));

	hull_front_bottom = createModel(cube(10.0));
	hull_front_bottom_left = createModel(triangle(10.0));
	hull_front_bottom_right = createModel(triangle(10.0));

	side_right_top = createModel(cube(10.0));
	side_right_middle = createModel(cube(10.0));
	side_right_angle = createModel(triangle(10.0));

	side_left_top = createModel(cube(10.0));
	side_left_middle = createModel(cube(10.0));
	side_left_angle = createModel(triangle(10.0));

	tube_structure_front = createModel(cube(10.0));
	tube_structure_back = createModel(cube(10.0));
	tube_structure_main = createModel(cube(10.0));

	feet_axis = createModel(uvCylinder(10.0, 20.0, 25.0, false, false));
	feet_axis_left = createModel(cube(10.0));
	feet_axis_right = createModel(cube(10.0));

	feet_plate_left = createModel(cube(10.0));
	feet_plate_right = createModel(cube(10.0));

	command_bump = createModel(cube(10.0));
	command_axis = createModel(uvCylinder(10.0, 20.0, 25.0, false, false));
	command_plate_left = createModel(cube(10.0));
	command_plate_right = createModel(cube(10.0));

	big_tube1_left = createModel(uvCylinder(10.0, 20.0, 25.0, false, false));
	big_tube2_left = createModel(uvCylinder(10.0, 20.0, 25.0, false, false));

	big_tube1_right = createModel(uvCylinder(10.0, 20.0, 25.0, false, false));
	big_tube2_right = createModel(uvCylinder(10.0, 20.0, 25.0, false, false));

	tube_top_main = createModel(cube(10.0));
	tube_top_right = createModel(cube(10.0));
	tube_top_left = createModel(cube(10.0));
	tube_top_main2 = createModel(cube(10.0));
	tube_top_right2 = createModel(cube(10.0));
	tube_top_left2 = createModel(cube(10.0));

  tube_seat_main= createModel(tetra(10.0));
  tube_seat_back = createModel(uvCylinder(10.0, 20.0, 25.0, false, false));

	terre=createModel(uvSphere(10.0, 25.0, 25.0));
	lune=createModel(uvSphere(10.0, 25.0, 25.0));
	jupiter=createModel(uvSphere(10.0, 25.0, 25.0));
	mars=createModel(uvSphere(10.0, 25.0, 25.0));
  sun=createModel(uvSphere(10.0, 25.0, 25.0));

  translucide= createModel(cube(10.0));
	reflechissant= createModel(cube(10.0));

	setInterval(render, 1000);
}

function render() {
	gl.clearColor(0.90, 0.7, 0.39, 1); //background
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	projection = perspective(60.0, 1.0, 1.0, 2000.0);

	//--- Get the rotation matrix obtained by the displacement of the mouse
	//---  (note: the matrix obtained is already "flattened" by the function getViewMatrix)
	flattenedmodelview = rotator.getViewMatrix();
	modelview = unflatten(flattenedmodelview);



	if (texIDmap0.isloaded ) {  // if texture images have been loaded

			var initialmodelview = modelview;
			// Draw the environment (box)
			gl.useProgram(progbox); // Select the shader program that is used for the environment box.

			gl.uniformMatrix4fv(uProjectionbox, false, flatten(projection));

			gl.enableVertexAttribArray(aCoordsbox);
			gl.disableVertexAttribArray(aNormalbox);     // normals are not used for the box
			gl.disableVertexAttribArray(aTexCoordbox);  // texture coordinates not used for the box

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, texIDmap0);
			// Send texture to sampler
			gl.uniform1i(uEnvbox, 0);
			normalMatrix = extractNormalMatrix(modelview);

			envbox.render();

	}


	var initialmodelview2 = modelview;

	modelview=mult(translate(transX,1,0,0),modelview);
	modelview=mult(rotate(rotaShip,0,1,0),modelview);

	initialmodelview = modelview;

	//Spaceship part
	gl.useProgram(prog);


	gl.uniformMatrix4fv(uProjection, false, flatten(projection));  // send projection matrix to the new shader program

	gl.enableVertexAttribArray(aCoords);
	gl.enableVertexAttribArray(aNormal);  // normal array not used for the other objects
	gl.enableVertexAttribArray(aTexCoord);



	//  now, draw box model
	/*modelview = initialmodelview;
	modelview = mult(modelview, translate(0, 0, 0.0));
	modelview = mult(modelview, rotate(0.0, 1, 0, 0));
	normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
	modelview = mult(modelview, scale(0.5, 0.5, 0.5));
	tetra.render();
	*/

	// if (ntextures_loaded == ntextures_tobeloaded) { // if texture image has been loaded
		if(true){

		//- -- -- SPACESHIP -- -- -//

		//var transX,transY,transZ;
		brushedMetal();

		//-- reactors --//

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -18.5,  -4.0,  0.0));
		modelview = mult(modelview, rotate(90, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.3, 0.3, 1));
		reactor_top.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -18.5,  4.0,  0.0));
		modelview = mult(modelview, rotate(90.0, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.3, 0.3, 1));
		reactor_bottom.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -14.5,  -4.0,  0.0));
		modelview = mult(modelview, rotate(90, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.3, 0.3, 1));
		reactor_front_top.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -14.5,  4.0,  0.0));
		modelview = mult(modelview, rotate(90.0, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.3, 0.3, 1));
		reactor_front_bottom.render();

		// -- -- plate/reactors fixations -- -- //

		blackMetal();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -17.5,  0,  0));
		modelview = mult(modelview, rotate(0, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.15, 0.35, 0.05));
		back_fix_mid.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -18.0,  0,  2));
		modelview = mult(modelview, rotate(-20, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.1, 0.05, 0.5));
		back_fix_left_bottom.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -18.0,  0,  -2));
		modelview = mult(modelview, rotate(20, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.1, 0.05, 0.5));
		back_fix_right_bottom.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -18,  4,  -2));
		modelview = mult(modelview, rotate(20, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.1, 0.05, 0.5));
		back_fix_left_top.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -18,  4,  2));
		modelview = mult(modelview, rotate(-20, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.1, 0.05, 0.5));
		back_fix_right_top.render();


		//-- back plate --//
		rusty();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( -17.0,  0,  4.5));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.5, 1.15, 0.05));
		back_left_main.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -17.0,  0,  -4.5));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.5, 1.15, 0.05));
		back_right_main.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -17.0,  6.85,  -4.1));
		modelview = mult(modelview, rotate(20, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.5, 0.25, 0.05));
		back_left_top.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -17.0, 6.85,  4.1));
		modelview = mult(modelview, rotate(-20, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.5, 0.25, 0.05));
		back_right_top.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -17.0,  -6.85,  -4.1));
		modelview = mult(modelview, rotate(-20, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.5, 0.25, 0.05));
		back_left_bottom.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -17.0,  -6.85,  4.1));
		modelview = mult(modelview, rotate(20, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.5, 0.25, 0.05));
		back_right_bottom.render();

		// -- -- main tubes -- -- //
		brushedMetal();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( -10,  4.0,  0.0));
		modelview = mult(modelview, rotate(90, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.3, 0.3, 1.25));
		tube1_back.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -5,  3.4,  0.0));
		modelview = mult(modelview, rotate(90.0, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.3, 0.3, 1));
		tube1_front.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -9,  -4.0,  0.0));
		modelview = mult(modelview, rotate(90, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.3, 0.3, 1.8));
		tube2.render();

		// -- -- hull - back part -- -- //
		blackMetal();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( -1.5,  0,  0.0));
		modelview = mult(modelview, rotate(90.0, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.5, 0.8, 1));
		hull_cylinder.render();

		rusty();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( -0.5,  0,  0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.5, 1.8, 1.25));
		hull_back.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( 10,  0,  0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(1.65, 1.8, 1.25));
		hull_main.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( 13.8,  10,  0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(2.35, 0.3, 0.75));
		hull_main_top.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( 13.8,  9.5,  -4.3));
		modelview = mult(modelview, rotate(-45, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(2.35, 0.2, 0.35));
		hull_main_right_top.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( 13.8, 9.5,  4.3));
		modelview = mult(modelview, rotate(45, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(2.35, 0.2, 0.35));
		hull_main_left_top.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( 2.2,  10,  4.85));
		modelview = mult(modelview, rotate(-45, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(1, 0.35, 0.05));
		hull_back_right_top.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 2.2,  10,  -4.85));
		modelview = mult(modelview, rotate(45, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(1, 0.35, 0.05));
		hull_back_left_top.render();

		// -- -- hull front -- -- //
		grid();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 19,  0,  0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.4, 1.5, 1));
		hull_grid.render();

		rusty();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 26.5,  0,  0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.3, 1.8, 0.75));
		hull_front.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( 23.25,  0,  0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.45, 1.8, 1.25));
		hull_front2.render();


		modelview = initialmodelview;
		modelview = mult(modelview, translate( 18.5,  0,  5.4));
		modelview = mult(modelview, rotate(35, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.2, 1.5, 0.05));
		hull_front_right_angle.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 18.5,  0,  -5.4));
		modelview = mult(modelview, rotate(-35, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.2, 1.5, 0.05));
		hull_front_left_angle.render();


		//-- -- plates over grid -- --//
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 21,  7.5,  6));
		modelview = mult(modelview, rotate(180, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.85, 0.3, 0.05));
		hull_front_right_top_plate.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 21,  7.5,  -6));
		modelview = mult(modelview, rotate(180, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.85, 0.3, 0.05));
		hull_front_left_top_plate.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( 21,  -7.5,  6));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.85, 0.3, 0.05));
		hull_front_right_bottom_plate.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 21,  -7.5,  -6));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.85, 0.3, 0.05));
		hull_front_left_bottom_plate.render();

		// -- -- top -- -- //
/////////
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 26.65, 10, 0));
		modelview = mult(modelview, rotate(90, 0, 1, 0));
		modelview = mult(modelview, rotate(135, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.75, 0.35, 0.05));
		hull_front_top.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( 26, 10.15, -4.25));
		modelview = mult(modelview, rotate(135, 0, 1, 0));
		modelview = mult(modelview, rotate(145, 1, 0, 0));
		modelview = mult(modelview, rotate(180, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.3, 0.3, 0.05));
		hull_front_top_left.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( 26, 10.15, 4.25));
		modelview = mult(modelview, rotate(-135, 0, 1, 0));
		modelview = mult(modelview, rotate(-145, 1, 0, 0));
		modelview = mult(modelview, rotate(180, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.3, 0.3, 0.05));
		hull_front_top_right.render();


		modelview = initialmodelview;
		modelview = mult(modelview, translate( 26.55, 0, 4.85));
		modelview = mult(modelview, rotate(45, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.35, 1.8, 0.05));
		hull_front_right_angle.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( 26.55, 0, -4.85));
		modelview = mult(modelview, rotate(-45, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.35, 1.8, 0.05));
		hull_front_left_angle.render();


		//bottom
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 11.2, -10, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(2.85, 0.3, 0.75));
		hull_main_bottom.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( 11.2, -9.5, 4.3));
		modelview = mult(modelview, rotate(-45, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(2.85, 0.2, 0.35));
		hull_main_right_bottom.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( 11.2, -9.5, -4.3));
		modelview = mult(modelview, rotate(45, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(2.85, 0.2, 0.35));
		hull_main_left_bottom.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( 26.65, -10, 0));
		modelview = mult(modelview, rotate(-90, 0, 1, 0));
		modelview = mult(modelview, rotate(135, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.75, 0.35, 0.05));
		hull_front_bottom.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( 26, -10.15, 4.25));
		modelview = mult(modelview, rotate(-135, 0, 1, 0));
		modelview = mult(modelview, rotate(145, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.3, 0.3, 0.05));
		hull_front_bottom_left.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( 26, -10.15, -4.25));
		modelview = mult(modelview, rotate(135, 0, 1, 0));
		modelview = mult(modelview, rotate(-145, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.3, 0.3, 0.05));
		hull_front_bottom_right.render();


		//-- -- side wings -- -- //
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 17, -8.5, 7.5));
		modelview = mult(modelview, rotate(-75, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.7, 0.05, 0.2));
		side_left_top.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 17.75, -10.4, 6.25));
		modelview = mult(modelview, rotate(-45, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.55, 0.05, 0.3));
		side_left_middle.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 15, -10.4, 6.25));
		modelview = mult(modelview, rotate(45, 1, 0, 0));
		modelview = mult(modelview, rotate(180, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.3, 0.3, 0.05));
		side_left_angle.render();


		modelview = initialmodelview;
		modelview = mult(modelview, translate( 17, -8.5, -7.5));
		modelview = mult(modelview, rotate(75, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.7, 0.05, 0.2));
		side_right_top.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 17.75, -10.4, -6.255));
		modelview = mult(modelview, rotate(45, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.55, 0.05, 0.3));
		side_right_middle.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 15, -10.4, -6.255));
		modelview = mult(modelview, rotate(-45, 1, 0, 0));
		modelview = mult(modelview, rotate(180, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.3, 0.3, 0.05));
		side_right_angle.render();

		// -- -- feet parts and tube structures -- -- //
		blackMetal();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( -11.5, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.05, 0.35, 0.12));
		tube_structure_back.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( -8, 0, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.05, 0.35, 0.12));
		tube_structure_front.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( -9.75, 0, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.35, 0.12, 0.05));
		tube_structure_main.render();



		modelview = initialmodelview;
		modelview = mult(modelview, translate( -9.75, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.05, 0.05, 0.3));
		feet_axis.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -10.35, -1, -3));
		modelview = mult(modelview, rotate(60, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.35, 0.075, 0.03));
		feet_axis_left.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( -10.35, -1, 3));
		modelview = mult(modelview, rotate(60, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.35, 0.075, 0.03));
		feet_axis_right.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -10.35, -3, 4));
		modelview = mult(modelview, rotate(-30, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.4, 0.03, 0.2));
		feet_plate_left.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( -10.35, -3, -4));
		modelview = mult(modelview, rotate(-30, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.4, 0.03, 0.2));
		feet_plate_right.render();

		// -- -- commands -- -- //
		modelview = initialmodelview;
		modelview = mult(modelview, translate( -4.5, 7, 0));
		modelview = mult(modelview, rotate(40, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.2, 0.1, 0.15));
		command_bump.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( -3.5, 8.5, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.02, 0.02, 0.5));
		command_axis.render();


		modelview = initialmodelview;
		modelview = mult(modelview, translate( -3.5, 8.5, -5.25));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.1, 0.05, 0.05));
		command_plate_left.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( -3.5, 8.5, 5.25));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.1, 0.05, 0.05));
		command_plate_right.render();



		// -- -- tubes connected to wings -- -- //
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 18.5, -9, -6));
		modelview = mult(modelview, rotate(-25, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.13, 0.13, 0.2));
		big_tube1_left.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 15.5, -9, -6));
		modelview = mult(modelview, rotate(-25, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.13, 0.13, 0.2));
		big_tube2_left.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 18.5, -9, 6));
		modelview = mult(modelview, rotate(25, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.13, 0.13, 0.2));
		big_tube1_right.render();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 15.5, -9, 6));
		modelview = mult(modelview, rotate(25, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.13, 0.13, 0.2));
		big_tube2_right.render();


		// -- -- back tube top -- -- //
		brown();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -17, 6.75, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.5, 0.05, 0.3));
		tube_top_main.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -17, 6.25, -1.8));
		modelview = mult(modelview, rotate(-45, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.5, 0.05, 0.15));
		tube_top_left.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -17, 6.25, 1.8));
		modelview = mult(modelview, rotate(45, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.5, 0.05, 0.15));
		tube_top_right.render();


		modelview = initialmodelview;
		modelview = mult(modelview, translate( -11, 7.5, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.7, 0.05, 0.35));
		tube_top_main2.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -11, 6.5, -2.9));
		modelview = mult(modelview, rotate(-45, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.7, 0.05, 0.35));
		tube_top_left2.render();

		modelview = initialmodelview;
		modelview = mult(modelview, translate( -11, 6.5, 2.9));
		modelview = mult(modelview, rotate(45, 1, 0, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.7, 0.05, 0.35));
		tube_top_right2.render();


    modelview = initialmodelview;
		modelview = mult(modelview, translate( -12, 9, 0));
    modelview = mult(modelview, rotate(90, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.4, 0.3, 0.5));
		tube_seat_main.render();

    modelview = initialmodelview;
		modelview = mult(modelview, translate( -13.5, 8.5, 0));
    //modelview = mult(modelview, rotate(90, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.08, 0.08, 0.2));
		tube_seat_back.render();

		modelview=mult(translate(rotaShip,0,0),modelview);



		grid();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 26, 0, 0.0));
		modelview = mult(modelview, rotate(90.0, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.35, 0.8, 1));
		hull_cylinder_grid.render();

		blackMetal();
		modelview = initialmodelview;
		modelview = mult(modelview, translate( 25.8, 0, 0.0));
		modelview = mult(modelview, rotate(90.0, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);
		modelview = mult(modelview, scale(0.37, 0.8, 1));
		hull_cylinder_grid_tour.render();



		//Planetes
		//terre
		terreTex();
		modelview = initialmodelview2;
		modelview = mult(modelview, translate(0,0,-70));
		modelview = mult(modelview, rotate(planetsRota, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
		modelview = mult(modelview, scale(2, 2, 2));
		terre.render();

		luneTex();
		modelview = initialmodelview2;
		modelview = mult(modelview, translate(0,50,-70));
		modelview = mult(modelview, rotate(planetsRota, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
		modelview = mult(modelview, scale(0.5, 0.5, 0.5));
		lune.render();

		jupiterTex();
		modelview = initialmodelview2;
		modelview = mult(modelview, translate(150,0,0));
		modelview = mult(modelview, rotate(planetsRota, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
		modelview = mult(modelview, scale(3, 3, 3));
		jupiter.render();

		marsTex();
		modelview = initialmodelview2;
		modelview = mult(modelview, translate(-200,0,0));
		modelview = mult(modelview, rotate(planetsRota, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
		modelview = mult(modelview, scale(2, 2, 2));
		mars.render();

    sunTex();
		modelview = initialmodelview2;
		modelview = mult(modelview, translate(800,0,-800));
		modelview = mult(modelview, rotate(sunRota, 0, 0, 1));
		normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
		modelview = mult(modelview, scale(30, 30, 30));
		mars.render();

		cubeTranslucide();
		gl.uniform1f(alphaLoc, 0.5);
		modelview = initialmodelview2;
    modelview = mult(modelview, translate(-50,0, 0));
    modelview = mult(modelview, rotate(planetsRota, 0, 1, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(2, 2, 2));
		translucide.render();
		gl.disable(gl.BLEND);
		gl.depthMask(true);

    // cubeReflechissant();
		// gl.uniform1f(alphaLoc, 0.5);
		// modelview = initialmodelview2;
    // modelview = mult(modelview, translate(-50, 50, 0));
    // modelview = mult(modelview, rotate(planetsRota, 0, 1, 0));
    // normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    // modelview = mult(modelview, scale(2, 2, 2));
		// reflechissant.render();
		// gl.disable(gl.BLEND);
		// gl.depthMask(true);

    // if (texIDmap0.isloaded ) {  // if texture images have been loaded
    //     var initialmodelview = modelview;
    //     // Draw the environment (box)
    //     gl.useProgram(progbox); // Select the shader program that is used for the environment box.
    //     gl.uniformMatrix4fv(uProjectionbox, false, flatten(projection));
    //     gl.enableVertexAttribArray(aCoordsbox);
    //     gl.disableVertexAttribArray(aNormalbox);     // normals are not used for the box
    //     gl.disableVertexAttribArray(aTexCoordbox);  // texture coordinates not used for the box
    //     gl.activeTexture(gl.TEXTURE0);
    //     gl.bindTexture(gl.TEXTURE_CUBE_MAP, texIDmap0);
    //     // Send texture to sampler
    //     gl.uniform1i(uEnvbox, 0);
    //     normalMatrix = extractNormalMatrix(modelview);
    //     envbox.render();
    // }

	}
}
