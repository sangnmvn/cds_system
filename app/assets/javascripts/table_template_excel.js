$(document).ready(function () {
  // alert fails
  function fails(content) {
    $('#content-alert-fail').html(content);
    $("#alert-danger").fadeIn();
    window.setTimeout(function () {
      $("#alert-danger").fadeOut(1000);
    }, 2000);
  }
  $('.export_excel_icon').on('click', function () {
    var template_id = $(this).data("template_id");
    var ext = $(this).data("ext");

    $.ajax({
      type: "GET",
      url: "/templates/" + template_id + "/" + ext,
      dataType: "json",
      success: function (response) {
        if (response.status == 'fail') {
          fails("The template hasn't been created.");
        }else{
          $(response).each(
            function (i, e) {
              // download this file
              window.location = e['filename'];
            }
          );
        }
      }
    });
  });
})