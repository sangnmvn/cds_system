function load_title_mapping_for_add() {
    role_id = $("#role_id").val();
    $.ajax({
        type: "GET",
        url: "/level_mappings/get_title_mapping_for_new_level_mapping/" + role_id,
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

                // convert to JSON because string is KEPT unique in set
                // while hash does NOT
                competency_list.add(JSON.stringify({name: data.competency_name, id: data.competency_id}))

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
            column_list = [];
            for (competency_s of competency_list){
                competency = JSON.parse(competency_s);
                column_list.push(competency.name);
                final_html += '<td data-competency-id="{id}" class="dynamic_title_header_col">{name}</td>'
                .formatUnicorn({id: competency.id, name: competency.name});                          
            }

            $("#title_header_column").append(final_html);            

            final_html = '';
            
            key_of_title_list = Object.keys(title_list)
            for (i=0; i<key_of_title_list.length; i++)
            {
                title_name = key_of_title_list[i];
                data_list = title_list[title_name];

                if (data_list.length == 0)
                {
                    continue;
                }
                // Giong nhau o tat ca record nen lay phan dau
                rank = data_list[0].rank;
                level = data_list[0].level;
                title_id = data_list[0].title_id;
                final_html += "<tr data-title_id='" + title_id + "'>";
                final_html += "<td>{title_name}</td> \
                               <td>{rank}</td>\
                               <td>{level}</td>".formatUnicorn({title_name: title_name, rank: rank, level: level});

                for (j=0; j< column_list.length; j++)
                {
                    current_cell_competency_name = column_list[j];
                    for (k=0; k< data_list.length; k++)
                    {
                        if (data_list[k].competency_name == current_cell_competency_name)
                        {
                            value_dropdown = "<select class='competency_value'> \
                            <option value='0-1'>0-1</option><option value='++1'>++1</option><option value='1'>1</option>\
                            <option value='1-2'>1-2</option><option value='++2'>++2</option><option value='2'>2</option>\
                            <option value='2-3'>2-3</option><option value='++3'>++3</option><option value='3'>3</option>\
                            <option value='4-5'>4-5</option><option value='++4'>++4</option><option value='4'>4</option>\
                            <option value='5-6'>0-1</option><option value='++5'>++5</option><option value='5'>5</option>\
                            </select>";

                            competency_value = data_list[k].value;

                            // select value from drop down
                            position_to_insert = value_dropdown.indexOf(" value='{value}'".formatUnicorn({value: competency_value}))
                            value_dropdown = value_dropdown.slice(0, position_to_insert) + " selected " + value_dropdown.slice(position_to_insert)
                            //

                            final_html += "<td>{value_dropdown}</td>".formatUnicorn({value_dropdown: value_dropdown});
                            break;
                        }
                    }
                }
                final_html += "</tr>";
            }

            $(".table-new-title-mapping tbody").html(final_html);
        }
    });
}

$(document).ready(function () {
    load_title_mapping_for_add();
});