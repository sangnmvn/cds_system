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
    check_status(start, attr_status);
  })
}
function change_notify(end_date, notify) {
  $(notify).change(function () {
    check_notify(end_date, notify);
  })
}

function reset_datepicker(arr_date) {
  for (i = 0; i <= arr_date.length; i++) {
    $(arr_date[i]).val('').datepicker('update');
  }
}
// end check

function view_schedule() {
  var reload_table = false;
  $('#schedule_table').dataTable().fnDraw(reload_table);
}


$(document).ready(function () {
  start_date_id = "#start_date"
  end_date_id = "#end_date"
  from_date = "#from_date"
  to_date = "#to_date"
  attr_id_notify = "#notify_hr"
  end_date_member_id = "#end_date_member"
  end_date_reviewer_id = "#end_date_reviewer"
  datepicker_setup([start_date_id, end_date_id, end_date_member_id, end_date_reviewer_id], [from_date, to_date]);
  check_selectAll();
  action_add();
  action_edit();
  view_schedule();
  $(attr_id_notify).change(function () {
    check_notify(end_date_id, attr_id_notify)
  })

  $('#start_date').change(function () {
    var start = $(start_date_id).val();
    check_status(start, "#status")
  })

  $("#schedule_table").dataTable({
    columnDefs: [
      { "orderable": false, "orderSequence": ["desc", "asc"], "targets": 0 },
    ],
    bDestroy: true,
    stripeClasses: ["even", "odd"],
    pagingType: "full_numbers",
    fnDrawCallback: function()
    {
      on_click_btn();
      check_selectAll();
    },
    iDisplayLength: 20,
    bProcessing: true,
    bServerSide: true,
    sAjaxSource: "schedule_data/",
    

  })

  $("#schedule_table_length").remove();
  add_button = $("#add_schedule_button").detach();
  delete_button = $("#delete_schedule_button").detach();
  add_button.insertAfter("#schedule_table_filter");
  delete_button.insertAfter("#schedule_table_filter");
  
  $("#schedule_hr_parent").on("change", function()
  {    
    var hr_schedule_id = $("#schedule_hr_parent").val();
    if (hr_schedule_id == "") return;

    $.ajax({
      url: "/schedules/get_schedule_hr_info/" + hr_schedule_id,
      type: "GET",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
      success: function (result) {
        $("#start_date").datepicker("setDate", result['start_date_hr']);
        $("#end_date").datepicker("setDate", result['end_date_hr']);
      }
    });
  });
});

function on_click_btn() {
  
  $(document).on("click", ".del_btn[enable='true']", function () {
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

        attr_end_date_member_id   = "#end_date_member_edit"
        attr_end_date_reviewer_id = "#end_date_reviewer_edit"


        datepicker_setup([attr_start_date_id, attr_end_date_id, attr_end_date_member_id, attr_end_date_reviewer_id], [attr_from_date, attr_to_date]);
        change_status(attr_start_date_id, attr_status);
        change_notify(attr_end_date_id, attr_id_notify);
        action_edit();
      }
    });
  });
  $(document).on("click", ".edit_btn[enable='true']", function () {
  
    var schedule_param = $(this).data('schedule');
    $.ajax({
      url: "/schedules/" + schedule_param + "/edit_page",
      type: "GET",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
      success: function () {
        attr_start_date_id = "#start_date_edit";
        if ($("#user_role").val() == "HR")
          attr_end_date_id = "#end_date_edit";
        else if  ($("#user_role").val() == "PM")
          attr_end_date_id = "";
        
        attr_from_date = "#from_date_edit";
        attr_to_date = "#to_date_edit";
        attr_id_notify = "#notify_hr_edit";
        attr_status = "#status_id";
        attr_end_date_member_id   = "#end_date_member_edit";
        attr_end_date_reviewer_id = "#end_date_reviewer_edit";

        datepicker_setup([attr_start_date_id, attr_end_date_id, attr_end_date_member_id, attr_end_date_reviewer_id], [attr_from_date, attr_to_date]);
        change_status(attr_start_date_id, attr_status);
        change_notify(attr_end_date_id, attr_id_notify);
        action_edit();
      }
    });
  
  });

    
  $("#selectAll").off("click.select_all_check");
  
  $("#selectAll").on("click.select_all_check", function () {
    $("tbody > tr > td > input[type=checkbox]").prop(
        "checked",
        $(this).prop("checked")     
      )      
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
        view_schedule();
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
    user_role = $('#user_role').val();
    schedule_name = $('#desc').val();
    company = $("#company").val();
    start_date = $("#start_date").val();
    end_date = $("#end_date").val();
    from_date = $("#from_date").val();
    to_date = $("#to_date").val();
    notify_date = $("#notify_date").val();
    notify_hr = $('#notify_hr').val();
    notify_member = $('#notify_member').val();
    status_hr = $('#status').val();
    end_date_member = $("#end_date_member").val();
    end_date_reviewer = $("#end_date_reviewer").val();
    schedule_hr_parent = $("#schedule_hr_parent").val()
    project = $("#project").val();
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

    if (user_role == "PM")
    {
      if (Date.parse(end_date_member) < Date.parse(start_date))
      {
        temp = false;
        $(end_date_member_id).after('<span class="error">Start date must be lower than End date for member.</span>');
      }
      else if (Date.parse(end_date_member) > Date.parse(end_date))
      {
        temp = false;
        $(end_date_member_id).after('<span class="error">End date for member must be lower than End date .</span>');
      }
      else if (end_date_member == "")
      {
        temp = false;
        $(end_date_member_id).after('<div class="offset-sm-12 col-sm-12"><span class="error">Please enter end date for member.</span></div>')
      }


      if (Date.parse(end_date_reviewer) < Date.parse(start_date))
      {
        temp = false;
        $(end_date_reviewer_id).after('<span class="error">Start date must be lower than End date for reviewer.</span>');
      }
      else if (Date.parse(end_date_reviewer) < Date.parse(end_date_member))
      {
        temp = false;
        $(end_date_reviewer_id).after('<span class="error">End date of Member must be lower than End date for reviewer.</span>')
      }
      else if (Date.parse(end_date_reviewer) > Date.parse(end_date))
      {
        temp = false;
        $(end_date_reviewer_id).after('<span class="error">End date for reviewer must be lower than End date.</span>')
      }
      else if (end_date_reviewer == "")
      {
        temp = false;
        $(end_date_reviewer_id).after('<div class="offset-sm-12 col-sm-12"><span class="error">Please enter end date for previewer.</span></div>')
      }
      
      
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
      if (user_role == "HR")
      {
        params = {from_date: from_date,
                  to_date: to_date,
                  user_id: user_id,
                  desc: schedule_name,
                  company_id: company,
                  start_date: start_date,
                  end_date_hr: end_date,
                  notify_hr: notify_hr,
                  status: status_hr}
      }
      else if (user_role == "PM")
      {
        params = {desc: schedule_name,
                  company_id: company, 
                  project_id: project,
                  end_date_member: end_date_member,
                  end_date_revACiewer: end_date_reviewer,
                  notify_member: notify_member,
                  start_date: start_date,
                  end_date_hr: end_date,
                  user_id: user_id,     
                  schedule_hr_parent: schedule_hr_parent,             
                  status: status_hr
                  }
      }
      $.ajax({
        url: "/schedules",
        type: "POST",
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
        },
        data: params,
        success: function (res) {
          $('.lmask').hide();
          $('#form_add_hr')[0].reset();
          reset_datepicker(["#end_date","#start_date","#to_date","#from_date", "#end_date_member", "#end_date_reviewer"]);
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

    end_date_member   = $("#end_date_member_edit").val();
    end_date_reviewer = $("#end_date_reviewer_edit").val();
    notify_member     = $("#notify_member_edit").val();
    user_role = $("#user_role").val();
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
      if (user_role == "HR")
      {
        input_data = {
        desc: schedule_name,
        end_date_hr: end_date,
        notify_hr: notify_hr,          
        };
      }
      else if (user_role == "PM")
      {
          input_data = {
          end_date_member: end_date_member,
          end_date_reviewer: end_date_reviewer,
          notify_member: notify_member,          
          };
      }
      $.ajax({
        url: "/schedules/" + id_schedule,
        type: "PUT",
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
        },
        data: input_data,
        success: (res) => {
          $('.lmask').hide();
          //$('#form_edit_hr')[0].reset();
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
  $(".selectable").off('click.select_one_namespace')
  $(".selectable").on('click.select_one_namespace', function () {
    if ($(':checkbox:checked').length > 0) {
      $('#delete_schedule_button').prop("disabled", false);
    }
    else {
      $('#delete_schedule_button').prop("disabled", true);
    }

    if($('.table tbody :checkbox:not(:checked)').length == 0 ){
      $('#selectAll').prop('checked', true);
    }
    else
    {
      $('#selectAll').prop('checked', false);
    }
  })
  $("#selectAll").off('click.select_all_namespace_delete');
  $('#selectAll').on('click.select_all_namespace_delete', function () {
    if ($('#selectAll').is(':checked')) {
      $('#delete_schedule_button').prop("disabled", false);
    }
    else {
      $('#delete_schedule_button').prop("disabled", true);
    }
  })



  if ($('.table tbody :checkbox').length == 0) {
    $('#selectAll').prop("disabled", true);
  }
  if ($('.table tbody :checkbox').length != 0) {
    $('#selectAll').prop("disabled", false);
  }
}
