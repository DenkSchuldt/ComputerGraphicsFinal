function initialize() {
	scene = new THREE.Scene();
	WIDTH = window.innerWidth*6/10;
	HEIGHT = window.innerHeight;

	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(WIDTH, HEIGHT);
	document.getElementById("canvas_3d").appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
	camera.position.set(10,10,10);
	camera.lookAt(scene.position);
	scene.add(camera);

	window.addEventListener('resize', function() {
		WIDTH = window.innerWidth*6/10;
		HEIGHT = window.innerHeight;
		renderer.setSize(WIDTH, HEIGHT);
		camera.aspect = WIDTH / HEIGHT;
		camera.updateProjectionMatrix();
	});

	renderer.setClearColor(0xEEEEEE, 1);

	var ambientLight = new THREE.AmbientLight(0x999999);
	scene.add(ambientLight);

	renderer.shadowMapEnabled = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;

	createAxes();
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	
}

/**
 *
 */
function createAxes() {
	// X Axis
	scene.add(createAxis(
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 10, 0, 0 ),
	0xFF0000, false
	));
	// Y Axis
	scene.add(createAxis(
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 0, 10, 0 ),
	0x00FF00, false
	));
	// Z Axis
	scene.add(createAxis(
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 0, 0, 10 ),
	0x0000FF, false
	));
	// -X Axis
	scene.add(createAxis(
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( -10, 0, 0 ),
	0xFF0000, true
	));
	// -Y Axis
	scene.add(createAxis(
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 0, -10, 0 ),
	0x00FF00, true
	));
	// -Z Axis
	scene.add(createAxis(
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 0, 0, -10 ),
	0x0000FF, true
	));
}

/**
			 *
			 */
function createAxis( src, dst, colorHex, dashed) {
	var geom = new THREE.Geometry(), 
	mat; 
	if(dashed) {
		mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 1, gapSize: 0.5 });
	} else {
		mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
	}
	geom.vertices.push( src.clone() );
	geom.vertices.push( dst.clone() );
	geom.computeLineDistances(); 
	return new THREE.Line( geom, mat, THREE.LinePieces );
}

function drawQuadrangle(quadrangleType){

	if (quadrangleType == 1){
		var geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
		var material = new THREE.MeshBasicMaterial({color: main_color});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
	}else if (quadrangleType == 3){
		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 4, 1 );
		var material = new THREE.MeshBasicMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		pyramid.position.y += 1;
		scene.add( pyramid );
		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 4, 1 );
		var material = new THREE.MeshBasicMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		pyramid.rotation.x += 3.1416;
		pyramid.position.y -= 1;
		scene.add( pyramid );
	}else if (quadrangleType == 4){
		var geometry = new THREE.PlaneGeometry( 3, 3, 8 );
		var material = new THREE.MeshBasicMaterial( {color: main_color, side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( geometry, material );
		plane.rotation.x += 3.1416/2;
		scene.add( plane );
	}

	clearOptions();
	clearCanvas2D();
}

function drawTriangle(triangleType){
	
	if (triangleType == 2){
		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 4, 1 );
		var material = new THREE.MeshBasicMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		scene.add( pyramid );
	}else if (triangleType == 3){
		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 3, 1 );
		var material = new THREE.MeshBasicMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		scene.add( pyramid );
	}else if (triangleType == 1){
		var geometry = new THREE.CylinderGeometry( 1, 1, 2, 3, 1 );
		var material = new THREE.MeshBasicMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		scene.add( pyramid );
	}
}

initialize();
animate();
