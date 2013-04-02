

function main()
{
	var rendercanvas = document.getElementById("ThreeCanvas");
	var viewangle = 90;
	var aspect = rendercanvas.width / rendercanvas.height;
	var nearclip = 0.1;
	var farclip = 1000;




	var renderer = new THREE.WebGLRenderer({canvas: rendercanvas, clearColor: 0x00FF00, clearAlpha: 0.5});
	var camera = new THREE.PerspectiveCamera(viewangle, aspect, nearclip, farclip);
	camera.position.y = 0;
	camera.position.x = 0;
	camera.position.z = 1;


	var scene = new THREE.Scene();
	//renderer.setSize(rendercanvas.width, rendercanvas.height);
	
	var quadcolor = new THREE.MeshBasicMaterial({color: 0xFF0000});
	var quadgeometry = new THREE.Geometry();
	var quadvertices = [new THREE.Vector3(0, 0, 0),
						new THREE.Vector3(1, 0, 0),
						new THREE.Vector3(1, 1, 0),
						new THREE.Vector3(0, 1, 0)];
	var quadmesh;
	for (i = 0; i < quadvertices.length; i++)
	{
		quadgeometry.vertices.push(quadvertices[i]);
	}
	quadgeometry.faces.push(new THREE.Face4(0, 1, 2, 3));
	quadmesh = new THREE.Mesh(quadgeometry, quadcolor);

	scene.add(quadmesh);
	scene.add(camera);
	renderer.render(scene, camera);



}