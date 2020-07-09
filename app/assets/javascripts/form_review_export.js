$(document).ready(function ()
{
    $("#export_excel_cds_review").on('click', function()
    {
        $.ajax({
            type: "POST",
            url: "/forms/export_excel_cds_review",
            data: {},
            headers: {
              "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
            },
            dataType: "json",
            success: function (response) {
        
      
            }
          });
    })
})
