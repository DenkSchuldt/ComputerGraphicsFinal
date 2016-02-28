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

/**
 *
 */
function toggleFabOption() {
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
function closeMenuOptions(ignore) {
  if (ignore !== '.colors-option') {
    if($('.colors-option').is(':visible')) {
      $('.colors-option').toggle('drop');
    }
  }
  if (ignore !== '.lightning-option') {
    if($('.lightning-option').is(':visible')) {
      $('.lightning-option').toggle('drop');
    }
  }
  if (ignore !== '.textures-option') {
    if($('.textures-option').is(':visible')) {
      $('.textures-option').toggle('drop');
    }
  }
  if(ignore !== '.instructions-option'){
    if($('.instructions-option').is(':visible')) {
      $('.instructions-option').toggle('drop');
    }
  }
  if(ignore !== 'download-upload-option'){
    if($('download-upload-option').is(':visible')) {
      $('download-upload-option').toggle('drop');
    }
  }
}


/**
 *
 */
function colorsMenuOption() {
  $('.colors').click(function(e) {
    if(!$('.colors-option').is(':visible')) {
      $('.colors-option').css({'top':e.pageY, 'right':$(window).width()-e.pageX});
    }
    $('.colors-option').toggle('drop');
    closeMenuOptions('.colors-option');
  });
  $('.colors-option span').draggable({
    appendTo: 'body',
    containment: 'window',
    helper: 'clone',
    start: function(e, ui) {
      closeMenuOptions();
    }
  });
  $('.color').hover(
    function(){
      $(this).attr('style', 'border: 2px solid ' + $(this).css('background-color'));
      if (rgb2hex($(this).css('background-color')).indexOf('ffffff') >= 0) {
        $(this).attr('style', 'border: 2px solid #000');
      }
    }, function() {
      $(this).attr('style', 'border: 2px solid white');
      if (rgb2hex($(this).css('background-color')).indexOf('ffffff') >= 0) {
        $(this).attr('style', 'border: 1px solid #000');
      }
  });
  $('.color').click(function(){
    main_color = $(this).css('background-color');
    context.fillStyle = main_color;
    $('.colors-option').toggle('drop');
    url = 'url(../images/cursors/' + rgb2hex(main_color) + '.png) 6 40, auto';
    hex = '#'+rgb2hex(main_color);
    $('.colors').css('color', hex);
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
  $('.lightning').click(function(e) {
    if(!$('.lightning-option').is(':visible')) {
      $('.lightning-option').css({'top':e.pageY, 'right':$(window).width()-e.pageX});
    }
    $('.lightning-option').toggle('drop');
    closeMenuOptions('.lightning-option');
  });
  $('.lightning-option img').draggable({
    helper: 'clone',
    appendTo: 'body',
    containment: 'window',
    start: function(e, ui) {
      closeMenuOptions();
    }
  });
}


/**
 *
 */
function texturesMenuOption() {
  $('.textures').click(function(e) {
    if(!$('.textures-option').is(':visible')) {
      $('.textures-option').css({'top':e.pageY, 'right':$(window).width()-e.pageX});
    }
    $('.textures-option').toggle('drop');
    closeMenuOptions('.textures-option');
  });
  $('.textures-option img').draggable({
    appendTo: 'body',
    containment: 'window',
    helper: 'clone',
    start: function(e, ui) {
      closeMenuOptions();
    }
  });
}


/**
 *
 */
function instructionsMenuOption() {
  $('.instructions').click(function(e) {
    if(!$('.instructions-option').is(':visible')) {
      $('.instructions-option').css({'top':e.pageY, 'right':$(window).width()-e.pageX});
    }
    document.cookie = 'geometricshaper';
    $('.instructions-option').toggle('drop');
    closeMenuOptions('.instructions-option');
  });
}


/**
 *
 */
function downloadUploadMenuOption() {
  $('.download-upload').click(function(e) {
    if(!$('.download-upload-option').is(':visible')) {
      $('.download-upload-option').css({'top':e.pageY, 'right':$(window).width()-e.pageX});
    }
    $('.download-upload-option').toggle('drop');
    closeMenuOptions('.download-upload-option');
  });
}

/**
 *
 */
function menuInit() {
  toggleFabOption();
  colorsMenuOption();
  lightningMenuOption();
  texturesMenuOption();
  instructionsMenuOption();
  downloadUploadMenuOption();
  if(document.cookie.indexOf('geometricshaper')==-1) {
    $('.instructions-option').toggle('drop');
  }
}

menuInit();
