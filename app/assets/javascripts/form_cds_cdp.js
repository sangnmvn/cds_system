function loadDataAssessmentList() {
  $.ajax({
    type: "GET",
    url: "/forms/get_list_cds_assessment/",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    data: {},
    dataType: "json",
    success: function (response) {
      if (response.length == 0) {
        $(".table-cds-assessment-list tbody").html('<tr><td colspan="10" class="type-icon">No data available this table</td></tr>')
        return;
      }
      var temp = "";
      for (var i = 0; i < response.length; i++) {
        var form = response[i];
        link = `/forms/cdp_assessment?form_id=` + form.id;
        if (form.status == "Done")
          link = `/forms/cdp_assessment?title_history_id=${form.id}`;
        link_view = link;
        var color_delete = "red";
        var color_edit = "#fc9803";
        var status_class = "delete-cds";
        if (form.status == "Done") {
          color_delete = "gray";
          status_class = "";
          color_edit = "gray";
          link = '#';
        }
        if (!["Done", "New"].includes(form.status)) {
          color_delete = "gray";
          status_class = "";
          color_edit = "gray";
          link = "#";
        }
        var this_element = `<tr id='period_id_{id}'> 
              <td class="type-number"></td> 
              <td class="type-text"><a href='{link_view}'>{period}</a></td> 
              <td class="type-text">{role}</td> 
              <td class="type-number">{title}</td> 
              <td class="type-number">{rank}</td> 
              <td class="type-text">{level}</td>
              <td class="type-text">{submit_date}</td>
              <td class="type-text">{approved_date}</td>
              <td class="type-text">{status}</td>
              <td class="type-icon"> 
                <a data-id='{id}' href='{link}'><i class='fa fa-pencil icon' style='color: {color_edit}' title="Edit CDS/CDP"></i></a>
                &nbsp;
                <a class='{status_class}' data-id='{id}' data-period-cds='{period}' href='#' title="Delete CDS/CDP">
                  <i class='fa fa-trash icon' style='color: {color_delete}'></i>
                </a> 
              </td> 
            </tr>`.formatUnicorn({
          id: form.id,
          link: link,
          link_view: link_view,
          period: form.period_name,
          role: form.role_name,
          level: form.level,
          rank: form.rank,
          title: form.title,
          approved_date: form.approved_date,
          submit_date: form.submit_date,
          status: form.status,
          color_delete: color_delete,
          color_edit: color_edit,
          status_class: status_class,
        });
        temp += this_element;
      }
      $(".table-cds-assessment-list tbody").html(temp);

      var table = $(".table-cds-assessment-list").DataTable({
        "bLengthChange": false,
        "bFilter": false,
        "bAutoWidth": false,
        "columnDefs": [
          {
            "searchable": false,
            "orderable": false,
            "targets": 0,
          }
        ]
      });
      table.on("order.dt search.dt", function () {
        table.column(0, { search: "applied", order: "applied" })
          .nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
          });
      }).draw();
    },
  });
}

$(document).ready(function () {
  loadDataAssessmentList();
});

// delete cds
$(document).on("click", ".delete-cds", function () {
  var id = $(this).data("id");
  var delete_period_cds = $(this).data("period-cds");
  $("#confirm_yes_delete_cds").val(id);
  $("#delete_period_cds").html(delete_period_cds);
  $("#modal_delete_cds").modal("show");
});

$(document).on("click", "#confirm_yes_delete_cds", function () {
  delete_period_cds = $("#delete_period_cds").text();
  var id = $("#confirm_yes_delete_cds").val();
  $.ajax({
    type: "DELETE",
    url: "/forms/" + id,
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    dataType: "json",
    success: function (response) {
      $("#modal_delete_cds").modal("hide");
      if (response.status == "success") {
        loadDataAssessmentList();
        warning(
          "The CDS/CDP for period " +
          delete_period_cds +
          " has been deleted successfully."
        );
      } else {
        fails("Can't delete CDS/CDP for period " + delete_period_cds + " .");
      }
    },
  });
});
