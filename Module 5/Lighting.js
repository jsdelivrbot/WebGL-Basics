/*
Create application using Three.js that implements custom shader material for applying directional light and spot light illumination to example scene ground and ruin meshes. (You may keep the hand lighting implementation as it is). 
You may use scene.js and scene.html templates in module 5 code examples repo as basis for your answer.
Pass light parameters to shaders as uniforms from existing three.js objects.
Explain most significant parts of the code what they do. Especially, demonstate
How directional light support is implemented?
How spot light implementation differs from directional light implementation?
In which space you do lighting computations in the shader? camera, world or object space?
*/

/*
Loading the ruin mesh and textures. Also ground apparently
We need a spotlight and a directional light. Ambient is a bonus




I need:
THREE.JSONLoader
var rockTexture = THREE.ImageUtils.loadTexture("rock.jpg");
All the ruins.js files
Custom shader material
Camera
Scene
Movable controls?

*/


////////////////////////////// Controls //////////////////////////////

var mouse = {down : false, previousX: 0, previousY: 0}

document.onmousedown = function(ev)
{
	mouse.down = true;
	mouse.previousY = ev.pageY;
	mouse.previousX = ev.pageX;
	//console.log(lightingDemo.scene.camera.rotation.y);
	//console.log(lightingDemo.scene.camera.rotation.x);
}

document.onmouseup = function(ev)
{
	mouse.down = false;
}

document.onmousemove = function(ev)
{
	if (mouse.down === true)
	{

		var rotationAroundY = (ev.pageX - mouse.previousX) * 0.0001;
		var rotationAroundX = (ev.pageY - mouse.previousY) * 0.0001;

		lightingDemo.scene.camera.rotation.y += rotationAroundY;
		lightingDemo.scene.camera.rotation.x += rotationAroundX;
	}
}

////////////////////////////// Controls //////////////////////////////


////////////////////////////// Animated arm //////////////////////////////

function Shoulder()
{
	this.color = new THREE.MeshBasicMaterial({color: 0x00FF00});
	this.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.75, 5, 5), this.color);
	this.mesh.position.y = 0;

	this.rotationMin = -0.75;
	this.rotationMax = 1.5;
	this.direction = 1;


	this.add = function(object)
	{
		this.mesh.add(object);
	}
}

function UArm()
{
	this.color = new THREE.MeshBasicMaterial({color: 0xE1B899});
	this.mesh = new THREE.Mesh(new THREE.CubeGeometry(0.5, 1.25, 0.5), this.color);
	this.mesh.position.y = 1;
}

function Elbow()
{
	this.color = new THREE.MeshBasicMaterial({color: 0xFF0000});
	this.mesh = this.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 5, 5), this.color);
	this.mesh.position.y = 2;
	this.mesh.rotation.z = -0.5;

	this.rotationMin = -1.5;
	this.rotationMax = 0;
	this.direction = 1;

	this.add = function(object)
	{
		this.mesh.add(object);
	}
}

function LArm()
{
	this.color = new THREE.MeshBasicMaterial({color: 0xE1B899});
	this.mesh = this.mesh = new THREE.Mesh(new THREE.CubeGeometry(0.5, 1.25, 0.5), this.color);
	this.mesh.position.y = 1;
}

function Hand()
{
	this.color = new THREE.MeshBasicMaterial({color: 0x222277});
	this.mesh = this.mesh = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 0.5), this.color);
	this.mesh.position.y = 2;

	this.rotationMin = -0.75;
	this.rotationMax = 1;
	this.direction = 1;

	this.add = function(object)
	{
		this.mesh.add(object);
	}
}

function Finger()
{
	this.color = new THREE.MeshBasicMaterial({color: 0xEECEB3});
	this.mesh = this.mesh = new THREE.Mesh(new THREE.CubeGeometry(0.25, 0.75, 0.25), this.color);
	this.mesh.position.y = 0.9;
}

function Arm()
{
	this.joint = new THREE.Object3D();
	this.joint.position.x = 3;
	this.joint.position.y = 0.8;
	this.shoulder = new Shoulder();
	this.upperarm = new UArm();
	this.elbow = new Elbow();
	this.lowerarm = new LArm();
	this.hand = new Hand();
	this.thumb = new Finger();
	this.thumb.mesh.rotation.z = 2;
	this.thumb.mesh.position.x = 0.8;
	this.thumb.mesh.position.y = 0;
	this.indexfinger = new Finger();
	this.indexfinger.mesh.position.x = 0.4;
	this.middlefinger = new Finger();
	this.ringfinger = new Finger();
	this.ringfinger.mesh.position.x = -0.4;

	this.joint.add(this.shoulder.mesh);

	this.shoulder.add(this.upperarm.mesh);
	this.shoulder.add(this.elbow.mesh);
	this.elbow.add(this.lowerarm.mesh);
	this.elbow.add(this.hand.mesh);
	this.hand.add(this.thumb.mesh);
	this.hand.add(this.indexfinger.mesh);
	this.hand.add(this.middlefinger.mesh);
	this.hand.add(this.ringfinger.mesh);

}



function UpdateArmRotation(armobject)
{
	if (armobject.shoulder.mesh.rotation.z >= armobject.shoulder.rotationMax)
		{
			armobject.shoulder.direction = -1;
			armobject.elbow.direction = -1;
		}
		else if (armobject.shoulder.mesh.rotation.z < armobject.shoulder.rotationMin)
		{
			armobject.shoulder.direction = 1;
			armobject.elbow.direction = 1;
		}
		if (armobject.hand.mesh.rotation.x >= armobject.hand.rotationMax)
		{
			armobject.hand.direction = -1;
		}
		else if (armobject.hand.mesh.rotation.x < armobject.hand.rotationMin)
		{
			armobject.hand.direction = 1;
		}

		armobject.shoulder.mesh.rotation.z += 0.01 * armobject.shoulder.direction;
		armobject.elbow.mesh.rotation.z += 0.0045 * armobject.elbow.direction;
		armobject.hand.mesh.rotation.x += 0.01 * armobject.hand.direction;
}




////////////////////////////// Animated arm //////////////////////////////


////////////////////////////// Lighting //////////////////////////////

function SetUpLightingShader ()
{

}

////////////////////////////// Lighting //////////////////////////////


////////////////////////////// Loading //////////////////////////////


function LoadRuins()
{
	var meshloader = new THREE.JSONLoader();
	meshloader.load("ruins/ruins30.js", lightingDemo.assignRuins);    
    meshloader.load("ruins/ruins31.js", lightingDemo.assignRuins);
    meshloader.load("ruins/ruins33.js", lightingDemo.assignRuins);
    meshloader.load("ruins/ruins34.js", lightingDemo.assignRuins); 
    meshloader.load("ruins/ruins35.js", lightingDemo.assignRuins);
}

function LoadTextures()
{
	var textureloader = new THREE.TextureLoader();
	lightingDemo.scene.textures.push(textureloader.load("Textures/nightsky_down.png"));
	lightingDemo.scene.textures.push(textureloader.load("Textures/nightsky_up.png"));
	lightingDemo.scene.textures.push(textureloader.load("Textures/nightsky_north.png"));
	lightingDemo.scene.textures.push(textureloader.load("Textures/nightsky_east.png"));
	lightingDemo.scene.textures.push(textureloader.load("Textures/nightsky_south.png"));
	lightingDemo.scene.textures.push(textureloader.load("Textures/nightsky_west.png"));
	lightingDemo.scene.textures.push(textureloader.load("Textures/rock.jpg"));
}

function LoadShaders()
{
	lightingDemo.vertexShader = document.getElementById("CustomLightingVertexShader").text;
	lightingDemo.fragmentShader = document.getElementById("CustomLightingFragmentShader").text;
	

}

////////////////////////////// Loading //////////////////////////////

////////////////////////////// Scene Management //////////////////////////////

function Scene(canvaswidth, canvasheight)
{
	var viewangle = 90;
	var aspect = canvaswidth / canvasheight;
	var nearclip = 0.1;
	var farclip = 10000;

	this.threescene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(viewangle, aspect, nearclip, farclip);
	this.cameraobject = new THREE.Object3D();
	this.arm = new Arm();
	this.ruinsGeometry = [];
	this.ruins = [];
	this.textures = [];
	this.ground = null;
	this.skybox = null;
	this.skyboxmaterials = [];
	this.directionalLight = null;
	this.spotLight = null;
	this.customShader = null;
	this.vertexShader = null;
	this.fragmentShader = null;
}

function ConstructScene (scene)
{

	scene.textures[6].wrapS = THREE.RepeatWrapping;
	scene.textures[6].wrapT = THREE.RepeatWrapping;
	

	scene.cameraobject.add(scene.camera);

	scene.directionalLight = new THREE.DirectionalLight( 0xffffff );
	scene.spotLight = new THREE.SpotLight(0xffffff);

	scene.customShader = new THREE.ShaderMaterial(
							{
								vertexShader: lightingDemo.vertexShader,
								fragmentShader: lightingDemo.fragmentShader,
								transparent: false,
								uniforms: 
								{
									rockTexture: {type: 't', value: lightingDemo.scene.textures[6]},
									directionalLightVector: {type: 'v3', value: lightingDemo.scene.directionalLight.position},
									directionalLightDiffuse: {type: 'v4', value: new THREE.Vector4(lightingDemo.scene.directionalLight.color.r, 
																		  						   lightingDemo.scene.directionalLight.color.g,
																		  						   lightingDemo.scene.directionalLight.color.b,
																		  						   lightingDemo.scene.directionalLight.color.a)},
									directionalLightSpecular: {type: 'v4', value: new THREE.Vector4(0.2,0.2,0.2, 1)},
									spotLightPosition: {type: 'v3', value: scene.spotLight.position},
									spotLightTargetPosition: {type: 'v3', value: scene.spotLight.target.position},
									spotLightDiffuse: {type: 'v4', value: new THREE.Vector4(lightingDemo.scene.spotLight.color.r,
																								   lightingDemo.scene.spotLight.color.g,
																								   lightingDemo.scene.spotLight.color.b,
																								   lightingDemo.scene.spotLight.color.a)},
									spotLightSpecular: {type: 'v4', value: new THREE.Vector4(1, 1, 1, 0.9)},

									spotLightAngle: {type: 'f', value: scene.spotLight.angle}
								}
							});

	/*scene.ground = new THREE.Mesh (new THREE.CubeGeometry(100,0.2,100,1,1,1), 
							new THREE.MeshPhongMaterial(
								{map: scene.textures[6],
								transparent: true}));*/
	scene.ground = new THREE.Mesh (new THREE.CubeGeometry(100,0.2,100,1,1,1), scene.customShader);

	for (i = 0; i < scene.ruinsGeometry.length; i++)
	{
		scene.ruins[i] = new THREE.Mesh(scene.ruinsGeometry[i], scene.customShader);
		//scene.ruins[i] = new THREE.Mesh(scene.ruinsGeometry[i], new THREE.MeshPhongMaterial({map: scene.textures[6]}));
	}

	scene.ruins[0].rotation.x = Math.PI/2.0;
	scene.ruins[1].rotation.x = Math.PI/2.0;
	scene.ruins[2].rotation.x = Math.PI/2.0;
	scene.ruins[3].rotation.x = Math.PI/2.0;
	scene.ruins[4].rotation.x = Math.PI/2.0;

	scene.ruins[0].position.z = 13;
	scene.ruins[1].position.x = 13; 
	scene.ruins[2].position.x = -13;
	scene.ruins[3].position.z = -13;



	scene.skyboxmaterials = [new THREE.MeshBasicMaterial({map: scene.textures[5]}), 
							new THREE.MeshBasicMaterial({map: scene.textures[3]}), 
							new THREE.MeshBasicMaterial({map: scene.textures[1]}), 
							new THREE.MeshBasicMaterial({map: scene.textures[0]}), 
							new THREE.MeshBasicMaterial({map: scene.textures[2]}), 
							new THREE.MeshBasicMaterial({map: scene.textures[4]})];
	for (i = 0; i < scene.skyboxmaterials.length; i++)
	{
		scene.skyboxmaterials[i].side = THREE.BackSide;
		scene.skyboxmaterials[i].depthWrite = false;
	}
	scene.skybox = new THREE.Mesh(new THREE.CubeGeometry(1000,1000,1000,1,1,1), new THREE.MeshFaceMaterial(scene.skyboxmaterials));
	scene.skybox.flipSided = true;

	scene.cameraobject.add(scene.camera);
	scene.cameraobject.add(scene.skybox);
	scene.cameraobject.position.y = 4;
	scene.cameraobject.position.z = 10;





	scene.threescene.add(scene.arm.joint);
	scene.threescene.add(scene.cameraobject);
	scene.threescene.add(scene.ruins[0]);
	scene.threescene.add(scene.ruins[1]);
	scene.threescene.add(scene.ruins[2]);
	scene.threescene.add(scene.ruins[3]);
	scene.threescene.add(scene.ruins[4]);

	scene.threescene.add(scene.ground);
	scene.threescene.add(scene.skybox);


	scene.directionalLight.position.set( 0, 1, 1 ).normalize();
	scene.threescene.add(scene.directionalLight);

	scene.spotLight.position.set(0, 4, 4);
	scene.spotLight.angle = Math.PI/6;
	scene.spotLight.target = new THREE.Object3D();
	scene.spotLight.target.position.x = 4;
	scene.spotLight.target.y = 2;
	scene.spotLight.target.z = -5;

	scene.threescene.add(scene.spotLight.target);

	scene.threescene.add(scene.spotLight);

}

////////////////////////////// Scene Management //////////////////////////////


var lightingDemo;

function LightingDemo()
{
	var rendercanvas = document.getElementById("ThreeCanvas");
	
	this.scene = null;
	var renderer = null;

	renderer = new THREE.WebGLRenderer({canvas: rendercanvas});
	renderer.setClearColor(0x00FF00, 0.5)

	this.scene = new Scene(rendercanvas.width, rendercanvas.height);

	this.render = function()
	{
		renderer.clear();
		renderer.render(this.scene.threescene, this.scene.camera);
	}

	this.assignRuins = function(geometry, materials)
	{

		lightingDemo.scene.ruinsGeometry.push(geometry);
		if (lightingDemo.scene.ruinsGeometry.length == 5)
		{
			ConstructScene(lightingDemo.scene);
		}
	}
}





function Update()
{
	requestAnimationFrame(Update);
	UpdateArmRotation(lightingDemo.scene.arm);
	lightingDemo.render();

}

function main()
{
	lightingDemo = new LightingDemo();
	LoadTextures();
	LoadShaders();
	LoadRuins();
	Update();

}

