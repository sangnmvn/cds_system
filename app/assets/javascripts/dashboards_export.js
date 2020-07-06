function callAjaxExport(ext){
  $.ajax({
    url: "/dashboards/export_up_title",
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
      window.open(response['filename'], '_blank');
    }
  });
}

$("#export_excel_up_title").on('click', function () {
  callAjaxExport("xlsx");
});

$("#export_pdf_up_title").on('click', function () {
  callAjaxExport("pdf");
});