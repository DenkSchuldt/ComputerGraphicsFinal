
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
 *
 */
function hideInstructions() {
	$(".overlay").click(function(){
		$(".instructions").fadeOut();
		$(".title").fadeIn();
	});
}


/**
 *
 */
function toggleSelectedOption() {
  $('.fab').click(function(){
    if ($('.pencil-cursor').is(':visible')) {
      $('#canvas_2d').fadeIn('fast');
      $('.pencil-cursor').fadeOut('fast', function(){
        $('.mouse-cursor').fadeIn('fast');
      });
  	} else {
      $('#canvas_2d').fadeOut('fast');
      $('.mouse-cursor').fadeOut('fast', function() {
        $('.pencil-cursor').fadeIn('fast');
      });
    }
  });
}


/**
 *
 */
function closeMenuOptions() {
  if($('.colors-option').is(':visible')) {
    $('.colors-option').toggle('drop');
  }
  if($('.lightning-options').is(':visible')) {
    $('.lightning-options').toggle('drop');
  }
  if($('.textures-options').is(':visible')) {
    $('.textures-options').toggle('drop');
  }
}


/**
 *
 */
function colorsMenuOption() {
  $('.colors').click(function() {
    $('.colors-option').toggle('drop');
  });
  $('.colors-option span').draggable({
    appendTo: 'body',
    containment: 'window',
    helper: 'clone'
  });
  $('.color').hover(
    function(){
      $(this).attr('style', 'border: 2px solid ' + $(this).css('background-color'));
    }, function() {
      $(this).attr('style', 'border: 2px solid white');
  });
  $('.color').click(function(){
    main_color = $(this).css('background-color');
    context.fillStyle = main_color;
    $('.colors-option').toggle('drop');
    url = 'url(../images/cursors/' + rgb2hex(main_color) + '.png) 6 40, auto';
    console.log(url);
    $("#canvas_2d").css('cursor', url);
    $('#canvas_2d').fadeIn('fast');
    if ($('.pencil-cursor').is(':visible')) {
      $('#canvas_2d').fadeIn('fast');
      $('.pencil-cursor').fadeOut('fast', function(){
        $('.mouse-cursor').fadeIn('fast');
      });
  	}
  });
}


/**
 *
 */
function lightningMenuOption() {
  $('.lightning').click(function() {
    $('.lightning-options').toggle('drop');
  });
  $('.lightning-options img').draggable({ helper: 'clone' });
}


/**
 *
 */
function texturesMenuOption() {
  $('.textures').click(function() {
    $('.textures-options').toggle('drop');
  });
  $('.textures-options img').draggable({
    appendTo: 'body',
    containment: 'window',
    helper: 'clone'
  });
}

/**
 *
 */
function general_init() {
  hideInstructions();
  toggleSelectedOption();
  colorsMenuOption();
  lightningMenuOption();
  texturesMenuOption();
}


general_init();
