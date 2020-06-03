function load_data_level_mapping()
{
    $.ajax({
        type: "GET",
        url: "/level_mappings/get_data_level_mapping/",
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
        },
        data: {},
        dataType: "json",
        success: function (response) {
          final_html = "";

          for (var i=0 ; i< response.length; i++)
          {
            var data = response[i];
            final_html += "<tr> \
                           <td>{no}</td> \
                           <td>{role}</td> \
                           <td>{no_rank}</td> \
                           <td>{level}</td> \
                           <td>{latest_update}</td> \
                           <td>{updated_by}</td> \
                           <td> \
                           <a class='btn-edit-level-mapping' data-toggle='tooltip' title='Edit Level Mapping' data-role_id='{role_id}' href='javascript:void(0)'><i class='fa fa-pencil icon'></i></a> \
                            <a class='btn-delete-level-mapping' data-toggle='tooltip' title='Delete Competency' data-role_id='{role_id}' href='javascript:void(0)'><i class='fa fa-trash icon'></i></a> \
                            <a class='btn-change-status-on-mapping'><i class='fa fa-toggle-on'></i></a> \
                            </td> \
                            </tr>".formatUnicorn({no: data.no, role: data.role, no_rank: data.no_rank,
                        level: data.level, latest_update: data.latest_update, updated_by: data.updated_by, role_id: data.role_id})
          }
          
          $(".table-level-mapping tbody").html(final_html);
        },
      });
}

$(document).ready(function() {
    load_data_level_mapping();
})