$(document).on("click", "#btn-add-competency", function () {
  id = $(".form-add-competency #competency_id").val();
  index = $(".form-add-competency #competency_index").val();
  name = $(".form-add-competency #name").val();
  type = $(".form-add-competency #type").val();
  desc = $(".form-add-competency #desc").val();
  template_id = $('#msform .id-template').attr('value');
  if ($(".form-add-competency .error").length == 0 && id == "") {
    $.ajax({
      url: "/competencies",
      type: "POST",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
      data: { name: name, _type: type, desc: desc, template_id: template_id },
      dataType: "json",
      success: function (response) {
        if (response.status == "exist") {
          $(".form-add-competency #error-name-competency").html(
            '<span class="error">The competency name already exists</span>'
          );
        } else if (response.status == "success") {
          $(".form-add-competency")[0].reset();
          $(".form-add-competency #type option[value='"+type+"']").prop("selected", true);
          addCompetency(response.id,response.name,response.type,response.desc);
          disableNextCompetencies();
          disableButtonMove();
          // hide tooltip
          $('[data-toggle="tooltip"], .tooltip').tooltip("hide");
          // message success
          success("The competency has been saved successfully.");
          $('.btn-save-competency').prop("disabled", true);
          $(".btn-save-competency").removeClass("btn-primary").addClass("btn-secondary");
        } else if (response.status == "fail") {
          fails("Can't create competency.");
        }
      },
    });
  }else if ($(".form-add-competency .error").length == 0 && id != ""){
    $.ajax({
      url: "/competencies/"+id,
      type: "PUT",
      headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
      data: { id: id, name: name, _type: type, desc: desc, template_id: template_id },
      dataType: "json",
      success: function (response) {
        if (response.status == "exist") {
          $(".form-add-competency #error-name-competency").html(
            '<span class="error">The competency name already exists.</span>'
          );
        } else if (response.status == "success") {
          $(".form-add-competency")[0].reset();
          nextStep1();
          $('.btn-save-competency').prop("disabled", true);
          $(".btn-save-competency").removeClass("btn-primary").addClass("btn-secondary");
          // // reset value 
          $(".form-add-competency #competency_id").val('');
          $(".form-add-competency #competency_index").val('');
          $('[data-toggle="tooltip"], .tooltip').tooltip("hide");
          disableButtonMove();
          success("The competency has been saved successfully.");
        } else if (response.status == "fail") {
          fails("Can't update competency.");
        }
      },
    });
  }
});


function addCompetency(id,name,type,desc){
  table = $("#table_add_competency").DataTable();
  length = table.rows()[0].length;
  table.row.add([length+1,name,type,desc,
    '<td class="td_action"> \
          <a class="btnUp" data-toggle="tooltip" data-id="'+id+'" href="javascript:void(0)"><i class="fa fa-arrow-circle-up icon"></i></a> \
          <a class="btnDown" data-toggle="tooltip" data-id="'+id+'" href="javascript:void(0)"><i class="fa fa-arrow-circle-down icon"></i></a> \
          <a class="btn-edit-competency" data-toggle="tooltip" data-id="'+id+'" href="javascript:void(0)"><i class="fa fa-pencil icon"></i></a> \
          <a class="btn-delete-competency" data-toggle="tooltip" data-id="'+id+'" href="javascript:void(0)"><i class="fa fa-trash icon"></i></a> \
          </td>'
      ]).draw();
}
// alert success
function success(content) {
  $("#content-alert-success").html(content);
  $("#alert-success").fadeIn();
  window.setTimeout(function () {
    $("#alert-success").fadeOut(1000);
  }, 5000);
}
// alert fails
function fails(content) {
  $("#content-alert-fail").html(content);
  $("#alert-danger").fadeIn();
  window.setTimeout(function () {
    $("#alert-danger").fadeOut(1000);
  }, 5000);
}

$(document).on("click", "#table_add_competency .btn-edit-competency", function () {
  // load data edit
    var id = $(this).data("id");
    var index = $(this).closest('tr').index();
    $.ajax({
      type: "GET",
      url: "/competencies/load_data_edit",
      data: {
        id: id,
      },
      dataType: "json",
      success: function (response) {
          if (response.status == "success") {
            $(".form-add-competency .error").remove();
            $(".form-add-competency #competency_id").val(response.id);
            $(".form-add-competency #name").val(response.name);
            $(".form-add-competency #type").val(response.type);
            $(".form-add-competency #desc").val(response.desc);
            $(".form-add-competency #competency_index").val(index);
            $('.btn-save-competency').prop("disabled", true);
          } 
      },
    });
});

$(document).on("click", "#table_add_competency .btn-delete-competency", function () {
  // delete data
    var id = $(this).data("id");
    $('#modal_delete_competency').modal('show');  
    var index = $(this).closest('tr').index();
    var name_competency_delete = $("#table_add_competency").DataTable().row(index).data()[1];
    $('#name_competency_delete').html(name_competency_delete);
    $('#modal_delete_competency #competency_id').val(id);
    $('#modal_delete_competency #competency_index').val(index);
});

$(document).on("click", "#confirm_yes_delete_competency", function () {
  id = $('#modal_delete_competency #competency_id').val();
  index = $('#modal_delete_competency #competency_index').val();
  $.ajax({
      type: "DELETE",
      url: "/competencies/"+id,
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      data: {
        id: id,
      },
      dataType: "json",
      success: function (response) {
        $(response).each(function (i, e) {
          if (response.status == "success") {
            table = $("#table_add_competency").DataTable({
              info: false,
              bPaginate: false,
              bLengthChange: false,
              searching: false,
              ordering: true,
              retrieve: true,
            });
            table.row(index).remove().draw();
            table.column(0).nodes().each(function (cell, i) {
              cell.innerHTML = i + 1;
            });
            disableNextCompetencies();
            disableButtonMove();
            $('#modal_delete_competency').modal('hide');
            $(".form-add-competency")[0].reset();
            success("The competency has been deleted successfully.");
          } else {
            fails("Can't delete competency.");
          }
        });
      },
    });

});


$(document).ready(function () {
  var current_fs, next_fs, previous_fs;
  var opacity;


  $(".export_excel_icon").on('click', function()
    {      
      debugger;
    }
  );

  $(".next").click(function () {
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();
    $(".steps .step").eq($("fieldset").index(next_fs)).addClass("step-active");
    $(".steps .step")
      .eq($("fieldset").index(current_fs))
      .removeClass("step-active");
    next_fs.show();
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          opacity = 1 - now;
          current_fs.css({
            display: "none",
            position: "relative",
          });
          next_fs.css({ opacity: opacity });
        },
        duration: 600,
      }
    );
  });
  $(".previous").click(function () {
    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();
    $(".steps .step")
      .eq($("fieldset").index(current_fs))
      .removeClass("step-active");
    $(".steps .step")
      .eq($("fieldset").index(previous_fs))
      .addClass("step-active");
    previous_fs.show();
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          opacity = 1 - now;
          current_fs.css({
            display: "none",
            position: "relative",
          });
          previous_fs.css({ opacity: opacity });
        },
        duration: 600,
      }
    );
  });
  $("#table_add_competency_length").hide();
  $("#table_add_competency_filter").hide();

  var table = $("#table_add_competency").DataTable({
    info: false,
    bPaginate: false,
    bLengthChange: false,
    searching: false,
    ordering: true,
    retrieve: true,
    language: {
      "emptyTable": "No data available"
    }
  });
});

function checkPrivileges_step2(){
  
  $.ajax({
    type: "GET",
    url: "/competencies/check_privileges",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    data: {},
    dataType: "json",
    success: function (response) {
      $(response).each(function (i, e) {
        if (response.privileges == "view"){
          $('#table_add_competency tr td a').removeClass(["btnUp","btnDown","btn-edit-competency","btn-delete-competency"]);
          $("#table_add_competency tr td .fa-arrow-circle-up,.fa-arrow-circle-down,.fa-trash,.fa-pencil").css("color", "#4d4f4e");
          $('.form-add-competency #name').prop("disabled", true);
          $('.form-add-competency #desc').prop("disabled", true);
          $('.form-add-competency #type').prop("disabled", true);
        }
      });
    },
  });
}


function loadDataCompetencies(id) {
  $.ajax({
    type: "GET",
    url: "/competencies/load",
    data: {
      id: id,
    },
    dataType: "json",
    success: function (response) {
      $(response).each(function (i, e) {
        $("#table_add_competency")
          .DataTable({
            info: false,
            bPaginate: false,
            bLengthChange: false,
            searching: false,
            ordering: true,
            retrieve: true,
            language: {
              "emptyTable": "No data available"
            }
          })
          .row.add([i+1,e.name,e.type,e.desc,'<td class="td_action"> \
          <a class="btnUp" data-toggle="tooltip" data-id="'+e.id+'" href="javascript:void(0)"><i class="fa fa-arrow-circle-up icon"></i></a> \
          <a class="btnDown" data-toggle="tooltip" data-id="'+e.id+'" href="javascript:void(0)"><i class="fa fa-arrow-circle-down icon"></i></a> \
          <a class="btn-edit-competency" data-toggle="tooltip" data-id="'+e.id+'" href="javascript:void(0)"><i class="fa fa-pencil icon"></i></a> \
          <a class="btn-delete-competency" data-toggle="tooltip" data-id="'+e.id+'" href="javascript:void(0)"><i class="fa fa-trash icon"></i></a> \
          </td>',
          ])
          .draw();
      });
      disableNextCompetencies();
      disableButtonMove();
      checkPrivileges_step2();
      
    },
  });
}

function disableNextCompetencies(){
  table = $("#table_add_competency").DataTable();
  if ( table.rows()[0].length == 0 ) {
    $('.btn-next-competency').prop("disabled", true);
    $(".btn-next-competency").removeClass("btn-primary").addClass("btn-secondary")
  }else {
    $('.btn-next-competency').prop("disabled", false);
    $(".btn-next-competency").removeClass("btn-secondary").addClass("btn-primary")
  }
}

function disableButtonMove(){
  table = $("#table_add_competency").DataTable();
  length = table.rows().data().length;
  $('#table_add_competency tr td a:nth-child(1)').addClass("btnUp");
  $('#table_add_competency tr td a:nth-child(2)').addClass("btnDown");
  $("#table_add_competency tr td .fa-arrow-circle-up,.fa-arrow-circle-down").css("color", "green");
  if (length >= 1) {
    $('#table_add_competency tr:nth-child(1) td a').removeClass("btnUp");
    $("#table_add_competency tr:nth-child(1) td .fa-arrow-circle-up").css("color", "#4d4f4e");

    $('#table_add_competency tr:nth-child('+length+') td a').removeClass("btnDown");
    $('#table_add_competency tr:nth-child('+length+') td .fa-arrow-circle-down').css("color", "#4d4f4e");
  }
}

$(document).on('click','.btn-next-template', function(){
  nextStep1();
});

function nextStep1(){
  id = $('#msform .id-template').attr('value');
  table = $("#table_add_competency").DataTable().clear().draw();
  loadDataCompetencies(id);
}



$(document).on('change','.form-add-competency #name,#desc', function(){
  name = $(".form-add-competency #name").val();
  desc = $(".form-add-competency #desc").val();
  $(".form-add-competency .error").remove();
  if (name.length < 2 || name.length > 100) {
    $(".form-add-competency #error-name-competency").html(
      '<span class="error" >The competency name must be from 2 to 200 character.</span>'
    );
    $('.btn-save-competency').prop("disabled", true);
    $(".btn-save-competency").removeClass("btn-primary").addClass("btn-secondary");
  }else {
    if(/^[\w\.,\s\&]*$/.test(name) == false) {
      $(".form-add-competency #error-name-competency").html(
        '<span class="error" >The competency name can not contain special character.</span>'
      );
      $('.btn-save-competency').prop("disabled", true);
      $(".btn-save-competency").removeClass("btn-primary").addClass("btn-secondary");
    }else {
      $('.btn-save-competency').prop("disabled", false);
      $(".btn-save-competency").removeClass("btn-secondary").addClass("btn-primary")
    }
  }
  //desc
  if (desc.length > 100) {
    $(".form-add-competency #error-desc-competency").html(
      '<span class="error" >The competency desc must less than 100 character.</span>'
    );
    $('.btn-save-competency').prop("disabled", true);
    $(".btn-save-competency").removeClass("btn-primary").addClass("btn-secondary");
  }
});


$(document).on('click','#table_add_competency .btnUp', function(){
  var row_id = $(this).closest('tr').index();
  console.log(row_id);
  var id = $(this).data("id");
  if (row_id > 0) {
    $.ajax({
      type: "POST",
      url: "/competencies/change_location",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      data: {
        id: id, type: "up"
      },
      dataType: "json",
      success: function (response) {
        $(response).each(function (i, e) {
          if (response.status == "success"){
            table =  $("#table_add_competency").DataTable();
            current_row_data = table.row(row_id).data();
            previous_row_data = table.row(row_id - 1).data();
            
            current_row_data[0] = row_id + 1

            temp = current_row_data[1];
            current_row_data[1] = previous_row_data[1];
            previous_row_data[1] = temp;

            temp = current_row_data[2];
            current_row_data[2] = previous_row_data[2];
            previous_row_data[2] = temp;
            
            temp = current_row_data[3];
            current_row_data[3] = previous_row_data[3];
            previous_row_data[3] = temp;

            temp = current_row_data[4];
            current_row_data[4] = previous_row_data[4];
            previous_row_data[4] = temp;

            console.log(current_row_data);
            table.row(row_id).data(current_row_data).draw();
            table.row(row_id - 1).data(previous_row_data).draw();
            disableButtonMove();
            success("The competency is moved up 1 row successfully.");
          }else if (response.status == "fail") {
            fails("Can't move up competency.");
          }
        });
      },
    });
  }
});


$(document).on('click','#table_add_competency .btnDown', function(){
  var row_id = $(this).closest('tr').index();
  var id = $(this).data("id");
  table =  $("#table_add_competency").DataTable();
  if (table.rows().data().length-1 > row_id){
    $.ajax({
      type: "POST",
      url: "/competencies/change_location",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      data: {
        id: id, type: "down"
      },
      dataType: "json",
      success: function (response) {
        $(response).each(function (i, e) {
          if (response.status == "success"){
            current_row_data = table.row(row_id).data();
            next_row_data = table.row(row_id + 1).data();
            
            next_row_data[0] = row_id + 2;
            temp = current_row_data[1];
            current_row_data[1] = next_row_data[1];
            next_row_data[1] = temp;

            temp = current_row_data[2];
            current_row_data[2] = next_row_data[2];
            next_row_data[2] = temp;
            
            temp = current_row_data[3];
            current_row_data[3] = next_row_data[3];
            next_row_data[3] = temp;

            temp = current_row_data[4];
            current_row_data[4] = next_row_data[4];
            next_row_data[4] = temp;

            console.log(next_row_data);
            table.row(row_id).data(current_row_data).draw();
            table.row(row_id + 1).data(next_row_data).draw();
            disableButtonMove();
            success("The competency is moved down 1 row successfully.");
          }else if (response.status == "fail") {
            fails("Can't move down competency");
          }
        });
      },
    });
  }
});

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="modal"]').tooltip();
});



