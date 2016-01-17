function showTriangleOptions(){

	document.getElementById("options").innerHTML = "";
	var imagen1 = document.createElement("img");
	imagen1.setAttribute("src", "images/triangle1.png");
	imagen1.setAttribute("height", "200");
	imagen1.setAttribute("width", "200");
	imagen1.setAttribute("alt", "triangulo 1");
	imagen1.style.cursor = "pointer";
	imagen1.addEventListener("click", function(){ drawTriangle(1); });
	document.getElementById("options").appendChild(imagen1);
	
	var imagen2 = document.createElement("img");
	imagen2.setAttribute("src", "images/triangle2.png");
	imagen2.setAttribute("height", "200");
	imagen2.setAttribute("width", "200");
	imagen2.setAttribute("alt", "triangulo 2");
	imagen2.style.cursor = "pointer";
	document.getElementById("options").appendChild(imagen2);
	imagen2.addEventListener("click", function(){ drawTriangle(2); });
	
	var imagen3 = document.createElement("img");
	imagen3.setAttribute("src", "images/triangle3.jpeg");
	imagen3.setAttribute("height", "200");
	imagen3.setAttribute("width", "200");
	imagen3.setAttribute("alt", "triangulo 3");
	imagen3.style.cursor = "pointer";
	imagen3.addEventListener("click", function(){ drawTriangle(3); });
	document.getElementById("options").appendChild(imagen3);

}

function showQuadrangleOptions(){

	document.getElementById("options").innerHTML = "";
	var imagen1 = document.createElement("img");
	imagen1.setAttribute("src", "images/cuadrilatero1.jpg");
	imagen1.setAttribute("height", "200");
	imagen1.setAttribute("width", "200");
	imagen1.setAttribute("alt", "cuadrilatero 1");
	imagen1.style.cursor = "pointer";
	imagen1.addEventListener("click", function(){ drawQuadrangle(1); });
	document.getElementById("options").appendChild(imagen1);
	
	var imagen2 = document.createElement("img");
	imagen2.setAttribute("src", "images/cuadrilatero2.png");
	imagen2.setAttribute("height", "200");
	imagen2.setAttribute("width", "200");
	imagen2.setAttribute("alt", "cuadrilatero 2");
	imagen2.style.cursor = "pointer";
	imagen2.addEventListener("click", function(){ drawQuadrangle(2); });
	document.getElementById("options").appendChild(imagen2);
	
	var imagen3 = document.createElement("img");
	imagen3.setAttribute("src", "images/cuadrilatero3.png");
	imagen3.setAttribute("height", "200");
	imagen3.setAttribute("width", "200");
	imagen3.setAttribute("alt", "cuadrilatero 3");
	imagen3.style.cursor = "pointer";
	imagen3.addEventListener("click", function(){ drawQuadrangle(3); });
	document.getElementById("options").appendChild(imagen3);
	
	var imagen4 = document.createElement("img");
	imagen4.setAttribute("src", "images/cuadrilatero4.png");
	imagen4.setAttribute("height", "200");
	imagen4.setAttribute("width", "200");
	imagen4.setAttribute("alt", "cuadrilatero 3");
	imagen4.style.cursor = "pointer";
	imagen4.addEventListener("click", function(){ drawQuadrangle(4); });
	document.getElementById("options").appendChild(imagen4);

}

function clearOptions(){
	document.getElementById("options").innerHTML = "";
}


