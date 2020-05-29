function LoadDataAssessmentList() {
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
      for (var i = 0; i < response.length; i++) {
        var form = response[i];
        link = `/forms/cds_assessment`;
        if (form.status == "Done")
          link = `/forms/cds_assessment?title_history_id=${form.id}`;
        var color = "red";
        var status_class = "delete-cds";
        if (form.status == "Done") {
          color = "black";
          status_class = "";
        }
        var this_element = `<tr id='period_id_{id}'> 
              <td>{no}</td> 
              <td><a href='{link}'>{period}</a></td> 
              <td>{role}</td> 
              <td>{level}</td> 
              <td>{rank}</td> 
              <td>{title}</td> 
              <td>{status}</td> 
              <td class="{}"> 
                <a data-id='{id}' href='{link}'><i class='fa fa-pencil icon' style='color:#fc9803'></i></a> 
                <a class='{status_class}' data-id='{id}' data-period-cds='{period}' href='#'>
                  <i class='fa fa-trash icon' style='color: {color}'></i>
                </a> 
              </td> 
            </tr>`.formatUnicorn({
          no: i + 1,
          link: link,
          period: form.period_name,
          role: form.role_name,
          level: form.level,
          rank: form.rank,
          title: form.title,
          status: form.status,
          color: color,
          status_class: status_class,
        });
        temp += this_element;
      }
      $(".table-cds-assessment-list tbody").html(temp);
    },
  });
}

$(document).ready(function () {
  LoadDataAssessmentList();
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
  $.ajax({
    type: "DELETE",
    url: "/forms/" + $("#confirm_yes_delete_cds").val(),
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    dataType: "json",
    success: function (response) {
      $("#modal_delete_cds").modal("hide");
      if (response.status == "success") {
        LoadDataAssessmentList();
        success(
          "The CDS for period " +
            delete_period_cds +
            " has been deleted successfully."
        );
      } else {
        fails("Can't delete CDS for period " + delete_period_cds + " .");
      }
    },
  });
});
