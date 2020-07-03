$("#export_excel_up_title").on('click', function()
{
    $.ajax({
        url: "/dashboards/export_excel_up_title",
        data: {ext: "xlsx"},
        type: "POST",
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
        },
        success: function (response) {
          // download this file in NEW TAB
          window.open(response['filename'] ,'_blank');
        }
      });
    
});

$("#export_pdf_up_title").on('click', function()
{
    $.ajax({
        url: "/dashboards/export_excel_up_title",
        data: {ext: "pdf"},
        type: "POST",
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
        },
        success: function (response) {
          // download this file in NEW TAB
          window.open(response['filename'] ,'_blank');
        }
      });    
});