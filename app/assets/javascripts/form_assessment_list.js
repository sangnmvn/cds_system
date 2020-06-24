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
      var temp = "";
      if (response.length == 0)
        temp = `<tr><td colspan="8" style="text-align:center">No data available in table</td></tr>`;
      for (var i = 0; i < response.length; i++) {
        var form = response[i];
        link = `/forms/cds_assessment`;
        if (form.status == "Done")
          link = `/forms/cds_assessment?title_history_id=${form.id}`;
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
              <td class="type-number">{no}</td> 
              <td class="type-text"><a href='{link_view}'>{period}</a></td> 
              <td class="type-text">{role}</td> 
              <td class="type-text">{title}</td> 
              <td class="type-number">{rank}</td> 
              <td class="type-number">{level}</td> 
              <td class="type-text">{status}</td>
              <td class="type-icon"> 
                <a data-id='{id}' href='{link}'><i class='fa fa-pencil icon' style='color: {color_edit}'></i></a>
                &nbsp;
                <a class='{status_class}' data-id='{id}' data-period-cds='{period}' href='#'>
                  <i class='fa fa-trash icon' style='color: {color_delete}'></i>
                </a> 
              </td> 
            </tr>`.formatUnicorn({
          id: form.id,
          no: i + 1,
          link: link,
          link_view: link_view,
          period: form.period_name,
          role: form.role_name,
          level: form.level,
          rank: form.rank,
          title: form.title,
          status: form.status,
          color_delete: color_delete,
          color_edit: color_edit,
          status_class: status_class,
        });
        temp += this_element;
      }
      $(".table-cds-assessment-list tbody").html(temp);
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
        success(
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
