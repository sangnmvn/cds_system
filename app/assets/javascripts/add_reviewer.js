$(document).on("click", ".add-reviewer-icon[data-toggle=modal]", function () {
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
      reviewers = new Set(response.current_reviewers);
      $('#table_add_reviewer tbody').html(addDataReviewer(response.reviewers))
      if (response.reviewers.length > 0)
        setupDataTable('#table_add_reviewer');
      current_reviewers.forEach(function (id) {
        $('.checkbox-reviewer.checkbox-' + id).click();
      })
    }
  });
})

$(document).on("click", ".add-approver-icon[data-toggle=modal]", function () {
  var user_id = $(this).data("user_id");
  var user_account = $(this).data("user_account");
  $("#add_approver_modal_title").html(`Add Approver For <span style="color: #fff;font-size: bold;">${user_account}</span>`);

  $("#save_add_approver").data('user_id', user_id);
  $("#save_add_approver").data('user_account', user_account);

  $.ajax({
    url: "/users/add_approver/",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      user_id: user_id,
    },
    dataType: "json",
    success: function (response) {
      current_approvers = response.current_approvers;
      approvers = response.current_approvers;
      $("#submit_late").prop("checked", response.is_submit_late);
      $('#table_add_approver tbody').html(addDataReviewer(response.approvers, "checkbox-approver"))
      if (response.approvers.length > 0)
        setupDataTable('#table_add_approver');
      $(`.checkbox-approver.checkbox-${current_approvers}`).click();

    }
  });
})

$(document).on('click', '.checkbox-approver', function () {
  approvers = $(this).data('id');
  let flag = approvers == current_approvers;
  changeTypeButtonSave('#save_add_approver', flag);
});

$(document).on('change', "#submit_late", function () {
  changeTypeButtonSave('#save_add_approver', false);
});

$(document).on('click', '.checkbox-reviewer', function () {
  let id = $(this).data('id');
  if ($(this)[0].checked) {
    $(this).removeClass('check-checkbox-reviewer');
    reviewers.add(id);
  } else {
    $(this).addClass('check-checkbox-reviewer');
    reviewers.delete(id);
  }

  if ($('.checkbox-reviewer:checkbox:checked').length == 3) {
    $('.check-checkbox-reviewer').attr('disabled', true);
    disabled_reviewer = true;
  } else {
    disabled_reviewer = false;
    $('.check-checkbox-reviewer').removeAttr('disabled');
  }
  let flag = _.isEqual(reviewers, current_reviewers);
  changeTypeButtonSave("#save_add_reviewer", flag);
});

$(document).on('click', '#addReviewerModal .paginate_button', function () {
  if (disabled_reviewer) {
    $('.check-checkbox-reviewer').attr('disabled', true);
  } else {
    $('.check-checkbox-reviewer').removeAttr('disabled');
  }
})

$("#addReviewerModal").on('hide.bs.modal', function () {
  $('#table_add_reviewer').remove();
  $('#table_reviewer_wrapper').html(
    `<table class="table table-primary table-mytable table-responsive-sm" style="width:100%;border-bottom: 2px solid #4882bf;" id="table_add_reviewer">
      <thead>
        <tr>
          <td class="no">No.</td>
          <td class="checkbox"></td>
          <td class="full-name">Full Name</td>
          <td class="account">Account</td>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>`);
});

$("#addApproverModal").on('hide.bs.modal', function () {
  $('#table_add_approver').remove();
  $('#table_approver_wrapper').html(
    `<table class="table table-primary table-mytable table-responsive-sm" style="width:100%;border-bottom: 2px solid #4882bf;" id="table_add_approver">
      <thead>
        <tr>
          <td class="no">No.</td>
          <td class="checkbox"></td>
          <td class="full-name">Full Name</td>
          <td class="account">Account</td>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>`);
});
function changeTypeButtonSave(id, flag) {
  $(id).removeClass("btn-primary btn-secondary");
  if (flag) {
    $(id).prop("disabled", true);
    $(id).addClass("btn-secondary");
  } else {
    $(id).prop("disabled", false);
    $(id).addClass("btn-primary");
  }
}
$(document).on('click', '#save_add_reviewer', function () {
  let params = {
    user_id: $(this).data("user_id"),
    user_account: $(this).data("user_account"),
    reviewer_remove_ids: _.difference([...current_reviewers], [...reviewers]),
    add_reviewer_ids: _.difference([...reviewers], [...current_reviewers]),
    remove_ids: _.difference([...current_reviewers], [...reviewers]),
    add_reviewer: true,
  }
  ajaxAddReviewerApprover(params)
});

$(document).on('click', '#save_add_approver', function () {
  let params = {
    user_id: $(this).data("user_id"),
    user_account: $(this).data("user_account"),
    add_approver_ids: approvers,
    is_submit_late: $("#submit_late")[0].checked(),
    remove_ids: [current_approvers],
    add_reviewer: true,
  }
  ajaxAddReviewerApprover(params)
});

function ajaxAddReviewerApprover(params) {
  $.ajax({
    url: "/users/add_reviewer_to_database/",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      user_id: params.user_id,
      add_approver_ids: params.add_approver_ids,
      add_reviewer_ids: params.add_reviewer_ids,
      remove_ids: params.remove_ids,
      is_submit_late: params.is_submit_late,
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success")
        warning(`Add ${params.add_reviewer ? "reviewer" : "approver"} for ${params.user_account} has been successfully!`);
      else if (response.status == "fails")
        fails(`Couldn't add ${params.add_reviewer ? "reviewer" : "approver"} for ${params.user_account}!`)
    }
  })
}
function addDataReviewer(data, class_check = "checkbox-reviewer") {
  if (data.length == 0)
    return `<tr><td colspan="4" class="type-icon">No data available in this table</td></tr>`;
  tpl = ""
  data.forEach(function (user, i) {
    tpl += `<tr data-id="{id}">
      <td class="type-number no">{no}</td>`.formatUnicorn({ id: user.id, no: i + 1 });
    if (class_check == "checkbox-reviewer")
      tpl += `<td data-id="{id}" class="checkbox"><input type="checkbox" class="my-control {class_check} checkbox-{id} check-{class_check}" data-id="{id}"></td>`.formatUnicorn({ id: user.id, class_check: class_check });
    else
      tpl += `<td data-id="{id}" class="checkbox"><input type="radio" class="{class_check} checkbox-{id} check-{class_check}" data-id="{id}" name="approver"></td>`.formatUnicorn({ id: user.id, class_check: class_check });

    tpl += `<td class="type-text full-name">{name}</td>
      <td class="type-text account">{account}</td>
    </tr>`.formatUnicorn({ name: user.name, account: user.account });
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
