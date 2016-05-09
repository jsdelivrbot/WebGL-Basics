


////////////////////////////// Controls //////////////////////////////

var mouse = {down : false, previousX: 0, previousY: 0}

document.onmousedown = function(ev)
{
	mouse.down = true;
	mouse.previousY = ev.pageY;
	mouse.previousX = ev.pageX;
	//console.log(bonfireDemo.scene.camera.rotation.y);
	//console.log(bonfireDemo.scene.camera.rotation.x);
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

		bonfireDemo.scene.camera.rotation.y += rotationAroundY;
		bonfireDemo.scene.camera.rotation.x += rotationAroundX;
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




////////////////////////////// Tree //////////////////////////////

function CreateTree(texture)
{
	var geometry = new THREE.PlaneGeometry(6, 6, 1, 1);
	var material = new THREE.MeshPhongMaterial({map: texture,
												side: THREE.DoubleSide,
												blending: THREE.NormalBlending,
												transparent: true,
												depthWrite: true,
												depthTest: true
												});
	material.alphatest = 0.01;
	return new THREE.Mesh(geometry, material);
}

////////////////////////////// Tree //////////////////////////////


////////////////////////////// Particles //////////////////////////////

function Particle()
{
	this.lifeTime = 0;
}

function ParticleSystem(particleTexture, particleAmount)
{
	this.particles = [];
	this.geometry = null;
	this.particleAmount = particleAmount;
	this.particleLifeSpanReduction = 0.1;
	this.particleMaterial = null;
	this.points = null;
	this.particleTexture = particleTexture;


	this.Initialise = function(spawnX, spawnY, spawnZ)
	{
		this.geometry = new THREE.Geometry();
		this.particleMaterial = new THREE.PointsMaterial({
        map: this.particleTexture, 
        size: 1,
        transparent: true,
        blending: THREE.NormalBlending,
        //blending: THREE.CustomBlending,
        //blendEquation: THREE.AddEquation,
        //blendSrc: THREE.SrcAlphaFactor,
        //blendDst: THREE.OneFactor,
        depthWrite: false});
        this.particleMaterial.alphatest = 0.5;
        this.particleMaterial.opacity = 0.3;
		


		for (i = 0; i < particleAmount; i++)
		{
			this.geometry.vertices.push(new THREE.Vector3(
				spawnX, 
				spawnY,
				spawnZ));
			
		}
		this.points = new THREE.Points(this.geometry, this.particleMaterial);
		this.points.renderOrder = 98;


	}
	

		
		



	this.Update = function()
	{
		//this.geometry.verticesNeedUpdate = true;
		//Keep in mind you might have to fix spots designated with "this"
		for (i = 0; i < this.particles.length; i++)
		{
			//Update function for the particle

			this.particles[i].lifeTime -= particleLifeSpanReduction;
			if (this.particles[i].lifeTime <= 0)
			{

				//Particle reset, using a pool
			}

		}
	}

}


////////////////////////////// Particles //////////////////////////////

////////////////////////////// Loading //////////////////////////////


function LoadRuins()
{
	var meshloader = new THREE.JSONLoader();
	meshloader.load("ruins/Skydome.js", bonfireDemo.skyDomeAssignment);
	meshloader.load("ruins/ruins30.js", bonfireDemo.loadedObjectAssignment);    
    meshloader.load("ruins/ruins31.js", bonfireDemo.loadedObjectAssignment);
    meshloader.load("ruins/ruins33.js", bonfireDemo.loadedObjectAssignment);
    meshloader.load("ruins/ruins34.js", bonfireDemo.loadedObjectAssignment); 
    meshloader.load("ruins/ruins35.js", bonfireDemo.loadedObjectAssignment);
    
}

function LoadTextures()
{
	var textureloader = new THREE.TextureLoader();
	bonfireDemo.scene.textures.push(textureloader.load("Textures/nightsky_down.png"));
	bonfireDemo.scene.textures.push(textureloader.load("Textures/nightsky_up.png"));
	bonfireDemo.scene.textures.push(textureloader.load("Textures/nightsky_north.png"));
	bonfireDemo.scene.textures.push(textureloader.load("Textures/nightsky_east.png"));
	bonfireDemo.scene.textures.push(textureloader.load("Textures/nightsky_south.png"));
	bonfireDemo.scene.textures.push(textureloader.load("Textures/nightsky_west.png"));
	bonfireDemo.scene.textures.push(textureloader.load("Textures/rock.jpg"));
	bonfireDemo.scene.textures.push(textureloader.load("Textures/pine.png"));
	bonfireDemo.scene.textures.push(textureloader.load("Textures/smoke.png"));
	bonfireDemo.scene.textures.push(textureloader.load("Textures/fire.png"));
	bonfireDemo.scene.textures.push(textureloader.load("Textures/clouds.png"));
	bonfireDemo.scene.textures.push(textureloader.load("Textures/lime.png"));
}

////////////////////////////// Loading //////////////////////////////

////////////////////////////// Scene Management //////////////////////////////

function Scene ()
{
	this.constructed = false;
	this.threescene = null;
	this.camera = null;
	this.cameraobject = null;
	this.directionalLight = null;
	this.ambientLight = null;
	this.textures = [];
	this.arm = null; 
	this.ruins = [];
	this.ruinsGeometry = [];
	this.trees = [];
	this.cloudSphereGeometry = null;
	this.cloudSphere = null;
	this.ground = null;
	this.fireParticleSystem = null;
	this.smokeParticleSystem = null;

}

function ConstructScene(scene, width, height)
{
	var viewangle = 90;
	var aspect = width / height;
	var nearclip = 0.1;
	var farclip = 10000;


	scene.threescene = new THREE.Scene();
	scene.camera = new THREE.PerspectiveCamera(viewangle, aspect, nearclip, farclip);
	scene.cameraobject = new THREE.Object3D();
	scene.cameraobject.add(scene.camera);
	scene.cameraobject.position.z = 12;
	scene.cameraobject.position.y = 4;

	scene.directionalLight = new THREE.DirectionalLight( 0xffffff );
	scene.ambientLight = new THREE.AmbientLight (0x111144);
	scene.directionalLight.position.set(-1,1,1).normalize;


	scene.cloudSphere = new THREE.Mesh(scene.cloudSphereGeometry, new THREE.MeshBasicMaterial({map: scene.textures[10], transparent: true})); //check blending, doesn't need any???
	scene.cloudSphere.scale.set(100,100,100);

	scene.arm  = new Arm();

	scene.fireParticleSystem = new ParticleSystem(scene.textures[9], 200);
	scene.smokeParticleSystem = new ParticleSystem(scene.textures[8], 200);

	for (i = 0; i < scene.ruinsGeometry.length; i++)
	{
		
		scene.ruins[i] = new THREE.Mesh(scene.ruinsGeometry[i], new THREE.MeshPhongMaterial({map: scene.textures[6]}));
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

	scene.ground = new THREE.Mesh (new THREE.CubeGeometry(100,0.2,100,1,1,1), 
							new THREE.MeshPhongMaterial(
								{map: scene.textures[6],
								transparent: true}));

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

	for (i = 0; i < 26; i += 2)
	{
		if (i % 4 == 0)
		{
			scene.trees[i] = CreateTree(scene.textures[7]);
			scene.trees[i + 1] = CreateTree(scene.textures[7]);
			scene.trees[i].position.set(6, 3, 10 - 3 * i);
			scene.trees[i + 1].position.set(6, 3, 10 -  3 * i);



			//Pine tree
		}
		else
		{
			scene.trees[i] = CreateTree(scene.textures[11]);
			scene.trees[i + 1] = CreateTree(scene.textures[11]);
			scene.trees[i].position.set(6, 2, 10 - 3 * i);
			scene.trees[i + 1].position.set(6, 2, 10 -  3 * i);

			
			//Lime tree
		}



		

		scene.trees[i].renderOrder = 99;
		scene.trees[i + 1].renderOrder = 99;


		scene.trees[i].rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI);
		scene.trees[i + 1].rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI);
		scene.trees[i + 1].rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI/2);

		scene.threescene.add(scene.trees[i]);
		scene.threescene.add(scene.trees[i + 1]);
	}

	//create bonfire stuff
	scene.fireParticleSystem.Initialise(-1, 4, 11);
	scene.smokeParticleSystem.Initialise(-1, 6, 11);
	

	scene.threescene.add(scene.cloudSphere);
	scene.threescene.add(scene.ground);
	scene.threescene.add(scene.camera);
	scene.threescene.add(scene.skybox);
	
	scene.cameraobject.add(scene.camera); //why does calling this again change the position? Object position and camera not updated otherwise? What the hell?

	scene.threescene.add(scene.cameraobject);
	scene.threescene.add(scene.arm.joint);
	scene.threescene.add(scene.ruins[0]);
	scene.threescene.add(scene.ruins[1]);
	scene.threescene.add(scene.ruins[2]);
	scene.threescene.add(scene.ruins[3]);
	scene.threescene.add(scene.ruins[4]);

	scene.threescene.add(scene.directionalLight);
	scene.threescene.add(scene.ambientLight);

	

	scene.threescene.add(scene.fireParticleSystem.points);
	scene.threescene.add(scene.smokeParticleSystem.points);
	

	scene.constructed = true;
}


function UpdateSkyDome()
{
	
	bonfireDemo.scene.cloudSphere.rotation.y += 0.0005;
}
////////////////////////////// Scene Management //////////////////////////////

var bonfireDemo;

function BonfireDemo()
{
	this.canvas = null; 
	this.scene = null;
	this.renderer = null;

	this.initialise = function ()
	{
		bonfireDemo.canvas = document.getElementById("ThreeCanvas");
		bonfireDemo.scene = new Scene();
		bonfireDemo.renderer = new THREE.WebGLRenderer({canvas: bonfireDemo.canvas});


		bonfireDemo.renderer.setClearColor(0X000000);
	}

	this.render = function()
	{
		bonfireDemo.renderer.render(bonfireDemo.scene.threescene, bonfireDemo.scene.camera);
	}

	this.loadedObjectAssignment = function(geometry, materials)
	{
		bonfireDemo.scene.ruinsGeometry.push(geometry);
		if (bonfireDemo.scene.ruinsGeometry.length == 5)
		{
			ConstructScene(bonfireDemo.scene, bonfireDemo.canvas.width, bonfireDemo.canvas.height);
		}
	}

	this.skyDomeAssignment = function (geometry, materials)
	{
		bonfireDemo.scene.cloudSphereGeometry = geometry;
	}
}


function Update()
{
	requestAnimationFrame(Update);
	if (bonfireDemo.scene.constructed == true)
	{
		UpdateArmRotation(bonfireDemo.scene.arm);
		UpdateSkyDome();
		bonfireDemo.scene.fireParticleSystem.Update();
		bonfireDemo.scene.smokeParticleSystem.Update();
		bonfireDemo.render();
	}
	

}

function main()
{
	bonfireDemo = new BonfireDemo();
	bonfireDemo.initialise();
	LoadTextures();
	LoadRuins();

	Update();

}