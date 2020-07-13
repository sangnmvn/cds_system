$(document).on("click", ".approval-assessment", function () {
  var data_conflict = findConflictinArr(conflict_commits)
  if (data_conflict) {
    $("#content_modal_conflict").html(`The following slots have not conflicted on commitment between you and staff:
    <p>Slot: ${data_conflict} </p><p>Please continue reviewing or request update to Staff.</p>`)
    $('#modal_conflict').modal('show');
  } else
    $('#modal_approve_cds').modal('show');
});

$(document).on("click", ".reject-assessment", function () {
  $("#content_reject").html("Are you sure you want to reject CDS/CDP assessment of " + user_name + "?");
  $('#modal_reject_cds').modal('show');
})

$(document).on("click", "#confirm_yes_reject_cds", function () {
  $.ajax({
    type: "POST",
    url: "/forms/reject_cds",
    data: {
      form_id: form_id,
      user_id: user_to_be_reviewed,
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        success(`The CDS/CDP assessment of ${response.user_name} has been rejected successfully.`);
        $("#approve_cds").removeClass("d-none").addClass("approval-assessment")
        $("#reject_cds").addClass("d-none").removeClass("reject-assessment")
        $("#button_cancel_request").removeClass("d-none")
        $("#summary_comment").removeClass("d-none")
        $("#button_request_update").removeClass("d-none")
        $("#status").html("(Awaiting Approval)")
        toggleInput(true);
      } else {
        fails("Can't rejected CDS/CDP.");
      }
    }
  });
  $('#modal_reject_cds').modal('hide');
});

$(document).on("click", "#confirm_yes_approve_cds", function () {
  $('#modal_approve_cds').modal('hide');
  $.ajax({
    type: "POST",
    url: "/forms/approve_cds",
    data: {
      form_id: form_id,
      user_id: user_to_be_reviewed,
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        success(`The CDS/CDP assessment of ${response.user_name} has been approved successfully.`);
        $("#approve_cds").addClass("d-none").removeClass("approval-assessment")
        $("#button_cancel_request").addClass("d-none")
        $("#button_request_update").addClass("d-none")
        $("#summary_comment").addClass("d-none")
        $("#reject_cds").removeClass("d-none").addClass("reject-assessment")
        $("#status").html("(Done)")
        toggleInput(false);
      } else {
        fails("Can't approve CDS/CDP.");
      }
    }
  });
});

$(document).on("click", "#confirm_yes_request_add_more_evidence", function () {
  $('#modal_cancel_request_add_more_evidence, #modal_request_add_more_evidence').modal('hide');
  var _this = this;
  $.ajax({
    type: "POST",
    url: "/forms/request_update_cds",
    data: {
      form_slot_id: [...checked_set],
      form_id: form_id,
      slot_id: JSON.stringify(data_checked_request),
      user_id: user_to_be_reviewed,
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      // success_message = "These slots have been requested more evidence successfully.";
      // fails_message = "Can not requested"
      // if (response.status == "success") {
      //   success(success_message)
      // } else {
      //   fails(fails_message);
      // }
    }
  });
  success("These slots have been requested more evidence successfully.")
  checked_set.clear()
  data_checked_request = {}
  loadDataPanel(form_id)
});

$(document).on("change", ".approver-commit, .reviewer-commit", function () {
  var slot = $(this).closest('.row-slot')
  var competency = $("#competency_panel").find(".show").data("competency-name")
  if (slot.find(".staff-commit").val() != $(this).val()) {
    if (conflict_commits[competency] == undefined)
      conflict_commits[competency] = []
    conflict_commits[competency].push(slot.data("location"))
  } else {
    if (conflict_commits[competency] != undefined)
      conflict_commits[competency] = conflict_commits[competency].filter(item => item !== slot.data("location"))
  }
})

function findConflictinArr(arr) {
  var str = ""
  var keys = Object.keys(arr)
  keys.forEach(key => {
    if (arr[key].length > 0)
      str += `<p> ${key} / ${arr[key].toString()}</p>`
  });
  return str
}