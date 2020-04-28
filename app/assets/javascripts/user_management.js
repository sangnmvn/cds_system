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
  $("#btn-filter").click(function() {
    company = $("#filter-company").val();
    project = $("#filter-project").val();
    role = $("#filter-role").val();
    $.ajax({
      url: "/admin/user_management/submit/",
      type: "GET",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
      data: { company: company, project: project, role: role },
    });
  });
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

$(document).ready(function() {

  $('.modal-form-add-user').submit(function(e) {
    e.preventDefault();
    var first_name = $('#first').val();
    var last_name = $('#last').val();
    var email = $('#email').val();
    var account = $('#account').val();
    var role = $('#role').val();
    var company = $('#company').val();
    temp = true
    $(".error").remove();
    // $('.first').after('<span class="error">Please enter a valid email</span>');
    // return false;
    if (first_name.length < 1) {
      $('#first').after('<span class="error">Please enter a valid first name</span>');
      temp = false 
    }
    if (last_name.length < 1) {
      $('#last').after('<span class="error">Please enter a valid last name</span>');
      temp = false 
    }
    if (email.length < 1) {
      $('#email').after('<span class="error">Please enter a valid email</span>');
      temp = false 
    } 
    if (account.length < 1) {
      $('#account').after('<span class="error">Please enter a valid account</span>');
      temp = false 
    }""
    if (role == "") {
      $('#role').after('<span class="error">Please enter a valid role</span>');
      temp = false 
    }
    if (company == "") {
      $('#company').after('<span class="error">Please enter a valid company</span>');
      temp = false 
    }
    return temp
  });

});




$(document).ready(function () {
  $(".modal-add-user-management").change(function () {
    company = $(".modal-add-user-management").val();
    $.ajax({
      url: "/admin/user_management/modal/company/",
      type: "GET",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
      data: { company: company }
    });
  });
});