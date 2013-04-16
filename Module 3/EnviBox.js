/*
The normal boilerplate and then setting the textures
So, loading the textures, getting the shaders,
putting wanted GL settings (clear colour),
vertex data for the cube
and in the end binding everything and
rendering
*/

///////////////////////////////////////////////////////////////////////////////////////////////////
var EnvironmentBox;


function EnviBox()
{
	var glContainer;

	function GLContainer()
	{
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
		this.textureloaded = false;
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
		/*
		Faces in order:
		Front, left, back, right, top, bottom
		*/
		var indices = [
						0, 1, 2,
						2, 3, 0,

						2, 3, 7,
						2, 6, 7,

						4, 5, 6,
						6, 7, 4,

						4, 5, 1,
						1, 0, 4,

						0, 4, 7,
						7, 3, 0,

						1, 2, 6,
						6, 5, 1
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
		
		glContainer.cubetexture = new CubeTexture();
		glContainer.cubetexture.texture = glContainer.gl.createTexture();
		glContainer.gl.activeTexture(glContainer.gl.TEXTURE0);
		glContainer.gl.bindTexture(glContainer.gl.TEXTURE_CUBE_MAP, glContainer.cubetexture.texture);
		glContainer.gl.texParameteri(glContainer.gl.TEXTURE_CUBE_MAP, glContainer.gl.TEXTURE_WRAP_S, glContainer.gl.CLAMP_TO_EDGE);
		glContainer.gl.texParameteri(glContainer.gl.TEXTURE_CUBE_MAP, glContainer.gl.TEXTURE_WRAP_T, glContainer.gl.CLAMP_TO_EDGE);
		glContainer.gl.texParameteri(glContainer.gl.TEXTURE_CUBE_MAP, glContainer.gl.TEXTURE_MIN_FILTER, glContainer.gl.LINEAR);


		
		glContainer.cubetexture.posx = new Image();
		glContainer.cubetexture.negx = new Image();
		glContainer.cubetexture.posy = new Image();
		glContainer.cubetexture.negy = new Image();
		glContainer.cubetexture.posz = new Image();
		glContainer.cubetexture.negz = new Image();



		glContainer.cubetexture.posx.onload = function() {BindCube_PosX(glContainer);}
		glContainer.cubetexture.negx.onload = function() {BindCube_NegX(glContainer);}
		glContainer.cubetexture.posy.onload = function() {BindCube_PosY(glContainer);}
		glContainer.cubetexture.negy.onload = function() {BindCube_NegY(glContainer);}
		glContainer.cubetexture.posz.onload = function() {BindCube_PosZ(glContainer);}
		glContainer.cubetexture.negz.onload = function() {BindCube_NegZ(glContainer);}



		glContainer.cubetexture.posx.src = "posx.jpg";
		glContainer.cubetexture.negx.src = "negx.jpg";
		glContainer.cubetexture.posy.src = "posy.jpg";
		glContainer.cubetexture.negy.src = "negy.jpg";
		glContainer.cubetexture.posz.src = "posz.jpg";
		glContainer.cubetexture.negz.src = "negz.jpg";

		
		
	}


	function BindCube_PosX(glContainer)
	{
		glContainer.gl.texImage2D(glContainer.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, glContainer.gl.RGBA, glContainer.gl.RGBA, glContainer.gl.UNSIGNED_BYTE, glContainer.cubetexture.posx);
		glContainer.cubetexture.posx.loaded = true;
	}
	function BindCube_NegX(glContainer)
	{
		glContainer.gl.texImage2D(glContainer.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, glContainer.gl.RGBA, glContainer.gl.RGBA, glContainer.gl.UNSIGNED_BYTE, glContainer.cubetexture.negx);
		glContainer.cubetexture.negx.loaded = true;
	}
	function BindCube_PosY(glContainer)
	{
		glContainer.gl.texImage2D(glContainer.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, glContainer.gl.RGBA, glContainer.gl.RGBA, glContainer.gl.UNSIGNED_BYTE, glContainer.cubetexture.posy);
		glContainer.cubetexture.posy.loaded = true;
	}
	function BindCube_NegY(glContainer)
	{
		glContainer.gl.texImage2D(glContainer.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, glContainer.gl.RGBA, glContainer.gl.RGBA, glContainer.gl.UNSIGNED_BYTE, glContainer.cubetexture.negy);
		glContainer.cubetexture.negy.loaded = true;
	}
	function BindCube_PosZ(glContainer)
	{
		glContainer.gl.texImage2D(glContainer.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, glContainer.gl.RGBA, glContainer.gl.RGBA, glContainer.gl.UNSIGNED_BYTE, glContainer.cubetexture.posz);
		glContainer.cubetexture.posz.loaded = true;
	}
	function BindCube_NegZ(glContainer)
	{
		glContainer.gl.texImage2D(glContainer.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, glContainer.gl.RGBA, glContainer.gl.RGBA, glContainer.gl.UNSIGNED_BYTE, glContainer.cubetexture.negz);
		glContainer.cubetexture.negz.loaded = true;
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
		glContainer.gl.bufferData(glContainer.gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(glContainer.indices), glContainer.gl.STATIC_DRAW);


	}

	function GetShaderVariableLocations(glContainer)
	{
		glContainer.attriblocation = glContainer.gl.getAttribLocation(glContainer.shaders.shader, "a_Position");
		glContainer.cubetexture.samplerLocation = glContainer.gl.getUniformLocation(glContainer.shaders.shader, "u_CubeSampler");
	}


	function PassVariableData(glContainer)
	{
		glContainer.gl.bindBuffer(glContainer.gl.ARRAY_BUFFER, glContainer.buffers.vertexbuffer);
		glContainer.gl.enableVertexAttribArray(glContainer.attriblocation);
		glContainer.gl.vertexAttribPointer(glContainer.attriblocation, 3, glContainer.gl.FLOAT, false, 0, 0);
		glContainer.gl.uniform1i(glContainer.cubetexture.samplerLocation, 0);



	}


	this.Render = function()
	{

		if (CheckTextureStatus(glContainer) == true)
		{

			glContainer.gl.clear(glContainer.gl.COLOR_BUFFER_BIT);

			glContainer.gl.useProgram(glContainer.shaders.shader);

			GetShaderVariableLocations(glContainer);

			PassVariableData(glContainer);

			glContainer.gl.bindBuffer(glContainer.gl.ELEMENT_ARRAY_BUFFER, glContainer.buffers.elementbuffer);

			glContainer.gl.drawElements(glContainer.gl.TRIANGLES, glContainer.indices.length, glContainer.gl.UNSIGNED_BYTE, 0);
		}
	}


	function Debug(glContainer)
	{
		//console.log(glContainer.vertices);
		//console.log(glContainer.indices);
		/*alert(glContainer.cubetexture.posx.loaded);
		alert(glContainer.cubetexture.negx.loaded); 
		alert(glContainer.cubetexture.posy.loaded);
		alert(glContainer.cubetexture.negy.loaded);
		alert(glContainer.cubetexture.posz.loaded);
		alert(glContainer.cubetexture.negz.loaded);*/
	}

	function CheckTextureStatus(glContainer)
	{
		if (glContainer.cubetexture.textureloaded == true)
		{
			return true;
		}
		else if (glContainer.cubetexture.posx.loaded == true &&
			glContainer.cubetexture.negx.loaded == true &&
			glContainer.cubetexture.posy.loaded == true &&
			glContainer.cubetexture.negy.loaded == true &&
			glContainer.cubetexture.posz.loaded == true &&
			glContainer.cubetexture.negz.loaded == true)
			{glContainer.cubetexture.textureloaded = true; return true;}
		else
		{
			return false;
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////////

	this.main = function()
	{
		glContainer = new GLContainer();

		GetGLContext(glContainer);
		FixGLSettings(glContainer);
		glContainer.vertices = GetVertexData();
		glContainer.indices = GetIndexData();
		BindBufferData(glContainer);
		LoadShaders(glContainer);
		LoadTextures(glContainer);
		//Debug(glContainer);

	}

} 
//End of EnviBox

function main()
{
	EnvironmentBox = new EnviBox();
	EnvironmentBox.main();
	Render();

}


function Render()
{
	requestAnimationFrame(Render);
	EnvironmentBox.Render();
}