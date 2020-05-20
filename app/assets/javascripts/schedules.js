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
function check_status(start, status_id) {
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

function check_notify(end_date, notify) {
  var end_date_val = $(end_date).val();
  var notify_val = $(notify).val();
  var format_end_date = new Date(end_date_val);
  format_end_date.setDate(format_end_date.getDate() - parseInt(notify_val))
  var toDay = new Date();
  toDay.setHours(0, 0, 0, 0)
  if (toDay > format_end_date) {
    if ($('.error' + "_" + notify.split("#")[1]).length == 0) {
      // $(notify).after('<span class="error' + "_" + notify.split("#")[1] + '">Notice date must be greater than current date.</span>')
      $(notify).closest('div').children('em').after('<br><span class="error error' + "_" + notify.split("#")[1] + '">Notice date must be greater than current date.</span>')
    }
    else {
      $(this).html('Notice date must be greater than current date.')
    }
  }
}

function change_status(start_date, attr_status) {
  $(start_date).change(function () {
    var start = $(this).val();
    check_status(start, attr_status)
  })
}
function change_notify(end_date, notify) {
  $(notify).change(function () {
    check_notify(end_date, notify)
  })
}

function reset_datepicker(arr_date) {
  for (i = 0; i <= arr_date.length; i++) {
    $(arr_date[i]).val('').datepicker('update');
  }
}
// end check

function view_schedule() {
  $('.view_detail').on('click', function () {
    let schedule_param = $(this).data('schedule')

    $.ajax({
      url: "/schedules/" + schedule_param,
      type: "GET",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") }
    });
  })
}


$(document).ready(function () {
  start_date_id = "#start_date"
  end_date_id = "#end_date"
  from_date = "#from_date"
  to_date = "#to_date"
  attr_id_notify = "#notify_hr"
  datepicker_setup([start_date_id, end_date_id], [from_date, to_date]);
  check_selectAll();
  action_add();
  action_edit();
  view_schedule();
  on_click_btn();
  $(attr_id_notify).change(function () {
    check_notify(end_date_id, attr_id_notify)
  })

  $('#start_date').change(function () {
    var start = $(start_date_id).val();
    check_status(start, "#status")
  })

});

function on_click_btn() {
  
  $(document).on("click", ".del_btn", function () {
    var schedule_param = $(this).data('schedule')
  
    $.ajax({
      url: "/schedules/" + schedule_param + "/destroy_page",
      type: "GET",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
      success: function () {
        attr_start_date_id = "#start_date_edit";
        attr_end_date_id = "#end_date_edit";
        attr_from_date = "#from_date_edit";
        attr_to_date = "#to_date_edit";
        attr_id_notify = "#notify_hr_edit";
        attr_status = "#status_id"
        datepicker_setup([attr_start_date_id, attr_end_date_id], [attr_from_date, attr_to_date]);
        change_status(attr_start_date_id, attr_status);
        change_notify(attr_end_date_id, attr_id_notify);
        view_schedule();
        action_edit();
      }
    });
  });
  $(document).on("click", ".edit_btn", function () {
  
    var schedule_param = $(this).data('schedule');
    $.ajax({
      url: "/schedules/" + schedule_param + "/edit_page",
      type: "GET",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
      success: function () {
        attr_start_date_id = "#start_date_edit";
        attr_end_date_id = "#end_date_edit";
        attr_from_date = "#from_date_edit";
        attr_to_date = "#to_date_edit";
        attr_id_notify = "#notify_hr_edit";
        attr_status = "#status_id"
        datepicker_setup([attr_start_date_id, attr_end_date_id], [attr_from_date, attr_to_date]);
        change_status(attr_start_date_id, attr_status);
        change_notify(attr_end_date_id, attr_id_notify);
        view_schedule();
        action_edit();
      }
    });
  
  });
  $(document).on("click", "#selectAll", function () {
    $("#selectAll").select_all();
  });

  $("#delete_selected").on("click", function () {

    var schedule_ids = new Array();
  
    $.each($("input[name='checkbox']:checked"), function () {
      schedule_ids.push($(this).val());
    });
    $('.lmask').show();
    $.ajax({
      url: "/schedules/destroy_multiple/",
      method: "DELETE",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
      data: {
        schedule_ids: schedule_ids,
      },
      success: function (result) {
        $('.lmask').hide();
        check_selectAll();
        // Do something with the result
      },
    });
  });
}


// btn datepicker form add
function datepicker_setup(arr_date, period_date) {
  var toDay = new Date();
  toDay.setDate(toDay.getDate())
  for (i = 0; i <= arr_date.length; i++) {
    $(arr_date[i]).datepicker({
      todayBtn: "linked",
      todayHighlight: true,
      startDate: toDay,
      autoclose: true,
      format: "M dd, yyyy"
    })
  }
  for (i = 0; i <= period_date.length; i++) {
    $(period_date[i]).datepicker({
      todayBtn: "linked",
      todayHighlight: true,
      autoclose: true,
      format: "M dd, yyyy"
    })
  }
}

// btn add new schedule of HR 
function action_add() {

  $("[type='number']").keypress(function (evt) {
    evt.preventDefault();
  });
  $("#btn_modal_add_hr").off('click').on("click", function () {
    user_id = $('#user').val();
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

    if (Date.parse(start_date) <= Date.parse(from_date)) {
      temp = false;
      $('#start_date').after('<span class="error">Start date must be greater than period from date.</span>')
    }

    if (from_date == "") {
      temp = false;
      $('#from_date').after('<div class="offset-sm-6 col-sm-6"><span class="error">Please enter from date.</span></div>')
    }
    if (to_date == "") {
      temp = false;
      $('#to_date').after('<div class="offset-sm-6 col-sm-6"><span class="error">Please enter to date.</span></div>')
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

    if (notify_hr < 0) {
      temp = false;
      $('#notify_hr').closest('div').children('em').after('<br><span class="error">Notice date must be greater than current date.</span>')
    }


    if (temp == true) {
      $('.lmask').show();
      $.ajax({
        url: "/schedules",
        type: "POST",
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
        },
        data: {
          from_date: from_date,
          to_date: to_date,
          user_id: user_id,
          desc: schedule_name,
          company_id: company,
          start_date: start_date,
          end_date_hr: end_date,
          notify_hr: notify_hr,
          status: status_hr
        },
        success: function (res) {
          $('.lmask').hide();
          $('#form_add_hr')[0].reset();
          reset_datepicker(["#end_date","#start_date","#to_date","#rom_date"]);
          check_selectAll();
          action_add();
          action_edit();
          view_schedule();
        },
        error: function () {
          $('.lmask').hide();
          check_selectAll();
          action_add();
          action_edit();
          view_schedule();
        }
      });
    }
  });
}

function action_edit() {
  $("[type='number']").keypress(function (evt) {
    evt.preventDefault();
  });
  $("#btn_modal_edit_hr").on("click", function () {
    id_schedule = $('#id').val()
    schedule_name = $('#desc_edit').val();
    company = $("#company_edit").val();
    start_date = $("#start_date_edit").val();
    end_date = $("#end_date_edit").val();
    from_date = $("#from_date_edit").val();
    to_date = $("#to_date_edit").val();
    notify_hr = $('#notify_hr_edit').val();
    status_hr = $('#status_id').val()
    temp = true;
    $(".error").remove();
    
    if (end_date == "") {
      temp = false;
      $('#end_date_edit').after('<span class="error">Please enter end date.</span>')
    }
    // end check date
    if (schedule_name == "") {
      temp = false;
      $('#desc_edit').after('<span class="error">Please enter schedule name.</span>')
    }

    if (notify_hr == "") {
      temp = false;
      $('#notify_hr_edit').closest('div').children('em').after('<br><span class="error">Please enter notify date.</span>')
    }

    if (temp == true) {
      $('.lmask').show();
      $.ajax({
        url: "/schedules/" + id_schedule,
        type: "PUT",
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
        },
        data: {
          desc: schedule_name,
          end_date_hr: end_date,
          notify_hr: notify_hr
        },
        success: (res) => {
          $('.lmask').hide();
          $('#form_edit_hr')[0].reset();
          check_selectAll();
          action_edit();
          action_add();
          view_schedule();
        },
        error: function () {
          $('.lmask').hide();
          check_selectAll();
          action_edit();
          action_add();
          view_schedule();
        }
      })
    }
  });
}


function delete_schedule() {
  var id = $("#schedule_id").val();

  //alert( 'admin/user_management/'  + user_id + '/')
  $('.lmask').show();
  $.ajax({
    url: "/schedules/" + id,
    method: "DELETE",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
    beforeSend: function () {
    },
    success: function (result) {
      $('.lmask').hide();
      check_selectAll();
      view_schedule();
    },
  });
}

function check_selectAll() {
  $(".selectable").on('click', function () {
    if ($(':checkbox:checked').length > 0) {
      $('#displayBtnDel').prop("disabled", false);
    }
    else {
      $('#displayBtnDel').prop("disabled", true);
    }

    if($('.table tbody :checkbox:not(:checked)').length == 0 ){
      $('#selectAll').prop('checked', true);
    }
    else
    {
      $('#selectAll').prop('checked', false);
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



  if ($('.table tbody :checkbox').length == 0) {
    $('#selectAll').prop("disabled", true);
  }
  if ($('.table tbody :checkbox').length != 0) {
    $('#selectAll').prop("disabled", false);
  }
}
