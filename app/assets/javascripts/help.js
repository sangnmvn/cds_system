$(document).ready(function () {
  $('.help-1').click(function () {
    setDisplayHelp('.show-help-1');
  });
  $('.help-2').click(function () {
    setDisplayHelp('.show-help-2');
  });
  $('.help-3').click(function () {
    setDisplayHelp('.show-help-3');
  });
  $('.help-4').click(function () {
    setDisplayHelp('.show-help-4');
  });
  $('.help-5').click(function () {
    setDisplayHelp('.show-help-5');
  });
});
function setDisplayHelp(help_display){
  $('.show-help-1 , .show-help-2 , .show-help-3, .show-help-4 , .show-help-5').css("display","none");
  $(help_display).css("display","block");
}