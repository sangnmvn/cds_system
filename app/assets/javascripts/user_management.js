$(document).ready(function () {
  $("#filter-company,#filter-project").change(function () {
    company = $("#filter-company").val();
    project = $("#filter-project").val();
    $.ajax({
      url: "/admin/user_management/filter/",
      type: "POST",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
      data: { company: company, project: project },
    });
  });
  $(".tokenize-project").tokenize2();
  // $(".tokenize-project").tokenize2({
  //   dataSource: "select",
  //   placeholder: "Type something to start...",
  // });
  // $('.tokenize-project').tokenize2().trigger('tokenize:tokens:add', ['token value', 'token display text', true]);
  // $(".tokenize-project").on("tokenize:tokens:added", function (e, value) {
  //   console.log(value);
  //   val = $(".tokenize-project").val();
  // });
});

$(document).ready(function () {
  // $("#btn-search-user-management").click(function() {
  //   search = $("#search-user-management").val();
  //   alert(search);
  // });
});

function success(){
  $("#alert-success").fadeIn();
  window.setTimeout(function () {
    $("#alert-success").fadeOut(1000);
  }, 5000);
}
function fails(){
  $("#alert-danger").fadeIn();
  window.setTimeout(function () {
    $("#alert-danger").fadeOut(1000);
  }, 5000);
}