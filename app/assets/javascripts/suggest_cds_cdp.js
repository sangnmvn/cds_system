$(document).ready( function () {
    loadLevelSuggest();
    $("#suggest_level").trigger('change');
    $("#suggest_name").change( function(){
        loadLevelSuggest();
        $("#suggest_rank").val($("#suggest_name").val());
    });
    $("#suggest_rank").change( function(){
        $("#suggest_name").val($("#suggest_rank").val()).trigger('change');
    });
    $("#btn_find_suggest").click( function(){
        $.ajax({
            url: "/forms/get_data_suggest/",
            type: "GET",
            headers: {
              "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
            },
            data: { 
                form_id: form_id,
                title_id: $("#suggest_name").val(),
                level: $("#suggest_level").val(),
            },
            dataType: "json",
            success: function (response) {
                if (response.data.length == 0) return;
            }
        });
    });
})
function loadLevelSuggest(){
    $.ajax({
        url: "/forms/get_suggest_level/",
        type: "GET",
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
        },
        data: { form_id: form_id, title_id: $("#suggest_name").val() },
        dataType: "json",
        success: function (response) {
            if (response.data.length == 0) return;
            var temp = "";
            for (var i = 0; i < response.data.length; i++) {
                temp += `<option value="` + response.data[i] + `">` + response.data[i] + `</option>`
            }
            $("#suggest_level").html(temp).trigger('change');
        }
    });
}