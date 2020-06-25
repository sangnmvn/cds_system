function ToggleInput(enable)
{
  if (enable)
  {
    $(".reviewer-self").removeAttr("disabled");
    $(".approver-self").removeAttr("disabled");
  }
  else
  {
    $(".reviewer-self").attr("disabled", '');
    $(".approver-self").attr("disabled", '');
  }
  
}
function loadDataSlots(response) {
  var temp = "";
  $(response).each(function (i, e) {
    length = e.tracking.recommends == undefined ? 0 : e.tracking.recommends.length;
    flag = ""
    title_flag = ""
    for (i in e.tracking.recommends) {
      if (e.tracking.recommends[i].flag == "orange") {
        flag = "orange";
        title_flag = "Need to update"
        break
      } else if (e.tracking.recommends[i].flag == "yellow") {
        flag = "yellow";
        title_flag = "Updated Evidence"
        check_request_update = "true"
      }
    }
    if (check_request_update == "") {
      $(".confirm-request").addClass("disabled")
      $("#icon_confirm_request").prop("style", "color: #6c757d")
    }
    lst_slot[e.id] = flag
    temp += `<div class="container-fluid cdp-slot-wrapper row-slot" data-location="${e.slot_id}" data-slot-id="${e.id}" data-form-slot-id="${e.tracking.id}">
    <div class="row">
      <div class="col-11 div-slot" data-toggle="collapse" data-target="#content_${e.id}">
        <i class="fas fa-caret-down icon"></i>&nbsp &nbsp
        <b id="description_slot">${e.slot_id} - ${e.desc}</b>
      </div>
      <div class="col-1 div-slot div-icon">
        <a type='button' class='btn-action' title="View slot's history" id="btn_view_history"><i class="fas fa-history icon-green"></i></a>
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
            <select class="form-control input-staff staff-commit" data-slot-id="${e.tracking.id}" ${checkDisableFormSlotsReviewer(is_reviewer || e.tracking.is_passed)}>
              <option value="false" ${checkCommmit(!e.tracking.is_commit)}> Un-commit </option>
              <option value="commit_cds" ${checkCommmit(e.tracking.is_commit)}> Commit CDS</option>
              <option value="commit_cdp" ${checkDataCDP(e.tracking.point,e.tracking.is_commit)}> Commit CDP</option>
            </select>
          </div>
      </div>
      <div class="row div-content">
          <div class="col-2">
            <b>Self-Assessment (*):</b>
          </div>
          <div class="col-3">
            <select class="form-control input-staff select-assessment" ${checkDisableFormSlotsReviewer(is_reviewer || e.tracking.is_passed)} style="${checkDataPoint(e.tracking.point)}">
              <option disabled selected> select one </option>
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
          <div class="col-3">
            <textarea maxlength="1000" placeholder="comment content if any" class="form-control input-staff text-comment comment" ${checkDisableFormSlotsReviewer(is_reviewer || e.tracking.is_passed)}>${e.tracking.evidence}</textarea>
          </div>
      </div>`
    if (length > 0) {
      var lst_approver = []
      temp += `<div class="row div-row arrow-box row-cdp">
                  <div class="col-3 div-child-slot" data-toggle="collapse" data-target="#reviewer_${e.id}">
                    <a type='button' class='btn-action' title="View slot's history" id="btn_view_history"><i class="fas fa-caret-down"></i></a>
                    <b>Reviewer Review</b>
                  </div>
                </div>
                <div id="reviewer_${e.id}" class="collapse padding-collapse-children">
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
                  <select class="form-control select-commit reviewer-commit" disabled>
                    <option value="uncommit"> Un-commit </option>
                    <option value="commit_cds" ${e.tracking.comment_type == "CDS" ? "selected" : "" }> Commit CDS</option>
                    <option value="commit_cdp" ${e.tracking.comment_type == "CDP" ? "selected" : "" }> Commit CDP</option>
                  </select>
                </td>
                <td>
                  <select class="form-control select-commit reviewer-assessment ${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id) == "disabled" ? "" : "reviewer-self"} " ${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id)}>
                    <option disabled selected> select one </option>
                    <option value="1" ${compare(e.tracking.recommends[i].given_point, 1)}>1 - Does Not Meet Minimun Standards</option>
                    <option value="2" ${compare(e.tracking.recommends[i].given_point, 2)}>2 - Needs Improvement</option>
                    <option value="3" ${compare(e.tracking.recommends[i].given_point, 3)}>3 - Meets Expectations</option>
                    <option value="4" ${compare(e.tracking.recommends[i].given_point, 4)}>4 - Exceeds Expectations</option>
                    <option value="5" ${compare(e.tracking.recommends[i].given_point, 5)}>5 - Outstanding</option>
                  </select>
                </td>
                <td>
                  <textarea maxlength="1000" class="reviewer-recommend form-control ${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id) == 'disabled' ? '' : 'reviewer-self'}" placeholder="comment content if any" class="form-control" ${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id)}>${e.tracking.recommends[i].recommends}</textarea>
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
              <a type='button' class='btn-action' title="View slot's history" id="btn_view_history"><i class="fas fa-caret-down"></i></a>
              <b>Approver Review</b>
            </div>
          </div>
          <div id="approver_${e.id}" class="collapse padding-collapse-children">
            <div class="row div-content">
                <table class="table table-review" id="table-approver" >
                  <tr>
                    <td>${lst_approver[2]}</td>
                    <td>
                      <select class="form-control select-commit approver-commit" disabled>
                        <option value="uncommit"> Uncommit </option>
                        <option value="commit_cds" ${e.tracking.comment_type == "CDS" ? "selected" : "" }> Commit CDS</option>
                        <option value="commit_cdp" ${e.tracking.comment_type == "CDP" ? "selected" : "" }> Commit CDP</option>
                      </select>
                    </td>
                    <td>
                      <select class="form-control select-commit approver-assessment ${checkDisableFormSlotsStaff(is_reviewer, lst_approver[0]) == "disabled" ? '' : 'approver-self'}" disabled>
                        <option value="1" ${compare(lst_approver[1], 1)}>1 - Does Not Meet Minimun Standards</option>
                        <option value="2" ${compare(lst_approver[1], 2)}>2 - Needs Improvement</option>
                        <option value="3" ${compare(lst_approver[1], 3)}>3 - Meets Expectations</option>
                        <option value="4" ${compare(lst_approver[1], 4)}>4 - Exceeds Expectations</option>
                        <option value="5" ${compare(lst_approver[1], 5)}>5 - Outstanding</option>
                      </select>
                    </td>
                    <td>
                      <textarea maxlength="1000" class="approver-recommend form-control ${checkDisableFormSlotsStaff(is_reviewer, lst_approver[0]) == "disabled" ? '' : 'approver-self'}" placeholder="comment content if any" class="form-control" ${checkDisableFormSlotsStaff(is_reviewer, lst_approver[0])}>${lst_approver[3]}</textarea>
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
  $('#content-slot').html(temp);
  checkStatusFormStaff(status);
  checkChangeSlot();
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
    case "Awaiting Review":
      var temp = $(document).find(".input-staff")
      for (var i = 0; i < temp.length; i++) {
        temp[i].setAttribute("disabled", "true")
      }
      //$("#submit").addClass("disabled")
      //$("#icon_submit").attr("style", "color:gray")
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

function checkFlag(flag) {
  if (flag == "")
    return "display:none"
  return ""
}

function checkRequiredComment(point) {
  if (point == "")
    return ""
  return "(*)"
}

function checkDataCDP(point, is_commit) {
  if (point == "" && is_commit == true)
    return "selected"
  return ""
}

function checkCommmit(is_commit) {
  if (is_commit)
    return "selected"
  return ""
}

function checkDisableFormSlotsStaff(is_reviewer, user_id) {
  if (!is_reviewer  || user_id != user_current)
    return "disabled"
  return ""
}

function checkDisableFormSlotsReviewer(is_reviewer) {
  if (is_reviewer)
    return "disabled"
  else
    return ""
}

$(document).ready(function () {
  $(".left-panel-competency").hide();
  $("#body-row .collapse").collapse("hide");
  $("[data-toggle=sidebar-colapse]").click(function () {
    sidebarCollapse();
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
  $("#filter-form-slots").multiselect({});
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

  // left panel 
  $(document).on("click", ".card table thead tr", function () {
    var data = getParams();
    if (form_id)
      data.form_id = form_id;
    else if (title_history_id)
      data.title_history_id = title_history_id;
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
        checkStatusFormStaff(status);
      }
    });
  });

  $(document).on("click", ".level-competency", function () {
    var data = getParams();
    if (form_id)
      data.form_id = form_id;
    else if (title_history_id)
      data.title_history_id = title_history_id;
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
        checkStatusFormStaff(status);
      }
    });
  });

  $("#content-slot").on("change", ".staff-commit", function () {
    var row = $(this).closest('.content-staff')
    row.find(".comment").val("")
    var form_slot_id = $(this).data("slot-id")
    var type = ""
    if ($(this).val() == "commit_cds") {
      type = "CDS"
      row.find('.select-assessment').attr("style", "display:block")
      row.find('.title-comment').html("Staff Comment (*):")
    } else if ($(this).val() == "commit_cdp") {
      type = "CDP"
      row.find('.select-assessment').attr("style", "display:none")
      row.find('.title-comment').html("Staff Comment :")
    } else {
      row.find('.select-assessment').attr("style", "display:none")
      row.find('.title-comment').html("Staff Comment :")
      return
    }
    $.ajax({
      type: "GET",
      url: "/forms/get_assessment_staff",
      data: {
        form_slot_id,
        type,
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        if (response) {
          row.find(".comment").val(response.evidence)
          row.find('option[value="' + response.evidence + '"]').prop('selected', true)
          autoSaveStaff(row)
        } else
          autoSaveStaff(row)
      }
    });
  });

  $(document).on("change", ".search-assessment", function () {
    var data = getParams();
    if (form_id)
      data.form_id = form_id;
    else if (title_history_id)
      data.title_history_id = title_history_id;
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
      }
    });
  });

  $(document).on("change", "#filter-form-slots", function () {
    var data = getParams();
    if (form_id)
      data.form_id = form_id;
    else if (title_history_id)
      data.title_history_id = title_history_id;

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
      }
    });
  });

  $("#content-slot").on("change", ".row-slot", function () {
    var evidence = $(this).find('.comment').val();
    if (evidence.length >= 1000) {
      fails("Bằng chứng phải nhỏ hơn 1000 ký tự")
      return;
    }
  });

  $("#content-slot").on("change", ".tr-reviewer", function () {
    var slot_id = $(this).closest('.row-slot').data("slot-id");
    var url = "";
    if (is_approver) {
      url = "/forms/save_cds_assessment_manager";
      point = $(this).find(".approver-assessment").val();
      recommend = $(this).find(".approver-recomment").val();
      is_commit = $(this).find(".approver-commit").val();
      if (is_commit == "commit_cdp") {
        $(this).find(".approver-asssessment").addClass("d-none");
      } else if (is_commit == "commit_cds") {
        $(this).find(".approver-asssessment").removeClass("d-none");
      }
      if (is_commit == "uncommit") {
        return;
      } else if (is_commit == "commit_cdp" && is_commit == $(".staff-commit").val()) {
        point = null;
      } else if (is_commit != $(".staff-commit").val()) {
        // not sync between staff and line manager
        fails("Fail to auto-save review!")
        return;
      }
      data = {
        form_id: form_id,
        is_commit: is_commit,
        given_point: point,
        recommend: recommend,
        slot_id: slot_id,
        user_id: user_current
      };
    } else if (is_reviewer) {
      url = "/forms/save_cds_assessment_manager";
      point = $(this).find(".reviewer-assessment").val();
      recommend = $(this).find(".reviewer-recommend").val();
      is_commit = $(this).find(".reviewer-commit").val();
      if (is_commit == "commit_cdp") {
        $(this).find(".reviewer-asssessment").addClass("d-none");
      } else if (is_commit == "commit_cds") {
        $(this).find(".reviewer-asssessment").removeClass("d-none");
      }
      if (is_commit == "uncommit") {
        return;
      } else if (is_commit == "commit_cdp" && is_commit == $(".staff-commit").val()) {
        point = null;
      } else if (is_commit != $(".staff-commit").val()) {
        // not sync between staff and line manager
        fails("Fail to auto-save review!")
        return;
      }
      data = {
        form_id: form_id,
        is_commit: is_commit,
        given_point: point,
        recommend: recommend,
        slot_id: slot_id,
        user_id: user_current
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
        success: function (response) {}
      });
    }
  })

  $("#content-slot").on("change", ".comment", function () {
    var row = $(this).closest('.row-slot')
    autoSaveStaff(row)
  });

  $("#content-slot").on("change", ".select-assessment", function () {
    var row = $(this).closest('.row-slot')
    autoSaveStaff(row)
  });

  $("#content-slot").on("click", "#btn_view_history", function () {
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
                <td rowspan="${length}">${response[i].commit}</td>
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
                  <td>${response[i].commit}</td>
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
          success(`The CDS/CDP assessment of ${response.user_name} has been withdrawn successfully.`);
          $('a.withdraw-assessment').addClass('d-none');
          $('a.withdraw-assessment').addClass('disabled');
          $('a.submit-assessment').removeClass('d-none');
          $('a.submit-assessment').removeClass('disabled');
          checkStatusFormStaff("New")
        } else {
          fails("Can't withdraw CDS/CDP.");
        }
        $('#modal_withdraw').modal('hide');
      }
    });
  });

  $(document).on("click", "#confirm_submit_cds", function () {
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
            // NOT
            $('a.submit-assessment').removeClass('submit-assessment');
            $('#modal_period').modal('hide'); 
            ToggleInput(false);                       
          } else {
            fails("Can't submit CDS/CDP.");
          }
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
          $('#modal_period').modal('hide');
          if (response.status == "success") {
            // staff submit
            success("This CDS/CDP for " + $("#modal_period #period_id option:selected").text() + " has been submitted successfully.");
            $('a.submit-assessment').addClass('d-none');
            $('a.submit-assessment').addClass('disabled');
            $('a.withdraw-assessment').removeClass('d-none');
            $('a.withdraw-assessment').removeClass('disabled');
            checkStatusFormStaff("Awaiting Review")
          } else {
            fails("Can't submit CDS/CDP.");
          }
        }
      })
    };
  });
  $(document).on("click", ".submit-assessment", function () {
    $('#modal_period').modal('show');
  });
})

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
  if (is_commit == "commit_cdp")
    point = ""
  if (is_commit == "commit_cdp" || (is_commit == "commit_cds" && evidence != "")) {
    is_commit = true
    var slot_id = row.data("slot-id");
    $.ajax({
      type: "POST",
      url: "/forms/save_cds_assessment_staff",
      data: {
        form_id: form_id,
        is_commit: is_commit,
        point: point,
        evidence: evidence,
        slot_id: slot_id,
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      success: function (response) {
        if (lst_slot[slot_id] == "yellow") {
          $(".confirm-request").removeClass("disabled")
          $("#icon_confirm_request").prop("style", "color:green")
          row.closest(".row-slot").find('.icon-flag').prop("style", "color: yellow")
        }
        checkChangeSlot();
      }
    });
  }
}

function loadDataPanel(form_id) {
  data = {}
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
              <thead>confirm
                <tr class="d-flex" data-target="#collapse${i}" id="card${i}" data-id-competency="${response[competency].id}">
                  <td class="col-2">${response[competency].type}</td>
                  <td class="col-7" style=" padding-right: 10px; padding-left: 10px; text-align: left">  
                  ${competency}
                  </td>
                  <td class="col-3">${response[competency].level_point}</td>  
                </tr>
              </thead>
            </table>
          </div>
          <div id="collapse${i}" class="collapse" data-parent="#accordion" data-competency-id="${response[competency].id}">
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
        i += 1;confirm
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
      });confirm
      $('#card0').click()
    }
  });
}

function loadDataPanelReviewer(form_id) {
  data = {}
  if (form_id)
    data.form_id = form_id;
  else if (title_history_id)
    data.title_history_id = title_history_id;
  $.ajax({
    type: "POST",
    url: "/forms/get_competencies_reviewer/",
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
                  <td class="col-3">${response[competency].level_point}</td>  
                </tr>
              </thead>
            </table>
          </div>
          <div id="collapse${i}" class="collapse" data-parent="#accordion" data-competency-id="${response[competency].id}">
            <div class="card-body">
              <div class="competency">
                <table class="table table-primary table-responsive-sm table-mytable table-left-panel">
                  <tbody>`
        var l = '';
        var levels = response[competency].levelsconfirm
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
                    </div>confirm
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

function checkTitle(flag) {
  var title = "Request more evidences";
  if (flag == "orange")
    title = "Need to add more evidences";
  if (flag == "yellow")
    title = "Evidences have been added and sent to Requester";
  return title
}

function hightlightChangeCompetency(id, level) {
  var list_competency = $('#competency_panel').find('.card');
  for (var i = 0; i < list_competency.length; i++) {
    if ($("#card" + i).attr("data-id-competency") == id) {
      $("#card" + i).css('backgroundColor', '#FBE5D6')
      $("#collapse" + i).find('tr')[level].style.backgroundColor = '#99CCFF'
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

function getParams() {
  var data = {
    competency_id: $('#competency_panel').find('.show').data('competency-id'),
    search: $(".search-assessment").val(),
    filter: ""
  }
  filter = [];
  $('#filter-form-slots :selected').each(function (i, sel) {
    filter.push($(sel).val())
  });
  data.filter = filter.join();
  return data;
}