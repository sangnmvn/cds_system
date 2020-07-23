function loadTitleMappingForEdit() {
  role_id = global_role_id;

  $.ajax({
    type: "GET",
    url: "/level_mappings/get_title_mapping_for_edit_level_mapping/" + role_id,
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
      for (var i = 0; i < response.length; i++) {
        var data = response[i];
        var title_name = data.title;
        title_list[title_name] = [];
        // convert to JSON because string is KEPT unique in set
        // while hash does NOT
        for (var i = 0; i < response.length; i++) {
          var data = response[i];
          var title_name = data.title;
          // convert to JSON because string is KEPT unique in set
          // while hash does NOT
          competency_list.add(JSON.stringify({
            name: data.competency_name,
            id: data.competency_id
          }))
          if (title_name in title_list) {
            title_list[title_name].push(data);
          } else {
            title_list[title_name] = [data];
          }
        }
      }
      var title_with_most_competency = ""
      var max_competency_count = -1
      for (var title_name in title_list)
      {
        current_length = title_list[title_name].length
        if (current_length > max_competency_count)
        {
          title_with_most_competency = title_name;
          max_competency_count = current_length;
        }        
      }
      key_of_title_list = Object.keys(title_list);
      // get sorted competency list
      unsorted_competency_list = Array.from(competency_list);
      
      sortByKey(title_list[title_name], "competency_location");          
      competency_list = []

      for (var h = 0; h < unsorted_competency_list.length; h++) {            
        competency_list.push(JSON.stringify({
          name: title_list[title_with_most_competency][h].competency_name,
          id: title_list[title_with_most_competency][h].competency_id
        }))        
      }
      // step 2: append all of the competency column
      final_html = '';
      column_list = [];
      for (competency_s of competency_list) {
        competency = JSON.parse(competency_s);
        column_list.push(competency.name);
        final_html += '<td data-competency-id="{id}" class="dynamic-title-header-col">{name} (*)</td>'
          .formatUnicorn({
            id: competency.id,
            name: competency.name
          });
      }
      $("#title_header_column").append(final_html);
      final_html = '';
      for (i = 0; i < key_of_title_list.length; i++) {
        title_name = key_of_title_list[i];
        data_list = title_list[title_name];
        if (data_list.length == 0) {
          continue;
        }
        // Rank , title_id is the same in all records having same title name
        rank = data_list[0].rank;
        title_id = data_list[0].title_id;
        final_html += "<tr data-title_id='" + title_id + "'>";
        final_html += `<td style="text-align: left">{title_name}</td> 
                               <td class="number">{rank}</td>
                               `.formatUnicorn({
          title_name: title_name,
          rank: rank
        });
        for (j = 0; j < column_list.length; j++) {
          current_cell_competency_name = column_list[j];
          for (k = 0; k < data_list.length; k++) {
            // find competency data suitable for competency column cell
            if (data_list[k].competency_name == current_cell_competency_name) {
              max_rank = global_max_rank;
              value_dropdown = `<select data-is_changed='false' class='form-control competency-value'>`

              for (var x = 1; x < (max_rank + 1); x++) {
                value_dropdown += `<option value='{j}-{i}'>{j}-{i}</option><option value='++{i}'>++{i}</option><option value='{i}'>{i}</option>`.formatUnicorn({
                  i: x,
                  j: x - 1
                })
              }
              value_dropdown += '</select>';

              value = data_list[k].value;
              index_of_insert = value_dropdown.indexOf(" value='{value}'>".formatUnicorn({
                value: value
              }));
              if (index_of_insert > 0)
              {
                value_dropdown = value_dropdown.substring(0, index_of_insert) + ' selected ' + value_dropdown.substring(index_of_insert);
              }
              final_html += "<td class='competency-row'>{value_dropdown}</td>".formatUnicorn({
                value_dropdown: value_dropdown
              });
              break;

            }
          }
        }
        final_html += "</tr>";
      }

      $(".table-edit-title-mapping tbody").html(final_html);

      $('select.competency-value').change(function () {
        $(this).attr('data-is_changed', 'true');
        $('#btn_save').attr("disabled", false);
        $('#btn_save').addClass("btn-primary").removeClass("btn-secondary")
      })
      checkPrivilege($("#can_edit_level_mapping").val(), global_can_view)
    }
  });
}

$(document).ready(function () {
  loadTitleMappingForEdit();
});

function checkPrivilege(edit, view) {
  if (!edit && !view)
    window.location.replace = ""
  else {
    if (view && edit == "false") {
      $(".form-control").attr("disabled", true)
    }
  }
}