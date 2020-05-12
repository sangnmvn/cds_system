$(function () {
  $('[data-tooltip="true"]').tooltip()
})
function success(content = "Success !") {
  $('#content-alert-success').html(content);
  $("#alert-success").fadeIn();
  window.setTimeout(function () {
    $("#alert-success").fadeOut(1000);
  }, 5000);
}
// alert fails
function fails(content = "Fail !") {
  $('#content-alert-fail').html(content);
  $("#alert-danger").fadeIn();
  window.setTimeout(function () {
    $("#alert-danger").fadeOut(1000);
  }, 5000);
}
// check status when enter start date and end date
function check_status(start,status_id) {
  start = Date.parse(start);
  let toDay = new Date()
  toDay = toDay.setHours(0, 0, 0, 0);
  if (start == toDay) {
    $(status_id).val("In-progress")
  }
  if (start > toDay) {
    $(status_id).val("New")
  }
}

function change_status(start_date){
  $(start_date).change(function () {
    var start = $(this).val();
    check_status(start, "#status_id")
  })
}
// end check




$(document).ready(function () {
  start_date_id = "#start_date"
  end_date_id = "#end_date"
  from_date = "#from_date"
  to_date = "#to_date"
  datepicker_setup(start_date_id,[end_date_id, from_date, to_date])
  $('#start_date').change(function () {
    var start = $(start_date_id).val();
    check_status(start, "#status")
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
  var schedule_param = $(this).data('schedule')

  $.ajax({
    url: "/schedules/" + schedule_param + "/destroy_page",
    type: "GET",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") }
  });
});
$(document).on("click", ".edit_btn", function () {

  var schedule_param = $(this).data('schedule');
  $.ajax({
    url: "/schedules/" + schedule_param + "/edit_page",
    type: "GET",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
    success: function() {
      start_date_id = "#start_date_edit";
      end_date_id = "#end_date_edit";
      from_date = "#from_date_edit";
      to_date = "#to_date_edit";
      datepicker_setup(start_date_id,[end_date_id,from_date,to_date]);
      change_status(start_date_id);
    }
  });

});
$(document).on("click", "#selectAll", function () {
  $("#selectAll").select_all();
});

// btn datepicker form add
function datepicker_setup(start_id, arr_end_date){  
    var toDay = new Date();
    toDay.setDate(toDay.getDate())
    $(start_id).datepicker({
      todayBtn: "linked",
      todayHighlight: true,
      startDate: toDay
    })
   for(i = 0; i<= arr_end_date.length; i++)
   {
     $(arr_end_date[i]).datepicker({
      todayBtn: "linked",
      todayHighlight: true,
      startDate: toDay
     })
   } 
}



// btn add new schedule of HR 
$(document).on("click", "#btn_modal_add_hr", function () {
  admin_user_id = $('#user').val();
  schedule_name = $('#desc').val();
  company = $("#company").val();
  start_date = $("#start_date").val();
  end_date = $("#end_date").val();
  from_date = $("#from_date").val();
  to_date = $("#to_date").val();
  notify_date = $("#notify_date").val();
  notify_hr = $('#notify_hr').val();
  status_hr = $('#status').val();
  temp = true;
  $(".error").remove();
  
  // check date start and end
  if (Date.parse(start_date) >= Date.parse(end_date)) {
    temp = false;
    $('#end_date').after('<span class="error">End date must be greater than start date.</span>')
  }
  if (Date.parse(from_date) >= Date.parse(to_date)) {
    temp = false;
    $('#to_date').after('<span class="error">Period end date must be greater than period start date.</span>')
  }
  if (from_date == "") {
    temp = false;
    $('#from_date').after('<span class="error">Please enter from date.</span>')
  }
  if (to_date == "") {
    temp = false;
    $('#to_date').after('<span class="error">Please enter to date.</span>')
  }
  if (start_date == "") {
    temp = false;
    $('#start_date').after('<span class="error">Please enter start date.</span>')
  }

  if (end_date == "") {
    temp = false;
    $('#end_date').after('<span class="error">Please enter end date.</span>')
  }
  // end check date
  if (schedule_name == "") {
    temp = false;
    $('#desc').after('<span class="error">Please enter schedule name.</span>')
  }

  if (company == "") {
    temp = false;
    $('#company').after('<span class="error">Please enter company name.</span>')
  }

  if (notify_hr == "") {
    temp = false;
    $('#notify_hr').closest('div').children('em').after('<br><span class="error">Please enter notify date.</span>')
  }



  if (temp == true) {
    $.ajax({
      url: "/schedules",
      type: "POST",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      data: {
        from_date: from_date,
        to_date: to_date,
        admin_user_id: admin_user_id,
        desc: schedule_name,
        company_id: company,
        start_date: start_date,
        end_date_hr: end_date,
        notify_hr: notify_hr,
        status: status_hr
      },
      success: (res) => {
        $('#form_add_hr')[0].reset();
      }
    });
  }
});
$(document).on("click", "#btn_modal_edit_hr", function () {
  id_schedule = $('#id').val()
  schedule_name = $('#desc').val();
  company = $("#company").val();
  start_date = $("#start_date").val();
  end_date = $("#end_date").val();
  from_date = $("#from_date").val();
  to_date = $("#to_date").val();
  notify_date = $("#notify_date").val();
  notify_hr = $('#notify_hr').val();
  status_hr = $('#status').val();
  temp = true;
  $(".error").remove();
  
  // check date start and end
  if (Date.parse(start_date) >= Date.parse(end_date)) {
    temp = false;
    $('#end_date').after('<span class="error">End date must be greater than start date.</span>')
  }
  if (Date.parse(from_date) >= Date.parse(to_date)) {
    temp = false;
    $('#to_date').after('<span class="error">Period end date must be greater than period start date.</span>')
  }
  if (from_date == "") {
    temp = false;
    $('#from_date').after('<span class="error">Please enter from date.</span>')
  }
  if (to_date == "") {
    temp = false;
    $('#to_date').after('<span class="error">Please enter to date.</span>')
  }
  if (start_date == "") {
    temp = false;
    $('#start_date').after('<span class="error">Please enter start date.</span>')
  }

  if (end_date == "") {
    temp = false;
    $('#end_date').after('<span class="error">Please enter end date.</span>')
  }
  // end check date
  if (schedule_name == "") {
    temp = false;
    $('#desc').after('<span class="error">Please enter schedule name.</span>')
  }

  if (company == "") {
    temp = false;
    $('#company').after('<span class="error">Please enter company name.</span>')
  }

  if (notify_hr == "") {
    temp = false;
    $('#notify_hr').closest('div').children('em').after('<br><span class="error">Please enter notify date.</span>')
  }



  if (temp == true) {
    $.ajax({
      url: "/schedules",
      type: "POST",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      data: {
        from_date: from_date,
        to_date: to_date,
        admin_user_id: admin_user_id,
        desc: schedule_name,
        company_id: company,
        start_date: start_date,
        end_date_hr: end_date,
        notify_hr: notify_hr,
        status: status_hr
      },
      success: (res) => {
        $('#form_add_hr')[0].reset();
      }
    });
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

  $.each($("input[name='checkbox']:checked"), function () {
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
$(document).ready(function () {
  $(".selectable").on('click', function () {
    if ($(':checkbox:checked').length > 0) {
      $('#displayBtnDel').prop("disabled", false);
    }
    else {
      $('#displayBtnDel').prop("disabled", true);
    }
  })
  $('#selectAll').click(function () {
    if ($('#selectAll').is(':checked')) {
      $('#displayBtnDel').prop("disabled", false);
    }
    else {
      $('#displayBtnDel').prop("disabled", true);
    }
  })
})
