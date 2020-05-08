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
        '<span class="error">Please enter a value between {2} and {100} characters long.</span>'
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
          var table = $("#table_group").dataTable();
          var sData = table.fnGetData();
          var addData = [];
          addData.push(
            '<div class="resource_selection_cell"><input type="hidden" id="batch_action_item_' +
              response.id +
              '" value="0" \
            class="collection_selection" name="collection_selection[]">'+
     
          '<input type="checkbox" id="group_ids[]" value="' +
          response.id +
          '" class="selectable" name="checkbox"></div>'
          );
          addData.push(sData.length + 1);
          addData.push(response.name);
          addData.push(response.status_group);
          addData.push("0");
          addData.push(response.desc);
          addData.push(
            '<a class="action_icon edit_icon btn-edit-group" data-id="'+response.id +'" href="#">\
            <img border="0" src="/assets/edit-2e62ec13257b111c7f113e2197d457741e302c7370a2d6c9ee82ba5bd9253448.png"></a> \
            <a class="action_icon delete_icon" data-toggle="modal" data-target="#deleteModal" data-group_id="' +
              response.id +
              '" href="">\
            <img border="0" src="/assets/destroy-7e988fb1d9a8e717aebbc559484ce9abc8e9095af98b363008aed50a685e87ec.png"></a> \
            <a class="action_icon key_icon" data-toggle="modal" data-target="#modalPrivilege_'+response.id +'" data-id="'+response.id +'" href="#"><i class="fa fa-key"></i></a> \
            <a class="action_icon user_group_icon" data-toggle="modal" data-target="#AssignModal" data-id="'+response.id +'" href="#"><i class="fa fa-users"></i></a>'
          );
          table.fnAddData(addData);
          $("#modalAdd .form-add-group")[0].reset();
          $("#modalAdd").modal("hide");
          success("Add");
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
        '<span class="error">Please enter a value between {2} and {100} characters long.</span>'
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
          var table = $("#table_group").dataTable();
          var sData = table.fnGetData();
          for (var i = 0; i < sData.length; i++) {
            var current_user_id = sData[i][0]
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
          '" class="selectable" name="checkbox"></div>'

              );
              updateData.push(row_id+1);
              updateData.push(response.name);
              updateData.push(response.status_group);
              updateData.push("0");
              updateData.push(response.desc);
              updateData.push(
                '<a class="action_icon edit_icon btn-edit-group" data-id="'+response.id +'" href="#">\
                <img border="0" src="/assets/edit-2e62ec13257b111c7f113e2197d457741e302c7370a2d6c9ee82ba5bd9253448.png"></a> \
                <a class="action_icon delete_icon" data-toggle="modal" data-target="#deleteModal" data-group_id="' +response.id +'" href="">\
                <img border="0" src="/assets/destroy-7e988fb1d9a8e717aebbc559484ce9abc8e9095af98b363008aed50a685e87ec.png"></a> \
                <a class="action_icon key_icon" data-toggle="modal" data-target="#modalPrivilege_'+response.id +'" data-id="' +response.id +'" href="#"><i class="fa fa-key"></i></a> \
                <a class="action_icon user_group_icon" data-toggle="modal" data-target="#AssignModal" data-id="'+response.id +'" href="#"><i class="fa fa-users"></i></a>'
              );
              var delete_whole_row_constant = undefined;
              var redraw_table = false;
              table.fnUpdate(
                updateData,
                row_id,
                delete_whole_row_constant,
                redraw_table
              );
              break;
            }
          }
          success("Edit");
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
    $("#table_group").dataTable({
      bDestroy: true,
      stripeClasses: ["even", "odd"],
      pagingType: "full_numbers",
      iDisplayLength: 20,

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
  var row = data_table.$("tr")[row_id];
  data_table.fnDeleteRow(row);  
  reorder_table_row(data_table);
}

function delete_group() {
  var id = $("#group_id").val();

  //alert( 'admin/user_management/'  + user_id + '/')
  $.ajax({
    url: "/groups/" + id,
    method: "DELETE",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        $("#modal_destroy").modal("hide");
        var table = $("#table_group").dataTable();
          var sData = table.fnGetData();
          for (var i = 0; i < sData.length; i++) {
            var current_user_id = sData[i][0]
              .split("batch_action_item_")[1]
              .split('"')[0];
            current_user_id = parseInt(current_user_id);
            if (current_user_id == response.id) {
              var row_id = i;
              var updateData = [];
              delete_datatable_row(table, row_id);
              break;
           
            }
          }
        success("Delete");
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
  check_pri = $("check_privilege").val();
  content = '<div style="float:right; margin-bottom:10px;"><input type="hidden"></div>';
  if (check_pri == true) {
  content = '<div style="float:right; margin-bottom:10px;"> <button type="button" class="btn btn-primary" \
  data-toggle="modal" data-target="#modalAdd">Add</button><button type="button" class="btn btn-danger btn-xs\
   float-right" data-toggle="modal" data-target="#modalDeleteS" style="margin-left:5px" id="deletes">Delete</button></div>';
  };
  $(content).insertAfter(".dataTables_filter");
});

$(document).on("click","#deletes",function(){
  var groups_ids = new Array();

$.each($("input[name='checkbox']:checked"), function(){
    groups_ids.push($(this).val());
  });
number = groups_ids.length;
  if (number != 0) {
    $(".display_number_groups_delete").html("Are you sure want to delete " + number + " groups?");
  } else {
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
          for (var i_1 = 0; i_1 < response.id.length; i_1++) {
            var table = $("#table_group").dataTable();
            var sData = table.fnGetData();
          for (var i = 0; i < sData.length; i++) {
            var current_user_id = sData[i][0]
              .split("batch_action_item_")[1]
              .split('"')[0];
            current_user_id = parseInt(current_user_id);
            if (current_user_id == response.id[i_1]) {
              var row_id = i;
              var updateData = [];
              delete_datatable_row(table, row_id);
            }
          }}
          success("Delete");
    
    },
  });
});
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip(); 
  $('[data-toggle="modal"]').tooltip();
});