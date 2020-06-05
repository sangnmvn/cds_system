function go_to_add_page()
{
  role_id = $("#role_select").val();
  if (role_id == "")
  {
    $(".error").remove();
    $("#role_select").after("<div style='margin-left: -8px; font-size: 15px;' class='col-sm-12 error text-danger'>You have to select a Role to continue</div>")
    return;
  }

  window.location.href = "/level_mappings/add?role_id=" + role_id;
}
function load_role_without_level_mapping()
{
  var can_edit = $("#can_edit_level_mapping").val() == "true";
  $.ajax({
      type: "GET",
      url: "/level_mappings/get_role_without_level_mapping/",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      data: {},
      dataType: "json",
      success: function (response) {
        $(".error").remove();
    
        final_html = "<option value=''>Please select a Role</option>";
        
        if (!can_edit) return;
        
        for (var i=0 ; i< response.length; i++)
        {            
          var data = response[i];
          final_html += '<option value={role_id}>{role_name}</option>'.formatUnicorn({role_id: data.role_id, role_name: data.role_name});
        }
                
        $("#role_select").html(final_html);
        
      }
  })
}

function load_data_level_mapping()
{       
    var can_edit = $("#can_edit_level_mapping").val() == "true";
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
            if (can_edit) {
            final_html += "<tr> \
                           <td>{no}</td> \
                           <td>{role}</td> \
                           <td>{no_rank}</td> \
                           <td>{level}</td> \
                           <td>{latest_update}</td> \
                           <td>{updated_by}</td> \
                           <td> \
                           <a class='btn-edit-level-mapping' style='color:#F99D45' data-toggle='tooltip' title='Edit Level Mapping' data-role_id='{role_id}' href='javascript:void(0)'><i class='fa fa-pencil icon'></i></a> \
                            <a class='btn-delete-level-mapping' style='color:#E84415' data-toggle='tooltip' title='Delete Competency' data-role_id='{role_id}' href='javascript:void(0)'><i class='fa fa-trash icon'></i></a> \
                            </td> \
                            </tr>".formatUnicorn({no: data.no, role: data.role, no_rank: data.no_rank,
                        level: data.level, latest_update: data.latest_update, updated_by: data.updated_by, role_id: data.role_id})
            }
            else
            {
              final_html += "<tr> \
                           <td>{no}</td> \
                           <td>{role}</td> \
                           <td>{no_rank}</td> \
                           <td>{level}</td> \
                           <td>{latest_update}</td> \
                           <td>{updated_by}</td> \
                           <td> \
                           <a class='btn-edit-level-mapping' data-enable='false' data-toggle='tooltip' title='Edit Level Mapping' href='javascript:void(0)'><i style='color:#000' class='fa fa-pencil icon'></i></a> \
                            <a class='btn-delete-level-mapping'  data-enable='false' data-toggle='tooltip' title='Delete Competency' href='javascript:void(0)'><i style='color:#000' class='fa fa-trash icon'></i></a> \
                            </td> \
                            </tr>".formatUnicorn({no: data.no, role: data.role, no_rank: data.no_rank,
                        level: data.level, latest_update: data.latest_update, updated_by: data.updated_by})
            }
          }
          
          $(".table-level-mapping tbody").html(final_html);
        },
      });
}

$(document).ready(function() {
    var can_edit = $("#can_edit_level_mapping").val() == "true";
    if (!can_edit)
    {            
      $("#add_new_level_mapping").attr("disabled", "disabled");
      $("#add_new_level_mapping").closest("a").removeAttr("href");      
    }

    load_data_level_mapping();

    $("#add_new_level_mapping").on('click', function()
    {
      load_role_without_level_mapping();
    });
})