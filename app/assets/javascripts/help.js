$(document).ready(function () {

  var $container = $("html,body");
  $('.help-1').click(function () {
    setDisplayHelp('.show-help-1');
    document.getElementsByClassName("show-help-1")[0].scrollIntoView();
  });
  $('.help-1-1').click(function () {
    setDisplayHelp('.show-help-1');
    document.getElementsByClassName("show-help-1-1")[0].scrollIntoView();
  });
  $('.help-1-1-1').click(function () {
    setDisplayHelp('.show-help-1');
    document.getElementsByClassName("show-help-1-1-1")[0].scrollIntoView();
  });
  $('.help-1-1-2').click(function () {
    setDisplayHelp('.show-help-1');
    document.getElementsByClassName("show-help-1-1-2")[0].scrollIntoView();
  });
  $('.help-2').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2")[0].scrollIntoView();
  });
  $('.help-administration').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-administration")[0].scrollIntoView();
  });
  $('.help-2-1').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-1")[0].scrollIntoView();
  });
  $('.help-2-2').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-2")[0].scrollIntoView();
  });
  $('.help-2-3').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-3")[0].scrollIntoView();
  });
  $('.help-2-3-1').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-3-1")[0].scrollIntoView();
  });
  $('.help-2-3-2').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-3-2")[0].scrollIntoView();
  });
  $('.help-2-3-3').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-3-3")[0].scrollIntoView();
  });
  $('.help-2-3-4').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-3-4")[0].scrollIntoView();
  });
  $('.help-2-4').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-4")[0].scrollIntoView();
  });
  $('.help-2-4-1').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-4-1")[0].scrollIntoView();
  });
  $('.help-2-4-2').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-4-2")[0].scrollIntoView();
  });
  $('.help-2-5').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-5")[0].scrollIntoView();
  });
  $('.help-2-5-1').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-5-1")[0].scrollIntoView();
  });
  $('.help-2-5-2').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-5-2")[0].scrollIntoView();
  });
  $('.help-2-6').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-6")[0].scrollIntoView();
  });
  $('.help-2-6-1').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-6-1")[0].scrollIntoView();
  });
  $('.help-2-6-2').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-6-2")[0].scrollIntoView();
  });
  $('.help-2-6-3').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-6-3")[0].scrollIntoView();
  });
  $('.help-2-6-4').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-6-4")[0].scrollIntoView();
  });
  $('.help-2-7').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-7")[0].scrollIntoView();
  });
  $('.help-2-7-1').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-7-1")[0].scrollIntoView();
  });
  $('.help-2-7-2').click(function () {
    setDisplayHelp('.show-help-2');
    document.getElementsByClassName("show-help-2-7-2")[0].scrollIntoView();
  });

  $(window).scroll(function(e){ 
    var navbar = $('.right-panel').position().top;//khung chứa noi dung
    var st = $(window).scrollTop();
    if (st >= navbar) {
      $(".card").addClass('fixedElement');//card :menu (ngang hàng với khung)
    } else {
      $(".card").removeClass('fixedElement');
    }
  });
});

function setDisplayHelp(help_display) {
  $('.show-help-1 , .show-help-2 , .show-help-3, .show-help-4 , .show-help-5').css("display", "none");
  $(help_display).css("display", "block");
}