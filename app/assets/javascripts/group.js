$(document).on("click", "#btn-submit-add-user-group", function () {
  name = $("#name").val();
  status = $('input[name="status"]:checked').val();
  desc = $("#desc").val();
  temp = true;
  $(".error").remove();
  if (name.length < 1) {
    $("#name").after('<span class="error">Please enter Group Name</span>');
    temp = false;
  } else {
    if (name.length < 2 || name.length > 20) {
      $("#name").after(
        '<span class="error">Please enter a value between {2} and {20} characters long.</span>'
      );
      temp = false;
    }
  }
  if (status == "undefined") {
    $("#error-status").after(
      '<span class="error">Please Select A Status</span>'
    );
    temp = false;
  }
  if (temp == true) {
    $.ajax({
      url: "groups/",
      type: "POST",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      data: {
        Name: name,
        Status: status,
        Description: desc,
      },
      dataType: "json",
      success: function (response) {
          
          if (response.status == 'success'){
            $('#modalAdd').modal('hide');
            success();
          }else if (response.status == 'exist') {
            $(".error").remove();
            $("#name").after(
                '<span class="error">Name already exsit</span>'
            );
          }else if (response.status == 'fail') {
            fails();
        }
      },
    });
  }
});
