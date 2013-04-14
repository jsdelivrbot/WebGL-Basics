/*
The normal boilerplate and then setting the textures
So, loading the textures, getting the shaders,
putting wanted GL settings (clear colour),
vertex data for the cube
and in the end binding everything and
rendering
*/

///////////////////////////////////////////////////////////////////////////////////////////////////


function GLContainer()
{
	this.gl = null;
	this.shaders = null;
	this.vertices = null;
	this.indices = null;
	this.viewport = null;
	this.cubetexture = null;
	this.buffers = null;
	this.attriblocation = null;
}

function Viewport(width, height)
{
	this.width = width;
	this.height = height;
}

function Shaders()
{
	this.vertex = null;
	this.fragment = null;
	this.shader = null;
}


function CubeTexture()
{
	this.texture = null;
	this.samplerLocation = null;
	this.posx = null;
	this.negx = null;
	this.posy = null;
	this.negy = null;
	this.posz = null;
	this.negz = null;
}

function BufferContainer()
{
	this.vertexbuffer = null;
	this.elementbuffer = null;
}


///////////////////////////////////////////////////////////////////////////////////////////////////

function GetGLContext(glContainer)
{
	var canvas = document.getElementById("WebGLCanvas");
	glContainer.gl = canvas.getContext("experimental-webgl");
	glContainer.viewport = new Viewport(canvas.width, canvas.height);
}

function FixGLSettings(glContainer)
{
	glContainer.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	glContainer.gl.viewport(0, 0, glContainer.viewport.width, glContainer.viewport.height);
}

function GetVertexData()
{
	var vertices = [
					1.0, 1.0, 0.0,
					1.0, -1.0, 0.0,
					-1.0, -1.0, 0.0,
					-1.0, 1.0, 0.0,

					1.0, 1.0, 1.0,
					1.0, -1.0, 1.0,
					-1.0, -1.0, 1.0,
					-1.0, 1.0, 1.0];
	return vertices;

}

function GetIndexData()
{
	var indices = [
					0, 1, 2,
					2, 3, 0,

					2, 3, 7,
					2, 6, 7,

					4, 5, 6,
					6, 7, 4,

					4, 5, 1,
					1, 0, 4,

					0, 1, 7,
					7, 3, 0,


					];
					return indices;
}

function LoadShaders(glContainer)
{
	glContainer.shaders = new Shaders();
	glContainer.shaders.vertex = CompileShader(glContainer, "Vertex");
	glContainer.shaders.fragment = CompileShader(glContainer, "Fragment");
	LinkShaderProgram(glContainer);
}

function LoadTextures(glContainer)
{


	//After loading the images

	glContainer.cubetexture.texture = glContainer.gl.createTexture();
	glContainer.gl.activeTexture(glContainer.gl.TEXTURE0);
	glContainer.gl.bindTexture(glContainer.gl.TEXTURE_CUBE, glContainer.cubetexture.texture);
	glContainer.gl.texImage2D(glContainer.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, glContainer.gl.RGBA, glContainer.gl.RGBA, glContainer.gl.UNSIGNED_BYTE, glContainer.cubetexture.posx);
	glContainer.gl.texImage2D(glContainer.gl.TEXTURE_CUBE_MAP_NEGATIV_X, 0, glContainer.gl.RGBA, glContainer.gl.RGBA, glContainer.gl.UNSIGNED_BYTE, glContainer.cubetexture.negx);
	glContainer.gl.texImage2D(glContainer.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, glContainer.gl.RGBA, glContainer.gl.RGBA, glContainer.gl.UNSIGNED_BYTE, glContainer.cubetexture.posy);
	glContainer.gl.texImage2D(glContainer.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, glContainer.gl.RGBA, glContainer.gl.RGBA, glContainer.gl.UNSIGNED_BYTE, glContainer.cubetexture.negy);
	glContainer.gl.texImage2D(glContainer.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, glContainer.gl.RGBA, glContainer.gl.RGBA, glContainer.gl.UNSIGNED_BYTE, glContainer.cubetexture.posz);
	glContainer.gl.texImage2D(glContainer.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, glContainer.gl.RGBA, glContainer.gl.RGBA, glContainer.gl.UNSIGNED_BYTE, glContainer.cubetexture.negz);
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
	glContainer.gl.attachShader(glContainer.shaders.shader, glContainer.shaders.vertex);
	glContainer.gl.attachShader(glContainer.shaders.shader, glContainer.shaders.fragment);
	glContainer.gl.linkProgram(glContainer.shaders.shader);


	//Checking the link status and issues
	console.log(glContainer.gl.LINK_STATUS);
	console.log(glContainer.gl.getProgramInfoLog(glContainer.shaders.shader));
}

function BindBufferData(glContainer)
{
	glContainer.buffers = new BufferContainer();
	glContainer.buffers.vertexbuffer = glContainer.gl.createBuffer();
	glContainer.buffers.elementbuffer = glContainer.gl.createBuffer();
	glContainer.gl.bindBuffer(glContainer.gl.ARRAY_BUFFER, glContainer.buffers.vertexbuffer);
	glContainer.gl.bufferData(glContainer.gl.ARRAY_BUFFER, new Float32Array(glContainer.vertices), glContainer.gl.STATIC_DRAW);
	glContainer.gl.bindBuffer(glContainer.gl.ELEMENT_ARRAY_BUFFER, glContainer.buffers.elementbuffer);
	glContainer.gl.bufferData(glContainer.gl.ELEMENT_ARRAY_BUFFER, new Float32Array(glContainer.indices), glContainer.gl.STATIC_DRAW);


}

function GetShaderVariableLocations(glContainer)
{
	glContainer.attriblocation = glContainer.gl.getAttribLocation(glContainer.shaders.shader, "a_Position");
	glContainer.cubetexture.samplerLocation = glContainer.gl.getUniformLocation(glContainer.shaders.shader, "u_CubeSampler");
}


function BindVariableData()
{

}


function Render(glContainer)
{
	glContainer.gl.clear(glContainer.gl.COLOR_BUFFER_BIT);

	glContainer.gl.useProgram(glContainer.shaders.shader);

	glContainer.gl.drawElements(glContainer.gl.TRIANGLES, glContainer.indices.length, glContainer.gl.UNSIGNED_BYTE, glContainer.indices);
}

function Debug(glContainer)
{
	console.log(glContainer.vertices);
	console.log(glContainer.indices);
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function main()
{
	var glContainer = new GLContainer();

	GetGLContext(glContainer);
	FixGLSettings(glContainer);
	glContainer.vertices = GetVertexData();
	glContainer.indices = GetIndexData();
	BindBufferData(glContainer);
	LoadShaders(glContainer);
	/*LoadTextures();*/
	Debug(glContainer);
	GetShaderVariableLocations(glContainer);
	//BindVariableData(glContainer);
	Render(glContainer);

}