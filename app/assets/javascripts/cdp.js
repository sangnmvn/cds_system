function loadDataSlots(response) {
  var temp = "";
  $(response).each(function (i, e) {
    length = e.tracking.recommends == undefined ? 0 : e.tracking.recommends.length;
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
    temp += `<div class="container-fluid cdp-slot-wrapper" data-slot-id="${e.id}" id="row_slot">
    <div class="row">
      <div class="col-11 div-slot" data-toggle="collapse" data-target="#content_${e.id}">
        <i class="fas fa-caret-down icon"></i>&nbsp &nbsp
        <b id="description-slot">${e.slot_id} - ${e.desc}</b>
      </div>
      <div class="col-1 div-slot" class="div-icon">
        <a type='button' class='btn-action' title="View slot's history" id="btn_view_history"><i class="fas fa-history icon-green"></i></a>
      </div>
    </div>
    <div id="content_${e.id}" class="collapse padding-collapse">
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
            <select class="form-control" id="staff-commit" ${checkDisableFormSlotsReviewer(is_reviewer || e.tracking.is_passed)}>
              <option value="false" ${checkUncommmit(e.tracking.is_commit)}> Un-commit </option>
              <option value="commit_cds" ${checkCommmit(e.tracking.is_commit)}> Commit CDS</option>
              <option value="commit_cdp" ${checkDataCDP(e.tracking.point, e.tracking.is_commit)}> Commit CDP</option>
            </select>
          </div>
      </div>
      <div class="row div-content" style="${checkDataPoint(e.tracking.point)}">
          <div class="col-2">
            <b>Self-Assessment (*):</b>
          </div>
          <div class="col-3">
            <select class="form-control" id="select-assessment" ${checkDisableFormSlotsReviewer(is_reviewer || e.tracking.is_passed)}>
              <option value="1" ${check(e.tracking.point, 1)}> 1 - Does Not Meet Minimum Standards </option>
              <option value="2" ${check(e.tracking.point, 2)}> 2 - Needs Improvement</option>
              <option value="3" ${check(e.tracking.point, 3)}> 3 - Meets Expectations</option>
              <option value="4" ${check(e.tracking.point, 4)}> 4 - Exceeds Expectations</option>
              <option value="5" ${check(e.tracking.point, 5)}> 5 - Outstanding</option>
            </select>
          </div>
      </div>
      <div class="row div-content div-row">
          <div class="col-2">
            <b class="comment">Staff Comment :</b>
          </div>
          <div class="col-3">
            <textarea id="command" maxlength="1000" placeholder="<comment content if any>" class="form-control text-comment" ${checkDisableFormSlotsReviewer(is_reviewer || e.tracking.is_passed)}>${e.tracking.evidence}</textarea>
          </div>
      </div>`
    if (length > 0) {
      var lst_approver = []
      temp += `<div class="row div-row arrow-box row-cdp">
                  <div class="col-3 div-slot" data-toggle="collapse" data-target="#reviewer_${e.id}">
                    <a type='button' class='btn-action' title="View slot's history" id="btn_view_history"><i class="fas fa-caret-down"></i></a>
                    <b>Reviewer Review</b>
                  </div>
                </div>
                <div id="reviewer_${e.id}" class="collapse padding-collapse-children">
                  <div class="row div-content">
                    <table class="table table-review" id="table-reviewer">`
      for (i = 0; i < length; i++) {
        if (checkPM(e.tracking.recommends[i].is_pm)) {
          lst_approver.push(e.tracking.recommends[i].user_id)
          lst_approver.push(e.tracking.recommends[i].given_point)
          lst_approver.push(e.tracking.recommends[i].name)
          lst_approver.push(e.tracking.recommends[i].recommends)
        } else {
          temp += `<tr class="${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id)}">
                <td>${e.tracking.recommends[i].name}</td>
                <td>
                  <select class="form-control select-commit" id="reviewer-commit" ${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id)}>
                    <option value="uncommit" selected> Un-commit </option>
                    <option value="commit"> Commit</option>
                  </select>
                </td>
                <td>
                  <select class="form-control select-commit" id="reviewer-asssessment" ${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id)}>
                    <option value="1" ${check(e.tracking.recommends[i].given_point, 1)}>1 - Does Not Meet Minimun Standards</option>
                    <option value="2" ${check(e.tracking.recommends[i].given_point, 2)}>2 - Needs Improvement</option>
                    <option value="3" ${check(e.tracking.recommends[i].given_point, 3)}>3 - Meets Expectations</option>
                    <option value="4" ${check(e.tracking.recommends[i].given_point, 4)}>4 - Exceeds Expectations</option>
                    <option value="5" ${check(e.tracking.recommends[i].given_point, 5)}>5 - Outstanding</option>
                  </select>
                </td>
                <td>
                  <textarea maxlength="1000" id="reviewer_recomment" placeholder="<comment content if any>" class="form-control" ${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id)}>${e.tracking.recommends[i].recommends}</textarea>
                </td>
              </tr>`
        }
      }
      if (lst_approver.length > 0)
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
                  <tr class="${checkDisableFormSlotsStaff(is_reviewer, lst_approver[0])}">
                    <td>${lst_approver[2]}</td>
                    <td>
                      <select class="form-control select-commit" id="approver-commit" ${checkDisableFormSlotsStaff(is_reviewer, lst_approver[0])}>
                        <option value="uncommit" selected> Uncommit </option>
                        <option value="commit"> Commit</option>
                      </select>
                    </td>
                    <td>
                      <select class="form-control select-commit" id="approver-assessment" ${checkDisableFormSlotsStaff(is_reviewer, lst_approver[0])}>
                        <option value="1" ${check(lst_approver[1], 1)}>1 - Does Not Meet Minimun Standards</option>
                        <option value="2" ${check(lst_approver[1], 2)}>2 - Needs Improvement</option>
                        <option value="3" ${check(lst_approver[1], 3)}>3 - Meets Expectations</option>
                        <option value="4" ${check(lst_approver[1], 4)}>4 - Exceeds Expectations</option>
                        <option value="5" ${check(lst_approver[1], 5)}>5 - Outstanding</option>
                      </select>
                    </td>
                    <td>
                      <textarea maxlength="1000" id="approver-recomment" placeholder="<comment content if any>" class="form-control" ${checkDisableFormSlotsStaff(is_reviewer, lst_approver[0])}>${lst_approver[3]}</textarea>
                    </td>
                  </tr>
                </table>
            </div>
          </div>
          </div>
        </div>`
      }
      else {
        temp += `</div></div></div>`
      }
    }
    else {
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
      break;
    case "Done":
      break;
    case "Awaiting Review":
      break;
  }
}
function check(x, y) {
  if (x == y)
    return "selected"
  return ""
}

function checkDataPoint(x) {
  if (x == "")
    return "display:none"
  return ""
}

function checkDataCDP(x, y) {
  if (x == "" && y == true)
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
function checkPM(is_pm) {
  if (is_pm)
    return true
}
function checkDisableFormSlotsStaff(is_reviewer, user_id) {
  if (is_reviewer == false)
    return "disabled"
  else
    return checkDisableFormSlotsUser(user_id);
}

function checkDisableFormSlotsReviewer(is_reviewer) {
  if (is_reviewer == true)
    return "disabled"
  else
    return ""
}

function checkDisableFormSlotsUser(user_id) {
  if (user_id != user_current)
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
  // $('.filter-slots ul li').addClass('active');
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
      }
    });
  });

  $(document).on("change", "#staff-commit", function () {
    if ($(this).val() == "commit_cds") {
      $(this).parent().parent().next().removeAttr("style")
      $(this).parent().parent().nextAll()[1].children[0].children[0].innerHTML = "Staff Comment (*):"
    } else {
      $(this).parent().parent().next().attr("style", "display:none")
      $(this).parent().parent().nextAll()[1].children[0].children[0].innerHTML = "Staff Comment :"
    }
  });

  $("#content-slot").on("change", ".search-assessment", function () {
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

  $("#content-slot").on("change", "#filter-form-slots", function () {
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

  $("#content-slot").on("change", "#row_slot", function () {
    var is_commit = $(this).find('#staff-commit').val();
    var evidence = $(this).find('#command').val();
    var point = $(this).find('#select-assessment').val();
    if(is_commit == "commit_cdp")
      point = ""
    var temp = $(this).find('#description-slot').html().split(" - ")[0];
    if (is_commit == "commit_cdp" || (is_commit == "commit_cds" && evidence != "")) {
      is_commit = true
      var slot_id = $(this).data("slot-id");
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
          current = $('div.show table tr:nth-child(' + temp.charAt(0) + ') td:nth-child(3)').text().split('/');
          max = parseInt(current[1]);
          current_change = 0
          $('div#content-slot div#row_slot').each(function (i, sel) {
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
          $("div.show table tr:nth-child(" + temp.charAt(0) + ")").css('backgroundColor', '#99CCFF')
        }
      });
    }
  });
  $("#content-slot").on("click", "#btn_view_history", function () {
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
  $(document).on("click", ".submit-assessment", function () {
    $('#modal_period').modal('show');
  });
  $(document).on("click", "#confirm_submit_cds", function () {
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
          success("This CDS for " + $("#modal_period #period_id option:selected").text() + " has been submitted successfully.");
          $("a.submit-assessment .fa-file-import").css("color", "#ccc");
          $('a.submit-assessment').removeClass('submit-assessment');
          checkStatusFormStaff(status)
          checkChangeSlot();
        } else {
          fails("Can't submit CDS.");
        }
      }
    });
  });
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
  if (flag == "yellow")
    title = "Need to add more evidences";
  if (flag == "green")
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

