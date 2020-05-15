// alert success
function success(content) {
  $('#content-alert-success').html(content);
  $("#alert-success").fadeIn();
  window.setTimeout(function () {
    $("#alert-success").fadeOut(1000);
  }, 5000);
}
// alert fails
function fails(content) {
  $('#content-alert-fail').html(content);
  $("#alert-danger").fadeIn();
  window.setTimeout(function () {
    $("#alert-danger").fadeOut(1000);
  }, 5000);
}
$(document).on("click", "#btn-submit-add-user-group", function () {
  name = $("#name").val();
  status = $('input[name="status"]:checked').val();
  desc = $("#desc").val();

  $(".error").remove();
  if (name.length < 1) {
    $("#name").after('<span class="error">Please enter Group Name</span>');
  } else {
    if (name.length < 2 || name.length > 100) {
      $("#name").after(
        '<span class="error">The maximum length of Group Name is 100 characters.</span>'
      );
    }
  }
  if (status == "undefined") {
    $("#error-status").after(
      '<span class="error">Please Select A Status</span>'
    );
  }
  if ( $(".error").length == 0) {
    
    $.ajax({
      url: "groups/",
      type: "POST",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      data: {
        name: name,
        status: status,
        description: desc,
      },
      dataType: "json",
      success: function (response) {
        // data group
        if (response.status == "success") {
          var table = $("#table_group").DataTable();
          var sData = table.rows().data();
          
          var addData = [];
          addData.push(
            '<div class="resource_selection_cell"><input type="hidden" id="batch_action_item_' +
              response.id +
              '" value="0" \
            class="collection_selection" name="collection_selection[]">'+
     
          '<input type="checkbox" id="group_ids[]" value="' +
          response.id +
          '" class="selectable selectable_check" name="checkbox"></div>'
          );
          var a = sData.length + 1
          addData.push('<div style="text-align:right">'+ a +'</div>');
          addData.push(response.name);
          
          addData.push(response.desc);
          
          addData.push('<div style="text-align:right">0</div>');
          addData.push(response.status_group);
          addData.push(
            '<div style="text-align:center"><a class="action_icon edit_icon btn-edit-group" data-id="'+response.id +'" href="#">\
            <i class="fa fa-pencil icon" style="color:#fc9803"></i></a> \
            <a class="action_icon key_icon" data-target="#modalPrivilege" data-toggle="modal"  data-id="'+response.id+'" href="#" title="Assign Privileges To Group"><i class="fa fa-key"></i></a> \
            <a class="action_icon user_group_icon" data-toggle="modal" data-target="#AssignModal" title="Assign Users to Group" data-id="'+response.id +'" href="#"><i class="fa fa-users"></i></a>\
            <a class="action_icon del_btn" data-group="'+response.id +'" data-toggle="tooltip" title="Delete Group">\
            <i class="fa fa-trash icon" style="color:red"></i></a> </div>'
          );
          $("#modalAdd .form-add-group")[0].reset();
          $("#modalAdd").modal("hide");
          success("The new group information has been created successfully.");
          table.row.add(addData).draw( false );
         
        } else if (response.status == "exist") {
          $(".error").remove();
          $("#name").after('<span class="error">Name already exsit</span>');
        } else if (response.status == "fail") {
          fails("Add");
        }
      },
    });
  }
});

$(document).on("click", ".btn-edit-group", function () {
  group_id = $(this).data("id");
  $.ajax({
    url: "/groups/get_data",
    type: "GET",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
    data: { id: group_id },
    dataType: "json",
    success: function (response) {
      $(".error").remove();
      $("#modalEdit").modal("show");
      $.each(response.group, function (k, v) {
        $("#group_id").val(v.id);
        $(".edit-group").val(v.name);
        $(".edit-desc").val(v.description);
        if (v.status) {
          $("input:radio[id=status_Enable]").prop("checked", true);
        } else {
          $("input:radio[id=status_Disable]").prop("checked", true);
        }
      });
    },
  });
});

$(document).on("click", "#btn-submit-edit-user-group", function () {
  name = $("#modalEdit #name").val();
  status = $("#modalEdit input[name=status]:checked").val();
  desc = $("#modalEdit #desc").val();
  id = $("#modalEdit #group_id").val();
  $(".error").remove();
  if (name.length < 1) {
    $("#modalEdit #name").after(
      '<span class="error">Please enter Group Name</span>'
    );
  } else {
    if (name.length < 2 || name.length > 100) {
      $("#modalEdit #name").after(
        '<span class="error">The maximum length of Group Name is 100 characters.</span>'
      );
    }
  }
  if ($(".error").length == 0) {
    $.ajax({
      url: "groups/" + id,
      type: "PUT",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      data: {
        name: name,
        status: status,
        description: desc,
        id: id,
      },
      dataType: "json",
      success: function (response) {
        if (response.status == "success") {
          $("#modalEdit").modal("hide");
          var table = $("#table_group").DataTable();
          var dataLength = table.rows().data().length;
          for (var i = 0; i < dataLength; i++) {
            
            
            var current_user_id = table.row(i).data()[0]
            .split("batch_action_item_")[1]
            .split('"')[0];
            current_user_id = parseInt(current_user_id);
            if (current_user_id == response.id) {
              var row_id = i;
              var updateData = [];
              updateData.push(
                '<div class="resource_selection_cell"><input type="hidden" id="batch_action_item_' +
              response.id +
              '" value="0" \
            class="collection_selection" name="collection_selection[]">'+
     
          '<input type="checkbox" id="group_ids[]" value="' +
          response.id +
          '" class="selectable selectable_check" name="checkbox"></div>'

              );
              var a=row_id+1;
              updateData.push('<div style="text-align:right">'+ a +'</div>');
              updateData.push(response.name);
              updateData.push(response.desc);
              updateData.push('<div style="text-align:right">'+response.number+'</div>');
              updateData.push(response.status_group);
              
              updateData.push(
                '<div style="text-align:center"><a class="action_icon edit_icon btn-edit-group" data-id="'+response.id +'" href="#">\
            <i class="fa fa-pencil icon" style="color:#fc9803"></i></a> \
            <a class="action_icon key_icon" data-target="#modalPrivilege" data-toggle="modal"  data-id="'+response.id+'" href="#" title="Assign Privileges To Group"><i class="fa fa-key"></i></a> \
            <a class="action_icon user_group_icon" data-toggle="modal" data-target="#AssignModal" title="Assign Users to Group" data-id="'+response.id +'" href="#"><i class="fa fa-users"></i></a>\
            <a class="action_icon del_btn" data-group="'+response.id +'" data-toggle="tooltip" title="Delete Group">\
            <i class="fa fa-trash icon" style="color:red"></i></a> </div>'
              );

                var delete_whole_row_constant = undefined;
              var redraw_table = false;
              table.row(row_id).data(updateData);
              myJS_data_event();
              myAjax();
              privilegeAjax();	
              privilegeJS();
              /*
              table.fnUpdate(
                updateData,
                row_id,
                delete_whole_row_constant,
                redraw_table
              );
              */ ;
              break;
            }
          }
          success("The group information has been updated successfully.");
        } else if (response.status == "exist") {
          $(".error").remove();
          $("#modalEdit #name").after(
            '<span class="error">Name already exsit</span>'
          );
        } else if (response.status == "fail") {
          fails("Edit");
        }
      },
    });
  }
});

var group_dataTable;
function delete_dataTable() {
  group_dataTable.fnClearTable();
}
/*
processing: true,
      serverSide: true,
  */

function setup_dataTable() {
  $("#table_group").ready(function () {
    $("#table_group").DataTable({
      bDestroy: true,
      stripeClasses: ["even", "odd"],
      pagingType: "full_numbers",
      iDisplayLength: 20,

      fnDrawCallback: function()
      { 
        myJS_data_event();
        myAjax();
        privilegeAjax();	
        privilegeJS();
      },
      language: {
        "info": " _START_ - _END_ of _TOTAL_"
      },
   
    
      

      // order: [[1, "desc"]], //sắp xếp giảm dần theo cột thứ 1
      // pagingType is optional, if you want full pagination controls.
      // Check dataTables documentation to learn more about
      // available options.

      // aoColumns:
      //   [
      //     {"sClass": ""},
      //     {"sClass": ""},
      //     {"sClass": ""},
      //     {"sClass": ""},
      //     {"sClass": ""},
      //     {"sClass": ""},
      //     {"sClass": ""},
      //     {"sClass": ""},
      //     {"sClass": ""},
      //     {"sClass": ""},
      //     {"sClass": ""},
      //     {"sClass": "d-none"}
      //   ],
    });

    $("#table_group_length").remove();

    $(".toggle_all").click(function () {
      $(".collection_selection[type=checkbox]").prop(
        "checked",
        $(this).prop("checked")
      );
    });

    $(".collection_selection[type=checkbox]").click(function () {
      var nboxes = $("#table_group tbody :checkbox:not(:checked)");
      if (nboxes.length > 0 && $(".toggle_all").is(":checked") == true) {
        $(".toggle_all").prop("checked", false);
      }
      if (nboxes.length == 0 && $(".toggle_all").is(":checked") == false) {
        $(".toggle_all").prop("checked", true);
      }
    });
  });
}


$(document).on("click", ".del_btn", function () {
  group_id = $(this).data("group");
  $.ajax({
    url: "/groups/"+ group_id +"/destroy_page",
    type: "GET",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") }    
  });


});

function reorder_table_row(data_table)
{
  var all_data = data_table.fnGetData();  
    
  var reload_table = false;
  
  for (var i=0; i < all_data.length; i++)
  {
    data_table.fnUpdate(i+1, i, 1, reload_table,reload_table);
  }

  data_table.fnDraw();
}
function delete_datatable_row(data_table, row_id) {
  // delete the row from table by id
  //var row = data_table.$("tr")[row_id];
  
  data_table.row(row_id).remove().draw();
}

function delete_group() {
  var id = $("#group_id").val();
  //alert( 'admin/user_management/'  + user_id + '/')
  $.ajax({
    url: "/groups/"+id,
    method: "DELETE",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        $("#modal_destroy").modal("hide");

        /*
        var index = 0;
        var index2 = new Array();
        $('.selectable_check').each(function() {
            if ($(this).val() == response.id) {
              index2.push(index);
            }
            index++;
        });
       
          for (var i = 0; i < index2.length; i++) {
          var table = $("#table_group").DataTable();
        
            var row_id = index2[i];
           
            delete_datatable_row(table, row_id);
        
         
        }
        */
       table = $('#table_group').DataTable()

       var n_row = table.rows().data().length
       for (var i=0; i<n_row; i++)
       {
          var data = table.row(i).data()[0];
          var current_id = parseInt(data.split("batch_action_item_")[1].split('"')[0])
          if (current_id == response.id)
          {
            delete_datatable_row(table, i);
            break;
          }

       }

        success("The group information has been deleted successfully.");
      } else if (response.status == "exist") {
        $(".error").remove();
        $("#modalEdit #name").after(
          '<span class="error">Name already exsit</span>'
        );
      } else if (response.status == "fail") {
        fails("Edit");
      }
    },
  });
}
setup_dataTable();
$(function() {
  $("#selectAll").select_all();
});

$(document).ready(function () {
 
   a=$(".get_privilege").val();
  if(a == 'true'){
  content = '<div style="float:right; margin-bottom:10px;"> <button type="button" class="btn btn-light " \
  data-toggle="modal" data-target="#modalAdd" title="Add Group"style="width:90px;background:#8da8db"><img border="0" style="float:left;margin-top:4px" \
  src="/assets/Add.png">Add</button><button type="button" class="btn btn-light\
  float-right" data-toggle="modal"  title="Delete Group" style="margin-left:5px;width:100px;background:#dcdcdc" id="deletes">\
  <img border="0" style="float:left;margin-top:1.7px;width:26%"src="/assets/Delete.png">Delete</button></div>';

  $(content).insertAfter(".dataTables_filter");
  }else{
    content = '<div style="float:right; margin-bottom:10px;"> <button type="button" class="btn btn-light " \
    data-toggle="modal" data-target="#modalAdd" title="Add Group" style="width:90px;background:#dcdcdc"><img border="0" style="float:left;margin-top:4px" \
    src="/assets/Add.png">Add</button><button type="button" class="btn btn-light\
    float-right" data-toggle="modal" title="Delete Group" style="margin-left:5px;width:100px;background:#dcdcdc" id="deletes">\
    <img border="0" style="float:left;margin-top:1.7px;width:26%"src="/assets/Delete.png">Delete</button></div>';
  
    $(content).insertAfter(".dataTables_filter");
  }
});

$(document).on("click","#deletes",function(){
  var groups_ids = new Array();

$.each($("input[name='checkbox']:checked"), function(){
    groups_ids.push($(this).val());
  });
number = groups_ids.length;
  if (number != 0) {
    $('#modalDeleteS').modal('show');
    $('#delete_selected').prop("disabled", false);
    $(".display_number_groups_delete").html("Are you sure want to delete " + number + " groups?");
  } else {
    $('#delete_selected').prop("disabled", true);
    $(".display_number_groups_delete").html("Please select the groups you want delete ?");
  }
})
$(document).on("click", "#delete_selected", function () {

  var groups_ids = new Array();
  
  $.each($("input[name='checkbox']:checked"), function(){
    groups_ids.push($(this).val());
  });
 
  $.ajax({
    url: "/groups/destroy_multiple/",
    method: "DELETE",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
    data: {
      group_ids: groups_ids,
    },
    dataType: "json",
    success: function (response) {
        $("#modalDeleteS").modal("hide");
        
      
        table = $('#table_group').DataTable()

        var n_row = table.rows().data().length
        for (var i=0; i<n_row; i++)
        {
          for (var j = 0;j<response.id.length;j++)  {
           var data = table.row(i).data()[0];
           var current_id = parseInt(data.split("batch_action_item_")[1].split('"')[0])
           if (current_id == response.id[j])
           {
             delete_datatable_row(table, i);
           }
        }
      }
          success("The groups information has been deleted successfully.");
    
    },
  });
});
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip(); 
  $('[data-toggle="modal"]').tooltip();
});
$(document).click(function(e) {    
  a=$(".get_privilege").val();
  if(a == 'true'){
  var number = $("#table_group tbody :checkbox:checked").length;

  if (parseInt(number) > 0){
    $("#deletes").css('background-color', "#8da8db");
  }
  else{
    $("#deletes").css('background-color', "#dcdcdc");
  }
}
});