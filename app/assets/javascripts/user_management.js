// filter select company
$(document).ready(function () {
  var end_date = new Date();
  end_date.setDate(end_date.getDate() - 1);
  $(".joined-date").datepicker({
    todayBtn: "linked",
    todayHighlight: true,
    autoclose: true,
    format: "M dd, yyyy",
    minDate: -2,
    endDate: end_date,
  });
  get_filter();

  $("#filter_company").change(function () {
    $('#btn_reset').removeClass('disabled');
    company_id = $("#filter_company").val();
    $.ajax({
      url: "/users/get_filter_company",
      type: "GET",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      data: {
        company_id: company_id
      },
      dataType: "json",
      success: function (response) {
        $(response).each(function (i, e) {
          $("#filter_project").html("");
          $('<option value="all">All</option>').appendTo("#filter_project");
          $.each(e.projects, function (k, v) {
            $('<option value="' + v.id + '">' + v.name + "</option>").appendTo("#filter_project");
          });

          $('<option value="none">None</option>').appendTo("#filter_project");
          $("#filter_role").html("");
          $('<option value="all">All</option>').appendTo("#filter_role");
          $.each(e.roles, function (k, v) {
            $('<option value="' + v.id + '">' + v.name + "</option>").appendTo(
              "#filter_role"
            );
          });
        });
      },
    });
  });

  $("#filter_project").change(function () {
    $('#btn_reset').removeClass('disabled');
    company_id = $("#filter_company").val();
    project_id = $("#filter_project").val();
    $.ajax({
      url: "/users/get_filter_project",
      type: "GET",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      data: {
        company_id: company_id,
        project_id: project_id
      },
      dataType: "json",
      success: function (response) {
        $(response).each(function (i, e) {
          $("#filter_role").html("");
          $('<option value="all">All</option>').appendTo("#filter_role");
          $.each(e.roles, function (k, v) {
            $('<option value="' + v.id + '">' + v.name + "</option>").appendTo(
              "#filter_role"
            );
          });
        });
      },
    });
  });

  $("#filter_role").change(function () {
    $('#btn_reset').removeClass('disabled');
  });

  $(".tokenize-project").tokenize2();

  $('.tokenize-project').on('tokenize:select', function(container){
    $(this).tokenize2().trigger('tokenize:search', [$(this).tokenize2().input.val()]);
  });

  $("#btn_modal_add_user").click(function () {
    first_name = $("#first").val();
    last_name = $("#last").val();
    email = $("#email").val();
    account = $("#account").val();
    role = $("#role").val();
    company = $("#company").val();
    project = $("#project").val();
    joined_date = $("#joined_date").val();
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
      } else if (!checkName(first_name)) {
        $("#first").after(
          '<span class="error">The first name is in-valid</span>'
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
      } else if (!checkName(last_name)) {
        $("#last").after(
          '<span class="error">The first name is in-valid</span>'
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
          '<span class="error">The maximum length of Account is 100 characters.</span>'
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
        url: "users/create",
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
          joined_date: joined_date,
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
            warning("The new account information has been created successfully.");
          } else if (response.status == "fail") {
            fails("Add");
          }
        },
      });
    }
  });

  $(".modal-add-user-management").change(function () {
    company = $(".modal-add-user-management").val();
    $.ajax({
      url: "/users/get_modal_project",
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
          $('<option value="' + e.id + '">' + e.name + "</option>").appendTo("#modalAdd .tokenize-project");
        });
      },
    });
  });

  $(".modal-edit-user-management").change(function () {
    company = $(".modal-edit-user-management").val();
    $.ajax({
      url: "/users/get_modal_project",
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
          $('<option value="' + e.id + '">' + e.name + "</option>").appendTo("#modalEdit .tokenize-project");
        });
      },
    });
  });

  $("#btn_filter").click(function () {
    let company = $("#filter_company").val();
    let project = $("#filter_project").val();
    let role = $("#filter_role").val();

    localStorage.filterUserMgmt = JSON.stringify({
      company: company,
      project: project,
      role: role,
    });
    $('#table_user_management').dataTable().fnDraw();
  });

  $("#btn_reset").click(function () {
    $('#btn_reset').addClass('disabled');
    localStorage.filterUserMgmt = ""
    get_filter()
  });

  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="modal"]').tooltip();

  $(".toggle-all").click(function () {
    $(".collection-selection[type=checkbox]").prop("checked", $(this).prop("checked"));
  });
});

function get_filter() {
  $.ajax({
    url: "/users/get_filter/",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      let companies = ""
      let projects = ""
      let roles = ""
      if (response.companies.length > 1)
        companies += "<option value='all'>All</option>";
      if (response.projects.length > 1)
        projects += "<option value='all'>All</option>";
      if (response.roles.length > 1)
        roles += "<option value='all'>All</option>";
      response.companies.forEach(function (value, index) {
        companies += `<option value='${value[1]}'>${value[0]}</option>`;
      })
      response.projects.forEach(function (value, index) {
        projects += `<option value='${value[1]}'>${value[0]}</option>`;
      })

      projects += "<option value='none'>None</option>";
      response.roles.forEach(function (value, index) {
        roles += `<option value='${value[1]}'>${value[0]}</option>`;
      })
      $('#filter_company').html(companies);
      $('#filter_project').html(projects);
      $('#filter_role').html(roles);
      if (localStorage.filterUserMgmt) {
        let filter = JSON.parse(localStorage.filterUserMgmt);
        $('#filter_company').val(filter.company);
        $('#filter_project').val(filter.project);
        $('#filter_role').val(filter.role);
        $('#btn_reset').removeClass('disabled');
      }
      setup_dataTable();
    }
  })
}

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
          warning("The account information has been deleted successfully.");
        } else {
          fails("Delete");
        }
      });
    },
  });
}

function checkName(input) {
  var regex = new RegExp("^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
    "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆẾỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤÚỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
    "ụúủứừÚỬỮỰỲỴÝỶỸửữựỳýỵỷỹ\\s]+$")
  return regex.test(input)
}

$(document).on("click", ".delete_icon", function () {
  var user_id = $(this).data("user_id");
  var user_full_name = $(this).data("user_full_name");
  $(".delete_id").val(user_id);
  $(".display_user_account_delete").html(user_full_name);
});

function colorDisabledRowUser() {
  $(".fa-toggle-off").closest("tr").addClass("row-user-disabled");
  $(".fa-toggle-on").closest("tr").removeClass("row-user-disabled");
}

function setup_dataTable() {
  $("#table_user_management").ready(function () {
    $("#table_user_management").dataTable({
      bDestroy: true,
      stripeClasses: ["even", "odd"],
      pagingType: "full_numbers",
      iDisplayLength: 20,
      stateSave: true,
      fnServerParams: function (aoData) {
        company = $("#filter_company").val();
        project = $("#filter_project").val();
        role = $("#filter_role").val();

        aoData.push({
          "name": "filter_company",
          "value": company
        });
        aoData.push({
          "name": "filter_project",
          "value": project
        });
        aoData.push({
          "name": "filter_role",
          "value": role
        });

      },

      fnDrawCallback: function (dataSource) {
        $(".collection-selection[type=checkbox]").click(function () {
          var nboxes = $("#table_user_management tbody :checkbox:not(:checked)");
          if (nboxes.length > 0 && $(".toggle-all").is(":checked") == true) {
            $("#table_user_management .toggle-all").prop("checked", false);
          }
          if (nboxes.length == 0 && $(".toggle-all").is(":checked") == false) {
            $("#table_user_management .toggle-all").prop("checked", true);
          }
        });

        colorDisabledRowUser();

        $(".paginate_button.current").prop("style", "font-weight: bold");
        $('.dataTables_length').attr("style", "display:none");

        if (dataSource.aoData.length == 0) {
          $('.paginate_button').addClass('disabled')
        }
      },
      "bProcessing": true,
      "bServerSide": true,
      "sAjaxSource": "user_data/",
      language: {
        "info": " _START_ - _END_ of _TOTAL_",
        "infoFiltered": ""
      },
      "columnDefs": [{
        "orderable": false,
        "targets": 0
      },
      {
        "orderable": false,
        "targets": 1
      },
      {
        "orderable": false,
        "targets": 9
      },
      ],
    });

    if (crud_user) {
      content = '<div style="float:right; margin-bottom:10px;"> <button type="button" class="btn btn-light" title="Add a New User" data-toggle="modal" data-target="#modalAdd" \
      data-backdrop="true" data-keyboard="true" style="width:120px;background:#8da8db"><i class="fas fa-user-plus" style="margin:0px 10px 0px 0px;"></i>Add</button> \
      <button type="button" class="btn btn-light " id="btn-enable-multiple-users" title="Enable User" style="width:120px;background:#dcdcdc"><i class="fas fa-toggle-on" style="margin:0px 10px 0px 0px;"></i>Enable</button>\
      <button type="button" class="btn btn-light" id="btn-disable-multiple-users" title="Disable User" style="width:120px;background:#dcdcdc"><i class="fas fa-toggle-off" style="margin:0px 10px 0px 0px;padding:0px 0px 0px 0px"></i>Disable</button>\
      <button type="button" class="btn btn-light " title="Delete User"  id="btn-delete-many-users" style="width:120px;background:#dcdcdc"><i class="fas fa-user-minus"  style="margin:0px 10px 0px 0px;"></i>Delete</button> \
    </div>';

      $(content).insertAfter(".dataTables_filter");
      $(".hidden").attr("placeholder", "Type here to search");
    } else {
      content = '<div style="float:right; margin-bottom:10px;"> <button type="button" class="btn btn-light" title="Add a New User" data-toggle="modal" data-target="#modalAdd" \
      data-backdrop="true" data-keyboard="true" style="width:120px;background:#dcdcdc"><i class="fas fa-user-plus" style="margin:0px 10px 0px 0px;"></i>Add</button> \
      <button type="button" class="btn btn-light " id="btn-enable-multiple-users" title="Enable User" style="width:120px;background:#dcdcdc"><i class="fas fa-toggle-on" style="margin:0px 10px 0px 0px;"></i>Enable</button>\
      <button type="button" class="btn btn-light" id="btn-disable-multiple-users" title="Disable User" style="width:120px;background:#dcdcdc"><i class="fas fa-toggle-off" style="margin:0px 10px 0px 0px;padding:0px 0px 0px 0px"></i>Disable</button>\
      <button type="button" class="btn btn-light " title="Delete User"  id="btn-delete-many-users" style="width:120px;background:#dcdcdc"><i class="fas fa-user-minus"  style="margin:0px 10px 0px 0px;"></i>Delete</button> \
    </div>';

      $(content).insertAfter(".dataTables_filter");
      $(".hidden").attr("placeholder", "Type here to search");
    }

  });
}

$(document).on('click', '.collection-selection, .toggle-all', function (e) {
  if (crud_user) {
    var number = $("#table_user_management tbody :checkbox:checked").length;
    if (parseInt(number) > 0) {
      $("#btn-disable-multiple-users").css('background-color', "#8da8db");
      $("#btn-delete-many-users").css('background-color', "#8da8db");
      $("#btn-enable-multiple-users").css('background-color', "#8da8db");
    } else {
      $("#btn-disable-multiple-users").css('background-color', "#dcdcdc");
      $("#btn-delete-many-users").css('background-color', "#dcdcdc");
      $("#btn-enable-multiple-users").css('background-color', "#dcdcdc");
    }
  }
});

$(document).on("click", ".edit_icon", function () {
  user_id = $(this).data("user_id");
  $.ajax({
    url: "users/" + user_id + "/edit",
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
        v = e.user
        $("#modalEdit #first").val(v.first_name);
        $("#modalEdit #last").val(v.last_name);
        $("#modalEdit #email").val(v.email);
        $("#modalEdit #joined_date").val(e.joined_date);
        $("#modalEdit #account").val(v.account);
        $("#modalEdit #user_id").val(v.id);
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
          if (e.project_ids.indexOf(p.id) > -1) {
            $(
              '<option value="' +
              p.id +
              '" selected="selected">' +
              p.name +
              "</option>"
            ).appendTo("#modalEdit .edit-projects .edit-project");
          } else {
            $(
              '<option value="' + p.id + '">' + p.name + "</option>"
            ).appendTo("#modalEdit .edit-projects .edit-project");
          }
        });
        $(".tokenize-project").tokenize2();
        $('.tokenize-project').on('tokenize:select', function(container){
          $(this).tokenize2().trigger('tokenize:search', [$(this).tokenize2().input.val()]);
        });
      });
    },
  });
});

// submit edit user
$(document).on("click", "#btn_modal_edit_user", function () {
  first_name = $("#modalEdit #first").val();
  last_name = $("#modalEdit #last").val();
  email = $("#modalEdit #email").val();
  account = $("#modalEdit #account").val();
  role = $("#modalEdit #role").val();
  company = $("#modalEdit #company").val();
  project = $("#modalEdit #project").val()
  joined_date = $("#modalEdit #joined_date").val();;
  id = $("#modalEdit #user_id").val();
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
        '<span class="error">The maximum length of First Name is 100 characters.</span>'
      );
    } else if (!checkName(first_name)) {
      $("#modalEdit #first").after(
        '<span class="error">The first name is in-valid</span>'
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
        '<span class="error">The maximum length of Last Name is 100 characters.</span>'
      );
    } else if (!checkName(last_name)) {
      $("#modalEdit #last").after(
        '<span class="error">The last name is in-valid</span>'
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
        '<span class="error">The maximum length of Account is 100 characters.</span>'
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
      url: "/users/" + id,
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
        joined_date: joined_date,
      },
      dataType: "json",
      success: function (response) {
        if (response.status == "success") {
          $("#modalEdit").modal("hide");
          $("#table_user_management").dataTable().fnDraw();
          warning("The account information has been updated successfully.");
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
  number_user_delete = $("#table_user_management tbody :checkbox:checked").length;
  if (number_user_delete != 0) {
    $("#modalDeleteMultipleUsers").modal("show");
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
    url: "/users/delete_multiple_users",
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
        $('.collection-selection, #collection_selection_toggle_all').prop('checked', false);
        $("#table_user_management").dataTable().fnDraw();
        warning("The account information has been deleted successfully.");
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
    url: "/users/status",
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
        colorDisabledRowUser();
        warning("The status has been changed successfully.");
      } else if (response.status == "fail") {
        fails("The status hasn't been changed.");
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
    url: "/users/disable_multiple_users",
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
        $('.collection-selection, #collection_selection_toggle_all').prop('checked', false);
        warning("The account information has been disabled successfully.");
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
    url: "/users/enable_multiple_users",
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
        $('.collection-selection, #collection_selection_toggle_all').prop('checked', false);
        warning("The account information has been enabled successfully.");
      } else if (response.status == "fail") {
        $('.btn-modal-enable-multiple-users').prop("disabled", true);
        fails("Disable");
      }
    },
  });
});

$(document).on("click", ".reset-password", function () {
  $('#confirm_reset_password').val($(this).data('user_id'));
  $('.user-account-confirm-password').text($(this).data('user_account'));
  $('#modalResetPassword').modal();
});

$(document).on("click", "#confirm_reset_password", function () {
  $.ajax({
    url: "/users/reset_password",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      id: $(this).val()
    },
    dataType: "json",
    success: function (response) {
      $('#modalResetPassword').modal('hide');
      if (response.status == 'success')
        warning(`You have reset password for ${response.account} successfully.`);
      else
        fails("Can't reset password.");
    }
  });
});