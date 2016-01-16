(function(){
  $(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip('enable');
    sticky();
  });
})();

function sticky(){
  $(document).on('scroll', function(){
    if($(this).scrollTop() > 80){
      $('header').addClass('header-fixed');
    } else {
      $('header').removeClass('header-fixed');
    }
  });
}
