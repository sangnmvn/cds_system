$(document).ready(function () {
  $("#edit_contact").click(function () {
    $("#skype").val('')
    $("#modal_edit_contact").modal("show");
  })

  $("#edit_location").click(function () {
    $("#modal_edit_location").modal("show");
  })

  $("#change_password").click(function () {
    $("#old_pass").val('')
    $("#modal_change_password").modal("show");
  })

  $(".btn-save-edit").click(function () {
    var h_user = {
      id: $("#user_id").val(),
      first_name: $("#first_name").val(),
      last_name: $("#last_name").val(),
      phone_number: $("#phone_number").val(),
      date_of_birth: $("#birthday").val(),
      identity_card_no: $("#identity_card_no").val(),
      gender: $("#gender").val(),
      skype: $("#skype").val(),
      nationality: $("#nationality").val(),
      permanent_address: $("#permanent_address").val(),
      current_address: $("#current_address").val()
    }
    $.ajax({
      type: "POST",
      url: "/users/edit_user_profile",
      data: {
        h_user_profile: JSON.stringify(h_user)
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        if (response) {
          $("#modal_edit_contact").modal("hide")
          $("#modal_edit_location").modal("hide")
          success("My profile have been updated successfully!")
          setTimeout(location.reload.bind(location), 1000);
        } else
          fails("My profile haven't been updated!")
      }
    });
  })

  $("#btn_change_password").click(function () {
    changeBtnSave(false)
    checkEmptyData()
    $.ajax({
      type: "POST",
      url: "/users/change_password",
      data: {
        id: $("#user_id").val(),
        old_password: $("#old_pass").val(),
        new_password: $("#new_pass").val(),
        confirm_password: $("#confirm_pass").val()
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        if (response == "success") {
          success("Password have been changed successfully!")
          $("#modal_change_password").modal("hide")
        } else if (response.status == "Uncorrect") {
          changeClassStatus($("#old_pass"))
          $("#error_old_pass").html("Please enter correct password!")
        } else if (response.status == "Unequal") {
          changeClassStatus($("#confirm_pass"))
          $("#error_confirm").html("Confirm password isn't equal new password!")
        } else
          fails("Could not changed password!")
      }
    });
  })


  $("#modal_change_password #confirm_pass").focusout(function () {
    if ($(this).val() != $("#new_pass").val()) {
      $(this).addClass("is-invalid").removeClass("is-valid")
      $("#error_confirm").html("Confirm password isn't equal new password")
    } else {
      $(this).addClass("is-valid").removeClass("is-invalid")
      $("#error_confirm").html("")
    }
  })

  $("#modal_change_password #new_pass").focusout(function () {
    var regex = new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6}$")
    var pass = $(this).val()
    debugger
    if (pass == "") {
      $(this).addClass("is-invalid").removeClass("is-valid")
      $("#error_new_pass").html("Please enter new password")
    } else if (!regex.test(pass)) {
      $(this).addClass("is-invalid").removeClass("is-valid")
      $("#error_new_pass").html("Minimum of 8 characters, at least a uppercase letter, a lowercase letter and a number")
    } else {
      $(this).addClass("is-valid").removeClass("is-invalid")
      $("#error_new_pass").html("")
    }
  })

  $("#modal_change_password .form-control").change(function () {

  })

})

function changeBtnSave(bool) {
  if (bool == true) {
    $('#btn-change-password').attr("disabled", false);
    $('#btn-change-password').addClass("btn-primary").removeClass("btn-secondary")
  } else {
    $('#btn-change-password').attr("disabled", true);
    $('#btn-change-password').removeClass("btn-primary").addClass("btn-secondary")
  }

}

function changeClassStatus(item, status) {
  if (status) {
    item.addClass("is-valid").removeClass("is-invalid")
  } else {
    item.addClass("is-invalid").removeClass("is-valid")
  }
}

function checkEmptyData() {
  if ($("#new_pass").val() == $("#confirm_pass").val()) {
    if ($("#old_pass").val() == "") {
      $("#old_pass").addClass("is-invalid")
      $("#error_old_pass").html("Please enter old password")
    }
    if ($("#new_pass").val() == "") {
      changeClassStatus($("#new_pass"))
      $("#error_new_pass").html("Please enter new password")
    }
    if ($("#confirm_pass").val() == "") {
      changeClassStatus($("#confirm_pass"))
      $("#error_confirm").html("Please enter confirm password")
    }
  } else {
    changeClassStatus($("#confirm_pass"))
  }

}