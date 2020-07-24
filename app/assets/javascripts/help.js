$(document).ready(function () {
  $('.help-1').click(function () {
    SetDisplayHelp('.show-help-1');
  });
  $('.help-2').click(function () {
    SetDisplayHelp('.show-help-2');
  });
  $('.help-3').click(function () {
    SetDisplayHelp('.show-help-3');
  });
  $('.help-4').click(function () {
    SetDisplayHelp('.show-help-4');
  });
  $('.help-5').click(function () {
    SetDisplayHelp('.show-help-5');
  });
});
function SetDisplayHelp(help_display){
  $('.show-help-1 , .show-help-2 , .show-help-3, .show-help-4 , .show-help-5').css("display","none");
  $(help_display).css("display","block");
}