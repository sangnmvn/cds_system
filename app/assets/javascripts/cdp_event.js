$(document).on("click", ".approval-assessment", function () {
  $.ajax({
    type: "POST",
    url: "/forms/get_line_manager_miss_list",
    data: {
      form_id: form_id
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      var data_conflict = findConflictinArr(conflict_commits)
      str = ""
      if (data_conflict) {
        str = data_conflict
      }      
      if (jQuery.isEmptyObject(response)) {
        $('#modal_approve_cds').modal('show');
      } else {
        for (var competency_name in response) {
          str += "<p>\u2022 " + competency_name + ": ";
          slots = response[competency_name];
          str += slots.join(", ");
          str += "</p>"
        }

        $("#modal_approver_content").html(str);
        $("#modal_approver_submit").modal('show');
      }
    }
  });
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
        warning(`The CDS/CDP assessment of ${response.user_name} has been rejected successfully.`);
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
        warning(`The CDS/CDP assessment of ${response.user_name} has been approved successfully.`);
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
      success_message = "These slots have been requested more evidences successfully.";
      fails_message = "Can not requested"
      if (response.status == "success") {
        warning(success_message)
        $("a.submit-assessment .fa-file-import").css("color", "#6c757d");
        $('a.submit-assessment').removeClass('submit-assessment');
      } else {
        fails(fails_message);
      }
      checked_set.clear()
      data_checked_request = {}
      $("#button_request_update").addClass("disabled");
      $("#icon_request_update").prop("style", "color: #6c757d")
      loadDataPanel(form_id)
    }
  });
});

$(document).on("change", ".approver-commit, .reviewer-commit", function () {
  var slot = $(this).closest('.row-slot')
  var competency = $("#competency_panel").find(".show").data("competency-name")
  if (slot.find(".staff-commit").val() != $(this).val()) {
    if (conflict_commits[competency] == undefined) {
      a = new Set()
      conflict_commits[competency] = a.add(slot.data("location"))
    } else {
      conflict_commits[competency] = new Set(conflict_commits[competency])
      conflict_commits[competency].add(slot.data("location"))
    }
  } else {
    if (conflict_commits[competency] != undefined) {
      conflict_commits[competency] = new Set(conflict_commits[competency])
      conflict_commits[competency].delete(slot.data("location"))
    }
  }
})

function findConflictinArr(arr) {
  var str = "</p>"
  var keys = Object.keys(arr)
  keys.forEach(key => {
    a = new Set(arr[key])
    if (a.size > 0)
      str += `<p><b> ${key} / ${[...a].join()}</b></p>`
  });
  if (str.split("<p>").length <= 2)
    str = str.replace("<p>", "").replace("</p>", "")
  return str
}