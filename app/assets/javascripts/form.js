
$(document).ready(function () {
  $(".left-panel-competency").hide();
  $("#body-row .collapse").collapse("hide");
  drawColorTitleFormPreviewResult(3, 9, "#FAD7A0");
  drawColorTitleFormPreviewResult(10, 16, "#d4f6ff");
  drawColorTitleFormPreviewResult(17, 23, "#feffd4");
  drawColorTitleFormPreviewResult(24, 30, "#d4f6ff");
  drawColorTitleFormPreviewResult(31, 37, "#FAD7A0");
  
  $("[data-toggle=sidebar-colapse]").click(function () {
    SidebarCollapse();

  });
  function drawColorTitleFormPreviewResult(start, end, color) {
    for (i = start; i <= end; i++) {
      $(".table-preview-result thead tr td:nth-child(" + i + ")").css(
        "background-color",
        color
      );
    }
  }

  function SidebarCollapse() {
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
        temp += ` <div class="card">
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
        <div id="collapse${i}" class="collapse" data-parent="#accordion">
          <div class="card-body">
            <div class="competency">
              <table class="table table-primary table-responsive-sm table-mytable">
                <tbody>`
        var l = '';
        var levels = response[competency].levels
        for (level in levels) {
          l += ` <tr class="d-flex">
                    <td class="col-2"></td>
                    <td class="col-7">Level ${level}</td>
                    <td class="col-3">${levels[level].current}/${levels[level].total}</td>
                  </tr>`
        }
        temp += l
        temp += `</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`
        i += 1;
      };
      $('#competency_panel').html(temp);
      $(".card table thead tr").click(function () {
        $(".collapse").removeClass("show");
        $(".card-header table tr").css("background-color", "#ccc");
        id = $(this).data("target");
        $(id).addClass("show");
        num = id.split("#collapse");
        $(".table" + Number(num[1]) + " tr").css("background-color", "#bbcbea");
      });
      $('#card0').click()
    }
  });
}
function resize_textarea() {
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

function getValueStringPoint(point){
  switch(point) {
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

function loadDataSlots(response){
  var temp = "";
  $(response).each(function (i, e) {
    length = e.tracking.recommends.length;
    temp += `
    <tr id="${e.id}" class="tr_slot">
      <td style="text-align:center" rowspan="${length}">${e.slot_id}</td>
      <td style="position: relative;" rowspan="${length}">
        <div>${e.desc}</div>
        <br>
        <div id="slot_description_${e.slot_id}" style="display: none;">
        ${e.evidence}
        </div><br>
        <a id="${e.slot_id}" class="line-slot" href="javascript:void(0)" style="bottom:0; left:0; position: absolute;">View Details</a>
      </td>
      <td colspan="2" rowspan="${length}">
        <select class="commit-select">
          <option value="true" ${checkCommmit(e.tracking.is_commit)}>Commit</option>
          <option value="fasle" ${checkUncommmit(e.tracking.is_commit)}>Uncommit</option>
        </select>
      </td>
      <td colspan="4" rowspan="${length}">
        <select class="point-select">
          <option></option> 
          <option value="5" ${check(e.tracking.point, 5)}>5 - Outstanding</option>
          <option value="4" ${check(e.tracking.point, 4)}>4 - Exceeds Expectations</option>
          <option value="3" ${check(e.tracking.point, 3)}>3 - Meets Expectations</option>
          <option value="2" ${check(e.tracking.point, 2)}>2 - Needs Improvement</option>
          <option value="1" ${check(e.tracking.point, 1)}>1 - Does Not Meet Minimun Standards</option>
        </select>
      </td>
      <td colspan="5" rowspan="${length}"><textarea class="evidence autoresizing">${e.tracking.evidence}</textarea></td>
      <td colspan="2"><textarea style="resize:none"  disabled>${e.tracking.recommends[0].recommends}</textarea></td>
      <td>
        <select style="background-color: #ebebe4;" class="given-point-select" disabled>
          <option></option>
          <option value="5" ${check(e.tracking.recommends[0].given_point, 5)}>5 - Outstanding</option>
          <option value="4" ${check(e.tracking.recommends[0].given_point, 4)}>4 - Exceeds Expectations</option>
          <option value="3" ${check(e.tracking.recommends[0].given_point, 3)}>3 - Meets Expectations</option>
          <option value="2" ${check(e.tracking.recommends[0].given_point, 2)}>2 - Needs Improvement</option>
          <option value="1" ${check(e.tracking.recommends[0].given_point, 1)}>1 - Does Not Meet Minimun Standards</option>
        </select>
      </td>
      <td><textarea style="resize:none" disabled>${e.tracking.recommends[0].name}</textarea></td>
      <td rowspan="${length}">
        <a href="javascript:void(0)" style="color:green;" class="icon modal-view-assessment-history" data-id="${e.id}" data-slot-id="${e.slot_id}">
          <i class="fas fa-history"></i>
        </a>
        <a href="javascript:void(0)" class="flag--icon__red icon" data-slot-id="${e.slot_id}">
        <i class="far fa-flag"></i>
        </a>
      </td>
      </tr>
      `;
    for (i = 1; i < length; i++) {
      temp += `
        <tr>
        <td colspan="2"><textarea style="resize:none"  disabled>${e.tracking.recommends[i].recommends}</textarea></td>
        <td>
          <select style="background-color: #ebebe4;" class="given-point-select" disabled>
            <option></option>
            <option value="5" ${check(e.tracking.recommends[i].given_point, 5)}>5 - Outstanding</option>
            <option value="4" ${check(e.tracking.recommends[i].given_point, 4)}>4 - Exceeds Expectations</option>
            <option value="3" ${check(e.tracking.recommends[i].given_point, 3)}>3 - Meets Expectations</option>
            <option value="2" ${check(e.tracking.recommends[i].given_point, 2)}>2 - Needs Improvement</option>
            <option value="1" ${check(e.tracking.recommends[i].given_point, 1)}>1 - Does Not Meet Minimun Standards</option>
          </select>
        </td>
        <td><textarea style="resize:none" disabled>${e.tracking.recommends[i].name}</textarea></td>
        </tr>
        `;
    }

  });
  $('.csd-assessment-table table tbody').html(temp);
  resize_textarea();
}

$(document).on("click", ".line-slot", function () {
  if (
    document.getElementById("slot_description_" + this.id).style.display ==
    "block"
  ) {
    document.getElementById("slot_description_" + this.id).style.display =
      "none";
    document.getElementById(this.id).innerText = "ViewDetails";
  } else {
    document.getElementById("slot_description_" + this.id).style.display =
      "block";
    document.getElementById(this.id).innerText = "Hide Details";
  }
});

// delete cds 

$(document).on("click", ".delete-cds", function () {
  var id = $(this).data("id");
  var delete_period_cds = $(this).data("period-cds");
  $('#confirm_yes_delete_cds').val(id);
  $('#delete_period_cds').html(delete_period_cds);
  $('#modal_delete_cds').modal('show');
});

$(document).on("click", "#confirm_yes_delete_cds", function () {
  delete_period_cds = $('#delete_period_cds').text();
  $.ajax({
    type: "DELETE",
    url: "/forms/" + $('#confirm_yes_delete_cds').val(),
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      $('#modal_delete_cds').modal('hide');
      if (response.status == "success") {
        LoadDataAssessmentList();
        success("The CDS for period " + delete_period_cds + " has been deleted successfully.");
      } else {
        fails("Can't delete CDS for period " + delete_period_cds + " .");
      }

    }
  });
});


// left panel 
$(document).on("click", ".card table thead tr", function () {
  var competency_id = $(this).data("id-competency");
  var data = { competency_id: competency_id };
  if (form_id)
    data.form_id = form_id;
  else if (title_history_id)
    data.title_history_id = title_history_id;

  // var form_id = parseInt(findGetParameter("form_id"));
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
      slot_id: id
    },  
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      temp = '';
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
      </tr>
        `;
      for (x = 1; x < length; x++) {
        temp += `
        <tr>
        <td>${response[i].recommends[x].recommends}</td>
        <td>${getValueStringPoint(response[i].recommends[x].given_point)}</td>
        <td>${response[i].recommends[x].name}</td>
        <td>${response[i].recommends[x].reviewed_date}</td>
        </tr>
        `;
      }
      };
      $('.table-view-assessment-history tbody').html(temp);
    }
  });


});

function get_data_filter() {
  filter = "";
  $('#filter-form-slots :selected').each(function (i, sel) {
    filter += $(sel).val()
    filter += ","
  });
  return filter.substring(0, filter.length - 1);;
}
function get_id_competency_current() {
  index = $(".card").find('.show').attr('id').split("collapse");
  return competency_id = $('.card .card-header .table' + index[1] + ' thead tr').data('id-competency');
}

$(document).on("change", ".search-assessment", function () {
  var data = {
    search: $(this).val(),
    filter: get_data_filter(),
    competency_id: get_id_competency_current()
  };
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
  var data = {
    // search: $(this).val(),
    filter: get_data_filter(),
    competency_id: get_id_competency_current()
  };
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


$(document).on("change", ".csd-assessment-table table tbody .tr_slot", function () {
  if ($(this).find('.point-select').val().length > 0 && $(this).find('.evidence').val().length > 0) {
    var slot_id = $(this)[0].id;
    var is_commit = $(this).find('.commit-select').val();
    var point = $(this).find('.point-select').val();
    var evidence = $(this).find('.evidence').val();
    $.ajax({
      type: "POST",
      url: "/forms/save_cds_assessment_staff",
      data: {
        form_id: form_id,
        is_commit: is_commit,
        point: parseInt(point),
        evidence: evidence,
        slot_id: slot_id,
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      success: function (response) {
      }
    });
  }
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
        success("This CDS for " + $("#modal_period #period_id option:selected").text() + " has been submit successfully..");
      } else {
        fails("Can't submit CDS.");
      }
    }
  });
});
// approve cds
$(document).on("click", "#confirm_yes_approve_cds", function () {
  $.ajax({
    type: "POST",
    url: "/forms/approve_cds",
    data: {
      form_id: form_id,
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      $('#modal_approve_cds').modal('hide');
      if (response.status == "success") {
        success("This CDS has been approve successfully..");
      } else {
        fails("Can't approve CDS.");
      }
    }
  });
});
