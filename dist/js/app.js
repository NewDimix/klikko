$(window).on("load",function(){$(".js-menu-btn").is(":visible");$(".js-menu-btn").click(function(n){$(".js-menu-content").slideToggle(),n.stopPropagation(),$(".js-menu-btn").toggleClass("open")}),$(document).mouseup(function(n){0===$(".js-menu").has(n.target).length&&$(window).width()<"768"&&($(".js-menu-content").slideUp(),$(".js-menu-btn").removeClass("open"))})});