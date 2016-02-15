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

toggleSelectedOption();
