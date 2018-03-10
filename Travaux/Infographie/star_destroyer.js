
"use strict";
var gl;   // The webgl context.

var CoordsLoc;       // Location of the coords attribute variable in the standard texture mapping shader program.
var NormalLoc;
var TexCoordLoc;

var ProjectionLoc;     // Location of the uniform variables in the standard texture mappping shader program.
var ModelviewLoc;
var NormalMatrixLoc;

var projection;   //--- projection matrix
var modelview;    // modelview matrix
var flattenedmodelview;    //--- flattened modelview matrix

var noTexLoc;
var texLoc;

//Textures
var basicTexture, basicTexture2, sideTexture, basicTexture3, basicTexture4;

var initialmodelview;

var normalMatrix = mat3();  //--- create a 3X3 matrix that will affect normals

var rotator;   // A SimpleRotator object to enable rotation by mouse dragging.

var cylinder, cube, cubeTour, sphere, boutTrapeze, square, pyramide;  // model identifiers

var numNodes = 3;

//Id of nodes
var  idBody = 0;
var idTour = 1;
var idReactor = 2;

var theta = [0, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var stack = [];

var ship = [];

for( var i=0; i<numNodes; i++) ship[i] = createNode(null, null, null, null);

var prog;  // shader program identifier

var lightPosition = vec4(100.0, 20.0, 100.0, 1.0);

var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

//BASE MATERIAL
var materialAmbient = vec4(0.0, 0.1, 0.3, 1.0);
var materialDiffuse = vec4(0.48, 0.55, 0.69, 1.0);
var materialSpecular = vec4(0.48, 0.55, 0.69, 1.0);

var whiteAmbient = vec4(0.6, 0.6, 0.6, 1.0);
var whiteDiffuse = vec4(0.8, 0.8, 0.8, 1.0);
var whiteSpecular = vec4(0.7, 0.7, 0.7, 1.0);

var ewhiteAmbient = vec4(0.6, 0.6, 0.6, 1.0);
var ewhiteDiffuse = vec4(0.0, 0.0, 0.0, 1.0);
var ewhiteSpecular = vec4(0.0, 0.0, 0.0, 1.0);

var gray1Ambient = vec4(0.5, 0.5, 0.5, 1.0);
var gray1Diffuse = vec4(0.7, 0.7, 0.7, 1.0);
var gray1Specular = vec4(0.6, 0.6, 0.6, 1.0);

var gray2Ambient = vec4(0.4, 0.4, 0.4, 1.0);
var gray2Diffuse = vec4(0.6, 0.6, 0.6, 1.0);
var gray2Specular = vec4(0.5, 0.5, 0.5, 1.0);

var gray3Ambient = vec4(0.3, 0.3, 0.3, 1.0);
var gray3Diffuse = vec4(0.5, 0.5, 0.5, 1.0);
var gray3Specular = vec4(0.4, 0.4, 0.4, 1.0);

var gray4Ambient = vec4(0.2, 0.2, 0.2, 1.0);
var gray4Diffuse = vec4(0.4, 0.4, 0.4, 1.0);
var gray4Specular = vec4(0.3, 0.3, 0.3, 1.0);

var materialShininess = 50;


var ambientProduct, diffuseProduct, specularProduct;

function whiteMaterial()
{
        ambientProduct = mult(lightAmbient, whiteAmbient);
        diffuseProduct = mult(lightDiffuse, whiteDiffuse);
        specularProduct = mult(lightSpecular, whiteSpecular);
        gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));

}

function ewhiteMaterial()
{
        ambientProduct = mult(lightAmbient, ewhiteAmbient);
        diffuseProduct = mult(lightDiffuse, ewhiteDiffuse);
        specularProduct = mult(lightSpecular, ewhiteSpecular);
        gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));

}

function gray1Material() 
{
        ambientProduct = mult(lightAmbient, gray1Ambient);
        diffuseProduct = mult(lightDiffuse, gray1Diffuse);
        specularProduct = mult(lightSpecular, gray1Specular);
        gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));

}

function gray2Material() 
{
        ambientProduct = mult(lightAmbient, gray2Ambient);
        diffuseProduct = mult(lightDiffuse, gray2Diffuse);
        specularProduct = mult(lightSpecular, gray2Specular);
        gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));

}

function gray3Material() 
{
        ambientProduct = mult(lightAmbient, gray3Ambient);
        diffuseProduct = mult(lightDiffuse, gray3Diffuse);
        specularProduct = mult(lightSpecular, gray3Specular);
        gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));

}

function gray4Material() 
{
        ambientProduct = mult(lightAmbient, gray4Ambient);
        diffuseProduct = mult(lightDiffuse, gray4Diffuse);
        specularProduct = mult(lightSpecular, gray4Specular);
        gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));

}

function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

function initNodes(Id) 
{
    var m = mat4();
    
    switch(Id) {
        case idBody:
			m = mult(m, translate(0.0, 0.0, 0.0));
			m = mult(m, scale(3, 3, 3));
			ship[idBody] = createNode(m, body, null, idTour);
			break;
			
		case idTour:
			m = mult(m, translate(0.0, 0.0, 0.0));
			ship[idTour] = createNode(m, tour, null, idReactor);
			break;
			
		case idReactor:
			m = mult(m, translate(0, 0.0, 0.0));
			ship[idReactor] = createNode(m, reactor, null, null);
			break;
    }
}

function body()
{

    var originalmodelview = modelview;
	gray4Material();
	
	gl.uniform1i(noTexLoc, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, sideTexture);
    gl.uniform1i(gl.getUniformLocation(prog, "texture"), 2);
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(1.50, 0, 0));
	modelview = mult(modelview, rotate(74.65, 0, 1, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(15, 0.5, 1));
    square.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(-1.50, 0, 0));
	modelview = mult(modelview, rotate(-74.65, 0, 1, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(15, 0.5, 1));
    square.render();
	
	gl.uniform1i(noTexLoc, 0);
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 0, -7.6));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(7.9, 0.5, 1));
    square.render();
	
	whiteMaterial();
	
	gl.uniform1i(noTexLoc, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, basicTexture2);
    gl.uniform1i(gl.getUniformLocation(prog, "texture"), 1);
	
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(-2.2, 1, 0.4));
	modelview = mult(modelview, rotate(-90, 0, 1, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(15, 1.5, 4.4));
    pyramide.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(2.2, 1, 0.4));
	modelview = mult(modelview, rotate(-90, 0, 1, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(15, 1.5, -4.4));
    pyramide.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(-2.2, -1, 0.4));
	modelview = mult(modelview, rotate(-90, 0, 1, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(15, -1.5, 4.4));
    pyramide.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(2.2, -1, 0.4));
	modelview = mult(modelview, rotate(-90, 0, 1, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(15, -1.5, -4.4));
    pyramide.render();
	
	gl.uniform1i(noTexLoc, 0);
	
	ewhiteMaterial();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, -0.7, -4));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(1, 1, 1));
    sphere.render();
	
	gl.uniform1i(noTexLoc, 0);
    modelview = originalmodelview;
}

function tour()
{
	var originalmodelview = modelview;
	
	gray1Material();
	
	gl.uniform1i(noTexLoc, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, basicTexture);
    gl.uniform1i(gl.getUniformLocation(prog, "texture"), 0);
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 2.75, -7.3));
	modelview = mult(modelview, rotate(90, 0, 1, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.75, 2.5, 1));
    boutTrapeze.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 2.75, -6.3));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(1, 2.5, 1.25));
    cube.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 2.75, -5.3));
	modelview = mult(modelview, rotate(-90, 0, 1, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.75, 2.5, 1));
    boutTrapeze.render();
	
	gl.uniform1i(noTexLoc, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, basicTexture3);
    gl.uniform1i(gl.getUniformLocation(prog, "texture"), 2);
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 3.5, -5.5));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(3.6, 0.5, 1));
    cubeTour.render();
	
	gl.uniform1i(noTexLoc, 0);
	
	
	gl.uniform1i(noTexLoc, 1);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, basicTexture4);
    gl.uniform1i(gl.getUniformLocation(prog, "texture"), 3);
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0.9, 3.9, -5.5));
	modelview = mult(modelview, rotate(0, 0, 0, 1));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(1.8, 0.30, 1));
    boutTrapeze.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(-0.9, 3.9, -5.5));
	modelview = mult(modelview, rotate(0, 0, 0, 1));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(-1.8, 0.30, 1));
    boutTrapeze.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(-0.9, 3.1, -5.5));
	modelview = mult(modelview, rotate(0, 0, 0, 1));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(-1.8, -0.30, 1));
    boutTrapeze.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0.9, 3.1, -5.5));
	modelview = mult(modelview, rotate(0, 0, 0, 1));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(1.8, -0.30, 1));
    boutTrapeze.render();
	
	gl.uniform1i(noTexLoc, 0);
	
	gray1Material();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(1.5, 0.75, -4.5));
	modelview = mult(modelview, rotate(90, 0, 1, 0));
	modelview = mult(modelview, rotate(5, 0, 0, 1));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(4, 1, 1));
    square.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(1, 1.25, -3.9));
	modelview = mult(modelview, rotate(90, 0, 1, 0));
	modelview = mult(modelview, rotate(5, 0, 0, 1));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(5.2, 1, 1));
    square.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0.5, 1.75, -4.2));
	modelview = mult(modelview, rotate(90, 0, 1, 0));
	modelview = mult(modelview, rotate(5, 0, 0, 1));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(4.5, 1, 1));
    square.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(-1.5, 1.75, -4.2));
	modelview = mult(modelview, rotate(90, 0, 1, 0));
	modelview = mult(modelview, rotate(5, 0, 0, 1));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(4.5, 1, 1));
    square.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(-2, 1.25, -3.9));
	modelview = mult(modelview, rotate(90, 0, 1, 0));
	modelview = mult(modelview, rotate(5, 0, 0, 1));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(5.2, 1, 1));
    square.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(-2.5, 0.75, -4.5));
	modelview = mult(modelview, rotate(90, 0, 1, 0));
	modelview = mult(modelview, rotate(5, 0, 0, 1));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(4, 1, 1));
    square.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 0.75, -3));
	modelview = mult(modelview, rotate(5, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(4, 0.8, 1));
    square.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 1, -7));
	modelview = mult(modelview, rotate(5, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(4, 1, 1));
    square.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 1, -1.8));
	modelview = mult(modelview, rotate(5, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(3, 1.25, 1));
    square.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 1.5, -7));
	modelview = mult(modelview, rotate(5, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(3, 1, 1));
    square.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 1.5, -6.98));
	modelview = mult(modelview, rotate(5, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(2, 2, 1));
    square.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 1.6, -2.5));
	modelview = mult(modelview, rotate(5, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(2, 1, 1));
    square.render();
	
	whiteMaterial();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 0.75, -4.5));
	modelview = mult(modelview, rotate(-85, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(4, 4, 1));
    square.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 1.25, -3.9));
	modelview = mult(modelview, rotate(-85, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(3, 5.2, 1));
    square.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 1.75, -4.2));
	modelview = mult(modelview, rotate(-85, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(2, 4.5, 1));
    square.render();
	
	gray2Material();
	
	
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 0.9, -1.25));
	modelview = mult(modelview, rotate(30, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(1, 1, 0.8));
    cube.render();
	
	ewhiteMaterial();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(-1.25, 4, -5.5));
	modelview = mult(modelview, rotate(90, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.2, 0.2, 0.04));
    cylinder.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(1.25, 4, -5.5));
	modelview = mult(modelview, rotate(90, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.2, 0.2, 0.04));
    cylinder.render();
	
	whiteMaterial();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(1.25, 4.4, -5.5));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.3, 0.3, 0.3));
    sphere.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(-1.25, 4.4, -5.5));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.3, 0.3, 0.3));
    sphere.render();
	
	modelview = originalmodelview;
}

function reactor()
{
	var originalmodelview = modelview;
	
	gray3Material();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 0, -7.5));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.4, 0.4, 0.05));
    cylinder.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(1.5, 0, -7.5));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.4, 0.4, 0.05));
    cylinder.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(-1.5, 0, -7.5));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.4, 0.4, 0.05));
    cylinder.render();
	
	gray1Material();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(0, 0, -7));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.3, 0.3, 0.1));
    cylinder.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(1.5, 0, -7));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.3, 0.3, 0.1));
    cylinder.render();
	
	modelview = originalmodelview;
    modelview = mult(modelview, translate(-1.5, 0, -7));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.3, 0.3, 0.1));
    cylinder.render();
	
	modelview = originalmodelview;

}

function traverse(Id) 
{   
   if(Id == null) return; 
   
   stack.push(modelview);
   modelview = mult(modelview, ship[Id].transform);
   
   ship[Id].render();
   if(ship[Id].child != null) 
   {
	   traverse(ship[Id].child, modelview); 
   }
   
   modelview = stack.pop();
   
   if(ship[Id].sibling != null) 
   {
	   traverse(ship[Id].sibling, modelview); 
   }
}

function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    projection = perspective(70.0, 1.0, 1, 200.0); 

    //--- Get the rotation matrix obtained by the displacement of the mouse
    //---  (note: the matrix obtained is already "flattened" by the function getViewMatrix)
    flattenedmodelview = rotator.getViewMatrix();
    modelview = unflatten(flattenedmodelview);

	normalMatrix = extractNormalMatrix(modelview);
		
    initialmodelview = modelview;

    //  Select shader program 
    gl.useProgram(prog);

    gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));
    gl.uniform1f(gl.getUniformLocation(prog, "shininess"), materialShininess);

    gl.uniform4fv(gl.getUniformLocation(prog, "lightPosition"), flatten(lightPosition));

    gl.uniformMatrix4fv(ProjectionLoc, false, flatten(projection));  // send projection matrix to the new shader program

	gl.enableVertexAttribArray(CoordsLoc);
    gl.enableVertexAttribArray(NormalLoc);
    gl.enableVertexAttribArray(TexCoordLoc);  // we do not need texture coordinates

    traverse(idBody, modelview); //idBody is the root of the "tree", and represents the base of the spaceship model


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


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);

    model.render = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(CoordsLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(NormalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(TexCoordLoc, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.uniformMatrix4fv(ModelviewLoc, false, flatten(modelview));    //--- load flattened modelview matrix
        gl.uniformMatrix3fv(NormalMatrixLoc, false, flatten(normalMatrix));  //--- load flattened normal matrix

        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }
    return model;
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

        // LOAD SHADER (standard texture mapping)
        var vertexShaderSource = getTextContent("vshader");
        var fragmentShaderSource = getTextContent("fshader");
        prog = createProgram(gl, vertexShaderSource, fragmentShaderSource);

        gl.useProgram(prog);

        // locate variables for further use
        CoordsLoc = gl.getAttribLocation(prog, "vcoords");
        NormalLoc = gl.getAttribLocation(prog, "vnormal");
        TexCoordLoc = gl.getAttribLocation(prog, "vtexcoord");

        ModelviewLoc = gl.getUniformLocation(prog, "modelview");
        ProjectionLoc = gl.getUniformLocation(prog, "projection");
        NormalMatrixLoc = gl.getUniformLocation(prog, "normalMatrix");
        noTexLoc = gl.getUniformLocation(prog, "fnoTexture");

        gl.enableVertexAttribArray(CoordsLoc);
        gl.enableVertexAttribArray(NormalLoc);
        gl.enableVertexAttribArray(TexCoordLoc);

        gl.enable(gl.DEPTH_TEST);

        rotator = new SimpleRotator(canvas, render);
        rotator.setView([0, 0, 1], [0, 1, 0], 40);

        cube= createModel(cube(1.0));
		cubeTour= createModel(cubeTour(1.0));
		pyramide= createModel(pyramide(1.0));
		boutTrapeze= createModel(boutTrapeze(1.0));
		square= createModel(square(1.0));
        cylinder = createModel(uvCylinder(1.0, 10.0, 50.0, false, false));
		sphere = createModel(uvSphere(1.0, 50.0, 50.0));
		
		initTexture();
		
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);

        for(i=0; i<numNodes; i++) initNodes(i);

        render();
    }
    catch (e) {
        document.getElementById("message").innerHTML =
             "Could not initialize WebGL: " + e;
        return;
    }
}



function unflatten(matrix) {
    var result = mat4();
    result[0][0] = matrix[0]; result[1][0] = matrix[1]; result[2][0] = matrix[2]; result[3][0] = matrix[3];
    result[0][1] = matrix[4]; result[1][1] = matrix[5]; result[2][1] = matrix[6]; result[3][1] = matrix[7];
    result[0][2] = matrix[8]; result[1][2] = matrix[9]; result[2][2] = matrix[10]; result[3][2] = matrix[11];
    result[0][3] = matrix[12]; result[1][3] = matrix[13]; result[2][3] = matrix[14]; result[3][3] = matrix[15];

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

//  TEXTURE FUNCTIONS
function handleLoadedTexture(texture) 
{
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    texture.isloaded = true;

    render();  // Call render function when the image has been loaded (to insure the model is displayed)

    gl.bindTexture(gl.TEXTURE_2D, null);
}

//  TEXTURE FUNCTIONS
function handleLoadedTextureR(texture) 
{
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    texture.isloaded = true;

    render();  // Call render function when the image has been loaded (to insure the model is displayed)

    gl.bindTexture(gl.TEXTURE_2D, null);
}

function initTexture() 
{
    // define first texture
    basicTexture = gl.createTexture();
    basicTexture.isloaded = false; 

    basicTexture.image = new Image();
    basicTexture.image.onload = function () {
        handleLoadedTexture(basicTexture);
    }
    basicTexture.image.src = "basicTexture.jpg";
	
	
	basicTexture2 = gl.createTexture();
    basicTexture2.isloaded = false; 

    basicTexture2.image = new Image();
    basicTexture2.image.onload = function () {
        handleLoadedTexture(basicTexture2);
    }
    basicTexture2.image.src = "basicTexture2.jpg";
	
	
	basicTexture3 = gl.createTexture();
    basicTexture3.isloaded = false; 

    basicTexture3.image = new Image();
    basicTexture3.image.onload = function () {
        handleLoadedTexture(basicTexture3);
    }
    basicTexture3.image.src = "basicTexture3.jpg";
	
	
	basicTexture4 = gl.createTexture();
    basicTexture4.isloaded = false; 

	
    basicTexture4.image = new Image();
    basicTexture4.image.onload = function () {
        handleLoadedTexture(basicTexture4);
    }
    basicTexture4.image.src = "basicTexture4.jpg";
	
	
	sideTexture = gl.createTexture();
    sideTexture.isloaded = false; 

    sideTexture.image = new Image();
    sideTexture.image.onload = function () {
        handleLoadedTexture(sideTexture);
    }
    sideTexture.image.src = "sideTexture.jpg";
}


