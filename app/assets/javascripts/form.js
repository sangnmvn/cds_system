function LoadDataAssessmentList()
  {
    $.ajax({
      type: "GET",
      url: "/forms/get_list_cds_assessment/",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      data: {
      },
      dataType: "json",
      success: function (response) {
        var temp = '';
        for (var i=0; i<response.length; i++){
          var form = response[i];
          var period_str = form.period.from_date.split("-")[1] + '/' + form.period.from_date.split("-")[0] + ' - ' + form.period.to_date.split("-")[1] + '/' + form.period.to_date.split("-")[0];
          var this_element = "<tr id='period_id_{id}'> \
            <td>{no}</td> \
            <td><a href='{period_link}'>{period}</a></td> \
            <td>{role}</td> \
            <td>{level}</td> \
            <td>{rank}</td> \
            <td>{title}</td> \
            <td>{status}</td> \
            <td> \
              <a data-id='{id}' href='#'><i class='fa fa-pencil icon' style='color:#fc9803'></i></a> \
              <a class='delete-cds' data-id='{id}' href='#'><i class='fa fa-trash icon' style='color:red'></i></a> \
            </td> \
          </tr>".formatUnicorn({no: i+1, id: form.id, period: period_str, role: form.role.name, level: form.level, rank: form.rank, title: form.title.name, status: form.status, period_link: "periods/" + form.period.id + '/'});
          temp += this_element;
        };
        $(".table-cds-assessment-list tbody").html(temp);
      }
    });
  }

$(document).ready(function () {
  loadDataPanel(1);
  $(".left-panel-competency").hide();
  $("#body-row .collapse").collapse("hide");
  drawColorTitleFormPreviewResult(3, 9, "#93dba3");
  drawColorTitleFormPreviewResult(10, 16, "#d4f6ff");
  drawColorTitleFormPreviewResult(17, 23, "#feffd4");
  drawColorTitleFormPreviewResult(24, 30, "#d4f6ff");
  drawColorTitleFormPreviewResult(31, 37, "#93dba3");
  LoadDataAssessmentList();

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
        for ( competency in response){
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
                  for ( level in levels){
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

  $(".line-slot").each(function (index) {
    $(this).on("click", function () {
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
        document.getElementById(this.id).innerText = "HideDetails";
      }
    });
  });
  $(".autoresizing").on("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  
});

function SelectPoint(point_val) {
  if (point_val.length > 1 ) {
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
  form_id = $('#confirm_yes_delete_cds').val();
  delete_period_cds = $('#delete_period_cds').text();
  $.ajax({
    type: "DELETE",
    url: "/forms/"+form_id,
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        $('#modal_delete_cds').modal('hide');
        success("The CDS for period "+ delete_period_cds +" has been deleted successfully.");
      }else {
        fails("Can't delete CDS for period "+ delete_period_cds + " .");
      }

    }
  });
});


// left panel 
$(document).on("click", ".card table thead tr", function () {
  var competency_id = $(this).data("id-competency");
  $.ajax({
    type: "POST",
    url: "/forms/get_cds_assessment",
    data: {
      competency_id: competency_id
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      // if (response.status == "success") {
      //   $('#modal_delete_cds').modal('hide');
      //   success("The CDS for period "+ delete_period_cds +" has been deleted successfully.");
      // }else {
      //   fails("Can't delete CDS for period "+ delete_period_cds + " .");
      // }

    }
  });

  
});