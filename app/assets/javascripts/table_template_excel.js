$(document).ready(function(){
  
    $('.export_excel_icon').on('click', function(){
        var template_id = $(this).data("template_id");
        var ext = $(this).data("ext");

        $.ajax({
            type: "GET",
            url: "/templates/" + template_id + "/" + ext,
            dataType: "json",
            success: function (response) {
              $(response).each(
                function (i, e) {
                    // download this file
                    window.location = e['filename'];                    
                }
              );
            }
          });
    });

    

})