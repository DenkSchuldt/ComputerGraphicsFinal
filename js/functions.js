
var colors = {
  "red": "#F44336",
  "pink": "#E91E63",
  "purple": "#9C27B0",
  "deeppurple": "#673AB7",
  "indigo": "#3F51B5",
  "blue": "#2196F3",
  "lightblue": "#03A9F4",
  "cyan": "#00BCD4",
  "teal": "#009688",
  "green": "#4CAF50",
  "lightgreen": "#8BC34A",
  "lime": "#CDDC39",
  "yellow": "#FFEB3B",
  "amber": "#FFC107",
  "orange": "#FF9800",
  "deeporange": "#FF5722",
  "brown": "#795548",
  "gray": "#9E9E9E",
  "black": "#000000"
}

var main_color;
var clickX = new Array();
var clickY = new Array();
var newClickX = new Array();
var newClickY = new Array();
var cornerX = new Array();
var cornerY = new Array();
var paint;
var dist_prom = 0;
var figura_cerrada = 0;

function Point(x, y) {
  this.x = x;
  this.y = y;
}
/**
 *
 */
function addClick(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
}

function distance(pointx, pointy, point2x, point2y){
	return Math.sqrt(Math.pow(point2x - pointx, 2) + Math.pow(point2y - pointy, 2));
}

function leaveCorners(){
	cornerX = [];
	cornerX.push(newClickX[0]);
	cornerY = [];
	cornerY.push(newClickY[0]);
	for (i = 1; i < newClickX.length - 1; i++) {
		var p1 = new Point(newClickX[i-1], newClickY[i-1]);
		var p2 = new Point(newClickX[i], newClickY[i]);
		var p3 = new Point(newClickX[i+1], newClickY[i+1]);
		var v1 = new Point(p2.x - p1.x, p2.y - p1.y);
		var v2 = new Point(p3.x - p2.x, p3.y - p2.y);
		//console.log(v1.x);
		var dot_product = Math.acos((v1.x*v2.x + v1.y*v2.y)/(Math.sqrt(v1.x*v1.x + v1.y*v1.y)*Math.sqrt(v2.x*v2.x + v2.y*v2.y)))* (180/Math.PI);
		if (dot_product > 90){
		  dot_product = 180 - dot_product;
		}
		distancia_punto_anterior = distance(cornerX[cornerX.length-1], cornerY[cornerY.length - 1], newClickX[i], newClickY[i])

		if(dot_product > 35 && distancia_punto_anterior > 2*dist_prom){
			cornerX.push(newClickX[i]);
			cornerY.push(newClickY[i]);
		}

	}
}

function resample(resample_number) {
  var distanciaTotal = 0; //Distancia total del trazo
  var distanciaPromedio = 0; //distancia promedio para equi-espaciar los puntos
  var distancia = 0; //distancia entre 2 puntos
  var distanciaAvance = 0; //distancia acumulada en el resampling
  newClickX = [];
  newClickY = [];

  // REMOVE PREVIOUS SKETCH

  for (i = 1; i < clickX.length; i++) {
    distanciaTotal += distance(clickX[i-1], clickY[i-1], clickX[i], clickY[i]);
  }
  distanciaPromedio = distanciaTotal/(resample_number - 1);
  dist_prom = distanciaPromedio;
  newClickX.push( clickX[0] );
  newClickY.push( clickY[0] );
  for (i = 1; i < clickX.length; i++) {
    distancia = distance(clickX[i-1], clickY[i-1], clickX[i], clickY[i]);
    if( (distanciaAvance + distancia) >= distanciaPromedio ) {
      var nuevoPuntoX = 0;
	  var nuevoPuntoY = 0;
      nuevoPuntoX = clickX[i-1] + ((distanciaPromedio - distanciaAvance)/distancia)*(clickX[i]-clickX[i-1]);
      nuevoPuntoY = clickY[i-1] + ((distanciaPromedio - distanciaAvance)/distancia)*(clickY[i]-clickY[i-1]);
      newClickX.push( nuevoPuntoX );
	  newClickY.push( nuevoPuntoY );
      clickX.splice(i, 0, nuevoPuntoX);
	  clickY.splice(i, 0, nuevoPuntoY);
      distanciaAvance = 0;
    } else {
      distanciaAvance += distancia;
    }
  }
  if(newClickX.length < resample_number){
	newClickX.push( clickX[ clickX.length- 1 ] );
	newClickY.push( clickY[ clickY.length- 1 ] );
  }
  console.log(newClickX.length);
  if(distance(clickX[0], clickY[0], clickX[clickX.length - 1], clickY[clickY.length - 1]) < 3*distanciaPromedio){
	figura_cerrada = 1;
  }else{
	figura_cerrada = 0;
  }
}

/**
 *
 */
function redraw() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.strokeStyle = main_color;
  context.lineWidth = 1;
  for(var i=0; i < clickX.length; i++) {
    context.beginPath();
    context.arc(clickX[i],clickY[i],1,0,2*Math.PI);
    context.fillStyle = main_color;
    context.fill();
    context.closePath();
    context.stroke();
  }
}

function redraw2() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.strokeStyle = main_color;
  context.lineWidth = 1;
  for(var i=0; i < newClickX.length; i++) {
    context.beginPath();
    context.arc(newClickX[i],newClickY[i],1,0,2*Math.PI);
    context.fillStyle = main_color;
    context.fill();
    context.closePath();
    context.stroke();
  }
}

function redrawCorners() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.strokeStyle = main_color;
  context.lineWidth = 1;
  for(var i=0; i < cornerX.length; i++) {
    context.beginPath();
    context.arc(cornerX[i],cornerY[i],1,0,2*Math.PI);
    context.fillStyle = main_color;
    context.fill();
    context.closePath();
    context.stroke();
  }
}

/**
 *
 */
$('#canvas_2d').mousedown(function(e){
  clickX = [];
  clickY = [];
  var offset = $(this).offset();
  var relX = e.pageX - offset.left;
  var relY = e.pageY - offset.top;
  paint = true;
  addClick(relX, relY);
  redraw();
});

/**
 *
 */
$('#canvas_2d').mousemove(function(e){
  var x, y;
  if(paint) {
    var offset = $(this).offset();
    var relX = e.pageX - offset.left;
    var relY = e.pageY - offset.top;
    addClick(relX, relY, true);
    redraw();
  }
});

/**
 *
 */
$('#canvas_2d').mouseup(function(e){
  paint = false;
  resample(64);
  redraw2();
  leaveCorners();
  //redrawCorners();
  if(cornerX.length == 3 && figura_cerrada){
	console.log('Es un Triangulo');
  }else if(cornerX.length == 4 && figura_cerrada){
	console.log('Es un Quadrangulo');
  }
});

/**
 *
 */
function init() {

  main_color = "#F44336";
  context = document.getElementById('canvas_2d').getContext("2d");

  $("#canvas_2d").attr("width", $("#canvas_2d").width());
  $("#canvas_2d").attr("height", $("#canvas_2d").height());


  window.addEventListener('resize', function() {
    $("#canvas_2d").attr("width", $("#canvas_2d").width());
    $("#canvas_2d").attr("height", $("#canvas_2d").height());
    redraw();
  });

  $('.options').click(function() {
    $('.colors').toggle('drop');
  });
  $('.color').hover(
    function(){
      $(this).attr('style', 'border: 2px solid ' + $(this).css('background-color'));
    }, function() {
      $(this).attr('style', 'border: 2px solid white');
  });
  $('.color').click(function(){
    main_color = $(this).css('background-color');
    $('.colors').toggle('drop');
  });

}

init();
