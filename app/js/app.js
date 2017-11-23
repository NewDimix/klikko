$(window).on('load', function () {
  var isMobile = $('.js-menu-btn').is(":visible");

  $('.js-menu-btn').click(function (event) {
    $('.js-menu-content').slideToggle();
    event.stopPropagation();
    $('.js-menu-btn').toggleClass('open');
  });

  $(document).mouseup(function (e) {
    var container = $('.js-menu');
    if (container.has(e.target).length === 0) {
      if ($(window).width() < '768') {
        $('.js-menu-content').slideUp();
        $('.js-menu-btn').removeClass('open');
      }
    }
  });
});
