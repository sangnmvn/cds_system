$(document).on("click", ".approval-assessment", function () {
    $('#modal_approve_cds').modal('show');
});
$(document).on("click", ".reject-assessment", function () {
    var user_to_be_reviewed = findGetParameter("user_id");
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
                warning(`The CDS assessment of ${response.user_name} has been rejected successfully.`);
                // $("a.reject-assessment i").css("color", "#ccc");
                // $('a.reject-assessment').removeClass('reject-assessment');
                location.reload();
            } else {
                fails("Can't rejected CDS.");
            }
        }
    });
});

$(document).on("click", "#confirm_yes_approve_cds", function () {
    $('#modal_approve_cds').modal('hide');
    var user_to_be_reviewed = findGetParameter("user_id");


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
                warning(`The CDS assessment of ${response.user_name} has been approved successfully.`);
                // $("a.approval-assessment i").css("color", "#ccc");
                // $('a.approval-assessment').removeClass('approval-assessment');
                location.reload();
            } else {
                fails("Can't approve CDS.");
            }
        }
    });
});