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
    temp += ` 
      <tr id="${e.id}" class="tr_slot">
        <td style="text-align:center" rowspan="${rowspan}">${e.slot_id}</td>
        <td style="position: relative; vertical-align: top" rowspan="${rowspan}">
          <div>${e.desc}</div>
          <br>
          <div id="slot_description_${e.slot_id}" style="display: none;">${e.evidence}</div>
          <br>
          <a id="${e.slot_id}" class="line-slot" href="javascript:void(0)" style="bottom:0; left:0; position: absolute;">View Details</a>
        </td>
        <td class="${checkDisableFormSlotsReviewer(is_reviewer || e.tracking.is_passed)}" rowspan="${rowspan}">
          <select class="commit-select" ${checkDisableFormSlotsReviewer(is_reviewer || e.tracking.is_passed)}>
            <option value="true" ${checkCommmit(e.tracking.is_commit)}>Commit</option>
            <option value="fasle" ${checkUncommmit(e.tracking.is_commit)}>Uncommit</option>
          </select>
        </td>
        <td class="${checkDisableFormSlotsReviewer(is_reviewer || e.tracking.is_passed)}" rowspan="${rowspan}"><textarea class="evidence autoresizing" ${checkDisableFormSlotsReviewer(is_reviewer || e.tracking.is_passed)}>${e.tracking.evidence}</textarea></td>`;
    if (length != 0) {
      temp += `
        <td class="${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[0].user_id)}"style="${checkPM(e.tracking.recommends[0].is_pm)}">
          <textarea style="resize:none" ${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[0].user_id)}>${e.tracking.recommends[0].recommends}</textarea>
        </td>
        <td class="disabled" style="${checkPM(e.tracking.recommends[0].is_pm)}"><textarea style="resize:none" disabled>${e.tracking.recommends[0].name}</textarea></td>`;
    } else {
      temp += `
        <td class="disabled" colspan="4" ><textarea style="resize:none" disabled></textarea></td>
        <td class="disabled" colspan="2" >
          <select class="given-point-select" disabled>
            <option></option>
          </select>
        </td>
        <td class="disabled" colspan="1"><textarea style="resize:none" disabled></textarea></td>`;
    }
    temp += `<td rowspan="${rowspan}">
              <a href="javascript:void(0)" title="History Comment" style="color:green;" class="icon modal-view-assessment-history" data-id="${e.id}" data-slot-id="${e.slot_id}"><i class="fas fa-history"></i></a>
              </br>
              `;
    if (e.tracking.flag != "red")
      temp += `<a href="javascript:void(0)" title="${checkTitle(e.tracking.flag)}"  class="flag-cds-assessment icon ${class_flag}" data-click="${flag}" data-form-slot-id="${e.tracking.id}" data-slot-id="${e.id}" ><i style="color: ${e.tracking.flag};" class="far fa-flag"></i></a>
              </br>`;
    if (e.tracking.is_passed)
      temp += `<a href="javascript:void(0)" title="Re-Assessment" class="icon modal-view-re-assess" data-id="${e.id}" data-slot-id="${e.slot_id}"><i class="fa fa-edit"></i></a>`;
    else
      temp += `<a href="javascript:void(0)" title="Re-Assessment" style="color:gray;" class="icon"><i class="fa fa-edit"></i></a>`
    temp += `</td></tr>`;

    if (length > 1) {
      for (i = 1; i < length; i++) {
        temp += `flag-cds-assessment
          <tr>
            <td class="${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id)}"style="${checkPM(e.tracking.recommends[i].is_pm)}"><textarea style="resize:none"  ${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id)}>${e.tracking.recommends[i].recommends}</textarea></td>
            <td class="${checkDisableFormSlotsStaff(is_reviewer, e.tracking.recommends[i].user_id)}"style="${checkPM(e.tracking.recommends[i].is_pm)}"><textarea style="resize:none" disabled>${e.tracking.recommends[i].name}</textarea></td>
          </tr>`;
      }
    }
  });
  if (jQuery.isEmptyObject(response)) {
    temp = '<td colspan="18" style="text-align:center">No data available in table</td>';
  }
  $('.cdp-table table tbody').html(temp);
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

function resizeTextarea() {
  $(".autoresizing").on("input", function () {
    if ($(this).height() < $(this).parent().height())
      return;
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  $(".autoresizing").each((i, el) => {
    if (el.textLength == 0)
      return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  })

}

function checkTitle(flag) {
  var title = "Request more evidences";
  if (flag == "yellow")
    title = "Need to add more evidences";
  if (flag == "green")
    title = "Evidences have been added and sent to Requester";
  return title
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

