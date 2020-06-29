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