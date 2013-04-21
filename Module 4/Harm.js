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

function Shoulder()
{
	this.joint = new THREE.Object3D();
	this.color = new THREE.MeshBasicMaterial({color: 0x00FF00});
	this.mesh = new THREE.Mesh(new THREE.SphereGeometry(4, 10, 10, 1, 1, 1), this.color);
	this.mesh.position.y = 0;
	this.children = new THREE.Object3D();
	this.joint.add(this.children);

	this.add = function(object)
	{
		this.children.add(object);
	}
}

function UArm()
{
	this.color = new THREE.MeshBasicMaterial({color: 0xE1B899});
	this.mesh = new THREE.Mesh(new THREE.CubeGeometry(3, 10, 4, 1, 1, 1), this.color);
	this.mesh.position.y = 0.5;
}

function Elbow()
{
	this.color = new THREE.MeshBasicMaterial({color: 0xFF0000});
	this.children = new THREE.Object3D();
	this.mesh = this.mesh = new THREE.Mesh(new THREE.SphereGeometry(4, 10, 10, 1, 1, 1), this.color);
	this.mesh.position.y = 0.5;

	this.add = function(object)
	{
		this.children.add(object);
	}
}

function LArm()
{
	this.color = new THREE.MeshBasicMaterial({color: 0xE1B899});
	this.mesh = this.mesh = new THREE.Mesh(new THREE.CubeGeometry(3, 10, 4, 1, 1, 1), this.color);
	this.mesh.position.y = 0.5;
}

function Hand()
{
	this.color = new THREE.MeshBasicMaterial({color: 0x222277});
	this.mesh = this.mesh = new THREE.Mesh(new THREE.CubeGeometry(3, 3, 1, 1, 1, 1), this.color);
	this.mesh.position.y = 0.5;
	this.children = new THREE.Object3D();

	this.add = function(object)
	{
		this.children.add(object);
	}
}

function Finger()
{
	this.color = new THREE.MeshBasicMaterial({color: 0xEECEB3});
	this.mesh = this.mesh = new THREE.Mesh(new THREE.CubeGeometry(1, 3, 1, 1, 1, 1), this.color);
	this.mesh.position.y = 0.5;
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
	this.indexfinger = new Finger();
	this.middlefinger = new Finger();
	this.ringfinger = new Finger();

	this.joint.add(this.shoulder);

	//this.shoulder.add(this.upperarm.mesh);
	this.shoulder.add(this.elbow.mesh);
	/*this.elbow.add(this.lowerarm.mesh);
	this.elbow.add(this.hand.mesh);
	this.hand.add(this.thumb.mesh);
	this.hand.add(this.indexfinger.mesh);
	this.hand.add(this.middlefinger.mesh);
	this.hand.add(this.ringfinger.mesh);*/

}



function main()
{
	var rendercanvas = document.getElementById("ThreeCanvas");
	var viewangle = 90;
	var aspect = rendercanvas.width / rendercanvas.height;
	var nearclip = 0.1;
	var farclip = 100;

	var renderer = new THREE.WebGLRenderer({canvas: rendercanvas, clearColor: 0x00FF00, clearAlpha: 0.5});

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(viewangle, aspect, nearclip, farclip);
	camera.position.y = 10;
	camera.position.z = 30;

	var armobject = new Arm();


	scene.add(armobject.shoulder.joint);
	scene.add(camera);
	renderer.render(scene, camera);

}