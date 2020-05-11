
// filter select company
$(document).ready(function () {
  $("#filter-company").change(function () {
    company = $("#filter-company").val();
    
    $.ajax({
      url: "/admin_users/get_filter_company",
      type: "GET",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      data: {
        company: company
      },
      dataType: "json",
      success: function (response) {
        $(response).each(function (i, e) {
          $("#filter-project").html("");

          if (Array.isArray(e.projects) && e.projects.length >= 1) {
            $('<option value="all">All</option>').appendTo("#filter-project");
          }
          $.each(e.projects, function (k, v) {
            $('<option value="' + v.id + '">' + v.desc + "</option>").appendTo(
              "#filter-project"
            );
          });
          $('<option value="none">None</option>').appendTo("#filter-project");
          $("#filter-role").html("");
          if (Array.isArray(e.roles) && e.roles.length > 1) {
            $('<option value="all">All</option>').appendTo("#filter-role");
          }
          $.each(e.roles, function (k, v) {
            $('<option value="' + v.id + '">' + v.name + "</option>").appendTo(
              "#filter-role"
            );
          });
        });
      },
    });
  });
});
// filter select project
$(document).ready(function () {
  $("#filter-project").change(function () {
    company = $("#filter-company").val();
    project = $("#filter-project").val();
    $.ajax({
      url: "/admin_users/get_filter_project",
      type: "GET",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      data: {
        company: company,
        project: project
      },
      dataType: "json",
      success: function (response) {
        $(response).each(function (i, e) {
          $("#filter-role").html("");
          if (Array.isArray(e.roles) && e.roles.length > 1) {
            $('<option value="all">All</option>').appendTo("#filter-role");
          }
          $.each(e.roles, function (k, v) {
            $('<option value="' + v.id + '">' + v.name + "</option>").appendTo(
              "#filter-role"
            );
          });
        });
      },
    });
  });
});
// alert success
function success(content) {
  $("#content-alert-success").html(content);
  $("#alert-success").fadeIn();
  window.setTimeout(function () {
    $("#alert-success").fadeOut(1000);
  }, 5000);
}
// alert fails
function fails(content) {
  $("#content-alert-fail").html(content);
  $("#alert-danger").fadeIn();
  window.setTimeout(function () {
    $("#alert-danger").fadeOut(1000);
  }, 5000);
}
// select project modal add, edit
$(document).ready(function () {
  $(".tokenize-project").tokenize2();
});
// submit add user
$(document).ready(function () {
  $("#btn-modal-add-user").click(function () {
    first_name = $("#first").val();
    last_name = $("#last").val();
    email = $("#email").val();
    account = $("#account").val();
    role = $("#role").val();
    company = $("#company").val();
    project = $("#project").val();
    $(".error").remove();
    check_email = false;
    check_account = false;
    if (first_name.length < 1) {
      $("#first").after('<span class="error">Please enter First Name</span>');
    } else {
      if (first_name.length < 2 || first_name.length > 20) {
        $("#first").after(
          '<span class="error">The maximum length of First Name is 100 characters.</span>'
        );
      }
    }

    if (last_name.length < 1) {
      $("#last").after('<span class="error">Please enter Last Name</span>');
    } else {
      if (last_name.length < 2 || last_name.length > 20) {
        $("#last").after(
          '<span class="error">The maximum length of Last Name is 100 characters.</span>'
        );
      }
    }

    if (email.length < 1) {
      $("#email").after(
        '<span class="error">Please enter Email Address</span>'
      );
    } else {
      var regEx = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      var validEmail = regEx.test(email);
      if (!validEmail) {
        $("#email").after(
          '<span class="error">Please enter a valid email address. For example: abc@domain.com.</span>'
        );
      } else {
        check_email = true;
      }
    }
    if (account.length < 1) {
      $("#account").after('<span class="error">Please enter Account</span>');
    } else {
      if (account.length < 2 || account.length > 20) {
        $("#account").after(
          '<span class="error">Please enter a value between {2} and {20} characters long.</span>'
        );
      } else {
        check_account = true;
      }
    }

    if (role == "") {
      $("#role").after('<span class="error">Please select a Role</span>');
    }
    if (company == "") {
      $("#company").after('<span class="error">Please select a Company</span>');
    }
    if ($(".error").length == 0) {
      $.ajax({
        url: "admin_users/add",
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
        dataType: "json",
        success: function (response) {
          // check email and account exist
          if (response.status == "exist") {
            if (response.email == true) {
              $("#email").after(
                '<span class="error">Email already exists</span>'
              );
            }
            if (response.account == true) {
              $("#account").after(
                '<span class="error">Account already exists</span>'
              );
            }
          } else if (response.status == "success") {
            $("#table_user_management").dataTable().fnDraw();
            // reset and hide form add user
            $("#modalAdd #project option").remove();
            $("#modalAdd .tokens-container .token").remove();
            $("#modalAdd .form-add-user")[0].reset();
            $("#modalAdd").modal("hide");
            success("Add");
          } else if (response.status == "fail") {
            fails("Add");
          }
        },
      });
    }
  });
});
// get project by company - modal add user
$(document).ready(function () {
  $(".modal-add-user-management").change(function () {
    company = $(".modal-add-user-management").val();
    $.ajax({
      url: "/admin_users/get_modal_project",
      type: "GET",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      data: {
        company: company
      },
      dataType: "json",
      success: function (response) {
        $("#modalAdd .tokens-container .token").remove();
        $("#modalAdd #project option").remove();
        $(response).each(function (i, e) {
          $.each(e.projects, function (k, v) {
            $('<option value="' + v.id + '">' + v.desc + "</option>").appendTo(
              "#modalAdd .tokenize-project"
            );
          });
        });
      },
    });
  });
});
// get project by company - modal edit user
$(document).ready(function () {
  $(".modal-edit-user-management").change(function () {
    company = $(".modal-edit-user-management").val();
    $.ajax({
      url: "/admin_users/get_modal_project",
      type: "GET",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      data: {
        company: company
      },
      dataType: "json",
      success: function (response) {
        $("#modalEdit .tokens-container .token").remove();
        $("#modalEdit #project option").remove();
        $(response).each(function (i, e) {
          $.each(e.projects, function (k, v) {
            $('<option value="' + v.id + '">' + v.desc + "</option>").appendTo(
              "#modalEdit .tokenize-project"
            );
          });
        });
      },
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
      url: "/admin_users/submit_filter",
      type: "POST",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      data: {
        company: company,
        project: project,
        role: role
      },
      // dataType: "json",
      // success: function (response) {

      // },
    });
  });
});

function reorder_table_row(data_table) {
  data_table.fnDraw();
}

function delete_datatable_row(data_table, row_id) {
  // delete the row from table by id
  var row = data_table.$("tr")[row_id];
  data_table.fnDeleteRow(row);
  reorder_table_row(data_table);
}

function delete_user() {
  var id = $(".delete_id").val();
  $.ajax({
    url: "/admin/user_management/" + id,
    method: "DELETE",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      $(response).each(function (i, e) {
        //duyet mang doi tuong
        if (e.status == "success") {
          var deleted_id = e["deleted_id"];
          var data_table = $("#table_user_management").dataTable();
          var all_data_list = data_table.fnGetData();

          for (var i = 0; i < all_data_list.length; i++) {
            // parse string manually because data is HTML tag string :((
            var current_user_id = all_data_list[i][0]
              .split("batch_action_item_")[1]
              .split('"')[0];
            current_user_id = parseInt(current_user_id);
            if (current_user_id == deleted_id) {
              // var row_id = i;
              //delete_datatable_row(data_table, row_id);
              data_table.fnDraw();
              break;
            }
          }
          success("Delete");
        } else {
          fails("Delete");
        }
      });
    },
  });
}

function add_reviewer_user() {
  var user_id = $(".add_reviewer_id_modal").val();
  //alert( 'admin/user_management/'  + user_id + '/')
  $.ajax({
    url: "/admin/user_management/add_reviewer/" + user_id,
    method: "post",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (result) {
      // Do something with the result
    },
  });
}

$(document).on("click", ".delete_icon", function () {
  var user_id = $(this).data("user_id");
  var user_account = $(this).data("user_account");
  $(".delete_id").val(user_id);
  $(".display_user_account_delete").html(user_account);
});

$(document).on("click", ".add_reviewer_icon", function () {
  var user_id = $(this).data("user_id");
  var user_account = $(this).data("user_account");

  $("#add_reviewer_modal_title").html(
    'Add Reviewer For <span style="color: #f00;font-size: bold;">{account}</span>'.formatUnicorn({
      account: user_account
    })
  );

  $(".add_reviewer_id_modal").val(user_id);
  add_reviewer_user();
});

var user_dataTable;

function delete_dataTable() {
  user_dataTable.fnClearTable();
}

function setup_dataTable() {

  $("#table_user_management").ready(function () {

    $("#table_user_management").dataTable({
      bDestroy: true,
      stripeClasses: ["even", "odd"],
      pagingType: "full_numbers",
      iDisplayLength: 20,
      fnServerParams: function(aoData){
        company = $("#filter-company").val();
        project = $("#filter-project").val();
        role = $("#filter-role").val();
        
        aoData.push({"name": "filter-company", "value": company});
        aoData.push({"name": "filter-project", "value": project});
        aoData.push({"name": "filter-role"   , "value": role});
        
      },
      
      fnDrawCallback: function(){
        $(".collection_selection[type=checkbox]").click(function () {
          var nboxes = $("#table_user_management tbody :checkbox:not(:checked)");
          if (nboxes.length > 0 && $(".toggle_all").is(":checked") == true) {
            $("#table_user_management .toggle_all").prop("checked", false);
          }
          if (nboxes.length == 0 && $(".toggle_all").is(":checked") == false) {
            $("#table_user_management .toggle_all").prop("checked", true);
          }
        });

        $('.dataTables_length').attr("style", "display:none");        
      }, 
      "bProcessing": true,
      "bServerSide": true,
      "sAjaxSource": "user_data/",
      
      "columnDefs": [
        { "orderable": false,"orderSequence": [ "desc","asc" ], "targets": 0 },
        { "orderable": true,"orderSequence": [ "desc","asc" ],  "targets": 1 },
        { "orderable": true,"orderSequence": [ "desc","asc" ], "targets": 2 },
        { "orderable": true,"orderSequence": [ "desc","asc" ], "targets": 3 },
        { "orderable": true,"orderSequence": [ "desc","asc" ], "targets": 4 },
        { "orderable": true,"orderSequence": [ "desc","asc" ], "targets": 5 },
        { "orderable": true,"orderSequence": [ "desc","asc" ], "targets": 6 },
        { "orderable": false,"orderSequence": [ "desc","asc" ], "targets": 7 },
        { "orderable": true,"orderSequence": [ "desc","asc" ], "targets": 8 },
        { "orderable": true,"orderSequence": [ "desc","asc" ], "targets": 9 },
        { "orderable": false,"orderSequence": [ "desc","asc" ], "targets": 10 },
      ],
    });

    $(".toggle_all").click(function () {
      $(".collection_selection[type=checkbox]").prop(
        "checked",
        $(this).prop("checked")
      );
    });

    
  });


}
setup_dataTable();

$(document).on("click", ".edit_icon", function () {
  user_id = $(this).data("user_id");
  $.ajax({
    url: "admin_users/" + user_id + "/edit",
    type: "GET",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      id: user_id
    },
    dataType: "json",
    success: function (response) {
      $("#modalEdit").modal("show");
      $(".error").remove();
      $(response).each(function (i, e) {
        $.each(e.user, function (k, v) {
          $("#modalEdit #first").val(v.first_name);
          $("#modalEdit #last").val(v.last_name);
          $("#modalEdit #email").val(v.email);
          $("#modalEdit #account").val(v.account);
          $("#modalEdit #admin_user_id").val(v.id);
          $("#modalEdit #role").html("");
          $("#modalEdit #company").html("");
          $.each(e.roles, function (k, x) {
            if (v.role_id == x.id) {
              $(
                '<option value="' + x.id + '" selected>' + x.name + "</option>"
              ).appendTo("#modalEdit #role");
            } else {
              $(
                '<option value="' + x.id + '">' + x.name + "</option>"
              ).appendTo("#modalEdit #role");
            }
          });
          $.each(e.companies, function (k, y) {
            if (v.company_id == y.id) {
              $(
                '<option value="' + y.id + '" selected>' + y.name + "</option>"
              ).appendTo("#modalEdit #company");
            } else {
              $(
                '<option value="' + y.id + '">' + y.name + "</option>"
              ).appendTo("#modalEdit #company");
            }
          });
          $(".edit-projects").html(
            '<select class="tokenize-project edit-project" id="project" multiple></select>'
          );
          $.each(e.projects, function (k, p) {
            if (e.project_user.indexOf(p.id) > -1) {
              $(
                '<option value="' +
                p.id +
                '" selected="selected">' +
                p.desc +
                "</option>"
              ).appendTo("#modalEdit .edit-projects .edit-project");
            } else {
              $(
                '<option value="' + p.id + '">' + p.desc + "</option>"
              ).appendTo("#modalEdit .edit-projects .edit-project");
            }
          });
          $(".tokenize-project").tokenize2();
        });
      });
    },
  });
});

// submit edit user
$(document).on("click", "#btn-modal-edit-user", function () {
  first_name = $("#modalEdit #first").val();
  last_name = $("#modalEdit #last").val();
  email = $("#modalEdit #email").val();
  account = $("#modalEdit #account").val();
  role = $("#modalEdit #role").val();
  company = $("#modalEdit #company").val();
  project = $("#modalEdit #project").val();
  id = $("#modalEdit #admin_user_id").val();
  check_email = false;
  check_account = false;
  $(".error").remove();
  if (first_name.length < 1) {
    $("#modalEdit #first").after(
      '<span class="error">Please enter First Name</span>'
    );
  } else {
    if (first_name.length < 2 || first_name.length > 20) {
      $("#modalEdit #first").after(
        '<span class="error">Please enter a value between {2} and {20} characters long.</span>'
      );
    }
  }
  if (last_name.length < 1) {
    $("#modalEdit #last").after(
      '<span class="error">Please enter Last Name</span>'
    );
  } else {
    if (last_name.length < 2 || last_name.length > 20) {
      $("#modalEdit #last").after(
        '<span class="error">Please enter a value between {2} and {20} characters long.</span>'
      );
    }
  }

  if (email.length < 1) {
    $("#modalEdit #email").after(
      '<span class="error">Please enter Email Address</span>'
    );
  } else {
    var regEx = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    var validEmail = regEx.test(email);
    if (!validEmail) {
      $("#modalEdit #email").after(
        '<span class="error">Please enter a valid email address. For example: abc@domain.com.</span>'
      );
    } else {
      check_email = true;
    }
  }
  if (account.length < 1) {
    $("#modalEdit #account").after(
      '<span class="error">Please enter Account</span>'
    );
  } else {
    if (account.length < 2 || account.length > 20) {
      $("#modalEdit #account").after(
        '<span class="error">Please enter a value between {2} and {20} characters long.</span>'
      );
    } else {
      check_account = true;
    }
  }
  if (role == "") {
    $("#modalEdit #role").after(
      '<span class="error">Please select a Role</span>'
    );
  }
  if (company == "") {
    $("#modalEdit #company").after(
      '<span class="error">Please select a Company</span>'
    );
  }
  if ($(".error").length == 0) {
    $.ajax({
      url: "/admin_users/" + id,
      type: "PUT",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      data: {
        company_id: company,
        project: project,
        role_id: role,
        first_name: first_name,
        last_name: last_name,
        email: email,
        account: account,
        id: id,
      },
      dataType: "json",
      success: function (response) {
        if (response.status == "success") {
          $("#modalEdit").modal("hide");
          $("#table_user_management").dataTable().fnDraw();
          success("Edit");
        } else if (response.status == "exist") {
          $(".error").remove();
          if (response.email_exist) {
            $("#modalEdit #email").after(
              '<span class="error">Email already exists</span>'
            );
          }
          if (response.account_exist) {
            $("#modalEdit #account").after(
              '<span class="error">Account already exists</span>'
            );
          }
        } else if (response.status == "fail") {
          fails("Edit");
        }
      },
    });
  }
});

// delete many users
$(document).on("click", "#btn-delete-many-users", function () {
  $("#modalDeleteMultipleUsers").modal("show");
  number_user_delete = $("#table_user_management tbody :checkbox:checked").length;
  if (number_user_delete != 0) {
    $('.btn-modal-delele-multiple-users').prop("disabled", false);
    $(".display_number_users_delete").html("Are you sure you want delete " + number_user_delete + " user ?");
  } else {
    $(".display_number_users_delete").html("Please select the user you want delete ?");
  }
});

$(document).on("click", ".btn-modal-delele-multiple-users", function () {
  var arr_id_user = [];
  $("#table_user_management tbody :checkbox:checked").each(function () {
    var user_id = this.id
      .split("batch_action_item_")[1]
      .split('"')[0];
    arr_id_user.push(user_id);
  });
  $.ajax({
    url: "/admin_users/delete_multiple_users",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      list_users: arr_id_user
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        $('.btn-modal-delele-multiple-users').prop("disabled", true);
        $("#modalDeleteMultipleUsers").modal("hide");
        $(".display_number_users_delete").html('');
        $('.collection_selection, #collection_selection_toggle_all').prop('checked', false);
        $("#table_user_management").dataTable().fnDraw();
        success("Delete");
      } else if (response.status == "fail") {
        $('.btn-modal-delele-multiple-users').prop("disabled", true);
        fails("Delete");
      }
    },
  });
});


// status user
$(document).on("click", ".status_icon", function () {
  var user_id = $(this).data("user_id");
  $.ajax({
    url: "/admin_users/status",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      id: user_id
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        if (response.change == false) {
          $('a.status_icon[data-user_id="' + user_id + '"]').html(
            '<i class="fa fa-toggle-off"></i>'
          );
        } else {
          $('a.status_icon[data-user_id="' + user_id + '"]').html(
            '<i class="fa fa-toggle-on"></i>'
          );
        }
        success("Change Status");
      } else if (response.status == "fail") {
        fails("Change Status");
      }
    },
  });
});

// disable multiple users
$(document).on("click", "#btn-disable-multiple-users", function () {
  
  number_user_delete = $("#table_user_management tbody :checkbox:checked").length;
  if (number_user_delete != 0) {
    $("#modalStatusMultipleUsers").modal("show");
    $('.btn-modal-disable-multiple-users').prop("disabled", false);
    $(".display_number_users_disable").html("Are you sure you want disable " + number_user_delete + " user ?");
  } else {
    $(".display_number_users_disable").html("Please select the user you want disable ?");
  }
});
$(document).on("click", "#btn-enable-multiple-users", function () {
  
  number_user_delete = $("#table_user_management tbody :checkbox:checked").length;
  if (number_user_delete != 0) {
    $("#modalStatusEnableUsers").modal("show");
    $('.btn-modal-enable-multiple-users').prop("disabled", false);
    $(".display_number_users_disable").html("Are you sure you want enable " + number_user_delete + " user ?");
  } else {
    $(".display_number_users_disable").html("Please select the user you want enable ?");
  }
});

$(document).on("click", ".btn-modal-disable-multiple-users", function () {
  var arr_id_user = [];
  $("#table_user_management tbody :checkbox:checked").each(function () {
    var user_id = this.id
      .split("batch_action_item_")[1]
      .split('"')[0];
    arr_id_user.push(user_id);
  });
  $.ajax({
    url: "/admin_users/disable_multiple_users",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      list_users: arr_id_user
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        $('.btn-modal-disable-multiple-users').prop("disabled", true);
        $("#modalStatusMultipleUsers").modal("hide");
        $("#table_user_management").dataTable().fnDraw();
        $('.collection_selection, #collection_selection_toggle_all').prop('checked', false);
        success("Disable");
      } else if (response.status == "fail") {
        $('.btn-modal-disable-multiple-users').prop("disabled", true);
        fails("Disable");
      }
    },
  });
});
$(document).on("click", ".btn-modal-enable-multiple-users", function () {
  var arr_id_user = [];
  $("#table_user_management tbody :checkbox:checked").each(function () {
    var user_id = this.id
      .split("batch_action_item_")[1]
      .split('"')[0];
    arr_id_user.push(user_id);
  });
  $.ajax({
    url: "/admin_users/enable_multiple_users",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      list_users: arr_id_user
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        $('.btn-modal-enable-multiple-users').prop("disabled", true);
        $("#modalStatusEnableUsers").modal("hide");
        $("#table_user_management").dataTable().fnDraw();
        $('.collection_selection, #collection_selection_toggle_all').prop('checked', false);
        success("Enable");
      } else if (response.status == "fail") {
        $('.btn-modal-enable-multiple-users').prop("disabled", true);
        fails("Disable");
      }
    },
  });
});


$(document).ready(function () {

  content = '<div style="float:right; margin-bottom:10px;"> <button type="button" class="btn btn-light border-primary" title="Add a New User" data-toggle="modal" data-target="#modalAdd" \
  data-backdrop="true" data-keyboard="true" style="width:120px"><i class="fas fa-user-plus" style="margin:0px 10px 0px 0px;"></i>Add</button> \
  <button type="button" class="btn btn-light border-primary"  id="btn-enable-multiple-users" data-toggle="tooltip" title="Disable User" style="width:120px"><i class="fas fa-toggle-on" style="margin:0px 10px 0px 0px;"></i>Enable</button>\
  <button type="button" class="btn btn-light border-danger" id="btn-disable-multiple-users" data-toggle="tooltip" title="Enable User" style="width:120px"><i class="fas fa-toggle-off" style="margin:0px 10px 0px 0px;padding:0px 0px 0px 0px"></i>Disable</button>\
  <button type="button" class="btn btn-light border-danger" data-toggle="tooltip" title="Delete User"  id="btn-delete-many-users" style="width:120px"><i class="fas fa-user-minus"  style="margin:0px 10px 0px 0px;"></i>Delete</button> \
  </div>';

  $(content).insertAfter(".dataTables_filter");
});
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip(); 
  $('[data-toggle="modal"]').tooltip();
});

