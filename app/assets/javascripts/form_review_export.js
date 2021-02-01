function resetExportIconColor() {
  if (checkPeriodFilter()) {
    $("#export_excel_cds_review i").prop("style", "color: #009000; opacity: 1.0;");
    $("#export_pdf_cds_review i").prop("style", "color: #9F6600; opacity: 1.0;");
  } else {
    $("#export_excel_cds_review i").prop("style", "color: #404040; opacity: 0.5;");
    $("#export_pdf_cds_review i").prop("style", "color: #404040; opacity: 0.5;");
  }
  changePeriodTableHeader()
}

function changePeriodTableHeader() {
  $.ajax({
    type: "POST",
    url: "/forms/get_period_table_header",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      company_ids:  $('#company_filter').val(),
      period_ids: $('#period_filter').val(),
    },
    dataType: "json",
    success: function (response) {
      $('.table_header_period_prev').text("Period " + response.period_prev)
      $('.table_header_period').text("Period " + response.period)
    }
  });
}

function checkPeriodFilter() {
  return !(data_filter.period == "" || data_filter.period == "0" || data_filter.period.length > 1)
}

function callAjaxExport(ext) {
  $.ajax({
    type: "POST",
    url: "/forms/export_excel_cds_review",
    data: {
      company_ids: data_filter.company,
      project_ids: data_filter.project,
      role_ids: data_filter.role,
      user_ids: data_filter.user,
      period_ids: data_filter.period,
      ext: ext
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
      // download this file in NEW TAB
      if (response.file_path == "") {
        alert("File is empty!");
      } else {
        window.open("/" + response.file_path, '_blank');
      }
    }
  });
}
$(document).ready(function () {
  $("#export_excel_cds_review").on('click', function () {
    // COMMENT the line below if you don't need the data
    if (checkPeriodFilter()) {
      callAjaxExport("xlsx");
    }
  });
  $("#export_pdf_cds_review").on('click', function () {
    // COMMENT the line below if you don't need the data

    if (checkPeriodFilter()) {
      callAjaxExport("pdf");
    }
  });

  $(".apply-filter, .reset-filter").on("click", function () {
    resetExportIconColor();
  })
});