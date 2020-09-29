// check status when enter start date and end date
function check_status(start, end, status_id) {
  start = Date.parse(start);
  end = Date.parse(end);
  let toDay = new Date()
  toDay = toDay.setHours(0, 0, 0, 0);
  if (start <= toDay && end >= toDay) {
    $(status_id).val("In-progress");
  }
  if (start > toDay) {
    $(status_id).val("New");
  }
  if (toDay > end) {
    $(status_id).val("Done");
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
      $(notify).closest('div').children('em').after('<br><span class="error error' + "_" + notify.split("#")[1] + '">Notice date must be greater than current date.</span>')
    } else {
      $(this).html('Notice date must be greater than current date.')
    }
  }
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

  $("#modalAdd").on("hide.bs.modal", function () {
    $(".error").html('');
  });

  $("#modalAdd").on("shown.bs.modal", function () {
    var user_id = $("#user").val();

    $('select[name=company] option:eq(1)').attr('selected', 'selected');
    //$('select[name=company]').attr("disabled", "true");

  });
  $("#add_schedule_button").on("click", function () {
    $.ajax({
      url: "/schedules/add_page/",
      type: "GET",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      success: function (res) {
        tpl = '<option value="">Please select a Company</option>'
        for (var i = 0; i < res.length; i++) {
          tpl += `<option value="${res[i][1]}">${res[i][0]}</option>`
        }
        $("#company").html(tpl);
      }
    });
    $("#schedule_task").val("add");
    $("#modalAdd .modal-title").html("Add a New Schedule");

    $('#desc').val('');
    $("#project").val('');
    $("#start_date").val('');
    $("#end_date").val('');
    $("#from_date").val('');
    $("#to_date").val('');
    $("#notify_date").val('1');
    $('#notify_hr').val('1');
    $('#notify_member').val('1');
    $('#status').val('');
    $("#end_date_member").val('');
    $("#end_date_reviewer").val('');
    $("#schedule_hr_parent").val('');

    user_role = $("#user_role").val()

    if (user_role == "HR") {
      // reenable disable field      
      $("#from_date").removeAttr("disabled");
      $("#to_date").removeAttr("disabled");
      $("#start_date").removeAttr("disabled");
      $('select[name=company]').removeAttr("disabled");
      datepicker_setup(["#end_date"], ["#from_date", "#to_date"]);
    } else if (user_role == "PM") {
      $("#schedule_hr_parent").removeAttr("disabled");
      $("#project").removeAttr("disabled");
      $("#start_date").attr("disabled", "false");
      $("#end_date").attr("disabled", "false");
      $("#desc").removeAttr("disabled");
      datepicker_setup(["#end_date_member", "#end_date_reviewer"], []);
    }
  })

  check_selectAll();
  action_add();
  view_schedule();


  $('#end_date').change(function () {
    var start = $(start_date_id).val();
    var end = $(end_date_id).val();
    check_status(start, end, "#status")
  })

  $("#schedule_table").dataTable({
    columnDefs: [{
      "orderable": false,
      "targets": 0
    },
    {
      "orderable": false,
      "targets": 1
    },
    {
      "orderable": true,
      "targets": 2
    },
    {
      "orderable": true,
      "targets": 3
    },
    {
      "orderable": false,
      "targets": 4
    },
    {
      "orderable": false,
      "targets": 5
    },
    {
      "orderable": false,
      "targets": 6
    },
    {
      "orderable": false,
      "targets": 7
    },
    {
      "orderable": false,
      "targets": 8
    },
    ],
    bDestroy: true,
    asStripeClasses: ["even", "odd"],
    pagingType: "full_numbers",
    fnDrawCallback: function () {
      //$("#schedule_table thead th").removeClass("sorting_asc");
      //$("#schedule_table thead th").removeClass("sorting_desc");
      //$("#schedule_table thead th").addClass("sorting_disabled");
      on_click_btn();
      check_selectAll();
    },
    iDisplayLength: 20,
    bProcessing: true,
    bServerSide: true,
    sAjaxSource: "schedule_data/",


  })

  $('input[aria-controls="schedule_table"]').attr("placeholder", "Search by Schedule Name, Company Name")
  $('input[aria-controls="schedule_table"]').attr('size', 32);

  $("#schedule_table_length").remove();
  add_button = $("#add_schedule_button").detach();
  delete_button = $("#delete_schedule_button").detach();
  add_button.insertAfter("#schedule_table_filter");
  delete_button.insertAfter("#schedule_table_filter");

  $("#schedule_hr_parent").on("change", function () {
    var hr_schedule_id = $("#schedule_hr_parent").val();
    if (hr_schedule_id == "") return;

    $.ajax({
      url: "/schedules/get_schedule_hr_info/" + hr_schedule_id,
      type: "GET",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      success: function (result) {
        var start_date = new Date(Date.parse(result['start_date_hr']));
        var end_date = new Date(Date.parse(result['end_date_hr']));
        $("#start_date").datepicker('destroy');
        $("#start_date").datepicker({
          todayBtn: "linked",
          todayHighlight: true,
          startDate: start_date,
          autoclose: true,
          format: "M dd, yyyy"
        });

        $("#end_date").datepicker('destroy');
        $("#end_date").datepicker({
          todayBtn: "linked",
          todayHighlight: true,
          startDate: start_date,
          autoclose: true,
          format: "M dd, yyyy"
        });

        $("#start_date").datepicker("setDate", start_date);
        $("#end_date").datepicker("setDate", end_date);

        var start = $(start_date_id).val();
        var end = $(end_date_id).val();

        check_status(start, end, "#status")
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
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      success: function (res) {
        $("#schedule_id").val(res.id);
        $('#modalDeleteSchedule').modal('show');
        attr_start_date_id = "#start_date_edit";
        attr_end_date_id = "#end_date_edit";
        attr_from_date = "#from_date_edit";
        attr_to_date = "#to_date_edit";
        attr_id_notify = "#notify_hr_edit";
        attr_status = "#status_id"

        attr_end_date_member_id = "#end_date_member_edit"
        attr_end_date_reviewer_id = "#end_date_reviewer_edit"

        datepicker_setup([attr_start_date_id, attr_end_date_id, attr_end_date_member_id, attr_end_date_reviewer_id], [attr_from_date, attr_to_date]);
      }
    });
  });

  $(document).on("click", ".edit_btn[enable='true']", function () {
    var schedule_param = $(this).data('schedule');
    $.ajax({
      url: "/schedules/" + schedule_param + "/edit_page",
      type: "GET",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      success: function (result) {
        $("#modalAdd").modal("show");
        var user_role = $("#user_role").val();

        $("#schedule_task").val("edit");

        $('#schedule_id').val(result.schedule_id);
        var user_role = $('#user_role').val();
        $("#modalAdd .modal-title").html("Edit Schedule");
        $("#desc").val(result.schedule_name);

        var start_date = new Date(Date.parse(result.start_date));
        var end_date = new Date(Date.parse(result.end_date_hr));

        var end_date_employee = new Date(Date.parse(result.end_date_employee));
        var end_date_reviewer = new Date(Date.parse(result.end_date_reviewer));

        $(start_date_id).datepicker('destroy');
        $(start_date_id).datepicker({
          todayBtn: "linked",
          todayHighlight: true,
          startDate: start_date,
          autoclose: true,
          format: "M dd, yyyy"
        });

        $(end_date_id).datepicker('destroy');
        $(end_date_id).datepicker({
          todayBtn: "linked",
          todayHighlight: true,
          startDate: start_date,
          autoclose: true,
          format: "M dd, yyyy"
        });

        if (user_role == "PM") {
          $(end_date_reviewer_id).datepicker('destroy');
          $(end_date_reviewer_id).datepicker({
            todayBtn: "linked",
            todayHighlight: true,
            startDate: start_date,
            autoclose: true,
            format: "M dd, yyyy"
          });

          $(end_date_member_id).datepicker('destroy');
          $(end_date_member_id).datepicker({
            todayBtn: "linked",
            todayHighlight: true,
            startDate: start_date,
            autoclose: true,
            format: "M dd, yyyy"
          });
          $("#end_date_member").datepicker("setDate", end_date_employee);
          $("#end_date_reviewer").datepicker("setDate", end_date_reviewer);
        } else if (user_role == "HR") {
          var notify_hr = result.notify_hr;
          var assessment_period_from_date = new Date(Date.parse(result.assessment_period_from_date));
          var assessment_period_to_date = new Date(Date.parse(result.assessment_period_to_date));

          $("#notify_hr").val(notify_hr);

          $("#from_date").datepicker("setDate", assessment_period_from_date);
          $("#to_date").datepicker("setDate", assessment_period_to_date);

          // disable field
          $("#company").attr("disabled", "disabled");
          $("#from_date").attr("disabled", "disabled");
          $("#to_date").attr("disabled", "disabled");
          $("#start_date").attr("disabled", "disabled");
        }
        $("#start_date").datepicker("setDate", start_date);
        $("#end_date").datepicker("setDate", end_date);


        $("select[name=company]").html(
          `<option value="">Please select a Company</option>
          <option value="{company_id}" selected="selected">{company_name}</option>
          `.formatUnicorn({ company_id: result.company_id, company_name: result.company_name }))


        $("select[name=project]").html(
          `<option value="">Please select a Project</option>
          <option value="{project_id}" selected="selected">{project_name}</option>
          `.formatUnicorn({ project_id: result.project_id, project_name: result.project_name }))
        $("select[name=schedule_hr_parent]").html(
          `<option value="">Please select an Assessment Period</option>
          <option value="{period_id}" selected="selected"">{assessment_period}</option>
          `.formatUnicorn({ period_id: result.period_id, assessment_period: result.assessment_period }))

        $("#notify_member").val(result.notify_employee);
        $("#status").val(result.status);

        attr_start_date_id = "#start_date";
        attr_end_date_id = "#end_date";

        attr_from_date = "#from_date";
        attr_to_date = "#to_date";
        attr_id_notify = "#notify_hr";
        attr_status = "#status_id";
        attr_end_date_member_id = "#end_date_member";
        attr_end_date_reviewer_id = "#end_date_reviewer";

        if (user_role == "HR") {
          $("#end_date").removeAttr("disabled");;
        } else if (user_role == "PM") {
          $("#start_date").attr("disabled", "true");
          $("#end_date").attr("disabled", "true");
          $("#schedule_hr_parent").attr("disabled", "true");
          $("#project").attr("disabled", "true");
          $("#company").attr("disabled", "true");
          $("#desc").attr("disabled", "true");

        }
        datepicker_setup([attr_start_date_id, attr_end_date_id, attr_end_date_member_id, attr_end_date_reviewer_id], [attr_from_date, attr_to_date]);
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
    $("#modalDeleteS").modal("hide");

    var schedule_ids = new Array();
    $.each($("input[name='checkbox']:checked"), function () {
      schedule_ids.push($(this).val());
    });
    $('.lmask').show();
    $.ajax({
      url: "/schedules/destroy_multiple/",
      method: "DELETE",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      data: {
        schedule_ids: schedule_ids,
      },
      success: function (res) {
        $('.lmask').hide();
        check_selectAll();
        // Do something with the result
        view_schedule();

        var status = res.status;
        if (status == true) {
          $("#modal").modal("hide");
          warning("The schedule(s) has been deleted successfully");
        } else {
          fails("Failed to delete all schedule(s)");
        }
      }
    });
  });
}


// btn datepicker form add
function datepicker_setup(arr_date, period_date) {
  var toDay = new Date();
  toDay.setDate(toDay.getDate())

  var user_role = $("#user_role").val();

  from_date = "#from_date"
  to_date = "#to_date"
  $('#end_date_member, #end_date_reviewer').datepicker({
    todayBtn: "linked",
    todayHighlight: true,
    autoclose: true,
    format: "M dd, yyyy"
  });

  for (i = 0; i <= arr_date.length; i++) {
    if (user_role == "HR") {
      $(arr_date[i]).datepicker({
        todayBtn: "linked",
        todayHighlight: true,
        autoclose: true,
        format: "M dd, yyyy"
      });
    } else if (user_role == "PM") {
      $(arr_date[i]).datepicker({
        todayBtn: "linked",
        todayHighlight: true,
        autoclose: true,
        format: "M dd, yyyy"
      });
    }
  }

  if ($("#schedule_task").val() == "edit") {
    for (i = 0; i <= period_date.length; i++) {
      $(period_date[i]).datepicker('destroy');
      $(period_date[i]).datepicker({
        todayBtn: "linked",
        todayHighlight: true,
        autoclose: true,
        format: "M dd, yyyy"
      })
    }
  }
  else {
    for (i = 0; i <= period_date.length; i++) {
      $(period_date[i]).datepicker('destroy');
      $(period_date[i]).datepicker({
        todayBtn: "linked",
        todayHighlight: true,
        autoclose: true,
        format: "M dd, yyyy"
      })
    }
  }
}

// btn add new schedule of HR 
function action_add() {
  $("[type='number']").keypress(function (evt) {
    evt.preventDefault();
  });

  $("#btn_modal_add_hr").off('click').on("click", function () {
    var user_id = $('#user').val();
    var period_id = $('#schedule_hr_parent').val();
    var project_id = $("#project").val();
    var user_role = $('#user_role').val();
    var schedule_name = $('#desc').val();
    var company = $("#company").val();
    var start_date = $("#start_date").val();
    var end_date = $("#end_date").val();
    var from_date = $("#from_date").val();
    var to_date = $("#to_date").val();
    var notify_hr = $('#notify_hr').val();
    var notify_member = $('#notify_member').val();
    var status_hr = $('#status').val();
    var end_date_member = $("#end_date_member").val();
    var end_date_reviewer = $("#end_date_reviewer").val();
    var schedule_hr_parent = $("#schedule_hr_parent").val()
    var project = $("#project").val();
    var schedule_task = $("#schedule_task").val();
    var temp = true;
    $(".error").parent().remove();

    // define date with moment
    var mm_start_date = moment(start_date);
    var mm_end_date = moment(end_date);
    var mm_from_date = moment(from_date);
    var mm_to_date = moment(to_date);
    var mm_end_date_member = moment(end_date_member);
    var mm_end_date_reviewer = moment(end_date_reviewer);

    if (user_role == "PM") {
      if (!project_id) {
        temp = false;
        $('#project').after('<div class="offset-sm-12"><span class="error">Please select a Project.</span></div>');
      }

      if (!period_id) {
        temp = false;
        $('#schedule_hr_parent').after('<div class="offset-sm-12"><span class="error">Please select an Assessment Period.</span></div>');
      }

      if (notify_member < 0 || mm_end_date_member.diff(mm_start_date, 'days') < parseInt(notify_member) || mm_end_date_reviewer.diff(mm_start_date, 'days') < parseInt(notify_member)) {
        temp = false;
        $('#notify_member').closest('div').children('em').after(`<div class="offset-sm-12">
          <span class="error">
            Reminder of Member must be greater than Start Date HR and Current Date but lesser than End Date Member.
          </span>
          <br>
          <span class="error">
            Reminder of Reviewer must be greater than End Date Member and Current Date but lesser than End Date Reviewer.
          </span>
        </div>`);
      }

      if (notify_member == "") {
        temp = false;
        $('#notify_member').closest('div').children('em').after('<div class="offset-sm-12"><span class="error">Please enter Reminder.</span></div>')
      }

      if (mm_start_date.diff(mm_end_date_member, 'days') >= 0) {
        temp = false;
        $(end_date_member_id).after('<div class="offset-sm-12"><span class="error">End Date Member must be greater than start date.</span></div>');
      } else if (Date.parse(end_date_member) > Date.parse(end_date)) {
        temp = false;
        $(end_date_member_id).after('<div class="offset-sm-12"><span class="error">End Date Member must be less than End Date HR.</span></div>');
      } else if (end_date_member == "") {
        temp = false;
        $(end_date_member_id).after('<div class="offset-sm-12"><span class="error">Please enter End Date Member.</span></div>')
      }

      if (Date.parse(end_date_reviewer) < Date.parse(start_date)) {
        temp = false;
        $(end_date_reviewer_id).after('<div class="offset-sm-12"><span class="error">Start Date must be less than End Date Reviewer.</span></div>');
      } else if (Date.parse(end_date_reviewer) < Date.parse(end_date_member)) {
        temp = false;
        $(end_date_reviewer_id).after('<div class="offset-sm-12"><span class="error">End Date Member must be less than End Date Reviewer.</span></div>')
      } else if (Date.parse(end_date_reviewer) > Date.parse(end_date)) {
        temp = false;
        $(end_date_reviewer_id).after('<div class="offset-sm-12"><span class="error">End Date Reviewer must be less than End Date HR.</span></div>')
      } else if (end_date_reviewer == "") {
        temp = false;
        $(end_date_reviewer_id).after('<div class="offset-sm-12"><span class="error">Please enter End Date Reviewer.</span></div>')
      }
    }
    else {
      if (!from_date) {
        temp = false;
        $('#from_date').after('<div class="offset-sm-6"><span class="error">Please enter From Date.</span></div>')
      }

      if (!to_date) {
        temp = false;
        $('#to_date').after('<div class="offset-sm-6"><span class="error">Please enter To Date.</span></div>')
      }
      if (!start_date) {
        temp = false;
        $('#start_date').after('<div class="offset-sm-12"><span class="error">Please enter Start Date.</span></div>')
      }

      if (!end_date) {
        temp = false;
        $('#end_date').after('<div class="offset-sm-12"><span class="error">Please enter End Date.</span></div>')
      }

      if (mm_start_date.diff(mm_end_date, 'days') > 0) {
        temp = false;
        $('#end_date').after('<div class="offset-sm-12"><span class="error">End Date must be greater than Start Date.</span></div>')
      }

      if (mm_from_date.diff(mm_to_date, 'days') > 0) {
        temp = false;
        $('#to_date').after('<div class="offset-sm-12"><span class="error">Period end date must be greater than Period start date.</span></div>')
      }

      if (notify_hr == '') {
        temp = false;
        $('#notify_hr').closest('div').children('em').after('<div class="offset-sm-12"><span class="error">Please enter Reminder.</span></div>')
      }

      if (notify_hr < 0 || mm_end_date.diff(mm_start_date, 'days') < parseInt(notify_hr)) {
        temp = false;
        $('#notify_hr').closest('div').children('em').after('<div class="offset-sm-12"><span class="error">Reminder does not exceed date range from Start Date to End Date.</span></div>')
      }
    }

    if (!schedule_name) {
      temp = false;
      $('#desc').after('<div class="offset-sm-12"><span class="error">Please enter Schedule Name.</span></div>')
    }

    if (!company) {
      temp = false;
      $('#company').after('<div class="offset-sm-12"><span class="error">Please select a Company.</span></div>')
    }

    if (temp == true) {
      $('.lmask').show();
      if (schedule_task == "add") {
        if (user_role == "HR") {
          params = {
            from_date: from_date,
            to_date: to_date,
            user_id: user_id,
            desc: schedule_name,
            company_id: company,
            start_date: start_date,
            end_date_hr: end_date,
            notify_hr: notify_hr,
            status: status_hr
          }
        } else if (user_role == "PM") {
          params = {
            desc: schedule_name,
            company_id: company,
            project_id: project,
            end_date_member: end_date_member,
            end_date_reviewer: end_date_reviewer,
            notify_member: notify_member,
            start_date: start_date,
            end_date_hr: end_date,
            user_id: user_id,
            schedule_hr_parent: schedule_hr_parent,
            status: status_hr
          }

        }

        $.ajax({
          url: "/schedules/",
          type: "POST",
          headers: {
            "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
          },
          data: params,
          success: function (res) {
            $('.lmask').hide();
            $('#form_add_hr')[0].reset();
            reset_datepicker(["#end_date", "#start_date", "#to_date", "#from_date", "#end_date_member", "#end_date_reviewer"]);
            check_selectAll();
            action_add();
            view_schedule();
            var status = res.status;
            if (status == true) {
              $("#modalAdd").modal("hide");
              warning("The schedule has been created successfully");
            } else {
              fails("Failed to create this schedule");
            }
          },
          error: function () {
            $('.lmask').hide();
            check_selectAll();
            action_add();
            view_schedule();
          }
        });
      } else if (schedule_task == "edit") {
        id_schedule = $('#schedule_id').val();

        if (user_role == "HR") {
          params = {
            desc: schedule_name,
            end_date_hr: end_date,
            notify_hr: notify_hr,
          };
        } else if (user_role == "PM") {
          params = {
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
          data: params,
          success: (res) => {
            $('.lmask').hide();
            //$('#form_edit_hr')[0].reset();
            check_selectAll();
            action_add();
            view_schedule();
            if (res.status == true) {
              $("#modal").modal("hide");
              warning("The schedule has been edited successfully");
            } else {
              fails("Failed to edit this schedule");
            }
          },
          error: function () {
            $('.lmask').hide();
            check_selectAll();
            action_add();
            view_schedule();
          }
        });
      }

      $("#modalAdd").modal('hide');
    }
  });

  $('select[name=company] option:eq(1)').attr('selected', 'selected');
  $('select[name=company]').attr("disabled", "true");
}

function delete_schedule() {
  var id = $("#schedule_id").val();
  $('.lmask').show();
  $.ajax({
    url: "/schedules/" + id,
    method: "DELETE",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    beforeSend: function () { },
    success: function (res) {
      $('.lmask').hide();
      check_selectAll();
      view_schedule();
      var status = res.status;
      if (status == true) {
        $("#modalDeleteSchedule").modal("hide");
        warning("The schedule(s) has been deleted successfully");
      } else {
        fails("Failed to delete all schedule(s)");
      }
    },
  });
}

function check_selectAll() {
  $(".selectable").off('click.select_one_namespace')
  $(".selectable").on('click.select_one_namespace', function () {
    if ($('.selectable:checked').length > 0) {
      $('#delete_schedule_button').prop("disabled", false);
    } else {
      $('#delete_schedule_button').prop("disabled", true);
    }

    if ($('.table tbody :checkbox:not(:checked)').length == 0) {
      $('#selectAll').prop('checked', true);
    } else {
      $('#selectAll').prop('checked', false);
    }
  })
  $("#selectAll").off('click.select_all_namespace_delete')
  $('#selectAll').on('click.select_all_namespace_delete', function () {
    if ($('#selectAll').is(':checked')) {
      $('#delete_schedule_button').prop("disabled", false);
    } else {
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