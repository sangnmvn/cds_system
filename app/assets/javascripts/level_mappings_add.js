function load_title_mapping_for_add() {
    $.ajax({
        type: "GET",
        url: "/level_mappings/get_title_mapping_for_new_level_mapping/",
        headers: {
            "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
        },
        data: {},
        dataType: "json",
        success: function (response) {
            // key: title
            // value: response with title = key
            // step 1: group by title
            var title_list = {};
            var competency_list = new Set();

            for (var i=0; i < response.length; i++){
                var data = response[i];
                var title_name = data.title;

                competency_list.add({name: data.competency_name, id: data.competency_id})

                if (title_name in title_list)
                {
                    title_list[title_name].push(data);
                }
                else
                {
                    title_list[title_name] = [data];
                }
            }
            
            // step 2: append all of the competency column
            final_html = '';
            for (let competency of competency_list){
                final_html += '<th data-competency-id="{id}" class="dynamic_title_header_col">{name}</td>'
                .formatUnicorn({id: competency.id, name: competency.name});                          
            }

            $("#title_header_column").append(final_html);
            debugger;
        }
    });
}

$(document).ready(function () {
    load_title_mapping_for_add();
});