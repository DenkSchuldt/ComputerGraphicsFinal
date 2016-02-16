
/**
 * Displays a draggable circle in the options area.
 */
function showCircleOption() {
	$("#options").html('');
	var img = document.createElement("img");
	$(img).attr('figure', 0);
	$(img).attr('id', 1);
	$(img).attr('src', "images/circle.png");
	$(img).attr('width', 150);
	$(img).attr('height', 150);
	$(img).attr('alt', 'Círculo');
	$(img).css('cursor', 'pointer');
	$(img).draggable();
	$('#options').append(img);

	var img2 = document.createElement("img");
	$(img2).attr('figure', 0);
	$(img2).attr('id', 2);
	$(img2).attr('src', "images/spotlight.png");
	$(img2).attr('width', 150);
	$(img2).attr('height', 150);
	$(img2).attr('alt', 'Spotlight');
	$(img2).css('cursor', 'pointer');
	$(img2).draggable();
	$('#options').append(img2);

	var img3 = document.createElement("img");
	$(img3).attr('figure', 0);
	$(img3).attr('id', 3);
	$(img3).attr('src', "images/directional.png");
	$(img3).attr('width', 150);
	$(img3).attr('height', 150);
	$(img3).attr('alt', 'Directional Light');
	$(img3).css('cursor', 'pointer');
	$(img3).draggable();
	$('#options').append(img3);
}



function showTriangleOptions(){
	document.getElementById("options").innerHTML = "";
	var imagen1 = document.createElement("img");
	imagen1.setAttribute('figure', 1);
	imagen1.setAttribute('id', 1);
	imagen1.setAttribute("src", "images/triangle1.png");
	imagen1.setAttribute("height", "200");
	imagen1.setAttribute("width", "200");
	imagen1.setAttribute("alt", "triangulo 1");
	imagen1.style.cursor = "pointer";
	$(imagen1).draggable();
	document.getElementById("options").appendChild(imagen1);

	var imagen2 = document.createElement("img");
	imagen2.setAttribute('figure', 1);
	imagen2.setAttribute('id', 2);
	imagen2.setAttribute("src", "images/triangle2.png");
	imagen2.setAttribute("height", "200");
	imagen2.setAttribute("width", "200");
	imagen2.setAttribute("alt", "triangulo 2");
	imagen2.style.cursor = "pointer";
	$(imagen2).draggable();
	document.getElementById("options").appendChild(imagen2);

	var imagen3 = document.createElement("img");
	imagen3.setAttribute('figure', 1);
	imagen3.setAttribute('id', 3);
	imagen3.setAttribute("src", "images/triangle3.png");
	imagen3.setAttribute("height", "200");
	imagen3.setAttribute("width", "200");
	imagen3.setAttribute("alt", "triangulo 3");
	imagen3.style.cursor = "pointer";
	$(imagen3).draggable();
	document.getElementById("options").appendChild(imagen3);

}

function showQuadrangleOptions(){

	document.getElementById("options").innerHTML = "";
	var imagen1 = document.createElement("img");
	imagen1.setAttribute('figure', 2);
	imagen1.setAttribute('id', 1);
	imagen1.setAttribute("src", "images/cuadrilatero1.png");
	imagen1.setAttribute("height", "200");
	imagen1.setAttribute("width", "200");
	imagen1.setAttribute("alt", "cuadrilatero 1");
	imagen1.style.cursor = "pointer";
	//imagen1.addEventListener("click", function(){ drawQuadrangle(1); });
	$(imagen1).draggable();
	document.getElementById("options").appendChild(imagen1);

	var imagen3 = document.createElement("img");
	imagen3.setAttribute('figure', 2);
	imagen3.setAttribute('id', 3);
	imagen3.setAttribute("src", "images/cuadrilatero3.png");
	imagen3.setAttribute("height", "200");
	imagen3.setAttribute("width", "200");
	imagen3.setAttribute("alt", "cuadrilatero 3");
	imagen3.style.cursor = "pointer";
	$(imagen3).draggable();
	document.getElementById("options").appendChild(imagen3);

	var imagen4 = document.createElement("img");
	imagen4.setAttribute('figure', 2);
	imagen4.setAttribute('id', 4);
	imagen4.setAttribute("src", "images/cuadrilatero4.png");
	imagen4.setAttribute("height", "200");
	imagen4.setAttribute("width", "200");
	imagen4.setAttribute("alt", "cuadrilatero 3");
	imagen4.style.cursor = "pointer";
	$(imagen4).draggable();
	document.getElementById("options").appendChild(imagen4);

}

function clearOptions(){
	document.getElementById("options").innerHTML = "";
}
