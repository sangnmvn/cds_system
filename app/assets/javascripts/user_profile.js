$(document).ready(function () {
  $("#edit_contact").click(function () {
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
    changeBtnSave("btn_change_password", false)
    if (checkEmptyData()) {
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
    }
  })


  $("#modal_change_password #confirm_pass").keyup(function () {
    if ($(this).val() != $("#new_pass").val()) {
      $(this).addClass("is-invalid").removeClass("is-valid")
      $("#error_confirm").html("Confirm password isn't equal new password")
    } else {
      $(this).addClass("is-valid").removeClass("is-invalid")
      $("#error_confirm").html("")
    }
    changeBtnSave("btn_change_password", true, true)
  })

  $("#modal_change_password #new_pass").keyup(function () {
    var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    var pass = $(this).val()
    if (pass == "") {
      $(this).addClass("is-invalid").removeClass("is-valid")
      $("#error_new_pass").html("Please enter new password")
    } else if (!regex.test(pass)) {
      $(this).addClass("is-invalid").removeClass("is-valid")
      $("#error_new_pass").html("Minimum of 6 characters, at least a letter and a number")
    } else {
      $(this).addClass("is-valid").removeClass("is-invalid")
      $("#error_new_pass").html("")
    }
    changeBtnSave("btn_change_password", true, true)
  })

  $("#phone_number").change(function () {
    checkPhoneNumber($(this).val(), "phone_number", "error_phone_number")
  })

  $("#old_pass").change(function () {
    var data = $(this).val()
    changeBtnSave("btn_change_password", true, true)
    if (data) {
      $(this).removeClass("is-invalid")
      $("#error_old_pass").html("")
    } else {
      $(this).addClass("is-invalid")
      $("#error_old_pass").html("Please enter old password")
    }
  })

  $("#first_name").change(function () {
    var first_name = $(this).val()
    if (first_name) {
      checkName(first_name,"first_name","error_first_name")
      checkDataContact()
    } else {
      $(this).addClass("is-invalid")
      $("#error_first_name").html("Please enter first name")
      changeBtnSave("btn_save_contact", false)
    }
  })

  $("#last_name").change(function () {
    var last_name = $(this).val()
    if (last_name) {
      checkName(last_name,"last_name","error_last_name")
      checkDataContact()
    } else {
      $(this).addClass("is-invalid")
      $("#error_last_name").html("Please enter last name")
      changeBtnSave("btn_save_contact", false)
    }
  })

})

function checkDataContact() {
  var first_name = $("#first_name").val()
  var last_name = $("#last_name").val()
  var phone = $("#phone_number").val()
  if (first_name && last_name && phone) {
    changeBtnSave("btn_save_contact", true)
  } else {
    changeBtnSave("btn_save_contact", false)
  }
}

function changeBtnSave(btn, bool, type) {
  if (type) {
    var old_pass = $("#old_pass").val()
    var new_pass = $("#new_pass").val()
    var confirm_pass = $("#confirm_pass").val()
    if (old_pass && new_pass && confirm_pass && (new_pass == confirm_pass)) {
      $('#' + btn).attr("disabled", false);
      $('#' + btn).addClass("btn-primary").removeClass("btn-secondary")
    } else {
      $('#' + btn).attr("disabled", true);
      $('#' + btn).removeClass("btn-primary").addClass("btn-secondary")
    }
  } else {
    if (bool == true) {
      $('#' + btn).attr("disabled", false);
      $('#' + btn).addClass("btn-primary").removeClass("btn-secondary")
    } else {
      $('#' + btn).attr("disabled", true);
      $('#' + btn).removeClass("btn-primary").addClass("btn-secondary")
    }
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
  var status = true
  if ($("#old_pass").val() == "") {
    $("#old_pass").addClass("is-invalid")
    $("#error_old_pass").html("Please enter old password")
    status = false
  }
  if ($("#new_pass").val() == "") {
    changeClassStatus($("#new_pass"))
    $("#error_new_pass").html("Please enter new password")
    status = false
  }
  if ($("#confirm_pass").val() == "") {
    changeClassStatus($("#confirm_pass"))
    $("#error_confirm").html("Please enter confirm password")
    status = false
  }
  return status
}

function checkConfirm() {
  if ($("#new_pass").val() == $("#confirm_pass").val()) {
    changeBtnSave("btn_change_password", true)
  } else {
    changeClassStatus($("#confirm_pass"))
    changeBtnSave("btn_change_password", false)
  }
}

function checkName(input, idinput, idspan) {
  var regex = new RegExp("^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
                          "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆẾỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤÚỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
                          "ụúủứừÚỬỮỰỲỴÝỶỸửữựỳýỵỷỹ\\s]+$")
  if (!regex.test(input)) {
    $("#" + idspan).html("This field is invalid")
    $("#" + idinput).addClass("is-invalid")
    changeBtnSave("btn_save_contact", false)
  } else {
    $("#" + idspan).html("")
    $("#" + idinput).removeClass("is-invalid")
  }
}

function checkPhoneNumber(input, idinput, idspan) {
  var regex = /^[0-9\-\+]{9,15}$/
  if (!regex.test(input)) {
    $("#" + idspan).html("This field is invalid")
    $("#" + idinput).addClass("is-invalid")
    changeBtnSave("btn_save_contact", false)
  } else {
    $("#" + idspan).html("")
    $("#" + idinput).removeClass("is-invalid")
  }
}