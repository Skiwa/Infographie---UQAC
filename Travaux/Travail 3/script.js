// This program was developped by Daniel Audet and uses sections of code
// from http://math.hws.edu/eck/cs424/notes2013/19_GLSL.html
//
//  It has been adapted to be compatible with the "MV.js" library developped
//  for the book "Interactive Computer Graphics" by Edward Angel and Dave Shreiner.
//

"use strict";

var gl;                                               // The webgl context.

var CoordsLoc;                                        // Location of the coords attribute variable in the standard texture mappping shader program.
var NormalLoc;
var TexCoordLoc;

var ProjectionLoc;                                   // Location of the uniform variables in the standard texture mappping shader program.
var ModelviewLoc;
var NormalMatrixLoc;


var projection;                                     //--- projection matrix
var modelview;                                      // modelview matrix
var flattenedmodelview;                             //--- flattened modelview matrix

var normalMatrix = mat3();                          //--- create a 3X3 matrix that will affect normals

var rotator;                                        // A SimpleRotator object to enable rotation by mouse dragging.

var sphere, cylinder;                               // model identifiers
var spheres=[];
var cylinders=[];
var nbCyl=0;
var nbSph=0;

//var hemisphereinside, hemisphereoutside, thindisk;
//var quartersphereinside, quartersphereoutside;

var prog;  // shader program identifier

var lightPosition = vec4(20.0, 20.0, 100.0, 1.0);

var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(0.0, 0.1, 0.3, 1.0);
var materialDiffuse = vec4(0.48, 0.55, 0.69, 1.0);
var materialSpecular = vec4(0.48, 0.55, 0.69, 1.0);
var materialShininess = 100.0;

var ambientProduct, diffuseProduct, specularProduct;

var i=0;  //deplacement sphere
var compteur=0;

var cylX,cylY,cylZ;
var sphX,sphY,sphZ;
var nbIterations=0;

var coordonneesSpheres=[];
var coordonneesCylindres=[];
var taille=0;
var success;
function render() {
    i+=0.05;             //vitesse du tuyau
    compteur++;         //nombre d'appels de render()
    success=false;


    gl.clearColor(0.79, 0.76, 0.27, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //--- Get the rotation matrix obtained by the displacement of the mouse
    flattenedmodelview = rotator.getViewMatrix();
    modelview = unflatten(flattenedmodelview);

	  normalMatrix = extractNormalMatrix(modelview);

    var initialmodelview = modelview;





    if(nbIterations==0 && compteur==1){
      //sphere de départ
      coordonneesSpheres.push(0,0,0);
    }



    if (Math.floor((Math.random()*10)+1)%5==0){     // 1 chance sur 5 qu'il change de direction
      success=true;
      var direction=Math.floor((Math.random()*4)+1);  //direction choisie aléatoirement

      // coordonneesSpheres.push(1);
      // coordonneesSpheres.push(1);
      // coordonneesSpheres.push(1);

      sphX=coordonneesSpheres[nbIterations*3];
      sphY=coordonneesSpheres[nbIterations*3+1];
      sphZ=coordonneesSpheres[nbIterations*3+2];

      switch(direction){
        case 1:
          coordonneesSpheres.push(sphX,sphY,sphZ);
        break;
        case 2:
          coordonneesSpheres.push(sphX,sphY,sphZ);
        break;
        case 3:
          coordonneesSpheres.push(sphX,sphY,sphZ);
        break;
        case 4:
          coordonneesSpheres.push(sphX,sphY,sphZ);
        break;
        case 5:
          coordonneesSpheres.push(sphX,sphY,sphZ);
        break;
        case 6:
          coordonneesSpheres.push(sphX,sphY,sphZ);
        break;
      }
      coordonneesCylindres.push(sphX,sphY,sphZ,direction,i);

      nbIterations++;                              //Incrémentation
      i=0;
    }

    //redessine les spheres
    for (var j=nbIterations;j>0;j--){

      sphX=coordonneesSpheres[j*3];
      sphY=coordonneesSpheres[j*3+1];
      sphZ=coordonneesSpheres[j*3+2];
      taille=coordonneesCylindres[j*5+4];
      direction=coordonneesCylindres[j*5+3];

       modelview = initialmodelview;
       switch(direction){
         case 1:sphY=sphY+taille;modelview = mult(modelview, translate(sphX,(sphY*20)+taille,sphZ));break;
         case 2:sphY=sphY-taille;modelview = mult(modelview, translate(sphX,(sphY*20)+taille,sphZ));break;
         case 3:sphX=sphX+taille;modelview = mult(modelview, translate((sphX*20)+taille,sphY,sphZ));break;
         case 4:sphX=sphX-taille;modelview = mult(modelview, translate((sphX*20)+taille,sphY,sphZ));break;
         case 5:sphZ=sphZ+taille;modelview = mult(modelview, translate(sphX,sphY,(sphZ*20)+taille));break;
         case 6:sphZ=sphZ-taille;modelview = mult(modelview, translate(sphX,sphY,(sphZ*20)+taille));break;
       }

       modelview = mult(modelview, rotate(0.0, 1, 0, 0));
       normalMatrix = extractNormalMatrix(modelview);
       modelview = mult(modelview, scale(0.2, 0.2, 0.2));
       sphere.render();
    }
    //redessine les cylindres
    for (var j=nbIterations;j>0;j--){
      cylX=coordonneesCylindres[j*5];
      cylY=coordonneesCylindres[j*5+1];
      cylZ=coordonneesCylindres[j*5+2];
      direction=coordonneesCylindres[j*5+3];
      taille=coordonneesCylindres[j*5+4];

      sphX=coordonneesSpheres[j*3];
      sphY=coordonneesSpheres[j*3+1];
      sphZ=coordonneesSpheres[j*3+2];

      switch(direction){
        case 1:
          modelview = initialmodelview;
          modelview = mult(modelview, translate(sphX,(sphY*20)+(taille*10+taille),sphZ));
          modelview = mult(modelview, rotate(90, 90, 1, 0));
          normalMatrix = extractNormalMatrix(modelview);
          modelview = mult(modelview, scale(0.1, 0.1,taille));
          cylinder.render();
        break;
        case 2:
          modelview = initialmodelview;
          modelview = mult(modelview, translate(sphX,(sphY*20)-(taille*10+taille),sphZ));
          modelview = mult(modelview, rotate(90, 90, 1, 0));
          normalMatrix = extractNormalMatrix(modelview);
          modelview = mult(modelview, scale(0.1, 0.1,taille));
          cylinder.render();
        break;
        case 3:
          modelview = initialmodelview;
          modelview = mult(modelview, translate((sphX*20)+(taille*10+taille),sphY,sphZ));
          modelview = mult(modelview, rotate(90, 1, 90, 0));
          normalMatrix = extractNormalMatrix(modelview);
          modelview = mult(modelview, scale(0.1, 0.1,taille));
          cylinder.render();
        break;
        case 4:
          modelview = initialmodelview;
          modelview = mult(modelview, translate((sphX*20)-(taille*10+taille),sphY,sphZ));
          modelview = mult(modelview, rotate(90, 1, 90, 0));
          normalMatrix = extractNormalMatrix(modelview);
          modelview = mult(modelview, scale(0.1, 0.1,taille));
          cylinder.render();
        break;
        case 5:
          modelview = initialmodelview;
          modelview = mult(modelview, translate(sphX,sphY,(sphZ*20)-(taille*10+taille)));
          modelview = mult(modelview, rotate(1, 90, 90, 0));
          normalMatrix = extractNormalMatrix(modelview);
          modelview = mult(modelview, scale(0.1, 0.1,taille));
          cylinder.render();
        break;
        case 6:
          modelview = initialmodelview;
          modelview = mult(modelview, translate(sphX,sphY,(sphZ*20)-(taille*10+taille)));
          modelview = mult(modelview, rotate(1,90 , 90, 0));
          normalMatrix = extractNormalMatrix(modelview);
          modelview = mult(modelview, scale(0.1, 0.1,taille));
          cylinder.render();
        break;
      }
    }





      // if(nbIterations==0){
      //
      //   //-- cylindre de départ --//
      //   modelview = initialmodelview;
      //   modelview = mult(modelview, translate(0, i*10, 0));
      //   modelview = mult(modelview, rotate(90, 1, 0, 0));
      //   normalMatrix = extractNormalMatrix(modelview);
      //   modelview = mult(modelview, scale(0.1, 0.1, i));
      //   //coordonnées du cylindre (pour placer une sphere)
      //   cylX = modelview[1][1]; //x
      //   cylY = modelview[1][2]; //y
      //   cylZ = modelview[1][3]; //z
      //
      //   cylinder.render();
      // }






    //  //redessine premier cylindre
    //  if(nbIterations>1){
    //    modelview = initialmodelview;
    //    modelview = mult(modelview, translate(0,coordonneesCylindres[1][4]*10,0));     //On crée une sphere pour chaque position du cylindre enregistrée
    //    modelview = mult(modelview, rotate(90, 1, 0, 0));
    //    normalMatrix = extractNormalMatrix(modelview);
    //    modelview = mult(modelview, scale(0.1, 0.1,coordonneesCylindres[1][4] ));
    //    cylinder.render();
     //
    //    //coordonnées du cylindre (pour placer une sphere)
    //    cylX = modelview[1][1]; //x
    //    cylY = modelview[1][2]; //y
    //    cylZ = modelview[1][3]; //z
     //
    //    if(success){
    //      coordonneesSpheres.push([cylX,cylY,cylZ]);
    //    }
     //
     //
    //  }
    //  //-- -- -- Redessine toutes les spheres créées -- -- -- //
    //  for(var j=nbIterations;j>0;j--){
    //    modelview = initialmodelview;
    //    modelview = mult(modelview, translate(coordonneesSpheres[j][0],-coordonneesSpheres[j][1]*20,coordonneesSpheres[j][2]-1.7));     //On crée une sphere pour chaque position du cylindre enregistrée
    //    modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    //    normalMatrix = extractNormalMatrix(modelview);
    //    modelview = mult(modelview, scale(0.2, 0.2, 0.2));
    //    sphere.render();
    //  }







     // -- -- -- Redessine tous les cylindres créés -- -- -- //
    //  for(var j=nbIterations;j>0;j--){
    //    modelview = initialmodelview;
    //    taille=coordonneesCylindres[j][4];
    //    switch(coordonneesCylindres[j][3]){  //en fonction de la direction décidée
    //        case 1:
    //        modelview = mult(modelview, translate(0,-coordonneesCylindres[j][1]*20,taille*10));
    //        modelview = mult(modelview, rotate(1,90,90, 0));
    //        normalMatrix = extractNormalMatrix(modelview);
    //        modelview = mult(modelview, scale(0.1, 0.1, taille));
    //        cylinder.render();
    //        break;
    //        case 2:
    //        modelview = mult(modelview, translate(0,-coordonneesCylindres[j][1]*20,-taille*10));
    //        modelview = mult(modelview, rotate(1,90,90, 0));
    //        normalMatrix = extractNormalMatrix(modelview);
    //        modelview = mult(modelview, scale(0.1, 0.1, taille));
    //        cylinder.render();
    //        break;
    //        case 3:
    //         modelview = mult(modelview, translate(taille*10,-coordonneesCylindres[j][1]*20,0));
    //         modelview = mult(modelview, rotate(90,1,90, 0));
    //         normalMatrix = extractNormalMatrix(modelview);
    //         modelview = mult(modelview, scale(0.1, 0.1, taille));
    //         cylinder.render();
    //        break;
    //        case 4:
    //          modelview = mult(modelview, translate(-taille*10,-coordonneesCylindres[j][1]*20,0));
    //          modelview = mult(modelview, rotate(90,1,90, 0));
    //          normalMatrix = extractNormalMatrix(modelview);
    //          modelview = mult(modelview, scale(0.1, 0.1, taille));
    //          cylinder.render();
    //        break;
          //  case 5:
          //   modelview = mult(modelview, translate(-coordonneesCylindres[j][1],-taille*10,0));
          //   modelview = mult(modelview, rotate(90,90,1, 0));
          //   normalMatrix = extractNormalMatrix(modelview);
          //   modelview = mult(modelview, scale(0.1, 0.1, taille));
          //   cylinder.render();
          //  break;
          //  case 6:
          //   modelview = mult(modelview, translate(-coordonneesCylindres[j][1],taille*10,0));
          //   modelview = mult(modelview, rotate(90,90,1, 0));
          //   normalMatrix = extractNormalMatrix(modelview);
          //   modelview = mult(modelview, scale(0.1, 0.1, taille));
          //   cylinder.render();
          //  break;
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
        //console.log(this.count);
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

        gl.enableVertexAttribArray(CoordsLoc);
        gl.enableVertexAttribArray(NormalLoc);
		gl.disableVertexAttribArray(TexCoordLoc);  // we do not need texture coordinates

        gl.enable(gl.DEPTH_TEST);

        //  create a "rotator" monitoring mouse mouvement
        rotator = new SimpleRotator(canvas, render);
        //  set initial camera position at z=40, with an "up" vector aligned with y axis
        //   (this defines the initial value of the modelview matrix )
        rotator.setView([0, 0, 1], [0, 1, 0], 40);

        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);

		gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
		gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
		gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));
		gl.uniform1f(gl.getUniformLocation(prog, "shininess"), materialShininess);

		gl.uniform4fv(gl.getUniformLocation(prog, "lightPosition"), flatten(lightPosition));

		projection = perspective(70.0, 1.0, 1.0, 200.0);
		gl.uniformMatrix4fv(ProjectionLoc, false, flatten(projection));  // send projection matrix to the shader program

		// You can use basic models using the following lines

        sphere = createModel(uvSphere(10.0, 25.0, 25.0));
        cylinder = createModel(uvCylinder(10.0, 20.0, 25.0, false, false));
        //box = createModel(cube(10.0));
        //
		    // teapot = createModel(teapotModel);
        // disk = createModel(ring(5.0, 10.0, 25.0));
        // torus = createModel(uvTorus(15.0, 5.0, 25.0, 25.0));
        // cone = createModel(uvCone(10.0, 20.0, 25.0, true));
        //
		    // hemisphereinside = createModel(uvHemisphereInside(10.0, 25.0, 25.0));
		    // hemisphereoutside = createModel(uvHemisphereOutside(10.0, 25.0, 25.0));
        // thindisk = createModel(ring(9.5, 10.0, 25.0));
        //
		    // quartersphereinside = createModel(uvQuartersphereInside(10.0, 25.0, 25.0));
		    // quartersphereoutside = createModel(uvQuartersphereOutside(10.0, 25.0, 25.0));

    }
    catch (e) {
        document.getElementById("message").innerHTML =
             "Could not initialize WebGL: " + e;
        return;
    }

    setInterval(render, 200);
}
