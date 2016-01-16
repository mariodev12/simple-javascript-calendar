(function(){
  $(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    sticky();
  });
})();

function sticky(){
  $(document).on('scroll', function(){
    if($(this).scrollTop() > 80){
      $('header').addClass('header-fixed');
      $('.addShow').attr('data-toggle','tooltip');
      $('.addShow').attr('title', 'Add Shows');
      $('.addShow').attr('data-original-title','Add Shows');
      $('.addShow').attr('data-placement','bottom');

      $('.deleteShow').attr('data-toggle','tooltip');
      $('.deleteShow').attr('title', 'Add Shows');
      $('.deleteShow').attr('data-original-title','Delete Shows');
      $('.deleteShow').attr('data-placement','bottom');
      $('[data-toggle="tooltip"]').tooltip('enable');

    } else {
      $('header').removeClass('header-fixed');
      $('.addShow').removeAttr('data-toggle','tooltip');
      $('.addShow').removeAttr('title', 'Add Shows');
      $('.addShow').removeAttr('data-original-title');
      $('.addShow').attr('data-placement','bottom');

      $('.deleteShow').removeAttr('data-toggle','tooltip');
      $('.deleteShow').removeAttr('title', 'Delete Shows');
      $('.deleteShow').removeAttr('data-original-title');
      $('.deleteShow').attr('data-placement','bottom');
      $('[data-toggle="tooltip"]').tooltip('destroy');

    }
  });
}
