$(document).ready(function () {
  $(".left-panel-competency").hide();
  $("#body-row .collapse").collapse("hide");
  drawColorTitleFormPreviewResult(4, 10, "#FAD7A0");
  drawColorTitleFormPreviewResult(11, 17, "#d4f6ff");
  drawColorTitleFormPreviewResult(18, 24, "#feffd4");
  drawColorTitleFormPreviewResult(25, 31, "#d4f6ff");
  drawColorTitleFormPreviewResult(32, 38, "#FAD7A0");
  $("[data-toggle=sidebar-colapse]").click(function () {
    sidebarCollapse();
  });

  function drawColorTitleFormPreviewResult(start, end, color) {
    for (i = start; i <= end; i++) {
      $(".table-preview-result thead tr th:nth-child(" + i + ")").css(
        "background-color",
        color
      );
    }
  }

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
  // $('.filter-slots ul li').addClass('active');
});

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
                <thead>
                  <tr class="d-flex" data-target="#collapse${i}" id="card${i}" data-id-competency="${response[competency].id}">
                    <td class="col-2">${response[competency].type}</td>
                    <td class="col-7" style=" padding-right: 10px; padding-left: 10px; text-align: left">  
                    ${competency}
                    </td>
                    <td class="col-3">1</td>
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
          l += `<tr class="d-flex">
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
      $('#card0').click()
    }
  });
}

function resizeTextarea() {
  $(".autoresizing").on("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  $(".autoresizing").each((i, el) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  })

}

function check(x, y) {
  if (x == y)
    return "selected"
  return ""
}

function checkCommmit(is_commit) {
  if (is_commit)
    return "selected"
  return ""
}

function checkUncommmit(is_commit) {
  if (!is_commit)
    return "selected"
  return ""
}

function checkReviewer(reviewers) {
  for (i = 0; i < reviewers.length; i++) {
    if (reviewers[i].flag == "yellow") {
      var a = "";
      if (reviewers[i].given_point == 5)
        a = "Outstanding";
      if (reviewers[i].given_point == 4)
        a = "Exceeds Expectations";
      if (reviewers[i].given_point == 3)
        a = "Meets Expectations";
      if (reviewers[i].given_point == 2)
        a = "Needs Improvement";
      if (reviewers[i].given_point == 1)
        a = "Does Not Meet Minimun Standards";

      return [reviewers[i].name, a, reviewers[i].recommends]
    }
  }
  return ""
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
  }
}

function checkDisableFormSlotsStaff(is_reviewer, user_id) {
  if ((is_reviewer != user_id) || (is_submit == "true"))
    return "disabled"
  else
    return;
}
function checkTitle(flag) {
  var title = "Add more evidences";
  if (flag == "yellow")
    title = "Cancel request more evidences";
  return title
}

// function checkDisableFormSlotsReviewer(is_reviewer) {
//   if (is_reviewer == true)
//     return "disabled"
//   else
//     return ""
// }
function checkPM(is_pm) {
  if (is_pm)
    return "border: 2px solid rgb(0, 110, 255);"
}

function checkDisableFormSlotsUser(user_id) {
  if (user_id != user_current)
    return "disabled"
  else
    return ""
}

function loadDataSlots(response) {
  var temp = "";
  $(response).each(function (i, e) {
    length = e.tracking.recommends == undefined ? 0 : e.tracking.recommends.length;
    rowspan = length || 1;
    flag = ""
    class_flag = "flag-red"
    for (i in e.tracking.recommends) {
      if (e.tracking.recommends[i].flag == "yellow") {
        flag = "yellow";
        class_flag = "flag-yellow";
        break
      } else if (e.tracking.recommends[i].flag == "green") {
        flag = "green";
        class_flag = "flag-green";
        break
      }
    }
    current_user = $("#get_current_user_inview").val();
    temp += ` 
        <tr id="${e.id}" class="tr_slot" data-id="${e.id}">
          <td style="text-align:center" rowspan="${rowspan}">${e.slot_id}</td>
          <td style="position: relative; vertical-align: top" rowspan="${rowspan}">
            <div>${e.desc}</div>
            <br>
            <div id="slot_description_${e.slot_id}" style="display: none;">${e.evidence}</div>
            <br>
            <a id="${e.slot_id}" class="line-slot" href="javascript:void(0)" style="bottom:0; left:0; position: absolute;">View Details</a>
          </td>
          <td class="disabled" colspan="2" rowspan="${rowspan}">
            <select class="commit-select" disabled>
              <option value="true" ${checkCommmit(e.tracking.is_commit)}>Commit</option>
              <option value="fasle" ${checkUncommmit(e.tracking.is_commit)}>Uncommit</option>
            </select>
          </td>
          <td class="disabled" colspan="4" rowspan="${rowspan}">
            <select class="point-select" disabled>
              <option></option> 
              <option value="5" ${check(e.tracking.point, 5)}>5 - Outstanding</option>
              <option value="4" ${check(e.tracking.point, 4)}>4 - Exceeds Expectations</option>
              <option value="3" ${check(e.tracking.point, 3)}>3 - Meets Expectations</option>
              <option value="2" ${check(e.tracking.point, 2)}>2 - Needs Improvement</option>
              <option value="1" ${check(e.tracking.point, 1)}>1 - Does Not Meet Minimun Standards</option>
            </select>
          </td>
          <td class="disabled" colspan="5" rowspan="${rowspan}"><textarea class="autoresizing" disabled>${e.tracking.evidence}</textarea></td>`;
    if (length != 0) {
      temp += `
          <td class="${checkDisableFormSlotsStaff(current_user, e.tracking.recommends[0].user_id)}" colspan="4" style="${checkPM(e.tracking.recommends[0].is_pm)}" >
            <textarea class="recommend autoresizing"  style="resize:none" ${checkDisableFormSlotsStaff(current_user, e.tracking.recommends[0].user_id)}>${e.tracking.recommends[0].recommends}</textarea>
          </td>
          <td class="${checkDisableFormSlotsStaff(current_user, e.tracking.recommends[0].user_id)}" colspan="2" style="${checkPM(e.tracking.recommends[0].is_pm)}">
            <select class="given-point-select" ${checkDisableFormSlotsStaff(current_user, e.tracking.recommends[0].user_id)} >
              <option></option>
              <option value="5" ${check(e.tracking.recommends[0].given_point, 5)}>5 - Outstanding</option>
              <option value="4" ${check(e.tracking.recommends[0].given_point, 4)}>4 - Exceeds Expectations</option>
              <option value="3" ${check(e.tracking.recommends[0].given_point, 3)}>3 - Meets Expectations</option>
              <option value="2" ${check(e.tracking.recommends[0].given_point, 2)}>2 - Needs Improvement</option>
              <option value="1" ${check(e.tracking.recommends[0].given_point, 1)}>1 - Does Not Meet Minimun Standards</option>
            </select>
          </td>flag
          <td class="disabled" style="${checkPM(e.tracking.recommends[0].is_pm)}" colspan="1"><textarea style="resize:none" disabled>${e.tracking.recommends[0].name}</textarea></td>`;
    } else {
      temp += `
          <td colspan="2" ><textarea style="resize:none"></textarea></td>
          <td >
            <select class="given-point-select">
              <option></option>
            </select>
          </td>
          <td><textarea style="resize:none"></textarea></td>`;
    }
    temp += `<td rowspan="${rowspan}">
                <a href="javascript:void(0)" title="History Comment" style="color:green;" class="icon modal-view-assessment-history" data-id="${e.id}" data-slot-id="${e.slot_id}"><i class="fas fa-history"></i></a>
                </br>
                <a id="${e.tracking.id}" href="javascript:void(0)" title="${checkTitle(e.tracking.flag)}" class="flag-cds-assessment icon ${class_flag}" data-click="${e.tracking.flag}" data-form-slot-id="${e.tracking.id}" data-slot-id="${e.slot_id}" data-recommend="${e.tracking.recommends[i].recommends}" ><i style="color: ${e.tracking.flag};" class="far fa-flag"></i></a>`;

    temp += `</td></tr>`;

    if (length > 1) {
      for (i = 1; i < length; i++) {
        temp += `
            <tr data-id="${e.id}" class="tr_slot">
              <td colspan="4" class="${checkDisableFormSlotsStaff(current_user, e.tracking.recommends[i].user_id)}" style="${checkPM(e.tracking.recommends[i].is_pm)}"><textarea class="recommend autoresizing" style="resize:none" ${checkDisableFormSlotsStaff(current_user, e.tracking.recommends[i].user_id)}>${e.tracking.recommends[i].recommends}</textarea></td>
              <td colspan="2" class="${checkDisableFormSlotsStaff(current_user, e.tracking.recommends[i].user_id)}" style="${checkPM(e.tracking.recommends[i].is_pm)}">
                <select class="given-point-select" ${checkDisableFormSlotsStaff(current_user, e.tracking.recommends[i].user_id)}>
                  <option></option>
                  <option value="5" ${check(e.tracking.recommends[i].given_point, 5)}>5 - Outstanding</option>
                  <option value="4" ${check(e.tracking.recommends[i].given_point, 4)}>4 - Exceeds Expectations</option>
                  <option value="3" ${check(e.tracking.recommends[i].given_point, 3)}>3 - Meets Expectations</option>
                  <option value="2" ${check(e.tracking.recommends[i].given_point, 2)}>2 - Needs Improvement</option>
                  <option value="1" ${check(e.tracking.recommends[i].given_point, 1)}>1 - Does Not Meet Minimun Standards</option>
                </select>
              </td>
              <td colspan="1" class="disabled" style="${checkPM(e.tracking.recommends[i].is_pm)}">
                <textarea style="resize:none" disabled>${e.tracking.recommends[i].name}</textarea>
              </td>
            </tr>`;
      }
    }
  });
  if (jQuery.isEmptyObject(response)) {
    temp = '<td colspan="18" style="text-align:center">No data available in table</td>';
  }
  $('.csd-assessment-table table tbody').html(temp);
  checkStatusFormReview(status);
  resizeTextarea();
  checkChangeSlot();
}

function hightlightChangeSlot(id) {
  var list_tr = $('.csd-assessment-table table tbody').find('.tr_slot');
  for (var i = 0; i < list_tr.length; i++) {
    if (list_tr[i].id == id) {
      list_tr[i].children[2].children[0].style.color = '#3366CC'
      list_tr[i].children[3].children[0].style.color = '#3366CC'
      list_tr[i].children[4].children[0].style.color = '#3366CC'
    }
  }
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
    data: { form_id: form_id },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      $.each(response, function (i, e) {
        hightlightChangeSlot(e.slot_id);
        hightlightChangeCompetency(e.competency_id, e.level);
      });
      $('#competency_panel').find('.show').parent().find('tr')[0].style.backgroundColor = '#7ba2ed';
    }
  });
}
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
      checkStatusFormReview(status);
    }
  });
});

$(document).on("click", ".modal-view-assessment-history", function () {
  $('#modal_history_assessment').modal('show');
  var slot_id = $(this).data("slot-id");
  var id = $(this).data("id");
  id = $(".card").find('.show').attr('id').split("collapse");
  competency_name = $('.card .card-header .table' + id[1] + ' thead tr td:nth-child(2)').text();
  competency_name = $.trim(competency_name);
  $('#assessment_history_competency_name').text(competency_name);
  $('#assessment_history_slot_id').text(slot_id);
  $.ajax({
    type: "POST",
    url: "/forms/get_cds_histories",
    data: {
      form_slot_id: $(this).data("id")
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
                <td colspan="7" style="text-align:center">No data available in table</td>
            </tr>`;
        $("#modal_history_assessment table").removeClass("table-responsive");
      }
      for (i in response) {
        length = response[i].recommends.length;
        temp += `
            <tr>
              <td rowspan="${length}">${i}</td>
              <td rowspan="${length}">${getValueStringPoint(response[i].point)}</td>
              <td rowspan="${length}">${response[i].evidence}</td>
              <td>${response[i].recommends[0].recommends}</td>
              <td>${getValueStringPoint(response[i].recommends[0].given_point)}</td>
              <td>${response[i].recommends[0].name}</td>
              <td>${response[i].recommends[0].reviewed_date}</td>
            </tr> `;
        for (x = 1; x < length; x++) {
          temp += `
              <tr>
                <td>${response[i].recommends[x].recommends}</td>
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

function checkStatusFormReview(status) {
  if (is_approval == "true") {
    $('a.submit-assessment').css("display", "none");
    $('a.reject-assessment i').css("color", "#ccc");
    return;
  }
  else {
    $('a.approval-assessment').css("display", "none");
    $('a.reject-assessment').css("display", "none");
    if (is_submit == "true") {
      $("a.submit-assessment .fa-file-import").css("color", "#ccc");
      $('a.submit-assessment').removeClass('submit-assessment');
      // $('given-point-select').css("display", "none"); 
      // $('recommend').css("n", "none");
     
      return;
    }
  }
  switch (status) {
    case "Awaiting Review":
      break;
    case "Done":
      $('a.reject-assessment i').css("color", "#ccc");
      $('a.approval-assessment i').css("color", "#ccc");
      $('a.reject-assessment').removeClass('reject-assessment');
      $('a.approval-assessment').removeClass('approval-assessment');
      $("a.preview-result i").css("color", "#ccc");
      $('a.preview-result')[0].href = "#";
      $('a.preview-result')[0].target = "";
      $("a.submit-assessment .fa-file-import").css("color", "#ccc");
      $('a.submit-assessment').removeClass('submit-assessment');
      $('.tr_slot td:nth-child(3),.tr_slot td:nth-child(4),.tr_slot td:nth-child(5)').addClass('disabled');
      $('.tr_slot td:nth-child(3) select,.tr_slot td:nth-child(4) select').prop('disabled', 'disabled');
      $('.tr_slot td:nth-child(5) textarea').prop('disabled', 'disabled');
      break;
    case "New":
      $("a.preview-result i").css("color", "#ccc");
      $('a.preview-result')[0].href = "#";
      $('a.preview-result')[0].target = "";
      $("a.submit-assessment .fa-file-import").css("color", "#ccc");
      $('a.submit-assessment').removeClass('submit-assessment');
      $('.tr_slot td:nth-child(3),.tr_slot td:nth-child(4),.tr_slot td:nth-child(5)').addClass('disabled');
      $('.tr_slot td:nth-child(3) select,.tr_slot td:nth-child(4) select').prop('disabled', 'disabled');
      $('.tr_slot td:nth-child(5) textarea').prop('disabled', 'disabled');
      break;
    case "Awaiting Approval":
      break;
  }
}


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

$(document).on("change", ".tr_slot", function () {
  if ($(this).find('.given-point-select').val().length > 0 && $(this).find('.recommend').val().length > 0) {
    var slot_id = $(this).data("id");
    var point = $(this).find('.given-point-select').val();
    var recommend = $(this).find('.recommend').val();
    temp = $(this).children('td:nth-child(1)').text();
    column_commit = $(this).children('td:nth-child(3)');
    column_point = $(this).children('td:nth-child(4)');
    column_recommend = $(this).children('td:nth-child(5)');

    $.ajax({
      type: "POST",
      url: "/forms/save_cds_assessment_manager",
      data: {
        form_id: form_id,
        given_point: parseInt(point),
        recommend: recommend,
        slot_id: slot_id,
        user_id: user_id,
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      success: function (response) {
        current = $('div.show table tr:nth-child(' + temp.charAt(0) + ') td:nth-child(3)').text().split('/');
        max = parseInt(current[1]);
        current_change = 0
        $('div.csd-assessment-table table tbody tr.tr_slot').each(function (i, sel) {
          level = $(this).children('td:nth-child(1)').text();
          index = i + 1
          val = $('div.csd-assessment-table table tbody tr:nth-child(' + index + ') td:nth-child(4) select option:selected').val();
          if (level.charAt(0) == temp.charAt(0) && val != "")
            current_change += 1;
        });
        if (current_change <= max)
          current_change = current_change;
        else
          current = max;
        $('div.show table tr:nth-child(' + temp.charAt(0) + ') td:nth-child(3)').text(current_change + '/' + max);
        column_commit.children()[0].style.color = '#3366CC'
        column_recommend.children()[0].style.color = '#3366CC'
        column_point.children()[0].style.color = '#3366CC'
        $("div.show table tr:nth-child(" + temp.charAt(0) + ")").css('backgroundColor', '#99CCFF')
      }
    });
  }
});

$(document).on("click", ".submit-assessment", function () {
  $.ajax({
    type: "POST",
    url: "/forms/reviewer_submit",
    data: {
      form_id: form_id,
      user_id: user_id,
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        warning(`The CDS assessment of ${response.user_name} has been submitted successfully.`);
        $("a.submit-assessment .fa-file-import").css("color", "#ccc");
        $('a.submit-assessment').removeClass('submit-assessment');
      } else {
        fails("Can't submit CDS.");
      }
    }
  });
});

$(document).on("click", ".approval-assessment", function () {
  $('#modal_approve_cds').modal('show');
});

$(document).on("click", "#confirm_yes_approve_cds", function () {
  $('#modal_approve_cds').modal('hide');
  $.ajax({
    type: "POST",
    url: "/forms/approve_cds",
    data: {
      form_id: form_id,
      user_id: user_id,
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        warning(`The CDS assessment of ${response.user_name} has been approved successfully.`);
        $("a.approval-assessment i").css("color", "#ccc");
        $('a.approval-assessment').removeClass('approval-assessment');
      } else {
        fails("Can't approve CDS.");
      }
    }
  });
});

// request add more evidence
$(document).on("click", ".flag-cds-assessment", function () {
  if ($(this).data("click") == "yellow")
    $('#modal_cancel_request_add_more_evidence').modal('show');
  else
    $('#modal_request_add_more_evidence').modal('show');
  var form_slot_id = $(this).data("form-slot-id");
  var slot_id = $(this).data("slot-id");
  var recommend = $(this).data("recommend");
  $('#request_more_evidence_recommend').val(recommend);
  $('.slot_id').html(slot_id);
  $('.confirm_yes_request_add_more_evidence').data("click", $(this).data("click"))
  $('.confirm_yes_request_add_more_evidence').val(form_slot_id);
});

$(document).on("click", ".confirm_yes_request_add_more_evidence", function () {
  $('#modal_cancel_request_add_more_evidence, #modal_request_add_more_evidence').modal('hide');
  var _this = this;
  $.ajax({
    type: "POST",
    url: "/forms/request_add_more_evidence",
    data: {
      form_slot_id: $(_this).val(),
      form_id: form_id,
      slot_id: $('#modal_request_add_more_evidence').find(".slot_id").text(),
      user_id: user_id,
      recommend: $('#request_more_evidence_recommend').val(),
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      var success_message = ""
      var fails_message = ""
      if (response.color == "yellow") {
        success_message = "This slot has been requested more evidence successfully.";
        fails_message = "Can not requested"
      } else {
        success_message = "This slot has been cancelled requesting more evidence successfully.";
        fails_message = "Can not cancelled request"
      }
      if (response.status == "success") {
        $('#' + $(_this).val() + " i").css('color', response.color)
        $('#' + $(_this).val()).data("click", response.color);
        $('#' + $(_this).val()).attr("title", checkTitle(response.color))
        warning(success_message)
      } else {
        fails(fails_message);
      }
    }
  });
});