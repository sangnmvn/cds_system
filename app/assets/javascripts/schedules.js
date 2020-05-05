
function success(content) {
  $('#content-alert-success').html(content);
  $("#alert-success").fadeIn();
  window.setTimeout(function () {
    $("#alert-success").fadeOut(1000);
  }, 5000);
}
// alert fails
function fails(content) {
  $('#content-alert-fail').html(content);
  $("#alert-danger").fadeIn();
  window.setTimeout(function () {
    $("#alert-danger").fadeOut(1000);
  }, 5000);
}
$(document).ready(function () {

  $('.edit_btn').bind("click", function () {
    let schedule_param = $(this).data('schedule')

    $.ajax({
      url: "/schedules/" + schedule_param + "/edit_page",
      type: "GET",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") }
    });
  })

  $('.del_btn').bind("click", function () {
    let schedule_param = $(this).data('schedule')

    $.ajax({
      url: "/schedules/" + schedule_param + "/destroy_page",
      type: "GET",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") }
    });
  })



});
$(document).on("click", ".del_btn", function () {
  let schedule_param = $(this).data('schedule')

    $.ajax({
      url: "/schedules/" + schedule_param + "/destroy_page",
      type: "GET",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") }
    });
});
$(document).on("click", ".edit_btn", function () {
  let schedule_param = $(this).data('schedule')

  $.ajax({
    url: "/schedules/" + schedule_param + "/edit_page",
    type: "GET",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") }
  });
});
$(document).on("click", "#selectAll", function () {
  $("#selectAll").select_all();
});
$(document).on("click", "#btn_modal_add", function () {


  project = $("#project").val();
  start_date = $("#start_date").val();
  end_date = $("#end_date").val();
  notify_date = $("#notify_date").val();
  temp = true;
  $(".error").remove();
  if (start_date.length < 1) {
    $("#start_date_1").after(
      '<p class="error">Please enter Start date</p>'
    );

    temp = false;
  }

  if (end_date.length < 1) {

    $("#end_date_1").after(
      '<p class="error">Please enter End date</p>'
    );
    temp = false;
  }
  if (notify_date.length < 1) {

    $("#notify_date").after(
      '<p class="error">Please enter notify date</p>'
    );
    temp = false;
  }
  if (new Date(end_date) < new Date()) {
    $("#end_date_1").after(
      '<p class="error">Please enter End date higher current_date</p>'
    );
    temp = false;
  }
  if (new Date(start_date) > new Date(end_date)) {
    $("#start_date_1").after(
      '<p class="error">Please enter Start date lower End_date</p>'
    );
    $("#end_date_1").after(
      '<p class="error">Please enter End_date higher Start date</p>'
    );
    temp = false;
  }
  if (new Date(start_date) < new Date()) {
    $("#start_date_1").after(
      '<p class="error">Please enter Start date higher current_date</p>'
    );
    temp = false;
  }
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }
  if (new Date(end_date) > (new Date(start_date)).addDays(30)) {
    $("#end_date_1").after(
      '<p class="error">The end date must not be higher than 30 days from the start date</p>'
    );
    temp = false;
  }
  if (project == "") {
    $("#project").after(
      '<p class="error">Please select a Project</p>'
    );
    temp = false;
  }
  if (temp == true) {
    $.ajax({
      url: "/schedules",
      type: "POST",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      data: {
        project: project,
        start_date: start_date,
        end_date: end_date,
        notify_date: notify_date,
      },
    });
  }
});
$(document).on("click", "#btn_modal_edit", function () {
  id = $("#schedule_id").val();
  project = $("#edit_project").val();
  start_date = $("#edit_start_date").val();
  end_date = $("#edit_end_date").val();
  notify_date = $("#edit_notify_date").val();
  status_edit = $("#status").val();
  temp = true;
  if (status_edit == "Not Started") {
    Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    }
    if (new Date(start_date) < new Date()) {

      $("#edit_start_date_1").after(
        '<p class="error">Please enter Start date higher current date</p>'
      );
      temp = false;
    }
    if (new Date(end_date) > (new Date(start_date)).addDays(30)) {
      $("#edit_end_date_1").after(
        '<p class="error">The end date must not be higher than 30 days from the start date</p>'
      );
      temp = false;
    }
    $(".error").remove();


    if (end_date.length < 1) {

      $("#edit_end_date_1").after(
        '<p class="error">Please enter End date</p>'
      );
      temp = false;
    }
    if (notify_date.length < 1) {

      $("#edit_notify_date").after(
        '<p class="error">Please enter notify date</p>'
      );
      temp = false;
    }
    if (new Date(end_date) < new Date()) {
      $("#edit_end_date_1").after(
        '<p class="error">Please enter End date higher current date</p>'
      );
      temp = false;
    }


    if (project == "") {
      $("#edit_project").after(
        '<p class="error">Please select a Project</p>'
      );
      temp = false;
    }
    end_date = new Date(end_date);
    start_date = new Date(start_date);
    if (temp == true) {
      $.ajax({
        url: "/schedules/" + id,
        type: "PUT",
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
        },
        data: {
          project_id: project,
          start_date: start_date,
          end_date: end_date,
          notify_date: notify_date,
        },
      });
    }
  }
  if (status_edit == "In-progress") {

    $(".error").remove();


    if (end_date.length < 1) {

      $("#edit_end_date_1").after(
        '<p class="error">Please enter End date</p>'
      );
      temp = false;
    }
    if (notify_date.length < 1) {

      $("#edit_notify_date").after(
        '<p class="error">Please enter notify date</p>'
      );
      temp = false;
    }


    end_date = new Date(end_date);
    if (temp == true) {
      $.ajax({
        url: "/schedules/" + id,
        type: "PUT",
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
        },
        data: {
          end_date: end_date,
          notify_date: notify_date,
        },
      });
    }
  }

});
function delete_schedule() {
  var id = $("#schedule_id").val();

  //alert( 'admin/user_management/'  + user_id + '/')
  $.ajax({
    url: "/schedules/" + id,
    method: "DELETE",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
    success: function (result) {
      // Do something with the result
    },
  });
}
$(document).on("click", "#delete_selected", function () {
  
  var schedule_ids = new Array();

            $.each($("input[name='checkbox']:checked"), function(){
              schedule_ids.push($(this).val());
            });
  
  $.ajax({
    url: "/schedules/destroy_multiple/",
    method: "DELETE",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
    data: {
      schedule_ids: schedule_ids,
    },
    success: function (result) {
      // Do something with the result
    },
  });
});

