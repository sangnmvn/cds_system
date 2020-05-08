$(() => {
  $('[data-tooltip="true"]').tooltip()
})
function success(content = "Success !") {
  $('#content-alert-success').html(content);
  $("#alert-success").fadeIn();
  window.setTimeout(() => {
    $("#alert-success").fadeOut(1000);
  }, 5000);
}
// alert fails
function fails(content = "Fail !") {
  $('#content-alert-fail').html(content);
  $("#alert-danger").fadeIn();
  window.setTimeout(() => {
    $("#alert-danger").fadeOut(1000);
  }, 5000);
}
// check status when enter start date and end date
function check_status(start) {
  start = Date.parse(start);
  let toDay = new Date()
  toDay = toDay.setHours(0,0,0,0);
  if ( start == toDay ) {
    $('#status').val("In-progress")
  }
  if ( start > toDay ) {
    $('#status').val("New")
  }
}

// end check




$(document).ready(() => {
  
  $('#start_date').change(()=>{
    let start = $('#start_date').val();
      check_status(start)
  })

  $('.edit_btn').bind("click",() => {
    let schedule_param = $(this).data('schedule')

    $.ajax({
      url: "/schedules/" + schedule_param + "/edit_page",
      type: "GET",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") }
    });
  })

  $('.del_btn').bind("click",() => {
    let schedule_param = $(this).data('schedule')

    $.ajax({
      url: "/schedules/" + schedule_param + "/destroy_page",
      type: "GET",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") }
    });
  })



});
$(document).on("click", ".del_btn",() => {
  let schedule_param = $(this).data('schedule')

  $.ajax({
    url: "/schedules/" + schedule_param + "/destroy_page",
    type: "GET",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") }
  });
});
$(document).on("click", ".edit_btn",() => {
  let schedule_param = $(this).data('schedule')

  $.ajax({
    url: "/schedules/" + schedule_param + "/edit_page",
    type: "GET",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") }
  });
});
$(document).on("click", "#selectAll",() => {
  $("#selectAll").select_all();
});

// btn datepicker
$(() => {
  let $dp = $("#start_date");
  $(document).ready(()=>{
    let toDay = new Date();
    toDay.setDate(toDay.getDate()- 1)
    $dp.datepicker({
      minDate: toDay
    })
  })
})

$(() => {
  let $dp = $("#end_date");
  $(document).ready(()=>{
    $dp.datepicker({
      minDate: new Date()
    })
  })
})


// btn add new schedule of HR 
$(document).on("click", "#btn_modal_add_hr",() => {
  admin_user_id = $('#user').val();
  schedule_name = $('#desc').val();
  company = $("#company").val();
  start_date = $("#start_date").val();
  end_date = $("#end_date").val();
  notify_date = $("#notify_date").val();
  notify_hr = $('#notify_hr').val();
  status_hr = $('#status').val();
  temp = true;
  $(".error").remove();

  if (start_date == "") {
    temp = false;
    $('#start_date').after('<span class="error">Please enter start date.</span>')
  }

  if (end_date == "") {
    temp = false;
    $('#end_date').after('<span class="error">Please enter end date.</span>')
  }

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
$(document).on("click", "#btn_modal_edit",() => {
  id = $("#schedule_id").val();
  project = $("#edit_project").val();
  start_date = $("#edit_start_date").val();
  end_date = $("#edit_end_date").val();
  notify_date = $("#edit_notify_date").val();
  status_edit = $("#status").val();
  temp = true;


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
$(document).on("click", "#delete_selected",() => {

  var schedule_ids = new Array();

  $.each($("input[name='checkbox']:checked"),() => {
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
$(document).ready(() => {
  $(".selectable").on('click',() => {
    if ($(':checkbox:checked').length > 0) {
      $('#displayBtnDel').prop("disabled", false);
    }
    else {
      $('#displayBtnDel').prop("disabled", true);
    }
  })
  $('#selectAll').click(() => {
    if ($('#selectAll').is(':checked')) {
      $('#displayBtnDel').prop("disabled", false);
    }
    else {
      $('#displayBtnDel').prop("disabled", true);
    }
  })
})

$(document).on('click', '#mailer', () => {
  $.ajax({
    url: "/schedules/mailer",
    method: "POST",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
    success: function (result) {
      // Do something with the result
    },
  });
})