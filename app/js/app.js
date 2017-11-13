$(window).on('load', function () {
  var isMobile = $('.js-menu-btn').is(":visible");
  $('.js-menu-btn').on('click', function () {
    $(this).toggleClass('open');
    $('.js-menu-content').toggleClass('open');
  });
});