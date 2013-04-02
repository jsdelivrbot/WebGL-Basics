/*
	Getting a WebGL context to canvas
	Getting the shaders from document (for this exercise)
	Compiling the shaders
	Attaching the shaders to form a shader object
	Defining the vertex data
	Binding the vertex to buffer
	Drawing the stuff on the canvas
	Cleaning up
*/


function AttachWebGLContext(glContainer)
{

	var canvas = document.getElementById("WebGLCanvas");
	glContainer.gl = canvas.getContext("experimental-webgl");
	glContainer.gl.viewportWidth = canvas.width;
	glContainer.gl.viewportHeight = canvas.height;
	//Check problems with initialising if you feel like it.
}

function FixGLSettings(glContainer)
{
	glContainer.gl.clearColor(1.0, 1.0, 1.0, 1.0);
	glContainer.gl.enable(glContainer.gl.DEPTH_TEST);
}

function BindBufferData(glContainer)
{
	glContainer.bufferhandle = glContainer.gl.createBuffer();
	glContainer.gl.bindBuffer(glContainer.gl.ARRAY_BUFFER, glContainer.bufferhandle);
	glContainer.gl.bufferData(glContainer.gl.ARRAY_BUFFER, new Float32Array(glContainer.currentvertices), glContainer.gl.STATIC_DRAW);
	
}

function CompileShader(source, glContainer)
{
	var shader = document.getElementById(source);
	var shadertype = shader.type;
	var sourcecode = "";
	var shaderobject = null;



	//Creating a handle object for the shader.
	if (shadertype == ".frag")
	{
		shaderobject = glContainer.gl.createShader(glContainer.gl.FRAGMENT_SHADER);
	}
	else if (shadertype == ".vert")
	{
		shaderobject = glContainer.gl.createShader(glContainer.gl.VERTEX_SHADER);
	}
	else
	{
		alert("You didn't specify a proper shadertype.");
	}

	//Getting the shader source code
	sourcecode += shader.firstChild.textContent;


	//Giving the source and compiling the actual shader
	glContainer.gl.shaderSource(shaderobject, sourcecode);
	glContainer.gl.compileShader(shaderobject);

	//Check compile status
	console.log(glContainer.gl.COMPILE_STATUS);
	console.log(glContainer.gl.getShaderInfoLog(shaderobject));

	return shaderobject;
}

function LinkShaderProgram(frag, vert, glContainer)
{
	glContainer.shaderprogram = glContainer.gl.createProgram();
	glContainer.gl.attachShader(glContainer.shaderprogram, vert);
	glContainer.gl.attachShader(glContainer.shaderprogram, frag);
	glContainer.gl.linkProgram(glContainer.shaderprogram);

	console.log(glContainer.gl.LINK_STATUS);
	console.log(glContainer.gl.getProgramInfoLog(glContainer.shaderprogram));


}

function Draw(glContainer)
{

	//Clear the screen
	glContainer.gl.clear(glContainer.gl.COLOR_BUFFER_BIT | glContainer.gl.DEPTH_BUFFER_BIT);

	//Set the viewport
	glContainer.gl.viewport(0, 0, glContainer.gl.viewportWidth, glContainer.gl.viewportHeight);

	//Bind the proper buffer for drawing
	glContainer.gl.bindBuffer(glContainer.gl.ARRAY_BUFFER, glContainer.bufferhandle);

	//Use our (only) shader program for drawing
	glContainer.gl.useProgram(glContainer.shaderprogram);

	//Getting the proper attribute location for the vertex shader
	glContainer.attributelocation = glContainer.gl.getAttribLocation(glContainer.shaderprogram, "vertexposition");

	//Enabling the location for drawing
	glContainer.gl.enableVertexAttribArray(glContainer.attributelocation);

	//Calling vertexAttribPointer
	glContainer.gl.vertexAttribPointer(glContainer.attributelocation, glContainer.vertexfloats, glContainer.gl.FLOAT, false, 0, 0);

	//Drawing
	glContainer.gl.drawArrays(glContainer.gl.TRIANGLES, 0, glContainer.vertsintriangle);

	//Cleaning up, disabling the position
	glContainer.gl.disableVertexAttribArray(glContainer.attributelocation);
}

function dBug(glContainer)
{
	alert(glContainer);
	alert(glContainer.gl);
	alert(glContainer.shaderprogram);
	alert(glContainer.bufferhandle);
	alert(glContainer.currentvertices);
	alert(glContainer.attributelocation);
}

function main()
{
	var glContainer = {gl: null, shaderprogram: null, bufferhandle: null, currentvertices: null, attributelocation: null, vertexfloats: 4, vertsintriangle: 3};
	var frag, vert;
	var fragsource = "fragment";
	var vertsource = "vertex";
	var trivertices = [
						0.0, 0.0, 0.0, 1.0,
						0.0, 1.0, 0.0, 1.0,
						1.0, 0.0, 0.0, 1.0
						];
	glContainer.currentvertices = trivertices;



	AttachWebGLContext(glContainer);
	frag = CompileShader(fragsource, glContainer);
	vert = CompileShader(vertsource, glContainer);
	LinkShaderProgram(frag, vert, glContainer);
	BindBufferData(glContainer);
	FixGLSettings(glContainer);
	Draw(glContainer);
	//dBug(glContainer);



}

