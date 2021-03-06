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


/**
 *
 */
function initialize() {
	scene = new THREE.Scene();
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;

	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(WIDTH, HEIGHT);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.sortObjects = false;
	document.getElementById("canvas_3d").appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
	camera.position.set(10,10,10);
	camera.lookAt(scene.position);
	scene.add(camera);

	control = new THREE.TransformControls( camera, renderer.domElement );
	scene.add(control);
	window.addEventListener( 'mousedown', onMouseDown );
	window.addEventListener('resize', function() {
		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		renderer.setSize(WIDTH, HEIGHT);
		camera.aspect = WIDTH / HEIGHT;
		camera.updateProjectionMatrix();
	});

	renderer.setClearColor(0xe4e4e4, 1);

	var ambientLight = new THREE.AmbientLight(0x999999);
	scene.add(ambientLight);
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;

}


/**
 *
 */
function createAxes(longLine, xOrigin, yOrigin, zOrigin, haveNegativeAxes) {
	var arrayAxes = [];
	var axes = new THREE.Object3D();
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


/**
 *
 */
$(function() {
  $( "#canvas_3d" ).droppable({
		tolerance: "pointer",
		drop: function( event, ui ) {
			closeMenuOptions();
			var pos = ui.draggable.offset();
			var dPos = $(this).offset();
			var top = pos.top - dPos.top;
			var left = pos.left - dPos.left
			var type = ui.draggable.attr('figure');
			if (type == 1){
				drawTriangleByPosition(ui.draggable.attr('id'), left + ui.draggable.width()/2, top + ui.draggable.height()/2);
			}else if (type == 2){
				drawQuadrangleByPosition(ui.draggable.attr('id'), left + ui.draggable.width()/2, top + ui.draggable.height()/2);
			}else if (type == 0){
				if (ui.draggable.attr('id') == 1){
					drawSphereByPosition(ui.draggable.attr('id'), left + ui.draggable.width()/2, top + ui.draggable.height()/2);
				}else{
					pos = ui.helper.offset();
					dPos = $(this).offset();
					top = pos.top - dPos.top;
					left = pos.left - dPos.left
					drawSphereByPosition(ui.draggable.attr('id'), left + ui.draggable.width()/2, top + ui.draggable.height()/2);
				}
			}
			if (ui.draggable.attr('class').indexOf("texture")>=0) {
				addTexture(event, ui);
			}
			if (ui.draggable.attr('class').indexOf("color")>=0) {
				addColor(event, ui);
			}
		}
  });
});


/**
 *
 */
function drawQuadrangleByPosition(quadrangleType, imagex, imagey){

	var vector = new THREE.Vector3();

	vector.set(
		( imagex / (window.innerWidth) ) * 2 - 1,
		- ( imagey / window.innerHeight ) * 2 + 1,
		0.5 );

	vector.unproject( camera );

	var dir = vector.sub( camera.position ).normalize();

	var distance = - camera.position.y / dir.y;

	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

	if (quadrangleType == 1){
		var geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
		var material = new THREE.MeshLambertMaterial({color: main_color});
		var cube = new THREE.Mesh(geometry, material);
		cube.position.x = pos.x;
		cube.position.z = pos.z;
		cube.position.y = 0;
		cube.castShadow = true;
		cube.receiveShadow = true;
		cube.name = "cube";
		scene.add(cube);
		objects.push(cube);
	}else if (quadrangleType == 3){
		var rombo = new THREE.Object3D();

		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 4, 1 );
		var material = new THREE.MeshLambertMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		pyramid.position.x = 0;
		pyramid.position.z = 0;
		pyramid.position.y = 0;
		pyramid.position.y += 1;
		pyramid.castShadow = true;
		pyramid.receiveShadow = true;
		
		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 4, 1 );
		var material = new THREE.MeshLambertMaterial( {color: main_color} );
		var pyramid2 = new THREE.Mesh( geometry, material );
		pyramid2.position.x = 0;
		pyramid2.position.z = 0;
		pyramid2.position.y = 0;
		pyramid2.rotation.x += 3.1416;
		pyramid2.position.y -= 1;
		pyramid2.castShadow = true;
		pyramid2.receiveShadow = true;
		
		rombo.add(pyramid);
		rombo.add(pyramid2);

		rombo.position.x = pos.x;
		rombo.position.z = pos.z;
		rombo.position.y = 0;
		rombo.castShadow = true;
		rombo.receiveShadow = true;
		rombo.name = "rombo";
		scene.add(rombo);
		objects.push(rombo);
	}else if (quadrangleType == 4){
		var geometry = new THREE.PlaneGeometry( 3, 3, 8 );
		var material = new THREE.MeshLambertMaterial( {color: main_color, side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( geometry, material );
		plane.position.x = pos.x;
		plane.position.z = pos.z;
		plane.position.y = 0;
		plane.rotation.x -= 3.1416/2;
		plane.name = "plane";
		plane.castShadow = true;
		plane.receiveShadow = true;
		scene.add( plane );
		objects.push(plane);
	}

	clearOptions();
	clearCanvas2D();
}


/**
 *
 */
function drawTriangleByPosition(triangleType, imagex, imagey){

	var vector = new THREE.Vector3();

	vector.set(
		( imagex / (window.innerWidth) ) * 2 - 1,
		- ( imagey / window.innerHeight ) * 2 + 1,
		0.5 );

	vector.unproject( camera );

	var dir = vector.sub( camera.position ).normalize();

	var distance = - camera.position.y / dir.y;

	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

	if (triangleType == 2){
		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 4, 1 );
		var material = new THREE.MeshLambertMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		pyramid.position.x = pos.x;
		pyramid.position.z = pos.z;
		pyramid.position.y = 0;
		pyramid.castShadow = true;
		pyramid.receiveShadow = true;
		pyramid.name = "pyramid2";
		scene.add( pyramid );
		objects.push(pyramid);
	}else if (triangleType == 3){
		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 3, 1 );
		var material = new THREE.MeshLambertMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		pyramid.position.x = pos.x;
		pyramid.position.z = pos.z;
		pyramid.position.y = 0;
		pyramid.name = "pyramid3";
		pyramid.castShadow = true;
		pyramid.receiveShadow = true;
		scene.add( pyramid );
		objects.push(pyramid);
	}else if (triangleType == 1){
		var geometry = new THREE.CylinderGeometry( 1, 1, 2, 3, 1 );
		var material = new THREE.MeshLambertMaterial( {color: main_color} );
		var pyramid = new THREE.Mesh( geometry, material );
		pyramid.position.x = pos.x;
		pyramid.position.z = pos.z;
		pyramid.position.y = 0;
		pyramid.castShadow = true;
		pyramid.receiveShadow = true;
		pyramid.name = "pyramid1";
		scene.add( pyramid );
		objects.push(pyramid);
	}

	clearOptions();
	clearCanvas2D();
}


/**
 *
 */
function drawSphereByPosition(circleType, imagex, imagey){

	var vector = new THREE.Vector3();

	vector.set(
		( imagex / (window.innerWidth) ) * 2 - 1,
		- ( imagey / window.innerHeight ) * 2 + 1,
		0.5 );

	vector.unproject( camera );

	var dir = vector.sub( camera.position ).normalize();

	var distance = - camera.position.y / dir.y;

	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

	if (circleType == 1){
		var geometry = new THREE.SphereGeometry( 1, 32, 32 );
		var material = new THREE.MeshLambertMaterial({color: main_color});
		var sphere = new THREE.Mesh(geometry, material);
		sphere.position.x = pos.x;
		sphere.position.z = pos.z;
		sphere.position.y = 0;
		sphere.castShadow = true;
		sphere.receiveShadow = true;
		sphere.name = "sphere";
		scene.add(sphere);
		objects.push(sphere);
	}else if (circleType == 2){
		var lightbulb = new THREE.Object3D();

		var light = new THREE.PointLight( 0xffffff, 2, 100 );
		light.castShadow = true;
		light.shadowDarkness = 0.7;
		
		var geometryTuck = new THREE.CylinderGeometry( 0.1, 0.1, 0.5, 32, 1 );
		var materialTuck = new THREE.MeshBasicMaterial( {color: main_color} );
		var tuck = new THREE.Mesh( geometryTuck, materialTuck );

		var geometry = new THREE.SphereGeometry( 0.2, 32, 32 );
		var material = new THREE.MeshBasicMaterial({color: main_color});
		var sphere = new THREE.Mesh(geometry, material);

		tuck.position.set(0, 0.15, 0)
		light.position.set(0, 0, 0)
		sphere.position.set(0, 0, 0)

		lightbulb.add(tuck);
		lightbulb.add(sphere);
		lightbulb.add(light);
		lightbulb.position.x = pos.x;
		lightbulb.position.z = pos.z;
		lightbulb.position.y = 6;
		lightbulb.name = "lightbulb";
		scene.add(lightbulb);
		objects.push(lightbulb);
		for (i = 0; i < objects.length; i++){
			if (objects[i].children.length > 0){
				for (j = 0; j < objects[i].children.length; j++){
					try{
						objects[i].children[j].material.needsUpdate = true;
					}catch(err){

					}
				}
			}
			try{
				objects[i].material.needsUpdate = true;
			}catch(err){

			}
		}
	}else if (circleType == 3){
		var sunRay = new THREE.Object3D();

		var light = new THREE.DirectionalLight( 0xffffff, 1 );
		light.castShadow = true;
		light.shadowDarkness = 0.7;
        light.shadowCameraVisible = false;
        light.shadowCameraNear = 1;
        light.shadowCameraFar = 1024;
        light.shadowCameraLeft = -15;
        light.shadowCameraRight = 15;
        light.shadowCameraTop = 15;
        light.shadowCameraBottom = -15;
        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;
		light.position.set( pos.x, 6, pos.z);
		
		var geometryTuck = new THREE.CylinderGeometry( 0.25, 0.25, 0.4, 32, 1 );
		var materialTuck = new THREE.MeshBasicMaterial( {color: main_color} );
		var tuck = new THREE.Mesh( geometryTuck, materialTuck );


		tuck.position.set(0, 0, 0)
		light.position.set(0, 0, 0)

		sunRay.add(tuck);
		sunRay.add(light);

		sunRay.position.x = pos.x;
		sunRay.position.z = pos.z;
		sunRay.position.y = 6;
		sunRay.name = "sunRay";
		scene.add(sunRay);
		objects.push(sunRay);
		for (i = 0; i < objects.length; i++){
			if (objects[i].children.length > 0){
				for (j = 0; j < objects[i].children.length; j++){
					try{
						objects[i].children[j].material.needsUpdate = true;
					}catch(err){

					}
				}
			}
			try{
				objects[i].material.needsUpdate = true;
			}catch(err){

			}
		}
	}

	clearOptions();
	clearCanvas2D();
}


/**
 *
 */
function changeToNextState(actualState){
	if (actualState == states[0]){
		control.setMode("rotate");
		return states[1];
	}else if (actualState == states[1]){
		control.setMode("scale");
		return states[2];
	}else{
		control.setMode("translate");
		return states[0];
	}
}


/**
 *
 */
function onMouseDown( e ) {
	if ($('.fa-pencil').is(':visible')) {
		mouseVector.x = 2 * (e.clientX / (window.innerWidth)) - 1;
		mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight);
		raycaster.setFromCamera( mouseVector, camera );
		intersectsMouse = raycaster.intersectObjects( objects , true);
		if (intersectsMouse.length>0){
			obj = intersectsMouse[0].object;
			if (obj.parent!=scene){
				obj = obj.parent;
			}
			if (selected.length==0){
				actualState = states[0];
				control.setMode("translate");
				control.attach(obj);
				selected.push(obj);
			}else if(selected[0]!=obj){
				control.detach();
				selected.pop();
				actualState = states[0];
				control.setMode("translate");
				control.attach(obj);
				selected.push(obj);
			}else{
				actualState = changeToNextState(actualState);
			}
		}else{
			if (selected.length>0){
				control.detach();
				selected.pop();
				control.update();
			}
		}
	}
}


/**
 *
 */
function addTexture(e, ui) {
	mouseVector.x = 2 * (e.clientX / (window.innerWidth)) - 1;
	mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight);
	raycaster.setFromCamera( mouseVector, camera );
	intersectsMouse = raycaster.intersectObjects( objects , true);
	if (intersectsMouse.length>0){
		obj = intersectsMouse[0].object;
		var texture = ui.draggable.attr('src');
		if (obj.parent!=scene){
			for (j = 0; j < obj.parent.children.length; j++){
				try{
					if (texture.indexOf('000')>=0) {
						obj.parent.children[j].material.map = null;
					} else {
						obj.parent.children[j].material.map = THREE.ImageUtils.loadTexture( texture );
						obj.parent.children[j].material.map.name = texture;
					}
					obj.parent.children[j].material.needsUpdate = true;
				}catch(err){
				}
			}
		}else{
			if (texture.indexOf('000')>=0) {
				obj.material.map = null;
			} else {
				obj.material.map = THREE.ImageUtils.loadTexture( texture );
				obj.material.map.name = texture;
			}
			obj.material.needsUpdate = true;
		}
	}
}


/**
 *
 */
function addColor(e, ui) {
	mouseVector.x = 2 * (e.clientX / (window.innerWidth)) - 1;
	mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight);
	raycaster.setFromCamera( mouseVector, camera );
	intersectsMouse = raycaster.intersectObjects( objects , true);
	if (intersectsMouse.length>0) {
		obj = intersectsMouse[0].object;
		if (obj.parent!=scene){
			for (j = 0; j < obj.parent.children.length; j++){
				try{
					obj.parent.children[j].material.color.setHex('0x'+rgb2hex($(ui.draggable).css('background-color')));
				}catch(err){
				}
			}
		}else{
			obj.material.color.setHex('0x'+rgb2hex($(ui.draggable).css('background-color')));
		}
	}
}


/**
 *
 */
function deleteObject() {
	var counter = 0;
	for (var i = 0; i < resampledPoints.length; i++) {
		var e = resampledPoints[i];
		mouseVector.x = 2 * (e.x / (window.innerWidth)) - 1;
		mouseVector.y = 1 - 2 * ( e.y / window.innerHeight);
		raycaster.setFromCamera( mouseVector, camera );
		intersectsMouse = raycaster.intersectObjects( objects , true);
		if (intersectsMouse.length>0) {
			counter++;
		}
		if (counter > 10) {
			obj = intersectsMouse[0].object;
			if (obj.parent!=scene){
				obj = obj.parent;
			}
			scene.remove(obj);
			objects.splice(objects.indexOf(obj), 1);
			clearCanvas2D();
		}
	}
}


/**
 *
 */
function animate() {
	requestAnimationFrame(animate);
	control.update();
	renderer.render(scene, camera);
}

$( "#download" ).click(function() {
	closeMenuOptions('*');
	var saveData = {
		savedObjects : []
	};

	var saveData = {};
	var savedObjects = []


	saveData.savedObjects = savedObjects;

	for (i = 0; i < objects.length; i++){
		try{
			if (objects[i].children.length == 0){
				var data = {
					"type" : objects[i].name,
					"color" : objects[i].material.color.getHexString(),
					"positionX" : objects[i].position.x,
					"positionY" : objects[i].position.y,
					"positionZ" : objects[i].position.z,
					"rotationX" : objects[i].rotation.x,
					"rotationY" : objects[i].rotation.y,
					"rotationZ" : objects[i].rotation.z,
					"scaleX" : objects[i].scale.x,
					"scaleY" : objects[i].scale.y,
					"scaleZ" : objects[i].scale.z
				};
				saveData.savedObjects.push(data);
				try{
					saveData.savedObjects[i].texture = objects[i].material.map.name;
				}catch(err2){
					saveData.savedObjects[i].texture = null;
				}
			}else{
				var data = {
					"type" : objects[i].name,
					"color" : objects[i].children[0].material.color.getHexString(),
					"positionX" : objects[i].position.x,
					"positionY" : objects[i].position.y,
					"positionZ" : objects[i].position.z,
					"rotationX" : objects[i].rotation.x,
					"rotationY" : objects[i].rotation.y,
					"rotationZ" : objects[i].rotation.z,
					"scaleX" : objects[i].scale.x,
					"scaleY" : objects[i].scale.y,
					"scaleZ" : objects[i].scale.z
				};
				saveData.savedObjects.push(data);
				try{
					saveData.savedObjects[i].texture = objects[i].children[0].material.map.name;
				}catch(err2){
					saveData.savedObjects[i].texture = null;
				}
			}
			console.log('pushed');
		}catch(err){
		}
	}

	document.location = 'data:Application/octet-stream,' + JSON.stringify(saveData);

});

function loadScene(event){
	//STILL IN DEVELOPMENT
	clearScene();
	input = document.getElementById('fileinput');
	file = input.files[0];
	fr = new FileReader();
	fr.onload = receivedText;
	fr.readAsText(file);
	$('#upload-form').fadeOut('fast');
}

function receivedText(e) {
	lines = e.target.result;
	console.log(lines);
	var jsonData = JSON.parse(lines);
	console.log('objetos ' + jsonData.savedObjects.length);
	var ready = 0;
	for (i = 0; i < jsonData.savedObjects.length; i++){
		ready = 0;

		if (jsonData.savedObjects[i].type == "pyramid1"){
			var geometry = new THREE.CylinderGeometry( 1, 1, 2, 3, 1 );
			var material = new THREE.MeshLambertMaterial( {color: '#' + jsonData.savedObjects[i].color} );
			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = "pyramid1";
			if(jsonData.savedObjects[i].texture != null){
				mesh.material.map = THREE.ImageUtils.loadTexture( jsonData.savedObjects[i].texture );
				mesh.material.map.name = jsonData.savedObjects[i].texture;
			}
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			ready = 1;
		}else if(jsonData.savedObjects[i].type == "pyramid2"){
			var geometry = new THREE.CylinderGeometry( 0, 1, 2, 4, 1 );
			var material = new THREE.MeshLambertMaterial( {color: '#' + jsonData.savedObjects[i].color} );
			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = "pyramid2";
			if(jsonData.savedObjects[i].texture != null){
				mesh.material.map = THREE.ImageUtils.loadTexture( jsonData.savedObjects[i].texture );
				mesh.material.map.name = jsonData.savedObjects[i].texture;
			}
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			ready = 1;
		}else if (jsonData.savedObjects[i].type == "pyramid3"){
			var geometry = new THREE.CylinderGeometry( 0, 1, 2, 3, 1 );
			var material = new THREE.MeshLambertMaterial( {color: '#' + jsonData.savedObjects[i].color} );
			var mesh = new THREE.Mesh( geometry, material );;
			mesh.name = "pyramid3";
			if(jsonData.savedObjects[i].texture != null){
				mesh.material.map = THREE.ImageUtils.loadTexture( jsonData.savedObjects[i].texture );
				mesh.material.map.name = jsonData.savedObjects[i].texture;
			}
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			ready = 1;
		}else if(jsonData.savedObjects[i].type == "sphere"){
			var geometry = new THREE.SphereGeometry( 1, 32, 32 );
			var material = new THREE.MeshLambertMaterial({color: '#' + jsonData.savedObjects[i].color});
			var mesh = new THREE.Mesh(geometry, material);
			mesh.name = "sphere";
			if(jsonData.savedObjects[i].texture != null){
				mesh.material.map = THREE.ImageUtils.loadTexture( jsonData.savedObjects[i].texture );
				mesh.material.map.name = jsonData.savedObjects[i].texture;
			}
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			ready = 1;
		}else if(jsonData.savedObjects[i].type == "lightbulb"){
			var mesh = new THREE.Object3D();

			var light = new THREE.PointLight( 0xffffff, 2, 100 );
			light.castShadow = true;
			light.shadowDarkness = 0.7;
			
			var geometryTuck = new THREE.CylinderGeometry( 0.1, 0.1, 0.5, 32, 1 );
			var materialTuck = new THREE.MeshBasicMaterial( {color: '#' + jsonData.savedObjects[i].color} );
			var tuck = new THREE.Mesh( geometryTuck, materialTuck );

			var geometry = new THREE.SphereGeometry( 0.2, 32, 32 );
			var material = new THREE.MeshBasicMaterial({color: '#' + jsonData.savedObjects[i].color});
			var sphere = new THREE.Mesh(geometry, material);

			tuck.position.set(0, 0.15, 0)
			light.position.set(0, 0, 0)
			sphere.position.set(0, 0, 0)

			if(jsonData.savedObjects[i].texture != null){
				tuck.material.map = THREE.ImageUtils.loadTexture( jsonData.savedObjects[i].texture );
				sphere.material.map = THREE.ImageUtils.loadTexture( jsonData.savedObjects[i].texture );
				tuck.material.map.name = jsonData.savedObjects[i].texture;
				sphere.material.map.name = jsonData.savedObjects[i].texture;
			}


			mesh.add(tuck);
			mesh.add(sphere);
			mesh.add(light);
			mesh.name = "lightbulb";

			ready = 1;

		}else if(jsonData.savedObjects[i].type == "sunRay"){
			var mesh = new THREE.Object3D();

			var light = new THREE.DirectionalLight( 0xffffff, 1 );
			light.castShadow = true;
			light.shadowDarkness = 0.7;
			light.shadowCameraNear = 1;
			light.shadowCameraFar = 1024;
			light.shadowCameraLeft = -15;
			light.shadowCameraRight = 15;
			light.shadowCameraTop = 15;
			light.shadowCameraBottom = -15;
			light.shadowMapWidth = 2048;
			light.shadowMapHeight = 2048;
			light.position.set( jsonData.savedObjects[i].positionX, 6, jsonData.savedObjects[i].positionZ);
			
			var geometryTuck = new THREE.CylinderGeometry( 0.25, 0.25, 0.4, 32, 1 );
			var materialTuck = new THREE.MeshBasicMaterial( {color: '#' + jsonData.savedObjects[i].color} );
			var tuck = new THREE.Mesh( geometryTuck, materialTuck );

			tuck.position.set(0, 0, 0)
			light.position.set(0, 0, 0)

			mesh.add(tuck);
			mesh.add(light);

			mesh.name = "sunRay";
			if(jsonData.savedObjects[i].texture != null){
				tuck.material.map = THREE.ImageUtils.loadTexture( jsonData.savedObjects[i].texture );
				tuck.material.map.name = jsonData.savedObjects[i].texture;
			}
			ready = 1;
		}else if (jsonData.savedObjects[i].type == "cube"){
			var geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
			var material = new THREE.MeshLambertMaterial({color: '#' + jsonData.savedObjects[i].color});
			var mesh = new THREE.Mesh(geometry, material);
			mesh.name = "cube";
			if(jsonData.savedObjects[i].texture != null){
				mesh.material.map = THREE.ImageUtils.loadTexture( jsonData.savedObjects[i].texture );
				mesh.material.map.name = jsonData.savedObjects[i].texture;
			}
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			ready = 1;
		}else if (jsonData.savedObjects[i].type == "rombo"){
			var mesh = new THREE.Object3D();

			var geometry = new THREE.CylinderGeometry( 0, 1, 2, 4, 1 );
			var material = new THREE.MeshLambertMaterial( {color: '#' + jsonData.savedObjects[i].color} );
			var pyramid = new THREE.Mesh( geometry, material );
			pyramid.position.x = 0;
			pyramid.position.z = 0;
			pyramid.position.y = 0;
			pyramid.position.y += 1;
			pyramid.castShadow = true;
			pyramid.receiveShadow = true;
			
			var geometry = new THREE.CylinderGeometry( 0, 1, 2, 4, 1 );
			var material = new THREE.MeshLambertMaterial( {color: '#' + jsonData.savedObjects[i].color} );
			var pyramid2 = new THREE.Mesh( geometry, material );
			pyramid2.position.x = 0;
			pyramid2.position.z = 0;
			pyramid2.position.y = 0;
			pyramid2.rotation.x += 3.1416;
			pyramid2.position.y -= 1;
			pyramid2.castShadow = true;
			pyramid2.receiveShadow = true;
			
			mesh.add(pyramid);
			mesh.add(pyramid2);

			mesh.name = "rombo";
			if(jsonData.savedObjects[i].texture != null){
				pyramid.material.map = THREE.ImageUtils.loadTexture( jsonData.savedObjects[i].texture );
				pyramid2.material.map = THREE.ImageUtils.loadTexture( jsonData.savedObjects[i].texture );
				pyramid.material.map.name = jsonData.savedObjects[i].texture;
				pyramid2.material.map.name = jsonData.savedObjects[i].texture;
			}
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			ready = 1;
		}else if (jsonData.savedObjects[i].type == "plane"){
			var geometry = new THREE.PlaneGeometry( 3, 3, 8 );
			var material = new THREE.MeshLambertMaterial( {color: '#' + jsonData.savedObjects[i].color, side: THREE.DoubleSide} );
			var mesh = new THREE.Mesh( geometry, material );

			mesh.name = "plane";
			if(jsonData.savedObjects[i].texture != null){
				mesh.material.map = THREE.ImageUtils.loadTexture( jsonData.savedObjects[i].texture );
				mesh.material.map.name = jsonData.savedObjects[i].texture;
			}
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			ready = 1;
		}

		if(ready){
			mesh.position.x = jsonData.savedObjects[i].positionX;
			mesh.position.y = jsonData.savedObjects[i].positionY;
			mesh.position.z = jsonData.savedObjects[i].positionZ;
			mesh.rotation.x = jsonData.savedObjects[i].rotationX;
			mesh.rotation.y = jsonData.savedObjects[i].rotationY;
			mesh.rotation.z = jsonData.savedObjects[i].rotationZ;
			mesh.scale.x = jsonData.savedObjects[i].scaleX;
			mesh.scale.y = jsonData.savedObjects[i].scaleY;
			mesh.scale.z = jsonData.savedObjects[i].scaleZ;

			scene.add( mesh );
			objects.push(mesh);
		}


	}

	for (i = 0; i < objects.length; i++){
		if (objects[i].children.length > 0){
			for (j = 0; j < objects[i].children.length; j++){
				try{
					objects[i].children[j].material.needsUpdate = true;
				}catch(err){

				}
			}
		}
		try{
			objects[i].material.needsUpdate = true;
		}catch(err){

		}
	}
	$( "#fileinput" ).val('');
}

function clearScene(){
	for (i = 0; i < objects.length; i++){
		scene.remove(objects[i]);
	}
	objects = [];
}

initialize();
animate();
