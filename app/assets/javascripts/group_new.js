$(document).ready(function () {
  loadDataGroups();
  $.fn.DataTable.ext.pager.numbers_length = 5;
});

function loadDataGroups() {
  $('#table_group_wrapper').remove();
  $(".table-group-wrapper").html(`
    <table class="table table-striped table-bordered table-sm table-group" id="table_group">
      <thead>
        <tr>
          <th class="type-icon no">No.</th>
          <th class="type-icon name" >Name</th>
          <th class="type-icon description">Description</th>
          <th class="type-icon number-user">Number of User</th>
          <th class="type-icon status">Status</th>
          <th class="type-icon action">Action</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
  </table>`);

  $.ajax({
    url: "/groups/load_data_groups/",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {},
    dataType: "json",
    success: function (response) {
      if (response.data.length == 0) {
        $("#table_group tbody").html('<tr><th class="type-icon" style="background-color: #cfd5ea" colspan="7">No data available on this table</th></tr>');
        return;
      }
      tpl = ""
      response.data.forEach(function (group, index) {
        tpl += formatData(group, index);
      });
      $("#table_group tbody").html(tpl);
      setupDataTable();
      addBtnAdd();
      actionEdit();
      actionDelete()
      loadPrivileges();
      loadAssignUser();
    }
  });
}

function formatData(group, index) {
  tpl = `
  <tr role="row">
    <td class="type-number number">{no}</td>
    <td class="type-text name">{name}</td>
    <td class="type-text description">{description}</td>
    <td class="type-number number-user">{number_users}</td>
    <td class="type-text status">{status}</td>
    <td class="type-icon action">`.formatUnicorn({
    no: index + 1, id: group.id, name: group.name, description: group.description,
    number_users: group.number_users, status: group.status
  });
  if (full_access) {
    tpl += `
      <a class="action-icon btn-edit-group"  title="Edit Group" data-name="{name}" data-id="{id}" data-status="{status}" 
        data-description="{description}" href="javascript:;">
        <i class="fa fa-pencil icon" style="color:#fc9803"></i>
      </a>
      <a class="action-icon key-icon" data-name="{name}" data-id="{id}" 
          title="Assign Privileges To Group"href="javascript:;">
        <i class="fa fa-key"></i>
      </a>
      <a class="action-icon user-group-icon" data-name="{name}" data-id="{id}" title="Assign Users to Group" href="javascript:;">
        <i class="fa fa-users"></i>
      </a>&nbsp;`.formatUnicorn({ id: group.id, name: group.name, status: group.status, description: group.description });
    if (group.number_users)
      tpl += `<a class="action-icon" title="Delete Group" ref="javascript:;">
            <i class="fa fa-trash icon-disabled"></i>
          </a>`;
    else
      tpl += `<a class="action-icon btn-delete-group" data-name="{name}" data-id="{id}" title="Delete Group" href="javascript:;">
            <i class="fa fa-trash icon" ></i>
          </a>`.formatUnicorn({ id: group.id, name: group.name });
  }
  else
    tpl += `
      <a class="action-icon" title="Edit Group" href="javascript:;">
        <i class="fa fa-pencil icon-disabled"></i>
      </a>
      <a class="action-icon" title="Assign Privileges To Group" href="javascript:;">
        <i class="fa fa-key icon-disabled"></i>
      </a>
      <a class="action-icon "title="Assign Users to Group" href="javascript:;">
        <i class="fa fa-users icon-disabled"></i>
      </a> &nbsp;
      <a class="action-icon" title="Delete Group" ref="javascript:;">
        <i class="fa fa-trash icon-disabled"></i>
      </a>`;
  tpl += `</td></tr>`;
  return tpl;
}

function setupDataTable() {
  var table = $("#table_group").DataTable({
    "bLengthChange": false,
    "bAutoWidth": false,
    retrieve: true,
    language: {
      searchPlaceholder: "Search by name, description"
    },
    "columnDefs": [
      {
        "searchable": false,
        "orderable": false,
        "targets": 0,
      },
      {
        "searchable": false,
        "targets": 3,
      },
      {
        "searchable": false,
        "targets": 4,
      },
      {
        "searchable": false,
        "orderable": false,
        "targets": 5,
      },
    ],
    "order": [[2, "asc"]],
  });
  table.on("order.dt search.dt",
    () => table.column(0, { search: "applied", order: "applied" })
      .nodes().each((cell, i) => cell.innerHTML = i + 1)
  ).draw();
  $("#table_group").removeClass('no-footer');
}

function addBtnAdd() {
  var btn_add_delete = '';
  if (full_access)
    btn_add_delete = `<div class="btn-group">
          <button class="btn btn-light" data-toggle="modal" data-target="#modalAdd" title="Add Group"style="width:90px;background:#8da8db">
            <i border="0" style="float:left;margin-top:4px;color:#b5e840;font-size:20px" class="fa fa-plus"></i>Add
          </button>
        </div>`;
  else
    btn_add_delete = `<div class="btn-group">
          <button class="btn btn-light disabled" title="Add Group"style="width:90px; background:#8da8db">
            <i border="0" style="float:left;margin-top:4px;color:#b5e840;font-size:20px" class="fa fa-plus"></i>Add
          </button>
        </div>`;
  $('#table_group_wrapper').prepend(btn_add_delete);

  $('#add_group').off('click').on('click', function (event) {
    event.preventDefault();
    var id = $(this).val();
    var group_name = $("#name").val();
    var description = $("#desc").val()
    var status = $("#modalAdd input[name=status]:checked").val();
    $(".error").remove();
    if (group_name.length < 1) {
      $("#name").after(
        '<span class="error">Please enter Group Name</span>'
      );
    } else if (group_name.length < 2 || group_name.length > 100) {
      $("#name").after('<span class="error">The length of Group Name is from 2 to 100 characters.</span>');
    }
    if (description.length > 500) {
      $("#desc").after('<span class="error">The maximum length of Group Desctription is 500 characters.</span>');
    }
    if ($(".error").length == 0) {
      $("#modalAdd").modal("hide");
      $.ajax({
        url: "/groups/",
        type: "POST",
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
        },
        data: {
          name: group_name,
          status: status,
          description: description,
        },
        success: function (response) {
          warning('The group information has been created successfully.');
          loadDataGroups();
        }
      });
    }
  });
}

function actionEdit() {
  $('.btn-edit-group').off('click').on('click', function () {
    $('#edit_group_name').val($(this).data('name'));
    $('#edit_group_description').val($(this).data('description'));
    $('#edit_save').val($(this).data('id'));
    $('#modalEdit').modal();
    $('.edit_status').prop('checked', false);
    $('#edit_status_' + $(this).data('status')).prop('checked', true);
  });

  $('#edit_save').off('click').on('click', function (event) {
    event.preventDefault();
    var id = $(this).val();
    var group_name = $("#edit_group_name").val();
    var description = $("#edit_group_description").val()
    var status = $("#modalEdit input[name=status]:checked").val();
    $(".error").remove();
    if (group_name.length < 1) {
      $("#edit_group_name").after(
        '<span class="error">Please enter Group Name</span>'
      );
    } else if (group_name.length < 2 || group_name.length > 100) {
      $("#edit_group_name").after('<span class="error">The length of Group Name is from 2 to 100 characters.</span>');
    }
    if (description.length > 500) {
      $("#edit_group_description").after('<span class="error">The maximum length of Group Desctription is 500 characters.</span>');
    }
    if ($(".error").length == 0) {
      $("#modalEdit").modal("hide");
      $.ajax({
        url: "/groups/"+id,
        type: "PUT",
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
        },
        data: {
          name: group_name,
          status: status,
          description: description,
        },
        success: function (response) {
          warning('The group information has been updated successfully.');
          loadDataGroups();
        }
      });
    }
  })
}

function actionDelete() {
  $('.btn-delete-group').off('click').on('click', function () {
    $('#btn_confirm_delete').val($(this).data('id'));
    $('#modalDelete').modal();
  });

  $('#btn_confirm_delete').off('click').on('click', function (event) {
    event.preventDefault();
    var id = $(this).val();
    $.ajax({
      url: id,
      type: "DELETE",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      success: function (response) {
        $('#modalDelete').modal('hide');
        if (response.status == "success") {
          warning('The group has been deleted successfully.');
          loadDataGroups();
        }
        else
          fails("Can't delete group");
      }
    });

  })
}

function loadPrivileges() {
  $('.key-icon').off('click').on('click', function () {
    var group_id = $(this).data('id');
    var group_name = $(this).data('name');
    $(`#modalPrivilege .table-left tbody`).children('tr').remove()
    $(`#modalPrivilege .table-right tbody`).children('tr').remove()
    $.ajax({
      type: "POST",
      url: `/user_groups/load_privileges/`,
      data: {
        group_id: group_id,
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      dataType: "json",
      success: function (response) {
        $('#to_left').prop("disabled", true);
        $('#to_right').prop("disabled", true);

        $('#title_modal_privilege').text('Assign Privileges To Group ' + group_name);
        formatDataPrivilege(response.left, 'left');
        formatDataPrivilege(response.right, 'right');
        $('#modalPrivilege').modal();
        $('#modalPrivilege').off('shown').on('shown.bs.modal', function (e) {
          eventPrivilegePopup(group_id);
          $('.table-fixed').each((_, el) => el.scrollTop = 0)
        });
        $('#modalPrivilege').off('hide').on('hide.bs.modal', function () {
          $('#save_group').prop('disabled', true);
          $('.select-all-right').prop('checked', false);
          $('.select-all-left').prop('checked', false);
          $('.to-left, .to-right').prop('disabled', true);
        });
      }
    })
  })
}

function formatDataPrivilege(data, type_table) {
  if (data == undefined || data.length == 0) {
    $('.select-all-' + type_table).prop('disabled', true);
    $(`#table_${type_table} tbody`).append(`
      <tr class="type-icon notice">
        <th class="privilege-name" style="background-color: #cfd5ea" colspan=3>No data available on this table</th>
      </tr>`)
    return;
  }
  $('.select-all-' + type_table).prop('disabled', false);
  var old_name = []
  data.forEach(function (value, index) {
    if (!old_name.includes(value.title_id)) {
      $(`#modalPrivilege .table-${type_table} tbody`).append(`
          <tr class="privilege-name title-${value.title_id}">
            <th class="type-text privilege-name" colspan=3">${value.title_name}</th>
          </tr>`)
      old_name.push(value.title_id)
    }
    $(`#modalPrivilege .table-${type_table} tbody`).append(`
        <tr data-title_id="${value.title_id}" class="${value.title_id} ${index % 2 == 0 ? "odd" : "even"}" id="privilege_${value.id}">
          <td scope="row" class="number">${index + 1}</td>
          <td><input type="checkbox" class="checkbox privilege-${value.id}" value="${value.id}"></td>
          <td style="text-align: left;">${value.name}</td>
        </tr>`)
  })
}

function eventPrivilegePopup(group_id) {
  var table_left = 'left';
  var table_right = 'right'
  eventSelectAllPopup(table_left, table_right);
  eventSelectAllPopup(table_right, table_left);
  eventSelectCheckboxPopup(table_left, table_right);
  eventSelectCheckboxPopup(table_right, table_left);
  savePrivileges(group_id);
  $('.to-right').on('click', function () {
    $('#save_group').prop('disabled', false);
    $(this).prop('disabled', true);
    eventButtonLeftRight(table_left, table_right);
  });
  $('.to-left').on('click', function () {
    $('#save_group').prop('disabled', false);
    $(this).prop('disabled', true);
    eventButtonLeftRight(table_right, table_left);
  });
}

function eventSelectAllPopup(main_type, diff_type) {
  $('.select-all-' + main_type).off('click').on('click', function () {
    $('.to-' + diff_type).prop('disabled', !$(this)[0].checked);
    if (!$(this)[0].checked)
      $(`.table-${main_type} tbody :checkbox`).each(function (index, el) {
        $(el).click();
      });
    else
      $(`.table-${main_type} tbody :checkbox:not(:checked)`).each(function (index, el) {
        $(el).click();
      });
  });
}

function eventSelectCheckboxPopup(main_type, diff_type) {
  $(`#table_${main_type} tbody`).off('click').on('click', 'input:checkbox', function () {
    $(this).parents('tr').toggleClass('highlight-record');
    if ($(`.table-${main_type} tbody :checkbox:not(:checked)`).length == 0)
      $('.select-all-' + main_type).prop('checked', true)
    else
      $('.select-all-' + main_type).prop('checked', false)

    if ($(`.table-${main_type} tbody :checkbox:checked`).length == 0)
      $('.to-' + diff_type).prop('disabled', true);
    else
      $('.to-' + diff_type).prop('disabled', false);
  });
}

function eventButtonLeftRight(main_type, diff_type) {
  $(`.table-${main_type} tbody :checkbox:checked`).parents('tr').each(function () {
    var title_id = $(this).data('title_id');
    var name = this.id
    var privilege_id = name.slice(10);
    if ($(`.table-${diff_type} .privilege-name.title-${title_id}`).length == 0) {
      $(`.table-${main_type} .privilege-name.title-${title_id}`).clone().appendTo(`.table-${diff_type} tbody`)
    }
    $(`#${name}`).insertAfter($(`.table-${diff_type} .privilege-name.title-${title_id}`));

    $(`.select-all-${main_type}`).prop('checked', false);
    $(`.select-all-${diff_type}`).prop('checked', false);
    $('input.privilege-' + privilege_id).click();

    if ($(`.table-${main_type} .${title_id}`).length == 0) {
      $(`.table-${main_type} .privilege-name.title-${title_id}`).remove()
    }
  });
  $(`.table-${diff_type} tbody td.number`).each(function (index) {
    $(this).text(index + 1)
  });
  $(`.table-${main_type} tbody td.number`).each(function (index) {
    $(this).text(index + 1)
  });

  if ($(`.table-${main_type} tbody :checkbox`).length == 0 && $(`.table-${main_type} .notice`).length == 0) {
    $(`.select-all-${main_type}`).prop('disabled', true);
    $(`.table-${main_type} tbody`).append('<tr class="type-icon notice"><th class="privilege-name" style="background-color:#cfd5ea" colspan=3>No data available on this table</th></tr>')
  }
  if ($(`.table-${diff_type} tbody :checkbox`).length > 0) {
    $(`.select-all-${diff_type}`).prop('disabled', false);
    $(`.table-${diff_type} tbody .notice`).remove();
  }
}

function savePrivileges(group_id) {
  $('#save_group').off('click').on('click', function () {
    $('#save_group').prop('disabled', true);
    var save_arr = [];
    $(`.table-right tbody :checkbox`).each(function (key, value) {
      save_arr.push($(value).val())
    })

    $.ajax({
      url: `/user_groups/save_privileges`,
      type: "POST",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      data: {
        group_id: group_id,
        data: save_arr
      },
      dataType: "json",
      success: function (response) {
        $("#modalPrivilege").modal("hide");
        warning('The group information has been updated privilege successfully.')
      }
    })
  })
}

function loadAssignUser() {
  $('.user-group-icon').off('click').on('click', function () {
    var group_id = $(this).data('id');
    var group_name = $(this).data('name');
    $(`#modalAssign .table-available tbody`).html('');
    $(`#modalAssign .table-selected tbody`).html('');

    $.ajax({
      type: "POST",
      url: `/user_groups/data_assign_user/`,
      data: {
        group_id: group_id,
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      dataType: "json",
      success: function (response) {
        $('#to_selected').prop("disabled", true);
        $('#to_available').prop("disabled", true);

        $('#title_modal_assign').text('Assign Privileges To Group ' + group_name);
        formatDataAssignUsers(response.selected_users, 'selected');
        formatDataAssignUsers(response.available_users, 'available');
        $('#modalAssign').modal();
        $('#modalAssign').off('shown').on('shown.bs.modal', function (e) {
          var group = {
            id: group_id,
            name: group_name
          }
          eventAssignUser(group);
          $('.table-fixed').each((_, el) => el.scrollTop = 0);
          $('#save_assign_user').addClass('disabled');
        });

        $('#modalAssign').off('hide').on('hide.bs.modal', function () {
          $('#save_group').prop('disabled', true);
          $('.select-all-selected').prop('checked', false);
          $('.select-all-available').prop('checked', false);
          $('.to-selected, .to-available').prop('disabled', true);
          delete_users_group = [];
          add_users_group = [];
          current_users_group = [];
        });
      }
    })
  })
}

function formatDataAssignUsers(data, type_table) {
  $(`#table_${type_table}_user`).html(`
  <table class="table table-primary table-responsive table-${type_table}" id="table_${type_table}" style="width:100%; border: 3px solid #4882bf;">
    <thead>
      <tr>
        <th class="type-icon no" data-orderable="false">No.</th>
        <th class="type-icon c-checkbox" data-orderable="false"><input type="checkbox" class="select-all-${type_table}"/></th>
        <th class="type-icon full-name">Full Name</th>
        <th class="type-icon account">Account</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>`);

  $('.select-all-' + type_table).prop('disabled', false);
  tmp = ""
  data.forEach(function (user, index) {
    if (type_table == 'selected')
      current_users_group.push(user.id);
    tmp += `
        <tr class="${index % 2 == 0 ? "odd" : "even"}">
          <td scope="row" class="type-number number">${index + 1}</td>
          <td class="type-icon c-checkbox"><input type="checkbox" class="checkbox" value="${user.id}"></tdclass=>
          <td class="type-text">${user.full_name}</td>
          <td class="type-text">${user.account}</td>
        </tr>`
  });
  $(`#table_${type_table} tbody`).html(tmp);
  var table = $(`#table_${type_table}`).DataTable({
    "bLengthChange": false,
    "bAutoWidth": false,
    "retrieve": true,
    "language": {
      "searchPlaceholder": "Search by Full Name, Account",
      "info": " _START_ - _END_ of _TOTAL_"
    },
    "fnDrawCallback": function (dataSource) {
      nextPagePopupAssign(type_table);
    },
    "columnDefs": [
      {
        "searchable": false,
        "orderable": false,
        "targets": 0,
      },
      {
        "searchable": false,
        "orderable": false,
        "targets": 1,
      },
    ],
    "order": [[3, "asc"]],
  });
  $(".dataTables_length").addClass("bs-select");

  if (data == undefined || data.length == 0) {
    $('.select-all-' + type_table).prop('disabled', true);
    $(`#table_${type_table}_user .paginate_button`).prop('disabled', true);
    $(`#table_${type_table} tbody`).html(`
      <tr class="type-icon notice">
        <th class="type-icon" style="background-color: #cfd5ea" colspan=4>No data available on this table</th>
      </tr>`);
    return;
  }
  table.on("order.dt search.dt", function () {
    table.column(0, { search: "applied", order: "applied" })
      .nodes().each(function (cell, i) {
        cell.innerHTML = i + 1;
      });
  }).draw();
}

function eventAssignUser(group) {
  var table_left = 'available';
  var table_right = 'selected';
  eventSelectAllPopup(table_left, table_right);
  eventSelectAllPopup(table_right, table_left);
  eventSelectCheckboxPopup(table_left, table_right);
  eventSelectCheckboxPopup(table_right, table_left);
  eventButtonLeftRightAssign(table_left, table_right);
  eventButtonLeftRightAssign(table_right, table_left);
  searchChange(table_left);
  searchChange(table_right);
  addAssignUser(group);
}

function eventButtonLeftRightAssign(main_type, diff_type) {
  $('#to_' + main_type).off('click').on('click', function () {
    $('#save_assign_user').removeClass('disabled');
    $(`.select-all-${main_type}`).prop('disabled', false);
    var checkboxes = $(`#table_${diff_type} tbody input:checkbox:checked`);
    checkboxes.each(function (_, el) {
      if (main_type == 'selected') {
        add_users_group.push(parseInt(el.value));
      } else {
        delete_users_group.push(parseInt(el.value));
      }
      el.click();
      var tr = el.closest("tr");

      table_left = $(`#table_${diff_type}:visible`).dataTable();
      table_right = $(`#table_${main_type}:visible`).dataTable();

      var tr_add = table_left.fnGetData(tr);
      table_right.fnAddData(tr_add);
      table_left.fnDeleteRow(tr);
    });
    if ($(`#table_${diff_type}_user .paginate_button.current`).length == 0) {
      $(`#table_${diff_type} tbody`).html('<tr><th class="type-icon" style="background-color: #cfd5ea" colspan="4">No data available on this table</th></tr>');
      $(`.select-all-${diff_type}`).prop('disabled', true);
    }
    $(`.table-${diff_type} tbody :checkbox:checked`).each(function (index, el) {
      $(el).click();
    });
  });
}

function addAssignUser(group) {
  $('#save_assign_user').off('click').on('click', function () {
    var user_deletes = _.difference(delete_users_group, add_users_group);
    var user_add = _.difference(add_users_group, delete_users_group);
    $.ajax({
      type: "POST",
      url: "/user_groups/save_user_group",
      data: {
        user_deletes: user_deletes,
        user_add: user_add,
        group_id: group.id,
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        $('#modalAssign').modal('hide');
        if (response.status == "success")
        {
          warning(`Assign user to group ${group.name} has been successfully!`);
          loadDataGroups();
        }
        else
          fails(`Assign user to group ${group.name} failed!`);
      }
    });
  })
}

function searchChange(type_table) {
  $(`#table_${type_table}_filter input`).on('keyup', function () {
    if ($(`#table_${type_table} tbody :checkbox`).length == 0) {
      $(`#table_${type_table} tbody`).html('<tr><th class="type-icon" style="background-color: #cfd5ea" colspan="4">No data available on this table</th></tr>');
      $(`.select-all-${type_table}`).prop('disabled', true);
    } else {
      $(`.select-all-${type_table}`).prop('disabled', false);
    }
  })
}

function nextPagePopupAssign(type_table) {
  $(`#table_${type_table}_user .paginate_button`).on('click', function () {
    $('.select-all-' + type_table).click();
    $(`.table-${type_table} tbody :checkbox:checked`).each(function (index, el) {
      $(el).click();
    });
  })
}