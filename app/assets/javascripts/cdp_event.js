$(document).on("click", ".approval-assessment", function () {
  $('#modal_approve_cds').modal('show');
});

$(document).on("click", ".reject-assessment", function () {
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
        // $("a.reject-assessment i").css("color", "#ccc");
        // $('a.reject-assessment').removeClass('reject-assessment');    
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
        // $("a.approval-assessment i").css("color", "#ccc");
        // $('a.approval-assessment').removeClass('approval-assessment');        
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
      slot_id: data_checked_request,
      user_id: user_to_be_reviewed,
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      var success_message = ""
      var fails_message = ""
      if (response.color == "yellow") {
        success_message = "This slot has been requested more evidence successfully.";
        fails_message = "Can not requested"
      } else {
        success_message = "This slot has been cancelled requesting more evidence successfully.";
        fails_message = "Can not cancelled request"
      }
      if (response.status == "success") {
        $('#' + $(_this).val() + " i").css('color', response.color)
        $('#' + $(_this).val()).data("click", response.color);
        $('#' + $(_this).val()).attr("title", checkTitle(response.color))
        warning(success_message)
      } else {
        fails(fails_message);
      }
    }
  });
});