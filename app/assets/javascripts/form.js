
$(document).ready(function () {
  var form_id = parseInt(findGetParameter("form_id"));
  loadDataPanel(form_id);
  $(".left-panel-competency").hide();
  $("#body-row .collapse").collapse("hide");
  drawColorTitleFormPreviewResult(3, 9, "#93dba3");
  drawColorTitleFormPreviewResult(10, 16, "#d4f6ff");
  drawColorTitleFormPreviewResult(17, 23, "#feffd4");
  drawColorTitleFormPreviewResult(24, 30, "#d4f6ff");
  drawColorTitleFormPreviewResult(31, 37, "#93dba3");
  
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

  function loadDataPanel(form_id) {
    $.ajax({
      type: "POST",
      url: "/forms/get_competencies/",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      data: {
        form_id: form_id,
      },
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



  $(".autoresizing").on("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });


});

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


function SelectPoint(point_val) {
  if (point_val.length > 1) {
    // && document.getElementById("").value
  }
}
// end

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
  // var form_id = parseInt(findGetParameter("form_id"));
  $.ajax({
    type: "POST",
    url: "/forms/get_cds_assessment",
    data: {
      form_id: form_id,
      competency_id: competency_id
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {

      var temp = "";
      $(response).each(function (i, e) {
        temp += `
        <tr>
          <td>${e.slot_id}</td>
          <td style="position: relative;">
            <div>${e.desc}</div>
            <br>
            <div id="slot_description_${e.slot_id}" style="display: none;">
            ${e.evidence}
            </div><br>
            <a id="${e.slot_id}" class="line-slot" href="javascript:void(0)" style="bottom:0; left:0; position: absolute;">View Details</a>
          </td>
          <td colspan="2">
            <select class="custom-select" style="border:none; height:100%;">
              <option></option>
              <option value="2">Commit</option>
              <option value="1">Uncommit</option>
            </select>
          </td>
          <td colspan="4">
            <select class="custom-select" style="border:none; height:100%;" onchange="SelectPoint(this.value)">
              <option></option>
              <option value="5">5 - Outstanding</option>
              <option value="4">4 - Exceeds Expectations</option> 
              <option value="3">3 - Meets Expectations</option>
              <option value="2">2 - Needs Improvement</option>
              <option value="1">1 - Does Not Meet Minimun Standards</option>
            </select>
          </td>
          <td colspan="5"><textarea class="autoresizing">${e.tracking.evidence}</textarea></td>
          <td colspan="2"><textarea class="autoresizing"></textarea></td>
          <td><textarea class="autoresizing"></textarea></td>
          <td><textarea class="autoresizing"></textarea></td>
          <td><a href="javascript:void(0)" style="color:green; font-size:25px" class="modal-view-assessment-history" data-slot-id="${e.slot_id}"><i class="fas fa-history"></i></a></td>
        </tr>
          `;
      });
      $('.csd-assessment-table table tbody').html(temp);
    }
  });
});


$(document).on("click", ".modal-view-assessment-history", function () {
  $('#modal_history_assessment').modal('show');
  var slot_id = $(this).data("slot-id");
  id = $(".card").find('.show').attr('id').split("collapse");
  competency_name = $('.card .card-header .table'+ id[1] +' thead tr td:nth-child(2)').text();
  competency_name = $.trim(competency_name);
  $('#assessment_history_competency_name').text(competency_name);
  $('#assessment_history_slot_id').text(slot_id);

});