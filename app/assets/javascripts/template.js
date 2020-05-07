


$(document).on("click", "#btn-add-competency", function () {
  id = $(".form-add-competency #competency_id").val();
  name = $(".form-add-competency #name").val();
  type = $(".form-add-competency #type").val();
  desc = $(".form-add-competency #desc").val();
  index = $(".form-add-competency #competency_index").val();
  template_id = 1;
  // $(".form-add-competency .error").remove();
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
            '<span class="error">Name Competency already exists</span>'
          );
        } else if (response.status == "success") {
          $(".form-add-competency")[0].reset();
          $(".form-add-competency #type option[value='"+type+"']").prop("selected", true);
          success("Add");
          addCompetency(response.id,response.name,response.type,response.desc);
          disableNextCompetencies();
          $('.btn-save-compentency').prop("disabled", true);
        } else if (response.status == "fail") {
          fails("Add");
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
            '<span class="error">Name Competency already exists</span>'
          );
        } else if (response.status == "success") {
          $(".form-add-competency")[0].reset();
          table = $("#table_add_competency").DataTable();
          table.row(index).data([Number(index)+1,response.name,response.type,response.desc,
          '<td class="td_action"> \
          <button class="btn btn-light btn-edit-competency" data-id="'+response.id+'"><i class="fa fa-pencil icon" style="color:#FFCC99"></i></button> \
          <button class="btn btn-light btn-delete-competency" data-id="'+response.id+'"><i class="fa fa-trash icon" style="color:red"></i></button> \
          <button class="btn btn-primary btnUp" data-id="'+response.id+'"><i class="fa fa-arrow-circle-up"></i></button> \
          <button class="btn btn-primary btnDown"><i class="fa fa-arrow-circle-down"></i></button> \
          </td>']).draw();
          // table.column(0).nodes().each(function (cell, i) {
          //   cell.innerHTML = i + 1;
          // });
          // $(".form-add-competency #type option[value='"+type+"']").prop("selected", true);
          success("Update");
          $('.btn-save-compentency').prop("disabled", true);
          
          // addCompetency(response.id,response.name,response.type,response.desc);
        } else if (response.status == "fail") {
          fails("Update");
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
          <button class="btn btn-light btn-edit-competency" data-id="'+id+'"><i class="fa fa-pencil icon" style="color:#FFCC99"></i></button> \
          <button class="btn btn-light btn-delete-competency" data-id="'+id+'"><i class="fa fa-trash icon" style="color:red"></i></button> \
          <button class="btn btn-primary btnUp" data-id="'+id+'"><i class="fa fa-arrow-circle-up"></i></button> \
          <button class="btn btn-primary btnDown"><i class="fa fa-arrow-circle-down"></i></button> \
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

$(document).on("click", ".btn-edit-competency", function () {
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
            success("Load Data");
            id = $(".form-add-competency #competency_id").val(response.id);
            name = $(".form-add-competency #name").val(response.name);
            type = $(".form-add-competency #type").val(response.type);
            desc = $(".form-add-competency #desc").val(response.desc);
            index = $(".form-add-competency #competency_index").val(index);
            $('.btn-save-compentency').prop("disabled", false);
            $('#table_add_competency tr:nth-child('+index+1+') td .btn-delete-competency').prop("disabled", false);
          } else {
            fails("Load Data");
          }
      },
    });
});

$(document).on("click", ".btn-delete-competency", function () {
  // delete data
    var id = $(this).data("id");
    var index = $(this).closest('tr').index();
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
            success("Delete");
          } else {
            fails("Delete");
          }
        });
      },
    });
});

// $(document).on("click", "#btn-add-competency", function () {


// });

$(document).ready(function () {
  var current_fs, next_fs, previous_fs; //fieldsets
  var opacity;
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
    retrieve: true
  });
  $(".btnUp").click(function () {
    var row_id = $(this).closest('tr').index();
    // var id = $(this).closest('tr').attr('value');
    var index = $("#table_add_competency")
      .DataTable()
      .row($(this).closest("tr"))
      .index();
    current_row_data = table.row(row_id).data();
    previous_row_data = table.row(row_id - 1).data();
    temp = current_row_data[0];
    current_row_data[0] = previous_row_data[0];
    previous_row_data[0] = temp;

    temp = $("#table_add_competency")
      .DataTable()
      .row(row_id)
      .data(current_row_data);
    $("#table_add_competency")
      .DataTable()
      .row(row_id - 1)
      .data(previous_row_data);
    $("#table_add_competency").DataTable().draw();
  });
  // $(".btnDown").click(function () {
  //   var id = $(this).closest("tr").attr("value");
  //   moveRowbyAjax(1);
  //   var index = table.row($(this).closest("tr")).index();
  //   moveRow("down", "table_add_competency", index);
  // });
});

function loadDataCompetencies() {
  $.ajax({
    type: "GET",
    url: "/competencies/load",
    data: {
      id: 1,
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
          })
          .row.add([i+1,e.name,e.type,e.desc,'<td class="td_action"> \
          <button class="btn btn-light btn-edit-competency" data-id="'+e.id+'"><i class="fa fa-pencil icon" style="color:#FFCC99"></i></button> \
          <button class="btn btn-light btn-delete-competency" data-id="'+e.id+'"><i class="fa fa-trash icon" style="color:red"></i></button> \
          <button class="btn btn-primary btnUp" data-id="'+i +'"><i class="fa fa-arrow-circle-up"></i></button> \
          <button class="btn btn-primary btnDown"><i class="fa fa-arrow-circle-down"></i></button> \
          </td>',
          ])
          .draw();
      });
      disableNextCompetencies();
    },
  });
}

function disableNextCompetencies(){
  table = $("#table_add_competency").DataTable();
  if ( table.rows()[0].length == 0 ) {
    $('.btn-next-competency').prop("disabled", true);
  }else {
    $('.btn-next-competency').prop("disabled", false);
  }
}

$(document).ready(function(){
  loadDataCompetencies();
});

$(document).on('keyup','.form-add-competency #name', function(){
  name = $(".form-add-competency #name").val();
  $(".form-add-competency .error").remove();
  if (name.length < 2 || name.length > 200) {
    $(".form-add-competency #error-name-competency").html(
      '<span class="error" >Competency name must be from 2 to 200 character</span>'
    );
    $('.btn-save-compentency').prop("disabled", true);
  }else {
    if(/^[a-zA-Z0-9- ]*$/.test(name) == false) {
      $(".form-add-competency #error-name-competency").html(
        '<span class="error" >Competency name can not contain special character</span>'
      );
      $('.btn-save-compentency').prop("disabled", true);
    }else {
      $('.btn-save-compentency').prop("disabled", false);
    }
    
  }
});





