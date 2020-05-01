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
    if (name.length < 2 || name.length > 100) {
      $("#name").after(
        '<span class="error">Please enter a value between {2} and {100} characters long.</span>'
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
        name: name,
        status: status,
        description: desc,
      },
      dataType: "json",
      success: function (response) {
        if (response.status == "success") {
          $("#modalAdd").modal("hide");
          success();
        } else if (response.status == "exist") {
          $(".error").remove();
          $("#name").after('<span class="error">Name already exsit</span>');
        } else if (response.status == "fail") {
          fails();
        }
      },
    });
  }
});

$(document).ready(function () {
  $(".btn-edit-group").click(function () {
    group_id = $(this).data("id");
    // alert(group_id);
    $.ajax({
      url: "/groups/get_data",
      type: "GET",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
      data: { id: group_id },
      dataType: "json",
      success: function (response) {
        $("#modalEdit").modal("show");

        $.each(response.group, function (k, v) {
          $("#group_id").val(v.id);
          $(".edit-group").val(v.name);
          $(".edit-desc").val(v.description);
          if (v.Status) {
            $("input:radio[id=status_Enable]").prop("checked", true);
          } else {
            $("input:radio[id=status_Disable]").prop("checked", true);
          }
        });
      },
    });
  });
  $("#btn-submit-edit-user-group").click(function () {
    name = $("#modalEdit #name").val();
    status = $("input[name=status]:checked").val();
    desc = $("#modalEdit #desc").val();
    id = $("#modalEdit #group_id").val();
    temp = true;
    $(".error").remove();
    if (name.length < 1) {
      $("#modalEdit #name").after(
        '<span class="error">Please enter Group Name</span>'
      );
      temp = false;
    } else {
      if (name.length < 2 || name.length > 100) {
        $("#modalEdit #name").after(
          '<span class="error">Please enter a value between {2} and {100} characters long.</span>'
        );
        temp = false;
      }
    }
    if (temp == true) {
      $.ajax({
        url: "groups/" + id,
        type: "PUT",
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
        },
        data: {
          name: name,
          status: status,
          description: desc,
          id: id,
        },
        dataType: "json",
        success: function (response) {
          if (response.status == "success") {
            $("#modalEdit").modal("hide");
            success();
          } else if (response.status == "exist") {
            $(".error").remove();
            $("#modalEdit #name").after('<span class="error">Name already exsit</span>');
          } else if (response.status == "fail") {
            fails();
          }
        },
      });
    }
  });
});
