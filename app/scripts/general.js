
/**
 * src: http://stackoverflow.com/a/3627747
 */
function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

/**
 * src: http://javascriptexample.net/extobjects81.php
 */
Math.avg = function() {
  var cnt, tot, i;
  cnt = arguments.length;
  tot = i = 0;
  while (i < cnt) tot+= arguments[i++];
  return tot / cnt;
}

/**
 *
 */
function newPoint(x, y) {
  var point = {};
  point.x = x;
  point.y = y;
  return point;
}

/**
 *
 */
function getDistance(pointA, pointB) {
	return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2));
}

/**
 *
 */
function getMagnitud(pointA) {
	return Math.sqrt(Math.pow(pointA.x, 2) + Math.pow(pointA.y, 2));
}

/**
 *
 */
function getNormalZ(pointA, pointB, pointC){
	return producto_cruz = (pointB.x - pointA.x)*(pointC.y - pointB.y) - (pointC.x - pointB.x)*(pointB.y - pointA.y);
}
