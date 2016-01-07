
var clickX = new Array();
var clickY = new Array();
var paint;

/**
 *
 */
function addClick(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
}

/**
 *
 */
function redraw() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.strokeStyle = "#df4b26";
  context.lineWidth = 1;
  for(var i=0; i < clickX.length; i++) {
    context.beginPath();
    context.arc(clickX[i],clickY[i],1,0,2*Math.PI);
    context.fillStyle = "#df4b26";
    context.fill();
    context.closePath();
    context.stroke();
  }
}

/**
 *
 */
$('#canvas_2d').mousedown(function(e){
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
});

/**
 *
 */
function init() {
  $("#canvas_2d").attr("width", $("#canvas_2d").width());
  $("#canvas_2d").attr("height", $("#canvas_2d").height());
  context = document.getElementById('canvas_2d').getContext("2d");

  window.addEventListener('resize', function() {
    $("#canvas_2d").attr("width", $("#canvas_2d").width());
    $("#canvas_2d").attr("height", $("#canvas_2d").height());
    redraw();
  });
}

init();
