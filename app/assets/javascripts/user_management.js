$(document).ready(function () {
  $("#filter-company,#filter-project").change(function () {
    company = $("#filter-company").val();
    project = $("#filter-project").val();
    $.ajax({
      url: "/admin/user_management/filter/",
      type: "POST",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
      data: { company: company, project: project },
      dataType: "json",
      success: function (response) {
        $(response).each(function (i, e) {
          console.log(e.project_current);
          $("#filter-project").html("");
          if (Array.isArray(e.projects) && e.projects.length) {
            $('<option value="all">All</option>').appendTo("#filter-project");
          }

          $.each(e.projects, function (k, v) {
            if (v.id == e.project_current && e.company_current != 'all') {
              $('<option value="' + v.id + '" selected>' + v.desc + '</option>').appendTo(
                "#filter-project"
              );
            } else {
              $('<option value="' + v.id + '">' + v.desc + '</option>').appendTo(
                "#filter-project"
              );
            }
          });
          $("#filter-role").html("");
          if (Array.isArray(e.roles) && e.roles.length) {
            $('<option value="all">All</option>').appendTo("#filter-role");
          }
          $.each(e.roles, function (k, v) {
            $('<option value="' + v.id + '">' + v.name + "</option>").appendTo(
              "#filter-role"
            );
          });

          // $('#filter-role').html(projects);
          // $('#filter-role').html('');
          //duyet mang doi tuong
          // var tr = $("<tr id=" + e.id + "/>");
          // $("<td style='text-align: right'/>").html("1").appendTo(tr);
          // $("<td/>")
          //   .html("<input type='checkbox' class='mycontrol'/>")
          //   .appendTo(tr);
          // $("<td/>").html(e.first_name).appendTo(tr);
          // $("<td/>").html(e.last_name).appendTo(tr);
          // $("<td/>").html(e.email).appendTo(tr);
          // tr.appendTo("#table_right tbody");
        });
      },
    });
  });
});
// $('#filter-project').html('<option value="all">All</option><% @projects.each {|x| %><option value="<%= x.id%>" <%= "selected" if @project.to_i == x.id%> ><%= x.desc %></option><%}%>');
// $('#filter-role').html('<option value="all">All</option><% @roles.each {|x| %><option value="<%= x.id%>"><%= x.name %></option><%}%>');
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
      $("#first").after('<p class="error">Please enter First Name</p>');

      temp = false;
    } else {
      if (first_name.length < 2 || first_name.length > 20) {
        $("#first").after(
          '<p class="error">Please enter a value between {2} and {20} characters long.</p>'
        );
        temp = false;
      }
    }

    if (last_name.length < 1) {
      $("#last").after('<p class="error">Please enter Last Name</p>');
      temp = false;
    } else {
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
        $("#email").after(
          '<p class="error">The format of email address must follow RFC 5322. For example: abc@domain.com</p>'
        );
        temp = false;
      }
    }
    if (account.length < 1) {
      $("#account").after('<p class="error">Please enter Account</p>');
      temp = false;
    } else {
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
      $("#company").after('<p class="error">Please select a Company</p>');
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

function delete_user() {
  var user_id = $(".delete_id").val();

  //alert( 'admin/user_management/'  + user_id + '/')
  $.ajax({
    url: "/admin/user_management/" + user_id,
    method: "DELETE",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
    success: function (result) {
      // Do something with the result
    },
  });
}
$(document).on("click", ".delete_icon", function () {
  var user_id = $(this).data("user_id");
  $(".delete_id").val(user_id);
  // As pointed out in comments,
  // it is unnecessary to have to manually call the modal.
  // $('#addBookDialog').modal('show');
});

var user_dataTable;
function delete_dataTable() {
  //var table = $('#example').DataTable();
  user_dataTable.fnClearTable();
}
/*
processing: true,
      serverSide: true,
  */

function setup_dataTable() {
  $("#table_user_management").ready(function () {
    $("#table_user_management").dataTable({
      destroy: true,
      ajax: {
        url: $("#table_user_management").data("source"),
      },
      stripeClasses: ["even", "odd"],
      pagingType: "full_numbers",
      iDisplayLength: 20,
      columns: [
        { data: "id" },
        { data: "first_name" },
        { data: "last_name" },
        { data: "email" },
        { data: "account" },
      ],

      order: [[1, "asc"]], //sắp xếp giảm dần theo cột thứ 1
      // pagingType is optional, if you want full pagination controls.
      // Check dataTables documentation to learn more about
      // available options.
    });
  });
}

$("#table_user_management_length").remove();

$(".toggle_all").click(function () {
  $(".collection_selection[type=checkbox]").prop(
    "checked",
    $(this).prop("checked")
  );
});

$(".collection_selection[type=checkbox]").click(function () {
  var nboxes = $("#table_user_management tbody :checkbox:not(:checked)");
  if (nboxes.length > 0 && $(".toggle_all").is(":checked") == true) {
    $(".toggle_all").prop("checked", false);
  }
  if (nboxes.length == 0 && $(".toggle_all").is(":checked") == false) {
    $(".toggle_all").prop("checked", true);
  }
});

setup_dataTable();

$(document).on("click", ".edit_icon", function () {
  user_id = $(this).data("user_id");
  $.ajax({
    url: "user_management/edit",
    type: "GET",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
    data: { user_id: user_id },
  });
});

$(document).on("click", "#btn-modal-edit-user", function () {
  first_name = $(".edit-first").val();
  last_name = $(".edit-last").val();
  email = $(".edit-email").val();
  account = $(".edit-account").val();
  role = $(".edit-role").val();
  company = $(".edit-company").val();
  project = $(".edit-project").val();
  temp = true;
  $(".error").remove();
  if (first_name.length < 1) {
    $(".edit-first").after('<p class="error">Please enter First Name</p>');

    temp = false;
  } else {
    if (first_name.length < 2 || first_name.length > 20) {
      $(".edit-first").after(
        '<p class="error">Please enter a value between {2} and {20} characters long.</p>'
      );
      temp = false;
    }
  }
  if (last_name.length < 1) {
    $(".edit-last").after('<p class="error">Please enter Last Name</p>');
    temp = false;
  } else {
    if (last_name.length < 2 || last_name.length > 20) {
      $(".edit-last").after(
        '<p class="error">Please enter a value between {2} and {20} characters long.</p>'
      );
      temp = false;
    }
  }

  if (email.length < 1) {
    $(".edit-email").after('<p class="error">Please enter Email Address</p>');
    temp = false;
  } else {
    var regEx = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    var validEmail = regEx.test(email);
    if (!validEmail) {
      $(".edit-email").after(
        '<p class="error">The format of email address must follow RFC 5322. For example: abc@domain.com</p>'
      );
      temp = false;
    }
  }
  if (account.length < 1) {
    $(".edit-account").after('<p class="error">Please enter Account</p>');
    temp = false;
  } else {
    if (account.length < 2 || account.length > 20) {
      $(".edit-account").after(
        '<p class="error">Please enter a value between {2} and {20} characters long.</p>'
      );
      temp = false;
    }
  }
  if (role == "") {
    $(".edit-role").after('<p class="error">Please select a Role</p>');
    temp = false;
  }
  if (company == "") {
    $(".edit-company").after('<p class="error">Please select a Company</p>');
    temp = false;
  }
  // if (temp == true) {
  //   $.ajax({
  //     url: "/admin/user_management/add/",
  //     type: "POST",
  //     headers: {
  //       "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
  //     },
  //     data: {
  //       company: company,
  //       project: project,
  //       role: role,
  //       first: first_name,
  //       last: last_name,
  //       email: email,
  //       account: account,
  //     },
  //   });
  // }
});
