var raycaster = new THREE.Raycaster();
var mouseVector = new THREE.Vector2();
var mouseUpVector = new THREE.Vector2();
var mouseDownVector = new THREE.Vector2();
var mouseMoveVector = new THREE.Vector2();
var intersectsMouse;
var objects = [];
var selected = [];
var objSelected = new THREE.Object3D();
var states = ["moving", "rotating", "scaling"];
var actualState = "";
var control;

function initialize() {
	scene = new THREE.Scene();
	WIDTH = window.innerWidth*6/10;
	HEIGHT = window.innerHeight;

	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(WIDTH, HEIGHT);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.sortObjects = false;
	document.getElementById("canvas_3d").appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
	camera.position.set(10,10,10);
	camera.lookAt(scene.position);
	/*scene.add( new THREE.GridHelper( 500, 100 ) );*/
	scene.add(camera);

	control = new THREE.TransformControls( camera, renderer.domElement );
	control.addEventListener( 'change', animate );
	scene.add(control);


	window.addEventListener( 'mousedown', onMouseDown );
	window.addEventListener( 'mouseup', onMouseUp );
	window.addEventListener( 'mousemove', onMouseMove);
	window.addEventListener( 'click', onMouseClick);

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

	scene.add(createAxes(3, 0, 0, 0, true));

}

function animate() {
	requestAnimationFrame(animate);
	control.update();

	renderer.render(scene, camera);

	//sceneHelpers.updateMatrixWorld();
	scene.updateMatrixWorld();
	renderer.clear();
	renderer.render( scene, camera );
	/*if ( renderer instanceof THREE.RaytracingRenderer === false ) {
		renderer.render( sceneHelpers, camera );
	}*/
	
}

/**
 *
 */
function createAxes(longLine, xOrigin, yOrigin, zOrigin, haveNegativeAxes) {
	var arrayAxes = [];
	var axes = new THREE.Object3D();
	/*var axes = new THREE.Group();
	var xAxis = new THREE.Group();
	var yAxis = new THREE.Group();
	var zAxis = new THREE.Group();*/
	// X Axis
	//xAxis.name = "xAxis";
	arrayAxes.push(createAxis(
	new THREE.Vector3( xOrigin, yOrigin, zOrigin ),
	new THREE.Vector3( xOrigin + longLine, yOrigin, zOrigin ),
	0xFF0000, false
	));
	// Y Axis
	//yAxis.name = "yAxis";
	arrayAxes.push(createAxis(
	new THREE.Vector3( xOrigin, yOrigin, zOrigin ),
	new THREE.Vector3( xOrigin, yOrigin + longLine, zOrigin ),
	0x00FF00, false
	));
	// Z Axis
	//zAxis.name = "zAxis";
	arrayAxes.push(createAxis(
	new THREE.Vector3( xOrigin, yOrigin, zOrigin ),
	new THREE.Vector3( xOrigin, yOrigin, zOrigin + longLine ),
	0x0000FF, false
	));

	if (haveNegativeAxes){
		// -X Axis
		arrayAxes.push(createAxis(
		new THREE.Vector3( xOrigin, yOrigin, zOrigin ),
		new THREE.Vector3( xOrigin - longLine, yOrigin, zOrigin ),
		0xFF0000, true
		));
		// -Y Axis
		arrayAxes.push(createAxis(
		new THREE.Vector3( xOrigin, yOrigin, zOrigin ),
		new THREE.Vector3( xOrigin, yOrigin - longLine, zOrigin ),
		0x00FF00, true
		));
		// -Z Axis
		arrayAxes.push(createAxis(
		new THREE.Vector3( xOrigin, yOrigin, zOrigin ),
		new THREE.Vector3( xOrigin, yOrigin, zOrigin - longLine ),
		0x0000FF, true
		));
	}
	axes.name = "axes";
	/*axes.add(xAxis);
	axes.add(yAxis);
	axes.add(zAxis);*/
	axes.children = arrayAxes;
	return axes;
}

/**
			 *
			 */
function createAxis( src, dst, colorHex, dashed) {
	var geom = new THREE.Geometry(), 
	mat; 
	if(dashed) {
		mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 0.3, gapSize: 0.3 });
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
		control.attach(cube);
		objects.push(cube);
	}else if (quadrangleType == 3){
		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 4, 1 );
		var material = new THREE.MeshBasicMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		pyramid.position.x = pos.x;
		pyramid.position.z = pos.z;
		pyramid.position.y = 0;
		pyramid.position.y += 1;
		scene.add( pyramid );
		control.attach(pyramid);
		objects.push(pyramid);
		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 4, 1 );
		var material = new THREE.MeshBasicMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		pyramid.position.x = pos.x;
		pyramid.position.z = pos.z;
		pyramid.position.y = 0;
		pyramid.rotation.x += 3.1416;
		pyramid.position.y -= 1;
		scene.add( pyramid );
		objects.push(pyramid);
	}else if (quadrangleType == 4){
		var geometry = new THREE.PlaneGeometry( 3, 3, 8 );
		var material = new THREE.MeshBasicMaterial( {color: main_color, side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( geometry, material );
		plane.position.x = pos.x;
		plane.position.z = pos.z;
		plane.position.y = 0;
		plane.rotation.x += 3.1416/2;
		scene.add( plane );
		control.attach(plane);
		objects.push(plane);
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
		control.attach(pyramid);
		objects.push(pyramid);
	}else if (triangleType == 3){
		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 3, 1 );
		var material = new THREE.MeshBasicMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		pyramid.position.x = pos.x;
		pyramid.position.z = pos.z;
		pyramid.position.y = 0;
		scene.add( pyramid );
		control.attach(pyramid);
		objects.push(pyramid);
	}else if (triangleType == 1){
		var geometry = new THREE.CylinderGeometry( 1, 1, 2, 3, 1 );
		var material = new THREE.MeshBasicMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		pyramid.position.x = pos.x;
		pyramid.position.z = pos.z;
		pyramid.position.y = 0;
		scene.add( pyramid );
		control.attach(pyramid);
		objects.push(pyramid);
	}
	
	clearOptions();
	clearCanvas2D();
}

function changeToNextState(actualState){
	if (actualState == states[0]){
		console.log("Ahora Rotando");
		return states[1];
	}else if (actualState == states[1]){
		console.log("Ahora Escalando");
		return states[2];
	}else{
		console.log("Moviendo de Vuelta");
		return states[0];
	}
}

function onMouseClick(e){
	var axes = new THREE.Object3D();
	mouseVector.x = 2 * (e.clientX / (window.innerWidth*0.6)) - 1;
	mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight);
	raycaster.setFromCamera( mouseVector, camera );
	intersectsMouse = raycaster.intersectObjects( objects , true);
	if (intersectsMouse.length>0){
		obj = intersectsMouse[0].object;
		if (selected.length==0){
			axes = createAxes(1, obj.position.x, obj.position.y, obj.position.z, false);
			obj.add(axes);
			obj.name = "shape" ;
			selected.push(obj);
			actualState = states[0];
		}else if(selected[0]!=obj){
			selected[0].remove(selected[0].getObjectByName("axes"));
			selected.pop();
			axes = createAxes(1, obj.position.x, obj.position.y, obj.position.z, false);
			obj.add(axes);
			obj.name = "shape" ;
			selected.push(obj);
			actualState = states[0];
		}else{
			actualState = changeToNextState(actualState);
		}
		obj.material.color.setRGB(Math.random()*2, Math.random()*2, Math.random()*2);
	}else{
		if (selected.length>0){
			selected[0].remove(selected[0].getObjectByName("axes"));
			selected.pop();
		}
	}
}

function onMouseDown( e ) {
	mouseVector.x = 2 * (e.clientX /(window.innerWidth*0.6)) - 1;
	mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight );
	mouseDownVector.x = 2 * (e.clientX / (window.innerWidth*0.6)) - 1;
	mouseDownVector.y = 1 - 2 * ( e.clientY / window.innerHeight );
	raycaster.setFromCamera( mouseDownVector, camera );
	intersectsMouse = raycaster.intersectObjects( objects , true);
	if (intersectsMouse.length>0){
		obj = intersectsMouse[0].object;
		/*if (selected.length==0){
			obj.add(createAxes(1, obj.position.x, obj.position.y, obj.position.z));
			obj.name = "shape" ;
			selected.push(obj);
			actualState = states[0];
		}else if(selected[0]!=obj){
			selected[0].remove(selected[0].getObjectByName("axes"));
			selected.pop();
			obj.add(createAxes(1, obj.position.x, obj.position.y, obj.position.z));
			obj.name = "shape" ;
			selected.push(obj);
			actualState = states[0];
		}else{
			actualState = changeToNextState(actualState);
		}
		obj.material.color.setRGB(Math.random()*2, Math.random()*2, Math.random()*2);
		console.log('YES');*/
	}else{
		if (selected.length>0){
			selected[0].remove(selected[0].getObjectByName("axes"));
			selected.pop();
		}
	}
}
		

function onMouseUp( e ) {
	mouseUpVector.x = 2 * (e.clientX / window.innerWidth) - 1;
	mouseUpVector.y = 1 - 2 * ( e.clientY / window.innerHeight );
	if (mouseDownVector.x == mouseUpVector.x && mouseDownVector.y == mouseUpVector.y){
		raycaster.setFromCamera( mouseDownVector, camera );
		var intersects = raycaster.intersectObjects( scene , true);
		if (intersects.length>0){

		}
	}
	clickingTop = false;
}


function onMouseMove (e){
	mouseMoveVector.x = 2 * (e.clientX / (window.innerWidth*0.6)) - 1;
	mouseMoveVector.y = 1 - 2 * ( e.clientY / window.innerHeight );
	if (selected.length > 0 && actualState == states[0]){
		/*shape = selected[0].getObjectByName("shape");
		shape.position.y = mouseMoveVector.y *10;
		shape.position.x = mouseMoveVector.x *10;
		if (mouseVector.x < mouseMoveVector.x && mouseVector == mouseMoveVector){
			
		}
	}else if (actualState == states[1]){

	}else if (actualState == states[2]){

	}
	if (mouseVector.x != mouseMoveVector.x && mouseVector.y != mouseMoveVector.y){
		if(mouseVector.y < mouseMoveVector.y){

		}
		if(mouseVector.y > mouseMoveVector.y){

		}*/
	}
	mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
	mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight );
}

initialize();
animate();
