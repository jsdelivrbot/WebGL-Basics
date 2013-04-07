var glContainer = {gl: null, radius: 1, angles: null, shaders: null, 
	bufferhandle: null, uniformlocation: null, attributelocation: null, anglecount: 16};
var shaderContainer = {vert: null, frag: null, shader: null };

function AttachWebGlContext(glContainer)
{
	var canvas = document.getElementById("WebGLCanvas");
	glContainer.gl = canvas.getContext("experimental-webgl");
	glContainer.gl.viewportWidth = canvas.width;
	glContainer.gl.viewportHeight = canvas.height;
}

function SetGLSettings(glContainer)
{
	glContainer.gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

function LoadShaders(glContainer)
{
	glContainer.shaders = shaderContainer;
	glContainer.shaders.vert = CompileShader(glContainer, "Vertex");
	glContainer.shaders.frag = CompileShader(glContainer, "Fragment");
	LinkShaderProgram(glContainer);


}

function CompileShader(glContainer, source)
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

function LinkShaderProgram(glContainer)
{
	glContainer.shaders.shader = glContainer.gl.createProgram();
	glContainer.gl.attachShader(glContainer.shaders.shader, glContainer.shaders.vert);
	glContainer.gl.attachShader(glContainer.shaders.shader, glContainer.shaders.frag);
	glContainer.gl.linkProgram(glContainer.shaders.shader);

	console.log(glContainer.gl.LINK_STATUS);
	console.log(glContainer.gl.getProgramInfoLog(glContainer.shaders.shader));
}

function LoadAngles(glContainer)
{
	var angles = new Array();
	var circle = 2 * Math.PI;

	for (i = 0; i < glContainer.anglecount; i++)
	{
		angles[i] = circle * (i / glContainer.anglecount);
	}

	glContainer.angles = angles;
}

function BindBufferData(glContainer)
{
	glContainer.bufferhandle = glContainer.gl.createBuffer();
	glContainer.gl.bindBuffer(glContainer.gl.ARRAY_BUFFER, glContainer.bufferhandle);
	glContainer.gl.bufferData(glContainer.gl.ARRAY_BUFFER, 
		new Float32Array(glContainer.angles), glContainer.gl.STATIC_DRAW);
}

function Render(rendertype)
{
	glContainer.gl.clear(glContainer.gl.COLOR_BUFFER_BIT);

	glContainer.gl.viewport(0, 0, glContainer.gl.viewportWidth, glContainer.gl.viewportHeight);

	glContainer.gl.bindBuffer(glContainer.gl.ARRAY_BUFFER, glContainer.bufferhandle);

	glContainer.gl.useProgram(glContainer.shaders.shader);

	glContainer.uniformlocation = glContainer.gl.getUniformLocation(glContainer.shaders.shader, "radius");

	glContainer.gl.uniform1f(glContainer.uniformlocation, glContainer.radius);
	
	glContainer.gl.attributelocation = glContainer.gl.getAttribLocation(glContainer.shaders.shader, "angle");

	glContainer.gl.enableVertexAttribArray(glContainer.attributelocation);

	glContainer.gl.vertexAttribPointer(glContainer.attributelocation, 1, glContainer.gl.FLOAT, false, 0, 0);

	if (rendertype == "LINE_LOOP")
	{
		glContainer.gl.drawArrays(glContainer.gl.LINE_LOOP, 0, glContainer.anglecount);
	}
	else if (rendertype == "POINT_SPRITE")
	{
		glContainer.gl.drawArrays(glContainer.gl.POINTS, 0, glContainer.anglecount);
	}
	else if (rendertype == "Polygon")
	{
		glContainer.gl.drawArrays(glContainer.gl.TRIANGLE_FAN, 0, glContainer.anglecount);
	}

}

function Debug(glContainer)
{
	alert(glContainer.angles);
}

function main()
{
	
	AttachWebGlContext(glContainer);
	SetGLSettings(glContainer);
	LoadShaders(glContainer);
	LoadAngles(glContainer);
	BindBufferData(glContainer);
	//Debug(glContainer);

}
