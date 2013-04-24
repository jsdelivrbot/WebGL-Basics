/*
Create each mesh. Create a hierarchy,
rotate upper arm and lower arm to the same direction.
Rotate hand perpendicular to the arms. 


Hierarchy:
shoulder (if sphere is rotated, everything else moves as well)
 -upper arm
 - elbow (if sphere is rotated, lower arm, hand and fingers move)
  -lower arm
  - wrist/hand (if cube is rotated, fingers move)
   - fingers (no rotation in this assignment)

   Object3D for hierarchy
*/
var waveAnimation;

function Shoulder()
{
	this.color = new THREE.MeshBasicMaterial({color: 0x00FF00});
	this.mesh = new THREE.Mesh(new THREE.SphereGeometry(1.5, 10, 10), this.color);
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
	this.mesh = new THREE.Mesh(new THREE.CubeGeometry(1, 2.5, 1), this.color);
	this.mesh.position.y = 2;
	this.mesh.position.z = 1;
}

function Elbow()
{
	this.color = new THREE.MeshBasicMaterial({color: 0xFF0000});
	this.mesh = this.mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10), this.color);
	this.mesh.position.y = 4;
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
	this.mesh = this.mesh = new THREE.Mesh(new THREE.CubeGeometry(1, 2.5, 1), this.color);
	this.mesh.position.y = 2;
}

function Hand()
{
	this.color = new THREE.MeshBasicMaterial({color: 0x222277});
	this.mesh = this.mesh = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 1), this.color);
	this.mesh.position.y = 4;

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
	this.mesh = this.mesh = new THREE.Mesh(new THREE.CubeGeometry(0.5, 1.5, 0.5), this.color);
	this.mesh.position.y = 1.8;
}

function Arm()
{
	this.joint = new THREE.Object3D();
	this.shoulder = new Shoulder();
	this.upperarm = new UArm();
	this.elbow = new Elbow();
	this.lowerarm = new LArm();
	this.hand = new Hand();
	this.thumb = new Finger();
	this.thumb.mesh.rotation.z = 2;
	this.thumb.mesh.position.x = 1.6;
	this.thumb.mesh.position.y = 0;
	this.indexfinger = new Finger();
	this.indexfinger.mesh.position.x = 0.8;
	this.middlefinger = new Finger();
	this.ringfinger = new Finger();
	this.ringfinger.mesh.position.x = -0.8;

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

function WaveAnimation()
{
	var rendercanvas = document.getElementById("ThreeCanvas");
	var viewangle = 90;
	var aspect = rendercanvas.width / rendercanvas.height;
	var nearclip = 0.1;
	var farclip = 100;

	var renderer = new THREE.WebGLRenderer({canvas: rendercanvas, clearColor: 0x333377, clearAlpha: 0.5});

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(viewangle, aspect, nearclip, farclip);
	var armobject = new Arm();



	this.main = function()
	{
		
		camera.position.y = 4;
		camera.position.z = 10;
		scene.add(armobject.joint);
		scene.add(camera);

	}

	this.updateRotation = function()
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

	this.render = function()
	{
		this.updateRotation();
		renderer.render(scene, camera);
	}
}

function Animate()
{
	requestAnimationFrame(Animate);
	waveAnimation.render();
}

function main()
{
	waveAnimation = new WaveAnimation();
	waveAnimation.main();
	Animate();
	
}

