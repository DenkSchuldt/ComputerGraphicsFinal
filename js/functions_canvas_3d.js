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
	new THREE.Vector3( 2, 0, 0 ),
	0xFF0000, false
	));
	// Y Axis
	scene.add(createAxis(
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 0, 2, 0 ),
	0x00FF00, false
	));
	// Z Axis
	scene.add(createAxis(
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 0, 0, 2 ),
	0x0000FF, false
	));
	// -X Axis
	scene.add(createAxis(
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( -2, 0, 0 ),
	0xFF0000, true
	));
	// -Y Axis
	scene.add(createAxis(
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 0, -2, 0 ),
	0x00FF00, true
	));
	// -Z Axis
	scene.add(createAxis(
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 0, 0, -2 ),
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

$(function() {
    $( "#canvas_3d" ).droppable({
		tolerance: "pointer",
		drop: function( event, ui ) {
			var pos = ui.draggable.offset();
			var dPos = $(this).offset();
			var top = pos.top - dPos.top;
			var left = pos.left - dPos.left
			console.log(ui.draggable.attr('figure'));
			var type = ui.draggable.attr('figure');
			if (type == 1){
				drawTriangleByPosition(ui.draggable.attr('id'), left + ui.draggable.width()/2, top + ui.draggable.height()/2);
			}else if (type == 2){
				drawQuadrangleByPosition(ui.draggable.attr('id'), left + ui.draggable.width()/2, top + ui.draggable.height()/2);
			}
		}
    });
});

function drawQuadrangleByPosition(quadrangleType, imagex, imagey){

	var vector = new THREE.Vector3();

	vector.set(
		( imagex / (window.innerWidth*6/10) ) * 2 - 1,
		- ( imagey / window.innerHeight ) * 2 + 1,
		0.5 );

	vector.unproject( camera );

	var dir = vector.sub( camera.position ).normalize();

	var distance = - camera.position.y / dir.y;

	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

	if (quadrangleType == 1){
		var geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
		var material = new THREE.MeshBasicMaterial({color: main_color});
		var cube = new THREE.Mesh(geometry, material);
		cube.position.x = pos.x;
		cube.position.z = pos.z;
		cube.position.y = 0;
		scene.add(cube);
	}else if (quadrangleType == 3){
		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 4, 1 );
		var material = new THREE.MeshBasicMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		pyramid.position.x = pos.x;
		pyramid.position.z = pos.z;
		pyramid.position.y = 0;
		pyramid.position.y += 1;
		scene.add( pyramid );
		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 4, 1 );
		var material = new THREE.MeshBasicMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		pyramid.position.x = pos.x;
		pyramid.position.z = pos.z;
		pyramid.position.y = 0;
		pyramid.rotation.x += 3.1416;
		pyramid.position.y -= 1;
		scene.add( pyramid );
	}else if (quadrangleType == 4){
		var geometry = new THREE.PlaneGeometry( 3, 3, 8 );
		var material = new THREE.MeshBasicMaterial( {color: main_color, side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( geometry, material );
		plane.position.x = pos.x;
		plane.position.z = pos.z;
		plane.position.y = 0;
		plane.rotation.x += 3.1416/2;
		scene.add( plane );
	}

	clearOptions();
	clearCanvas2D();
}

function drawTriangleByPosition(triangleType, imagex, imagey){
	
	var vector = new THREE.Vector3();

	vector.set(
		( imagex / (window.innerWidth*6/10) ) * 2 - 1,
		- ( imagey / window.innerHeight ) * 2 + 1,
		0.5 );

	vector.unproject( camera );

	var dir = vector.sub( camera.position ).normalize();

	var distance = - camera.position.y / dir.y;

	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
	
	if (triangleType == 2){
		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 4, 1 );
		var material = new THREE.MeshBasicMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		pyramid.position.x = pos.x;
		pyramid.position.z = pos.z;
		pyramid.position.y = 0;
		scene.add( pyramid );
	}else if (triangleType == 3){
		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 3, 1 );
		var material = new THREE.MeshBasicMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		pyramid.position.x = pos.x;
		pyramid.position.z = pos.z;
		pyramid.position.y = 0;
		scene.add( pyramid );
	}else if (triangleType == 1){
		var geometry = new THREE.CylinderGeometry( 1, 1, 2, 3, 1 );
		var material = new THREE.MeshBasicMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		pyramid.position.x = pos.x;
		pyramid.position.z = pos.z;
		pyramid.position.y = 0;
		scene.add( pyramid );
	}
	
	clearOptions();
	clearCanvas2D();
}

initialize();
animate();
