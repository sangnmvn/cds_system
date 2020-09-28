function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).ready(function () {
  $('#send_mail_forget_password').on('click', function () {
    $('.error').remove()
    var email = $('#email').val()
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    //var address = document.getElementById[email].value;
    if (!email) {
      $('.input-group').parent().append('<div class="error type-text ">Please enter Email</div>')
    } else if (email.length > 255) {
      $('.input-group').parent().append('<div class="error type-text">Maximum length is 255 characters.</div>')
    } else if (reg.test(email) == false) {
      $('.input-group').parent().append('<div class="error type-text">Please enter a valid email address. For example: abc@domain.com</div>')
    }
    if ($('.error').length) return;
    $.ajax({
      url: `/users/forgot_password`,
      type: "POST",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      data: {
        email: email,
      },
      dataType: "json",
      success: function (response) {
        if (response.status == "success") {
          warning('You have sent a reset password email successfully. Please click the reset password link in your email to set your new password.');
          sleep(5000);
          // document.location.href = "/";
        } else
          fails('Your email address has not existed in CDS System. Please enter another email.')
      }
    });
  })

  $('#confirm_change_password').on('click', function (e) {
    var new_pass = $("#user_password").val();
    var confirm_pass = $("#user_password_confirmation").val();
    if ($(this).hasClass('disabled') || new_pass && confirm_pass && (new_pass == confirm_pass) && !$("#user_password").hasClass("is-invalid"))
      e.preventDefault();
  })

  $("#user_password").keyup(function () {
    $("#user_password_confirmation").val("");
    $("#user_password_confirmation").removeClass("is-invalid").removeClass("is-valid")
    var regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,32}$/;
    var pass = $(this).val()
    if (pass == "") {
      $(this).addClass("is-invalid").removeClass("is-valid")
      $("#error_new_pass").html("Please enter new password")
    } else if (!regex.test(pass)) {
      $(this).addClass("is-invalid").removeClass("is-valid")
      $("#error_new_pass").html("Min of 8 characters and must have: a uppercase, a downcase, a special character, a number.")
    } else {
      $(this).addClass("is-valid").removeClass("is-invalid")
      $("#error_new_pass").html("")
    }
  })

  $("#user_password_confirmation").keyup(function () {
    if ($(this).val() != $("#user_password").val()) {
      $(this).addClass("is-invalid").removeClass("is-valid")
      $("#error_confirm").html("Confirm password isn't equal new password.")
    } else {
      if (!$(this).val().length) {
        $(this).addClass("is-invalid").removeClass("is-valid");
        $("#error_confirm").html("Please enter confirm new password");
      }
      else if ($("#user_password").hasClass("is-invalid")) {
        $(this).addClass("is-invalid").removeClass("is-valid")
        $("#error_confirm").html("Min of 8 characters and must have: a uppercase, a downcase, a special character, a number.")
      } else {
        $(this).addClass("is-valid").removeClass("is-invalid")
        $("#error_confirm").html("")
      }
    }
    changeBtnSave();
  })

  $(".show-pass").on('click', function () {
    $(this).parents('.form-group').find('input').prop('type', 'text')
    $(this).addClass('d-none')
    $(this).next().removeClass('d-none')
  })

  $(".hide-pass").on('click', function () {
    $(this).parents('.form-group').find('input').prop('type', 'password')
    $(this).addClass('d-none')
    $(this).prev().removeClass('d-none')
  })
})

function changeBtnSave() {
  var new_pass = $("#user_password").val();
  var confirm_pass = $("#user_password_confirmation").val();
  if (new_pass != "" && new_pass == confirm_pass && !$(".change-password .is-invalid").length) {
    $('#confirm_change_password').removeClass("disabled");
  } else {
    $('#confirm_change_password').addClass("disabled");
  }
}