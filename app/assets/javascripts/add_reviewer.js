// const _ = require('lodash');
$(document).on("click", '.add-reviewer-icon', function () {
  var user_id = $(this).data("user_id");
  var user_account = $(this).data("user_account");
  $("#add_reviewer_modal_title").html(`Add Reviewer For <span style="color: #fff;font-size: bold;">${user_account}</span>`);

  $("#save_add_reviewer").data('user_id', user_id);
  $("#save_add_reviewer").data('user_account', user_account);
  $.ajax({
    url: "/users/add_reviewer/",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      user_id: user_id,
    },
    dataType: "json",
    success: function (response) {
      current_reviewers = new Set(response.current_reviewers);
      current_approvers = new Set(response.current_approvers);
      reviewers = new Set(response.current_reviewers);
      approvers = new Set(response.current_approvers);
      $('#table_left tbody').html(addDataReviewer(response.reviewers))
      $('#table_right tbody').html(addDataReviewer(response.approvers, "checkbox-approver"))
      if (response.reviewers.length > 0)
        setupDataTable('#table_left');
      if (response.approvers.length > 0)
        setupDataTable('#table_right');
    }
  });
})

$(document).on('click', '#check_all_choose_approvers', function () {
  var check = $(this)[0].checked
  $.each($('.checkbox-approver'), function (i, checkbox) {
    if (checkbox.checked != check)
      checkbox.click();
  })
  changeTypeButtonSave();
});

$(document).on('click', '#check_all_choose_reviewers', function () {
  var check = $(this)[0].checked
  $.each($('.checkbox-reviewer'), function (i, checkbox) {
    if (checkbox.checked != check)
      checkbox.click();
  })
  changeTypeButtonSave();
});

$(document).on('click', '.checkbox-approver', function () {
  let id = $(this).data('id');
  if ($(this)[0].checked) {
    approvers.add(id)
    $('.checkbox-reviewer.check-box-' + id).attr('disabled', true)
  } else {
    approvers.delete(id);
    $('.checkbox-reviewer.check-box-' + id).removeAttr('disabled')
  }
  if ($('.checkbox-approver').filter(function () {
    return !(this.disabled || this.checked);
  }).length == 0) {
    $('#check_all_choose_approvers')[0].checked = true;
  } else {
    $('#check_all_choose_approvers')[0].checked = false;
  }
  changeTypeButtonSave();
});

$(document).on('click', '.checkbox-reviewer', function () {
  let id = $(this).data('id');
  if ($(this)[0].checked) {
    reviewers.add(id)
    $('.checkbox-approver.check-box-' + id).attr('disabled', true)
  } else {
    reviewers.delete(id);
    $('.checkbox-approver.check-box-' + id).removeAttr('disabled')
  }

  if ($('.checkbox-reviewer').filter(function () {
    return !(this.disabled || this.checked);
  }).length == 0) {
    $('#check_all_choose_reviewers')[0].checked = true;
  } else {
    $('#check_all_choose_reviewers')[0].checked = false;
  }
  changeTypeButtonSave();
});

$("#addReviewerModal").on('hide.bs.modal', function () {
  $('#table_left, #table_right').remove();
  $('#table_left_wrapper').html(
    `<table class="table table-primary table-mytable table-responsive-sm" style="width:100%;border-bottom: 2px solid #4882bf;" id="table_left">
      <thead>
        <tr>
          <td>No.</td>
          <td><input type="checkbox" id="check_all_choose_reviewers" value="all" class="mycontrol"></td>
          <td>Full Name</td>
          <td>Account</td>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>`);
  $('#table_right_wrapper').html(
    `<table class="table table-primary table-mytable table-responsive-sm" style="width:100%;border-bottom: 2px solid #4882bf;" id="table_right">
      <thead>
        <tr>
          <td>No.</td>
          <td><input type="checkbox" id="check_all_choose_approvers" value="all" class="mycontrol"></td>
          <td>Full Name</td>
          <td>Account</td>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>`);
});

function changeTypeButtonSave() {
  let flag = _.isEqual(reviewers, current_reviewers) && _.isEqual(approvers, current_approvers)
  $("#save_add_reviewer").removeClass("btn-primary btn-secondary");
  if (flag) {
    $('#save_add_reviewer').prop("disabled", true);
    $("#save_add_reviewer").addClass("btn-secondary");
  } else {
    $('#save_add_reviewer').prop("disabled", false);
    $("#save_add_reviewer").addClass("btn-primary");
  }
}

$(document).on('click', '#save_add_reviewer', function () {
  let user_id = $(this).data("user_id");
  let user_account = $(this).data("user_account");
  let approver_remove_ids = _.difference([...current_approvers], [...approvers]);
  let reviewer_remove_ids = _.difference([...current_reviewers], [...reviewers]);
  let add_approver_ids = _.difference([...approvers], [...current_approvers]);
  let add_reviewer_ids = _.difference([...reviewers], [...current_reviewers]);
  remove_ids = _.concat(approver_remove_ids, reviewer_remove_ids)
  $.ajax({
    url: "/users/add_reviewer_to_database/",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      user_id: user_id,
      add_approver_ids: add_approver_ids,
      add_reviewer_ids: add_reviewer_ids,
      remove_ids: remove_ids,
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success")
        warning(`Add reviewer/approver for ${user_account} has been successfully!`);
      else if(response.status == "fails")
        fails(`Couldn't add reviewer/approver for ${user_account}!`)
    }
  })
});

function addDataReviewer(data, class_check = "checkbox-reviewer") {
  if (data.length == 0)
    return `<tr><td colspan="4" class="type-icon">No data available in this table</td></tr>`;
  tpl = ""
  data.forEach(function (user, i) {
    checked = user.checked != undefined ? "checked" : ""
    tpl += `<tr data-id="{id}">
      <td class="type-number">{no}</td>
      <td data-id="{id}"><input type="checkbox" class="my-control {class_check} check-box-{id}" {checked} data-id="{id}"></td>
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
