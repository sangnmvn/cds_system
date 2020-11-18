// Set can't have duplicates
// contains form slot id has been selected
var checked_set = new Set();
var data_checked_request = {}
var slot_assessing = {}
// contains form slot empty to be checked
// key: form slot id
// value: true or false, is message empty
var checked_set_is_empty_comment = {};

function refreshCheckbox() {
  if (!(is_reviewer || is_approver)) {
    return;
  }
  initCheckbox();
  $(".cdp-slot-wrapper .request-update-checkbox").each(function () {
    var form_slot_id = $(this).data("form-slot-id");
    if (checked_set.has(form_slot_id)) {
      $(this).prop("checked", true);
    } else {
      $(this).prop("checked", false);
    }
  });
}

function initCheckbox() {
  $(".cdp-slot-wrapper").each(function () {
    var form_slot_id = $(this).data("form-slot-id");
    var description_slot = $(this).find(".description-slot");
    var html_segment = `<input type='checkbox' data-form-slot-id='${form_slot_id}' data-slot-id='${form_slot_id}' class='request-update-checkbox'>`;
    description_slot.before(html_segment);
    $(".request-update-checkbox").change(function (e) {
      var chkbox_form_slot_id = $(this).data("form-slot-id");
      var slot_wrapper = $(this).closest(".cdp-slot-wrapper")
      if ($(this).is(":checked")) {
        var competency_name = $('#competency_panel').find('.show').data('competency-name');
        var slot_id = slot_wrapper.data("location");
        checked_set.add(chkbox_form_slot_id);
        if (data_checked_request[competency_name] == undefined)
          data_checked_request[competency_name] = []
        if (!data_checked_request[competency_name].includes(slot_id))
          data_checked_request[competency_name].push(slot_id);
        if (is_reviewer) {
          let check = slot_wrapper.find("textarea.reviewer-self").val().length == 0;
          if (slot_wrapper.find('.reviewer-commit').val() == 'commit_cds')
            check = slot_wrapper.find('.reviewer-assessment').val() == null;
          checked_set_is_empty_comment[chkbox_form_slot_id] = check;
        }
        if (is_approver) {
          let check = slot_wrapper.find("textarea.approver-self").val().length == 0;
          if (slot_wrapper.find('.approver-commit').val() == 'commit_cds')
            check = slot_wrapper.find('.approver-assessment').val() == null;
          checked_set_is_empty_comment[chkbox_form_slot_id] = check;
        }
        if (slot_wrapper.find(".icon-flag").css('color') == "rgb(255, 165, 0)") {
          $("#button_cancel_request").removeClass("disabled");
          $("#icon_cancel_request").prop("style", "color:green");
        } else {
          $("#button_request_update").removeClass("disabled");
          $("#icon_request_update").prop("style", "color:green");
        }
      } else {
        var competency_name = $('#competency_panel').find('.show').data('competency-name');
        var slot_id = slot_wrapper.data("location");
        checked_set.delete(chkbox_form_slot_id);
        delete checked_set_is_empty_comment[chkbox_form_slot_id];
        var index = data_checked_request[competency_name].indexOf(slot_id);
        if (index !== -1)
          data_checked_request[competency_name].splice(index, 1);
        if (checked_set.size == 0) {
          $("#button_request_update").addClass("disabled");
          $("#icon_request_update").prop("style", "color: #6c757d")
          $("#button_cancel_request").addClass("disabled");
          $("#icon_cancel_request").prop("style", "color: #6c757d");
        }
      }
    });

    // make collapse
    var original_toggle = $(this).find(".div-slot:nth-child(1)").data("toggle");
    var original_target = $(this).find(".div-slot:nth-child(1)").data("target");
    $(this).find(".div-slot:nth-child(1) b").after("<span></span>")
    $(this).find(".div-slot:nth-child(1)").removeAttr("data-toggle");
    $(this).find(".div-slot:nth-child(1)").removeAttr("data-target");
    $(this).find(".div-slot:nth-child(1) :not(input)").attr("data-toggle", original_toggle);
    $(this).find(".div-slot:nth-child(1) :not(input)").attr("data-target", original_target);
  });
}

function toggleInput(enable) {
  if (enable) {
    $(".reviewer-self").removeAttr("disabled");
    $(".approver-self").removeAttr("disabled");
  } else {
    $(".reviewer-self").attr("disabled", 'true');
    $(".approver-self").attr("disabled", 'true');
  }
}

function loadDataSlots(response) {
  var temp = "";
  $(response).each(function (i, e) {
    length = e.tracking.recommends == undefined ? 0 : e.tracking.recommends.length;
    flag = ""
    title_flag = ""
    for (var i = 0; i < length; i++) {
      if (e.tracking.flag == "orange") {
        flag = "orange";
        title_flag = "This slot needs an update."
        break
      } else if (e.tracking.flag == "yellow") {
        if (e.tracking.recommends[i].flag == "#99FF33") {
          if (e.tracking.recommends[i].user_id == user_current) {
            flag = e.tracking.recommends[i].flag;
            title_flag = "This slot have been updated."
            check_request_update = true
            break;
          }
        } else {
          flag = "yellow"
          title_flag = "This slot has been updated."
          check_request_update = false
        }
        if (!is_reviewer && !is_approver) {
          check_request_update = true
        }
      }
    }
    if (status == "New" || !check_request_update) {
      $("#confirm_request").addClass("disabled")
      $("#icon_confirm_request").prop("style", "color: #6c757d")
      $("#icon_cancel_request").prop("style", "color: #6c757d")
    }
    lst_slot[e.id] = flag
    temp += `<div id="${e.id}" class="container-fluid cdp-slot-wrapper row-slot" data-location="${e.slot_id}" data-slot-id="${e.id}" data-form-slot-id="${e.tracking.id}">
    <div class="row">
      <div class="col-10 div-slot" data-toggle="collapse" data-target="#content_${e.id}">
        <i class="fas fa-caret-down icon"></i>&nbsp
        <b class="description-slot">${e.slot_id} - ${e.desc}</b>
      </div>
      <div class="col-2 div-slot div-icon">
        <a type='button' class='btn-action re-assessment' title="Re-assessment this slot" style="${checkPassSlot(e.tracking.is_passed, e.tracking.is_change)}"><i class="fas fa-marker icon-yellow"></i></a>
        <i class="fas ${chooseClassIconBatery(e.tracking.final_point, e.tracking.point)} ${checkColorbatery(e.tracking.is_passed, e.tracking.is_change)} icon-cdp" title="${checkTitleFlag(e.tracking.final_point, e.tracking.point)}" style="${checkPassSlot(e.tracking.is_commit, false, e.tracking.is_passed)}"></i>
        <a type='button' class='btn-action' title="View slot's history" id="btn_view_history"><i class="fas fa-history icon-yellow"></i></a>
        <a type='button' class='btn-action' style="${checkFlag(flag)}" title="${title_flag}"><i style="color: ${flag};" class="fas fa-flag icon-default icon-flag"></i></a>
      </div>
    </div>
    <div id="content_${e.id}" class="collapse padding-collapse content-staff" data-slot-id="${e.id}">
      <div class="row div-content">
        <div class="col-2">
          <b>Evidence Guideline:</b>
        </div>
        <div class="col-10">${e.evidence}</div>
      </div>
      <div class="row div-content">
          <div class="col-2">
            <b>Staff Commit (*):</b>
          </div>
          <div class="col-3">
            <select class="form-control input-staff staff-commit" data-slot-id="${e.tracking.id}" ${checkDisableFormSlotsReviewer(e.tracking)}>
              <option value="uncommit" ${checkCommmit(!e.tracking.is_commit)}> Un-commit </option>`
    if (check_5_month)
      temp += `<option value="commit_cds" ${checkCommmit(e.tracking.is_commit)}> Commit CDS</option>`
    temp += `<option value="commit_cdp" ${checkData(e.tracking.point, e.tracking.is_commit, "CDP")}> Commit CDP</option>
            </select>
          </div>
      </div>
      <div class="row div-content">
          <div class="col-2">
            <b class='title-point' style="${checkDataPoint(e.tracking.point)}">Self-Assessment (*):</b>
          </div>
          <div class="col-3">
            <select class="form-control input-staff select-assessment" ${checkDisableFormSlotsReviewer(e.tracking)} style="${checkDataPoint(e.tracking.point)}">
              <option disabled selected>Please select one </option>
              <option value="1" ${compare(e.tracking.point, 1)}> 1 - Does Not Meet Minimum Standards </option>
              <option value="2" ${compare(e.tracking.point, 2)}> 2 - Needs Improvement</option>
              <option value="3" ${compare(e.tracking.point, 3)}> 3 - Meets Expectations</option>
              <option value="4" ${compare(e.tracking.point, 4)}> 4 - Exceeds Expectations</option>
              <option value="5" ${compare(e.tracking.point, 5)}> 5 - Outstanding</option>
            </select>
          </div>
      </div>
      <div class="row div-content div-row">
        <div class="col-2">
          <b class='title-comment'>Staff Comment ${checkRequiredComment(e.tracking.point)}:</b>
        </div>
        <div class="col-8">
          <textarea placeholder="Comment is required if you commit CDS" class="form-control input-staff text-comment comment" ${checkDisableFormSlotsReviewer(e.tracking)}>${e.tracking.evidence}</textarea>
        </div>
      </div>`
    if (length > 0) {
      var lst_approver = []
      temp += `<div class="row div-row arrow-box row-cdp">
                  <div class="col-3 div-child-slot" data-toggle="collapse" data-target="#reviewer_${e.id}">
                    <i class="fas fa-caret-down"></i>
                    <b>Reviewer Feedbacks</b>
                  </div>
                </div>
                <div id="reviewer_${e.id}" class="collapse padding-collapse-children show">
                  <div class="row div-content">
                    <table class="table table-review" id="table-reviewer">`
      for (i = 0; i < length; i++) {
        if (e.tracking.recommends[i].is_pm) {
          lst_approver.push(e.tracking.recommends[i].user_id)
          lst_approver.push(e.tracking.recommends[i].given_point)
          lst_approver.push(e.tracking.recommends[i].name)
          lst_approver.push(e.tracking.recommends[i].recommends)
          lst_approver.push(e.tracking.recommends[i].is_commit)
        } else {
          temp += `<tr class="tr-reviewer">
                <td>${e.tracking.recommends[i].name}</td>
                <td>
                  <select class="form-control select-commit reviewer-commit ${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id) == "disabled" ? "" : "reviewer-self"}" ${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id)} ${e.tracking.comment_type == "CDS" ? "disabled" : ""}>
                  <option value="uncommit" ${checkCommmit(!e.tracking.recommends[i].is_commit)}> Un-commit </option>
                  <option value="commit_cds" ${e.tracking.comment_type == "CDS" ? "selected" : ""} ${checkData(e.tracking.recommends[i].given_point, e.tracking.recommends[i].is_commit, "CDS")}> Commit CDS</option>
                  <option value="commit_cdp" ${e.tracking.comment_type == "CDP" ? "selected" : ""} ${checkData(e.tracking.recommends[i].given_point, e.tracking.recommends[i].is_commit, "CDP")}> Commit CDP</option>
                  </select>
                </td>
                <td>
                  <select class="form-control select-commit reviewer-assessment ${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id) == "disabled" ? "" : "reviewer-self"} " ${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id)}>
                    <option disabled selected>Please select one </option>
                    <option value="1" ${compare(e.tracking.recommends[i].given_point, 1)}>1 - Does Not Meet Minimun Standards</option>
                    <option value="2" ${compare(e.tracking.recommends[i].given_point, 2)}>2 - Needs Improvement</option>
                    <option value="3" ${compare(e.tracking.recommends[i].given_point, 3)}>3 - Meets Expectations</option>
                    <option value="4" ${compare(e.tracking.recommends[i].given_point, 4)}>4 - Exceeds Expectations</option>
                    <option value="5" ${compare(e.tracking.recommends[i].given_point, 5)}>5 - Outstanding</option>
                  </select>
                </td>
                <td>
                  <textarea class="reviewer-recommend form-control ${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id) == 'disabled' ? '' : 'reviewer-self'}" placeholder="Comment is required if you commit CDS" class="form-control" ${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id)}>${e.tracking.recommends[i].recommends}</textarea>
                </td>
              </tr>`
        }
      }
      temp += `</table>
        </div>
      </div>`
      if (lst_approver.length > 0) {
        temp += `
          <div class="row div-row arrow-box row-cdp">
            <div class="col-3 div-child-slot" data-toggle="collapse" data-target="#approver_${e.id}">
              <i class="fas fa-caret-down"></i>
              <b>Approver Feedbacks</b>
            </div>
          </div>
          <div id="approver_${e.id}" class="collapse padding-collapse-children show">
            <div class="row div-content">
                <table class="table table-review" id="table-approver" >
                  <tr class='tr-approver'>
                    <td>${lst_approver[2]}</td>
                    <td>
                      <select class="form-control select-commit approver-commit ${checkDisableFormSlotsStaff(is_approver, lst_approver[0]) == "disabled" ? "" : "approver-self"}" ${checkDisableFormSlotsStaff(is_approver, lst_approver[0])} ${e.tracking.comment_type == "CDS" ? "disabled" : ""} >
                      <option value="uncommit" ${checkCommmit(!lst_approver[4])}> Un-commit </option>
                      <option value="commit_cds" ${e.tracking.comment_type == "CDS" && !lst_approver[4] ? "selected" : ""} ${checkData(lst_approver[1], lst_approver[4], "CDS")}> Commit CDS</option>
                      <option value="commit_cdp" ${e.tracking.comment_type == "CDP" && !lst_approver[4] ? "selected" : ""} ${checkData(lst_approver[1], lst_approver[4], "CDP")}> Commit CDP</option>
                      </select>
                    </td>
                    <td>
                      <select class="form-control select-commit approver-assessment ${checkDisableFormSlotsStaff(is_approver, lst_approver[0]) == "disabled" ? '' : 'approver-self'}" ${checkDisableFormSlotsStaff(is_approver, lst_approver[0])}>${lst_approver[3]}>
                        <option disabled selected>Please select one </option>  
                        <option value="1" ${compare(lst_approver[1], 1)}>1 - Does Not Meet Minimun Standards</option>
                        <option value="2" ${compare(lst_approver[1], 2)}>2 - Needs Improvement</option>
                        <option value="3" ${compare(lst_approver[1], 3)}>3 - Meets Expectations</option>
                        <option value="4" ${compare(lst_approver[1], 4)}>4 - Exceeds Expectations</option>
                        <option value="5" ${compare(lst_approver[1], 5)}>5 - Outstanding</option>
                      </select>
                    </td>
                    <td>
                      <textarea class="approver-recommend form-control ${checkDisableFormSlotsStaff(is_approver, lst_approver[0]) == "disabled" ? '' : 'approver-self'}" placeholder="Comment is required if you commit CDS" class="form-control" ${checkDisableFormSlotsStaff(is_approver, lst_approver[0])}>${lst_approver[3]}</textarea>
                    </td>
                  </tr>
                </table>
            </div>
          </div>
          </div>
        </div>`
      } else {
        temp += `</div></div></div>`
      }
    } else {
      temp += `</div></div></div>`
    }
  })
  $('#content_slot').html(temp);
  checkChangeSlot();
  // checkIsRequested();
  setTimeout(function(){ 
    if (is_submit && !is_flag_yellow) {
    toggleInput(false);
  } }, 3000);
}

function checkStatusFormStaff(status) {
  switch (status) {
    case "New":
      var temp = $(document).find(".input-staff")
      for (var i = 0; i < temp.length; i++) {
        temp[i].removeAttribute("disabled")
      }
      break;
    case "Done":
      break;
    case "Awaiting Review" || "Awaiting Approval":
      $(".input-staff").each(function (i, e) {
        // e.disabled = true
      })
      break;
  }
}

function compare(x, y) {
  if (x == y)
    return "selected"
  return ""
}

function checkDataPoint(point) {
  if (point == "")
    return "display:none"
  return ""
}

function checkPassSlot(is_passed, is_change, un_commit_but_passed) {
  if ((!is_change && is_passed)||un_commit_but_passed)
    return ""
  return "visibility: hidden"
}

function checkColorbatery(is_passed, is_change) {
  if (!is_change && is_passed)
    return "icon-green"
  return "icon-yellow"
}

function chooseClassIconBatery(final_point, point) {
  var final = final_point > 0 ? final_point : point
  if (final) {
    if (final > 2)
      return "fa-battery-full"
    return "fa-battery-half"
  }
  return "fa-battery-empty"
}

function checkTitleFlag(final_point, point) {
  var final = final_point > 0 ? final_point : point
  if (final) {
    if (final > 2)
      return "This slot is passed in CDS assessment"
    return "This slot is failed in CDS assessment"
  }
  return "This slot is planned in CDP"
}

function checkFlag(flag) {
  if (flag == "")
    return "display:none"
  return ""
}

function changeListSlotAssessing(row, action) {
  var competency_name = $('#competency_panel').find('.show').data('competency-name');
  if (action == "add") {
    if (slot_assessing[competency_name] == undefined)
      slot_assessing[competency_name] = []
    slot_assessing[competency_name].push(row.data("location"))
  } else {
    if (slot_assessing[competency_name] != undefined)
      slot_assessing[competency_name] = slot_assessing[competency_name].filter(item => item !== row.data("location"))
  }
}

function checkRequiredComment(point) {
  if (point == "")
    return ""
  return "(*)"
}

function checkData(point, is_commit, type) {
  if (point < 1 && is_commit == true && type == "CDP")
    return "selected"
  else if (point >= 1 && is_commit == true && type == "CDS")
    return "selected"
  return ""
}

function checkCommmit(is_commit) {
  if (is_commit)
    return "selected"
  return ""
}

function checkDisableFormSlotsStaff(is_reviewer, user_id) {
  if (!is_reviewer || user_id != user_current)
    return "disabled"
  return ""
}

function checkDisableFormSlotsReviewer(tracking) {
  if ((is_reviewer || is_approver || (tracking.is_passed && !tracking.is_change) || ((status == "Awaiting Review" || status == "Awaiting Approval") && tracking.flag != "orange")) || status == "Done")
    return "disabled"
  return ""
}

$(document).ready(function () {
  loadDataConflict(form_id)
  if (!(is_reviewer || is_approver) || (is_reviewer && is_submit) || status == "Done") {
    $("#modal_summary_assessment .modal-body").html(`
      <div class="row">
        <div class='col-12'>
          <div class='table-wrapper'>
            <table class="table table-responsive-sm table-basic table-mytable border-table" id="table_summary_comment">
              <thead>
                <tr>
                  <th class="th period">Period</th>
                  <th class="th user-name">User name</th>
                  <th class="th comment">Comment</th>
                  <th class="th commented-date">Commented Date</th>
                </tr>
              </thead>
              <tbody id="data_summary">
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="row" >
          <div class="col-12 divButton" style="justify-content: center;">
            <button type="button" class="btn btn-light border-dark" data-dismiss="modal">Close</button>
          </div>
      </div>
    `)
  }
  $(document).on("click", "#summary_comment", function () {
    $.ajax({
      type: "GET",
      url: "/forms/get_summary_comment",
      data: {
        form_id: form_id
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        $("tbody#data_summary").html(`<tr><td colspan='4'>No data available in table</td></tr>`);
        if (response.length > 0) {
          var body = ""
          $(response).each(
            function (i, e) {
              if (e.status) {
                $("#input_summary_comment").html(e.comment)
                $("#id_summary").val(e.id)
              }
              body += `<tr id=${e.id}>
                        <td class="type-text period">${e.period}</td>
                        <td class="type-text user-name">${e.user_name}</td>
                        <td class="type-text comment"><pre>${e.comment}</pre></td>
                        <td class="type-text commented-date">${e.comment_date}</td>
                      </tr>`
            }
          )
          $("tbody#data_summary").html(body)
          $("#table_summary_comment").DataTable({
            "retrieve": true,
            "bLengthChange": false,
            "bFilter": false,
            "bAutoWidth": false,
            "columnDefs": [{
              "searchable": false,
              "orderable": false,
              "targets": 0,
            },],
            "order": [
              [1, "asc"]
            ],
          });
          $("#table_summary_comment").removeClass('no-footer')
        }
        $('#modal_summary_assessment').modal('show')
      }
    })
  })

  $(document).on("click", "#btn_save_summary_assessment", function () {
    $.ajax({
      type: "POST",
      url: "/forms/save_summary_comment",
      data: {
        form_id: form_id,
        summary_id: $("#id_summary").val(),
        comment: $("#input_summary_comment").val(),
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        if (response) {
          warning("The CDS/CDP has been saved your summary comment successfully")
          $('#modal_summary_assessment').modal('hide')
        } else
          fail("The CDS/CDP hasn't been saved your summary comment fail")
      }
    })
  })

  $("#button_request_update").on("click", function () {
    var booleans = Object.keys(checked_set_is_empty_comment).map(k => checked_set_is_empty_comment[k])
    var all_comments_not_empty = true;
    // make sure all values are false
    for (var i = 0; i < booleans.length; i++) {
      var current_bool = booleans[i];
      if (current_bool == true) {
        all_comments_not_empty = false;
        break;
      }
    }
    if (all_comments_not_empty && checked_set.size > 0) {
      $("#modal_request_add_more_evidence #slot_id").html(findConflictinArr(data_checked_request))
      $("#modal_request_add_more_evidence").modal("show");
    } else {
      $("#modal_deny_request_update #data_slot").html(findConflictinArr(data_checked_request))
      // open warning model
      $("#modal_deny_request_update").modal("show");
    }
  });
  $("#button_cancel_request").on("click", function () {
    $("#modal_cancel_request_update #data_slot").html(findConflictinArr(data_checked_request))
    $("#modal_cancel_request_update").modal("show");
  });

  $("#submit_cancel_request_update").on("click", function () {
    $.ajax({
      type: "POST",
      url: "/forms/cancel_request",
      data: {
        form_slot_id: [...checked_set],
        form_id: form_id,
        slot_id: JSON.stringify(data_checked_request),
        user_id: user_to_be_reviewed,
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        if (response.status == "success") {
          $('#modal_cancel_request_update').modal('hide');
          checked_set.clear()
          data_checked_request = {}
          loadDataPanel(form_id)
          warning("The CDS/CDP has been cancelled requesting update on some slots successfully.")
        } else {
          fails("The CDS/CDP hasn't been cancelled requesting update.")
        }
      }
    })
  });

  $(".left-panel-competency").hide();
  $("#body-row .collapse").collapse("hide");
  $("[data-toggle=sidebar-colapse]").click(function () {
    sidebarCollapse();
  });

  $(document).on("click", ".re-assessment", function () {
    $('#modal_re_assess_slots').modal('show');

    var slot_id = $(this).closest(".row-slot").data("location");
    var id = $(this).closest(".row-slot").data("slot-id");
    id_competency = $(".card").find('.show').attr('id').split("collapse");
    competency_name = $('.card .card-header .table' + id_competency[1] + ' thead tr td:nth-child(2)').text();
    competency_name = $.trim(competency_name);

    $('#competency_name_re_assess').text(competency_name);
    $('#slot_id_re_assess').text(slot_id);
    $('#confirm_yes_re_assess_slot').val(id);
  });

  $(document).on("click", "#confirm_yes_re_assess_slot", function () {
    $('#modal_re_assess_slots').modal('hide');
    slot_id = $(this).val();
    $('#' + slot_id).find('.re-assessment').prop("style", "visibility: hidden")
    $('#' + slot_id).find('.input-staff').prop("disabled", false)
  });

  $(document).on("click", "#confirm_request", function () {
    $('#modal_confirm_request').modal('show');
  });

  $(document).on("click", "#confirm_yes_request_update", function () {
    $.ajax({
      type: "POST",
      url: "/forms/confirm_request",
      data: {
        form_id: form_id,
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        if (response.status == "success")
          warning("These slots have been updated and informed to requester successfully.")
        else
          fails("These slots haven't been updated and informed to requester.")
      }
    })
    $("#icon_confirm_request").prop("style", "color: #ccc")
    $("#confirm_request").addClass("disabled")
    $('#modal_confirm_request').modal('hide');
  });

  function sidebarCollapse() {
    $("#sidebar-container").toggleClass("sidebar-expanded sidebar-collapsed");
    if ($(".card").is(":visible")) {
      $(".card").hide();
      $("#accordion table").hide();
      $(".left-panel-competency").show();
    } else {
      $(".card").show();
      $("#accordion table").show();
      $(".left-panel-competency").hide();
    }
    $("#collapse-icon").toggleClass(
      "fa-angle-double-left fa-angle-double-right"
    );
  }
  // filter
  $("#filter_form_slots").multiselect({});
  $(".filter-slots .multiselect-selected-text").hide();
  $(document).on("click", ".line-slot", function () {
    if (document.getElementById("slot_description_" + this.id).style.display == "block") {
      document.getElementById("slot_description_" + this.id).style.display = "none";
      document.getElementById(this.id).innerText = "ViewDetails";
    } else {
      document.getElementById("slot_description_" + this.id).style.display = "block";
      document.getElementById(this.id).innerText = "Hide Details";
    }
  });

  $(document).on("click", ".card table thead tr", function () {
    var data = getParams();
    if (title_history_id)
      data.title_history_id = title_history_id;
    else if (form_id)
      data.form_id = form_id;
    $.ajax({
      type: "POST",
      url: "/forms/get_cds_assessment",
      data: data,
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        loadDataSlots(response);
        checkHideShowSlot();
        // init page at start
        if (is_submit) {
          toggleInput(false);
        }
        if (status == "Done") {
          toggleInput(false);
        }
        $(".select-commit").each(function () {
          is_commit = $(this).val();
          if (is_commit == "commit_cdp") {
            $(this).closest("tr").find(".reviewer-assessment").addClass("d-none");
            $(this).closest("tr").find(".approver-assessment").addClass("d-none");
          } else if (is_commit == "commit_cds") {
            $(this).closest("tr").find(".reviewer-assessment").removeClass("d-none");
            $(this).closest("tr").find(".approver-assessment").removeClass("d-none");
          }
        });
        $(".cdp-slot-wrapper").each(function () {
          if ($(this).find(".icon-flag").css("color") != "rgb(255, 255, 255)") {
            $(this).find(".reviewer-self").removeAttr("disabled");
            $(this).find(".approver-self").removeAttr("disabled");
          }
        });
        refreshCheckbox();
      }
    });
  });


  $(document).on("click", ".level-competency", function () {
    var data = getParams();
    if (title_history_id)
      data.title_history_id = title_history_id;
    else if (form_id)
      data.form_id = form_id;
    data.level = $(this).data('level')
    $.ajax({
      type: "POST",
      url: "/forms/get_cds_assessment",
      data: data,
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        loadDataSlots(response);
        checkHideShowSlot();
        // init page at start
        if (is_submit) {
          toggleInput(false);
        }
        if (status == "Done") {
          toggleInput(false);
        }
        $(".select-commit").each(function () {
          is_commit = $(this).val();
          if (is_commit == "commit_cdp") {
            $(this).closest("tr").find(".reviewer-assessment").addClass("d-none");
            $(this).closest("tr").find(".approver-assessment").addClass("d-none");
          } else if (is_commit == "commit_cds") {
            $(this).closest("tr").find(".reviewer-assessment").removeClass("d-none");
            $(this).closest("tr").find(".approver-assessment").removeClass("d-none");
          }
        });
        $(".cdp-slot-wrapper").each(function () {
          if ($(this).find(".icon-flag").css("color") != "rgb(255, 255, 255)") {
            $(this).find(".reviewer-self").removeAttr("disabled");
            $(this).find(".approver-self").removeAttr("disabled");
          }
        });
        refreshCheckbox();
      }
    });
  });

  $("#content_slot").on("change", ".staff-commit", function () {
    var row = $(this).closest('.content-staff')
    row.find(".comment").val("")
    var form_slot_id = $(this).data("slot-id")
    var type = ""
    if ($(this).val() == "commit_cds") {
      type = "CDS"
      row.find('.select-assessment').attr("style", "display:block")
      row.find('.title-point').attr("style", "display:block")
      row.find('.title-comment').html("Staff Comment (*):")
    } else if ($(this).val() == "commit_cdp") {
      type = "CDP"
      row.find('.select-assessment').attr("style", "display:none")
      row.find('.title-point').attr("style", "display:none")
      row.find('.title-comment').html("Staff Comment :")
    } else {
      row.find('.select-assessment').attr("style", "display:none")
      row.find('.title-point').attr("style", "display:none")
      row.find('.title-comment').html("Staff Comment :")
    }
    $.ajax({
      type: "GET",
      url: "/forms/get_assessment_staff",
      data: {
        form_slot_id,
        type,
        form_id,
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        if (response) {
          if (response.status == 'Delete') {
            row.closest(".row-slot").find('.icon-cdp').prop("style", "visibility: hidden")
            return
          }
          row.closest(".row-slot").find('.icon-cdp').prop("style", "visibility: hidden")
          row.find(".comment").val(response.evidence)
          row.find('option[value="' + response.evidence + '"]').prop('selected', true)
          autoSaveStaff(row.closest('.row-slot'))
        }
      }
    });
  });

  $(document).on("change", ".search-assessment", function () {
    var data = getParams();
    if (title_history_id)
      data.title_history_id = title_history_id;
    else if (form_id)
      data.form_id = form_id;
    $.ajax({
      type: "POST",
      url: "/forms/get_cds_assessment",
      data: data,
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        loadDataSlots(response);
        checkHideShowSlot();
        refreshCheckbox();
      }
    });
  });


  $(document).on("change", "#filter_form_slots", function () {
    var data = getParams();
    if (title_history_id)
      data.title_history_id = title_history_id;
    else if (form_id)
      data.form_id = form_id;

    $.ajax({
      type: "POST",
      url: "/forms/get_cds_assessment",
      data: data,
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        loadDataSlots(response);
        checkHideShowSlot();
        refreshCheckbox();
      }
    });
  });

  $("#content_slot").on("change", ".comment", function () {
    var row = $(this).closest('.row-slot')
    autoSaveStaff(row)
  });

  $("#content_slot").on("change", ".select-assessment", function () {
    var row = $(this).closest('.row-slot')
    autoSaveStaff(row)
  });

  $("#content_slot").on("click", "#btn_view_history", function () {
    $('#modal_history_assessment').modal('show');
    var row = $(this).closest(".row-slot")
    var slot_id = row.data("location");
    var id = $(".card").find('.show').attr('id').split("collapse");
    competency_name = $('.card .card-header .table' + id[1] + ' thead tr td:nth-child(2)').text();
    competency_name = $.trim(competency_name);
    $('#assessment_history_competency_name').text(competency_name);
    $('#assessment_history_slot_id').text(slot_id);
    $.ajax({
      type: "POST",
      url: "/forms/get_cds_histories",
      data: {
        form_slot_id: row.data("form-slot-id")
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        temp = '';
        if (jQuery.isEmptyObject(response)) {
          temp = `
              <tr>
                <td colspan="9" style="text-align:center">No data available in table</td>
              </tr>`;
          $("#modal_history_assessment table").removeClass("table-responsive");
        }
        for (i in response) {
          length = response[i].recommends.length;
          temp += `
              <tr>
                <td rowspan="${length}">${i}</td>
                <td rowspan="${length}">${response[i].point > 0 ? "CDS" : "CDP"}</td>
                <td rowspan="${length}">${getValueStringPoint(response[i].point)}</td>
                <td rowspan="${length}">${response[i].evidence}</td>
                <td>${response[i].recommends[0].recommends}</td>
                <td>${response[i].commit}</td>
                <td>${getValueStringPoint(response[i].recommends[0].given_point)}</td>
                <td>${response[i].recommends[0].name}</td>
                <td>${response[i].recommends[0].reviewed_date}</td>
              </tr> `;
          for (x = 1; x < length; x++) {
            temp += `
                <tr>
                  <td>${response[i].recommends[x].recommends}</td>
                  <td>${response[i].recommends[x].given_point > 0 ? "CDS" : "CDP"}</td>
                  <td>${getValueStringPoint(response[i].recommends[x].given_point)}</td>
                  <td>${response[i].recommends[x].name}</td>
                  <td>${response[i].recommends[x].reviewed_date}</td>
                </tr>`;
          }
        };
        $('.table-view-assessment-history tbody').html(temp);
      }
    });
  });

  $(document).on("click", ".withdraw-assessment", function () {
    $('#modal_withdraw').modal('show');
  });

  $(document).on("click", "#confirm_withdraw_cds", function () {
    $('#modal_withdraw').modal('hide');
    $.ajax({
      type: "POST",
      url: "/forms/withdraw_cds",
      data: {
        form_id: form_id,
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        if (response.status == "success") {
          warning(`The CDS/CDP assessment of ${response.user_name} has been withdrawn successfully.`);
          $('a.withdraw-assessment').addClass('d-none');
          $('a.withdraw-assessment').addClass('disabled');
          $('a.submit-assessment').removeClass('d-none');
          $('a.submit-assessment').removeClass('disabled');
          checkStatusFormStaff("New")
          status = "New"
          $("#status").html("(New)")
          $(".icon-flag").each(function (i, e) {
            e.setAttribute('style', 'display:none')
          })
        } else {
          fails("Can't withdraw CDS/CDP.");
        }
      }
    });
  });

  function findConflictinArr(arr) {
    var str = "</p>"
    var keys = Object.keys(arr)
    keys.forEach(key => {
      a = new Set(arr[key])
      if (a.size > 0)
        str += `<p>&#8226;<b> ${key} / ${[...a].join()}</b></p>`
    });
    if (str.split("<p>").length <= 2)
      str = str.replace("<p>", "").replace("</p>", "");
    return str
  }

  $(document).on("click", ".confirm-submit-cds", function () {
    if (is_reviewer) {
      $.ajax({
        type: "POST",
        url: "/forms/reviewer_submit",
        data: {
          form_id: form_id,
          user_id: user_to_be_reviewed,
        },
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
        },
        dataType: "json",
        success: function (response) {
          if (response.status == "success") {
            warning(`The CDS/CDP assessment of ${response.user_name} has been submitted successfully.`);
            $("a.submit-assessment .fa-file-import").css("color", "#ccc");
            $('a.submit-assessment').addClass('d-none');
            $('#modal_period').modal('hide');
            $("#button_request_update").addClass("d-none")
            $("#button_cancel_request").addClass("d-none")
            $("#summary_comment").addClass("d-none")
            $("#confirm_update_to_approver").removeClass("d-none")
            $("#icon_confirm_update_to_approver").css("color", "#ccc");
            $("#status").html("(Submited)")
            toggleInput(false);
            window.location.href = "/forms/cds_review"
          } else {
            fails("Can't submit CDS/CDP.");
          }
          $("#modal_reviewer_submit").modal('hide');
        }
      });
    } else {
      $.ajax({
        type: "POST",
        url: "/forms/submit",
        data: {
          form_id: form_id,
          period_id: parseInt($('#modal_period #period_id').val())
        },
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
        },
        dataType: "json",
        success: function (response) {
          if (response.status == "success") {
            $('#modal_period').modal('hide');
            // staff submit
            warning("This CDS/CDP for " + $("#modal_period #period_id option:selected").text() + " has been submitted successfully.");
            $('a.submit-assessment').addClass('d-none');
            $('a.submit-assessment').addClass('disabled');
            $('a.withdraw-assessment').removeClass('d-none');
            $('a.withdraw-assessment').removeClass('disabled');
            status = response.form_status
            checkStatusFormStaff(status)
            $("#status").html(`(${status})`)
          } else {
            fails("You have not had reviewer / approver yet. Therefore, you cannot submit this CDS/CDP. Please contact your Line Manager to setup.");
          }
        }
      })
    };
  });
  $(document).on("click", ".submit-assessment", function () {
    $.ajax({
      type: "GET",
      url: "/forms/check_status_form",
      data: {
        form_id: form_id
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        if (response.status == "New" && is_reviewer) {
          $("#content_modal_conflict").html("The CDS/CDP of " + user_name + " has been withdraw. Therefore, you cannot do this action.")
          $('#modal_conflict').modal('show');
          $(document).on("click", "#btn_check_status", function () {
            window.location.href = "/forms/index_cds_cdp"
          });
        } else {
          h_data = response.data;
          if (jQuery.isEmptyObject(h_data)) {
            var data_conflict = findConflictinArr(conflict_commits)
            var str = ""
            if (data_conflict && (is_reviewer || is_approver)) {
              str = "<p>The following slots have been conflicted on commitment between you and staff:</p><p>Slot: <b>" +
                data_conflict + "</b></p><p>Please review it or request update from staff before doing this action.</p>"
            } else {
              data_conflict = findConflictinArr(slot_assessing)
              if (data_conflict) {
                str = "<p>The following slots have not filled all required fields fully yet. Therefore, you cannot do this action.</p><p>" +
                  data_conflict + " </p>"
              }
            }
            if (str != "") {
              $("#content_modal_conflict").html(str);
              $('#modal_conflict').modal('show');
            } else if (is_reviewer) {
              $('#staff_account').html()
              $('#modal_period').modal('show');
            } else {
              $('#modal_period').modal('show');
            }
          } else {
            str = ""
            for (var competency_name in h_data) {
              str += "<p>\u2022 " + competency_name + ": ";
              slots = h_data[competency_name];
              str += slots.join(", ");
              str += "</p>";
            }

            $("#modal_reviewer_content").html(str);
            $("#modal_reviewer_submit").modal('show');
          }
        }
      }
    });
  });
  $("#content_slot").on("change", ".tr-reviewer, .tr-approver", function () {
    var row = $(this)
    var slot_id = row.closest('.row-slot').data("slot-id");
    var url = "";
    if (is_approver) {
      url = "/forms/save_cds_assessment_manager";
      point = row.find(".approver-assessment").val();
      recommend = row.find(".approver-recommend").val();
      var form_slot_id = row.closest(".cdp-slot-wrapper").data("form-slot-id")
      if (form_slot_id in checked_set_is_empty_comment) {
        checked_set_is_empty_comment[form_slot_id] = (recommend.length == 0);
      }

      is_commit = row.find(".approver-commit").val();
      if (is_commit == "commit_cdp" || is_commit == "uncommit") {
        row.find(".approver-assessment").addClass("d-none");
        point = null
        if (is_commit == "commit_cdp")
          is_commit = true
        else
          is_commit = false
      } else if (is_commit == "commit_cds") {
        is_commit = true
        var approver_point = row.find(".approver-assessment")
        approver_point.removeClass("d-none");
        if (!approver_point.val() || recommend == "") {
          changeListSlotAssessing(row.closest(".cdp-slot-wrapper"), "add")
          return
        }
      }
      data = {
        form_id: form_id,
        is_commit: is_commit,
        given_point: point,
        recommend: recommend,
        slot_id: slot_id,
        user_id: user_to_be_reviewed
      };
    } else if (is_reviewer) {
      url = "/forms/save_cds_assessment_manager";
      point = row.find(".reviewer-assessment").val();
      recommend = row.find(".reviewer-recommend").val();

      var form_slot_id = row.closest(".cdp-slot-wrapper").data("form-slot-id")
      if (form_slot_id in checked_set_is_empty_comment) {
        checked_set_is_empty_comment[form_slot_id] = (recommend.length == 0);
      }

      is_commit = row.find(".reviewer-commit").val();
      if (is_commit == "commit_cdp" || is_commit == "uncommit") {
        point = null;
        row.find(".reviewer-assessment").addClass("d-none");
        if (is_commit == "commit_cdp")
          is_commit = true
        else
          is_commit = false
      } else if (is_commit == "commit_cds") {
        is_commit = true
        var reviewer_point = row.find(".reviewer-assessment")
        reviewer_point.removeClass("d-none");
        if (!reviewer_point.val() || recommend == "") {
          changeListSlotAssessing(row.closest(".cdp-slot-wrapper"), "add")
          return
        }
      }
      data = {
        form_id: form_id,
        is_commit: is_commit,
        given_point: point,
        recommend: recommend,
        slot_id: slot_id,
        user_id: user_to_be_reviewed
      };
    }
    if (url != "") {
      $.ajax({
        type: "POST",
        url: url,
        data: data,
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
        },
        success: function (response) {
          $("#confirm_request").removeClass("disabled")
          $("#icon_confirm_request").prop("style", "color:green")
          flag = row.closest(".row-slot").find('.icon-flag')
          if (flag.css('color') == "rgb(255, 255, 0)" && is_reviewer)
            flag.prop("style", "color: #99FF33")
          changeListSlotAssessing(row.closest(".cdp-slot-wrapper"), "remove")
        }
      });
    }
  });

  $(".btn-show-hide-slot").on("click", function () {
    if(window.flag_hide_show_slot == 1){
      $('.ic-book-slot').addClass("fas fa-book-open");
      $('.ic-book-slot').removeClass("fa fa-book");
      window.flag_hide_show_slot = 0;
    }
    else{
      $('.ic-book-slot').removeClass("fas fa-book-open");
      $('.ic-book-slot').addClass("fa fa-book")
      window.flag_hide_show_slot = 1;
    }
    checkHideShowSlot();
  });

  $(".btn-up").on("click", function () {
    window.scrollTo({top: 0, behavior: 'smooth'});
  });

  $(".btn-down").on("click", function () {
    $('html,body').animate({scrollTop: document.body.scrollHeight}, "smooth");
    // window.scrollTo({top: (document.scrollingElement || document.body), behavior: 'smooth'});
  });

  window.flag_hide_show_slot = 0;

  $(window).scroll(function(e){ 
    var navbar = 888;
    var st = $(window).scrollTop();
    if (st >= navbar) {
      $(".btn-up").css("display", "block");
      $(".btn-down").css("display", "none");
    } else {
      $(".btn-up").css("display", "none");
      $(".btn-down").css("display", "block");
    }
  });
})

function checkHideShowSlot() {
  if(window.flag_hide_show_slot == 1)
    $(".content-staff").addClass("show");
  else
    $(".content-staff").removeClass("show");
}
function getValueStringPoint(point) {
  switch (point) {
    case 1:
      return "1 - Does Not Meet Minimun Standards";
    case 2:
      return "2 - Needs Improvement";
    case 3:
      return "3 - Meets Expectations";
    case 4:
      return "4 - Exceeds Expectations";
    case 5:
      return "5 - Outstanding";
    default:
      return ""
  }
}

function autoSaveStaff(row) {
  var is_commit = row.find('.staff-commit').val();
  var evidence = row.find('.comment').val();
  var point = row.find('.select-assessment').val();
  if (is_commit != "commit_cds")
    point = ""
  else
    changeListSlotAssessing(row.closest(".cdp-slot-wrapper"), "add")
  if (is_commit == "commit_cdp" || is_commit == "uncommit" || (is_commit == "commit_cds" && evidence != "" && parseInt(point) > 0)) {
    is_commit = is_commit != "uncommit"
    var slot_id = row.data("slot-id");
    var position = row.data('location');

    $.ajax({
      type: "POST",
      url: "/forms/save_cds_assessment_staff",
      data: {
        form_id: form_id,
        is_commit: is_commit,
        point: point,
        evidence: evidence,
        slot_id: slot_id,
        position: position
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      success: function (response) {
        if (response.status == "success") {
          changeListSlotAssessing(row, "remove")
          if (lst_slot[slot_id] == "orange") {
            $("#confirm_request").removeClass("disabled")
            $("#icon_confirm_request").prop("style", "color:green")
            row.closest(".row-slot").find('.icon-flag').prop("style", "color: yellow")
            row.closest(".row-slot").find('.icon-flag').prop("title", "This slot have been updated")
          }
          var icon_cdp = row.closest(".row-slot").find('.icon-cdp')
          icon_cdp.addClass("icon-yellow").removeClass("icon-green")
          if (is_commit == true) {
            icon_cdp.prop("style", "visibility: show")
            icon_cdp.prop("title", checkTitleFlag(parseInt(point), 0))
            if (point == "")
              icon_cdp.removeClass("fa-battery-full").addClass("fa-battery-empty").removeClass("fa-battery-half")
            else if (parseInt(point) < 3)
              icon_cdp.addClass("fa-battery-half").removeClass("fa-battery-empty").removeClass("fa-battery-full")
            else
              icon_cdp.addClass("fa-battery-full").removeClass("fa-battery-empty").removeClass("fa-battery-half")
          } else
            icon_cdp.prop("style", "visibility: hidden")
          checkChangeSlot();

          current = $("div.show table tr[data-level=" + row.data("location")[0] + "]").children()[2].innerText.split('/');
          max = parseInt(current[1]);
          current_change = 0
          $('div.row-slot').each(function (i, sel) {
            level = $(this).data("location")[0]
            is_cds = $(this).find(".staff-commit").val() == "commit_cds"
            point = $(this).find(".select-assessment").val()
            if (level == row.data("location")[0] && (is_cds && point >= 3 || $(this).find(".approver-assessment").val() >=3))
              current_change += 1;
          });
          if (current_change <= max)
            current_change = current_change;
          else
            current_change = max;
          var competency_id = $('div.show').data("competency-id")
          $('div.show .card-body table tr:nth-child(' + row.data("location")[0] + ') td:nth-child(3)').text(current_change + '/' + max);
          $("tr[data-id-competency=" + competency_id + "]").children()[2].innerText = response.data
        } else
          fails("This slot hasn't been save.")
      }
    });
  }
}

function loadDataPanel(form_id) {
  data = {}
  if (!(form_id || title_history_id)) {
    fails("Don't have template availabale!")
    window.setTimeout(function () {
      window.location.href = "/forms/index_cds_cdp"
    }, 3000);
  } else {
    if (form_id)
      data.form_id = form_id;
    else if (title_history_id)
      data.title_history_id = title_history_id;
    $.ajax({
      type: "POST",
      url: "/forms/get_competencies/",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      data: data,
      dataType: "json",
      success: function (response) {
        var temp = '';
        var i = 0;
        for (competency in response) {
          temp += `
        <div class="card">
          <div class="card-header">
            <table class="table table-primary table-responsive-sm table-mytable table${i}">
              <thead>
                <tr class="d-flex" data-target="#collapse${i}" id="card${i}" data-id-competency="${response[competency].id}">
                  <td class="col-2">${response[competency].type}</td>
                  <td class="col-7" style=" padding-right: 10px; padding-left: 10px; text-align: left">  
                  ${competency}
                  </td>
                  <td class="col-3">${response[competency].level_point || "N/A"}</td>  
                </tr>
              </thead>
            </table>
          </div>
          <div id="collapse${i}" class="collapse" data-parent="#accordion" data-competency-id="${response[competency].id}" data-competency-name="${competency}" >
            <div class="card-body">
              <div class="competency">
                <table class="table table-primary table-responsive-sm table-mytable table-left-panel">
                  <tbody>`
          var l = '';
          var levels = response[competency].levels
          for (level in levels) {
            l += `<tr data-level="${level}" class="d-flex level-competency">
                    <td class="col-2"></td>
                    <td class="col-7">Level ${level}</td>
                    <td class="col-3">${levels[level].current}/${levels[level].total}</td>
                </tr>`
          }
          temp += l
          temp += ` </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`
          i += 1;
        };
        $('#competency_panel').html(temp);

        $(".card table thead tr").click(function () {
          checkChangeSlot();
          $(".collapse").removeClass("show");
          $(".card-header table tr").css("background-color", "#bbcbea");
          id = $(this).data("target");
          $(id).addClass("show");
          num = id.split("#collapse");
          $(".table" + Number(num[1]) + " tr").css("background-color", "#7ba2ed");
        });

        $(".level-competency").click(function () {
          checkChangeSlot();
          $(".level-competency td").css("color", "black");
          $(this).find('td').css("color", "#4472c4");
        });
        $('#card0').click()
      }
    });
  }
}

function loadDataConflict(form_id) {
  $.ajax({
    type: "GET",
    url: "/forms/get_conflict_assessment/",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      form_id: form_id
    },
    dataType: "json",
    success: function (response) {
      conflict_commits = response
    }
  });
}

function checkTitle(flag) {
  var title = "Request more evidences";
  if (flag == "orange")
    title = "This slot needs an update";
  if (flag == "yellow")
    title = "This slot have been updated";
  return title
}

function hightlightChangeCompetency(id, level) {
  var list_competency = $('#competency_panel').find('.card');
  for (var i = 0; i < list_competency.length; i++) {
    if ($("#card" + i).attr("data-id-competency") == id) {
      $("#card" + i).css('backgroundColor', '#FBE5D6')
      $("#collapse" + i).find('tr')[level].style.backgroundColor = '#FBE5D6'
    }
  }
}

function checkChangeSlot() {
  $.ajax({
    type: "GET",
    url: "/forms/get_slot_is_change",
    data: {
      form_id: form_id
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      $.each(response, function (i, e) {
        hightlightChangeCompetency(e.competency_id, e.level);
      });
      $('#competency_panel').find('.show').parent().find('tr')[0].style.backgroundColor = '#7ba2ed';
    }
  });
}

function checkIsRequested() {
  $.ajax({
    type: "POST",
    url: "/forms/get_is_requested",
    data: { form_id: form_id },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        $("a.submit-assessment .fa-file-import").css("color", "#6c757d");
        $('a.submit-assessment').removeClass('submit-assessment');
      }
    }
  });
}

function getParams() {
  var data = {
    competency_id: $('#competency_panel').find('.show').data('competency-id'),
    search: $(".search-assessment").val(),
    filter: ""
  }
  filter = [];
  $('#filter_form_slots :selected').each(function (i, sel) {
    filter.push($(sel).val())
  });
  data.filter = filter.join();
  return data;
}
