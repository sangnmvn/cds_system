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
});

function success() {
  $("#alert-success").fadeIn();
  window.setTimeout(function () {
    $("#alert-success").fadeOut(1000);
  }, 5000);
}
function fails() {
  $("#alert-danger").fadeIn();
  window.setTimeout(function () {
    $("#alert-danger").fadeOut(1000);
  }, 5000);
}

$(document).ready(function () {
  $(".tokenize-project").tokenize2();
  $("#btn-modal-add-user").click(function () {
    first_name = $("#first").val();
    last_name = $("#last").val();
    email = $("#email").val();
    account = $("#account").val();
    role = $("#role").val();
    company = $("#company").val();
    project = $("#project").val();
    temp = true;
    $(".error").remove();
    if (first_name.length < 1) {
      $("#first").after(
        '<p class="error">Please enter First Name</p>'
      );
      
      temp = false;
    }else{
      if (first_name.length < 2 || first_name.length > 20) {
        $("#first").after(
          '<p class="error">Please enter a value between {2} and {20} characters long.</p>'
        );
        temp = false;
      }
    }
    
    if (last_name.length < 1) {
      
      $("#last").after(
        '<p class="error">Please enter Last Name</p>'
      );
      temp = false;
    }else{
      if (last_name.length < 2 || last_name.length > 20) {
        $("#last").after(
          '<p class="error">Please enter a value between {2} and {20} characters long.</p>'
        );
        temp = false;
      }
    }
    
    if (email.length < 1) {
      $("#email").after('<p class="error">Please enter Email Address</p>');
      temp = false;
    } else {
      var regEx = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      var validEmail = regEx.test(email);
      if (!validEmail) {
        $("#email").after('<p class="error">The format of email address must follow RFC 5322. For example: abc@domain.com</p>');
        temp = false;
      }
    }
    if (account.length < 1) {
      $("#account").after(
        '<p class="error">Please enter Account</p>'
      );
      temp = false;
    }else{
      if (account.length < 2 || account.length > 20) {
        $("#account").after(
          '<p class="error">Please enter a value between {2} and {20} characters long.</p>'
        );
        temp = false;
      }
    }


    if (role == "") {
      $("#role").after('<p class="error">Please select a Role</p>');
      temp = false;
    }
    if (company == "") {
      $("#company").after(
        '<p class="error">Please select a Company</p>'
      );
      temp = false;
    }
    if (temp == true) {
      $.ajax({
        url: "/admin/user_management/add/",
        type: "POST",
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
        },
        data: {
          company: company,
          project: project,
          role: role,
          first: first_name,
          last: last_name,
          email: email,
          account: account,
        },
      });
    }
  });
});

$(document).ready(function () {
  $(".modal-add-user-management").change(function () {
    company = $(".modal-add-user-management").val();
    $.ajax({
      url: "/admin/user_management/modal/company/",
      type: "GET",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
      data: { company: company },
    });
  });
});
// submit filter
$(document).ready(function () {
  $("#btn-filter").click(function () {
    company = $("#filter-company").val();
    project = $("#filter-project").val();
    role = $("#filter-role").val();
    $.ajax({
      url: "/admin/user_management/submit/filter/",
      type: "POST",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
      data: { company: company, project: project, role: role },
    });
  });
});
