function resetExportIconColor() {
  if (checkPeriodFilter()) {
    $("#export_excel_cds_review i").prop("style", "color: #009000");
    $("#export_pdf_cds_review i").prop("style", "color: #9F6600");
  } else {
    $("#export_excel_cds_review i").prop("style", "color: #808080");
    $("#export_pdf_cds_review i").prop("style", "color: #808080");
  }
}

function checkPeriodFilter() {
  try {
    // if data_filter doesn't exist
    data_filter
  } catch (e) {
    return true;
  }
  if (data_filter.period == "" || data_filter.period == "0" || data_filter.period.split(",").length > 1) {
    return false;
  } else {
    return true;
  }
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
    if (checkPeriodFilter()) {
      callAjaxExport("xlsx");
    } else {
      alert("You can only select 1 period on export");
    }
  });
  $("#export_pdf_cds_review").on('click', function () {
    if (checkPeriodFilter()) {
      callAjaxExport("pdf");
    } else {
      alert("You can only select 1 period on export");
    }
  });

  $(".apply-filter, .reset-filter").on("click", function () {
    resetExportIconColor();
  })
  resetExportIconColor();
});