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
        '<span class="error">Please enter a valid first name</span>'
      );
      temp = false;
    }
    if (last_name.length < 1) {
      $("#last").after(
        '<span class="error">Please enter a valid last name</span>'
      );
      temp = false;
    }
    
    if (email.length < 1) {
      $("#email").after('<span class="error">Please enter a valid email</span>');
    } else {
      var regEx = /^[A-Z0-9][A-Z0-9._%+-]{0,63}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/;
      var validEmail = regEx.test(email);
      if (!validEmail) {
        $("#email").after('<span class="error">Enter a valid email</span>');
      }else {
        temp = false;
      }
    }
    if (account.length < 1) {
      $("#account").after(
        '<span class="error">Please enter a valid account</span>'
      );
      temp = false;
    }
    ("");
    if (role == "") {
      $("#role").after('<span class="error">Please enter a valid role</span>');
      temp = false;
    }
    if (company == "") {
      $("#company").after(
        '<span class="error">Please enter a valid company</span>'
      );
      temp = false;
    }
    // alert(company);
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
