function goToAddPage() {
  role_id = $("#role_select").val();
  if (role_id == "") {
    $(".error").remove();
    $("#role_select").after("<div style='margin-left: -8px; font-size: 15px;' class='col-sm-12 error text-danger'>You have to select a Role to continue</div>")
    return;
  }
  window.location.href = "/level_mappings/add?role_id=" + role_id;
}

function loadRoleWithoutLevelMapping() {
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
      if (!can_edit) {
        return;
      }
      for (var i = 0; i < response.length; i++) {
        var data = response[i];
        final_html += '<option value={role_id}>{role_name}</option>'.formatUnicorn({
          role_id: data.role_id,
          role_name: data.role_name
        });
      }
      $("#role_select").html(final_html);
    }
  })
}

function loadDataLevelMapping() {
  var can_edit = $("#can_edit_level_mapping").val() == "true";
  $.ajax({
    type: "GET",
    url: "/level_mappings/get_data_level_mapping_list/",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    data: {},
    dataType: "json",
    success: function (response) {
      final_html = "";
      if (can_edit) {
        edit_button_color = '#F99D45';
        delete_button_color = '#E84415';
      } else {
        edit_button_color = '#000';
        delete_button_color = '#000';
        role_id = '';
      }
      for (var i = 0; i < response.length; i++) {
        var data = response[i];
        final_html += `<tr> 
                           <td>{no}</td> 
                           <td>{role}</td> 
                           <td>{no_rank}</td>                            
                           <td>{latest_update}</td> 
                           <td>{updated_by}</td> 
                           <td> 
                           <a class='btn-edit-level-mapping' data-enable='{can_edit}' data-toggle='tooltip' title='Edit Level Mapping' data-role_id='{role_id}' href='javascript:void(0)'><i class='fa fa-pencil icon' style='color:{edit_button_color};'></i></a> 
                            <a class='btn-delete-level-mapping' data-enable='{can_edit}'  data-toggle='tooltip' title='Delete Competency' data-role_id='{role_id}' href='javascript:void(0)'><i class='fa fa-trash icon' style='color:{delete_button_color};'></i></a> 
                            </td> 
                            </tr>
                           `.formatUnicorn({
          no: data.no,
          role: data.role,
          no_rank: data.no_rank,
          latest_update: data.latest_update,
          updated_by: data.updated_by,
          role_id: data.role_id,
          edit_button_color: edit_button_color,
          delete_button_color: delete_button_color,
          can_edit: can_edit
        })
      }
      $(".table-level-mapping_list tbody").html(final_html);
    },
  });
}

$(document).ready(function () {
  var can_edit = $("#can_edit_level_mapping").val() == "true";
  if (!can_edit) {
    $("#add_new_level_mapping").attr("disabled", "disabled");
    $("#add_new_level_mapping").closest("a").removeAttr("href");
  }
  loadDataLevelMapping();
  loadRoleWithoutLevelMapping();

})