function callAjaxExport(url, ext){
  $.ajax({
    url: url,
    data: {
      ext: ext,
      company_ids: data_filter["company_id"], 
      project_ids: data_filter["project_id"],
      role_ids:  data_filter["role_id"]
    },
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      // download this file in NEW TAB
      if (response['filename'] != "")
      {
        window.open(response['filename'], '_blank');
      }
      else
      {
        alert("File is empty!");
      }
    }
  });
}

$("#export_excel_up_title").on('click', function () {
  callAjaxExport("/dashboards/export_up_title", "xlsx");
});

$("#export_pdf_up_title").on('click', function () {
  callAjaxExport("/dashboards/export_up_title", "pdf");
});

$("#export_excel_down_title").on('click', function () {
  callAjaxExport("/dashboards/export_down_title", "xlsx");
});

$("#export_pdf_down_title").on('click', function () {
  callAjaxExport("/dashboards/export_down_title", "pdf");
});

$("#export_excel_keep_title").on('click', function () {
  callAjaxExport("/dashboards/export_keep_title", "xlsx");
});

$("#export_pdf_keep_title").on('click', function () {
  callAjaxExport("/dashboards/export_keep_title", "pdf");
});
