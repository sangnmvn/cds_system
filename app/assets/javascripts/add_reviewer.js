$(document).on("click", '.add-reviewer-icon', function () {
  var user_id = $(this).data("user_id");
  var user_account = $(this).data("user_account");
  $("#add_reviewer_modal_title").html(`Add Reviewer For <span style="color: #fff;font-size: bold;">${user_account}</span>`);

  $(".add-reviewer-id-modal").val(user_id);
  $.ajax({
    url: "/users/add_reviewer/",
    type: "POST",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
    data: {
      user_id: user_id,
    },
    dataType: "json",
    success: function (response) {
      reviewers = current_reviewers = response.current_reviewers;
      approvers = current_approvers = response.current_approvers;
      $('#table_left tbody').html(addDataReviewer(response.reviewers))
      $('#table_right tbody').html(addDataReviewer(response.approvers, "checkbox-approver"))
      if (response.reviewers.length > 0)
        setupDataTable('#table_left');
      if (response.approvers.length > 0)
        setupDataTable('#table_right');
    }
  });
})

$(document).on('click', '#check_all_choose_right', function () {
  var check = $(this)[0].checked
  $.each($('.checkbox-approver'), function (i, checkbox) {
    checkbox.checked = check
  })
});

$(document).on('click', '#check_all_choose_left', function () {
  var check = $(this)[0].checked
  $.each($('.checkbox-reviewer'), function (i, checkbox) {
    checkbox.checked = check
  })
});

$(document).on('click', '.checkbox-approver', function () {
  let id = $(this).data('id');
  if ($(this)[0].checked)
    approvers.push(id)
  else {
    var index = approvers.indexOf(id);
    approvers.splice(index, 1);
  }
  if ($('.checkbox-approver').filter('input:checkbox:not(":checked")').length == 0)
    $('#check_all_choose_right')[0].checked = true;
  else
    $('#check_all_choose_right')[0].checked = false;
});

$(document).on('click', '.checkbox-reviewer', function () {
  let id = $(this).data('id');
  if ($(this)[0].checked)
    reviewers.push(id)
  else {
    var index = reviewers.indexOf(id);
    reviewers.splice(index, 1);
  }
  if ($('.checkbox-reviewer').filter('input:checkbox:not(":checked")').length == 0)
    $('#check_all_choose_left')[0].checked = true;
  else
    $('#check_all_choose_left')[0].checked = false;
});

warning("Add reviewer to this group has been successfully!");
$("#addReviewerModal").on('hide.bs.modal', function () {
  resetTableAddReviewer();
});

function save_button(flag) {
  if (flag == 0) {
    $('#save').prop("disabled", true)
    $("#save").removeClass("btn-primary").addClass("btn-secondary");
  } else {
    $('#save').prop("disabled", false)
    $("#save").removeClass("btn-secondary").addClass("btn-primary");
  }
}

function addDataReviewer(data, class_check = "checkbox-reviewer") {
  if (data.length == 0)
    return `<tr><td colspan="4" class="type-icon">No data available in this table</td></tr>`;
  tpl = ""
  data.forEach(function (user, i) {
    checked = user.checked != undefined ? "checked" : ""
    tpl += `<tr data-id="{id}">
      <td class="type-number">{no}</td>
      <td data-id="{id}"><input type="checkbox" class="my-control {class_check}" {checked} data-id="{id}"></td>
      <td class="type-text">{name}</td>
      <td class="type-text">{account}</td>
    </tr>`.formatUnicorn({ id: user.id, no: i + 1, name: user.name, account: user.account, class_check: class_check, checked: checked });
  })
  return tpl
}


function setupDataTable(id) {
  var table = $(id).DataTable({
    "bLengthChange": false,
    "bAutoWidth": false,
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

  table.on("order.dt search.dt", function () {
    table.column(0, { search: "applied", order: "applied" })
      .nodes().each(function (cell, i) {
        cell.innerHTML = i + 1;
      });
  }).draw();
}

function resetTableAddReviewer() {
  $('#table_left').remove();
  $('#table_right').remove();
  $('#table_left_wrapper').html(`<table class="table table-primary table-mytable table-responsive-sm" style="width:100%;border-bottom: 2px solid #4882bf;" id="table_left">
      <thead>
        <tr>
          <td>No.</td>
          <td><input type="checkbox" id="check_all_choose_left" value="all" class="mycontrol"></td>
          <td>Full Name</td>
          <td>Account</td>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>`);
  $('#table_right_wrapper').html(`<table class="table table-primary table-mytable table-responsive-sm" style="width:100%;border-bottom: 2px solid #4882bf;" id="table_right">
        <thead>
          <tr>
            <td>No.</td>
            <td><input type="checkbox" id="check_all_choose_left" value="all" class="mycontrol"></td>
            <td>Full Name</td>
            <td>Account</td>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>`);
}