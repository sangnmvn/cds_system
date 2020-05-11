$(document).ready(function () {
  var templateId = 1;
  loadSlotsinCompetency();
  checkSlotinTemplate(templateId);
  $('#btnEdit').attr('disabled', true)
  var table = $('#table_slot').DataTable({
    "info": false, //không hiển thị số record / tổng số record
    "searching": false,
    "order": [[0, 'asc']]
  });
  $(".btnUp").click(function () {
    var id = $(this).closest('tr').attr('value');
    moveRowbyAjax(-1);
  });
  $(".btnDown").click(function () {
    var id = $(this).closest('tr').attr('value');
    moveRowbyAjax(1);
  });
  $('#selectCompetency').change(function () {
    loadSlotsinCompetency();
  });
  $("#addSlot").click(function () {
    var desc = $("#descSlot").val();
    var evidence = $("#evidenceSlot").val();
    var level = $("#selectLevel").val();
    var competencyId = $("#selectCompetency").val();
    var nameCompetency = $("#selectCompetency option:selected").text();
    var presentId = $("#hideIdSlot").html();
    $("#hideIdSlot").html("");
    if (presentId == "")
      addNewSlot(desc,evidence,level,competencyId,nameCompetency);
    else
      updateSlot(desc,evidence,level,competencyId,presentId);
    $("#descSlot").val("");
    $("#evidenceSlot").val("");
    loadSlotsinCompetency();
    changeBtnSave("-1")
    checkSlotinTemplate(templateId)
  });
  $("#table_slot").on('click', '.btnDel', function () {
    var id = $(this).attr('value');
    var tr = $(this).closest('tr'); //loại bỏ hàng đó khỏi UI
    delSlot(id,tr);
    $("#hideIdSlot").html("");
    $("#descSlot").val("");
    $("#evidenceSlot").val("")
  });
  $("#table_slot").on('click', '.btnEdit', function () {
    var id = $(this).attr('value');
    var tr = $(this).closest('tr').children();
    $("#descSlot").val(tr[1].textContent);
    $("#evidenceSlot").val(tr[2].textContent);
    chooseSelect("selectLevel",tr[0].textContent);
    $("#hideIdSlot").html(id);
    checkSlotinTemplate(templateId);
    // $("#success-alert").dialog();
    // $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
    //   $("#success-alert").alert('close');
    // });
  });
  changeBtnSave("-1");
  $("#table_slot").removeClass("dataTable")
  $('.dataTables_length').attr("style", "display:none");

  $("#btnFinish").click(function(){
    //Thêm điều kiện kiểm tra enable của template
    $('#messageModal').modal('show')
  })
  $('#btnEnable').click(function() {
    finnish(templateId);
  })

  $("#txtSearch").keypress(function(){
    if (event.keyCode == 13 || event.which == 13) {
      var search = $(this).val();
      loadSlotsinCompetency(search)
    }
  })
  $("#descSlot").keyup(function(){
    if ($("#descSlot").val())
      $("#ErrorDesc").attr("style","display:none")
    else
      $("#ErrorDesc").attr("style","display:block")
  })

  //-----------------------------------------------------
});
//--------------------------------------------------------
function loadSlotsinCompetency(search) {
  var id = $('#selectCompetency').val();
  $("#nameCompetency").html($('#selectCompetency option:selected').text() + "'s Slots");
  $.ajax({
    type: "GET",
    url: "/slots/load_slot",
    data: {
      id: id, //truyền id competency
      search: search
    },
    dataType: "json",
    success: function (response) {
      var table = $("#table_slot").dataTable();
      table.fnClearTable();
      $(response).each(
        function (i, e) { //duyet mang doi tuong
          if (search)
          {
            table.fnAddData([
              e.level, e.desc, e.evidence,"<a href='#' type='button' class='btnAction btnEdit' value='"+ e.id +"'><i class='fa fa-pencil icon' style='color:#FFCC99'></i></a>" +
              "<a href='#' class='btnAction btnDel' value='"+ e.id +"'><i class='fa fa-trash icon' style='color:red'></i></a>" 
            ]);
          }
          else
          {
            table.fnAddData([
              e.level, e.desc, e.evidence,"<a href='#' type='button'  class='btnAction btnEdit' value='"+ e.id +"' disabled><i class='fa fa-pencil icon' style='color:#FFCC99'></i></a>" +
              "<a class='btnAction btnUpSlot' href='#' value='"+ e.id +"'><i class='fa fa-arrow-circle-up icon'></i></a>" + "<a href='#' class='btnAction btnDel' value='"+ e.id +"'><i class='fa fa-trash icon' style='color:red'></i></a>" 
              + "<a href='#' class='btnAction btnDownSlot' value='"+ e.id +"'><i class='fa fa-arrow-circle-down icon'></i></a>"
            ]);
          }
        }
      );
    }
  });
}

//alert success
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


function addNewSlot(desc,evidence,level,competencyId,nameCompetency) {
  $.ajax({
    type: "GET",
    url: "/slots/new_slot",
    data: {
      desc: desc,
      evidence: evidence,
      level: level,
      competency_id: competencyId
    },
    dataType: "json",
    success: function (response) {
      success("Add new slot to " + nameCompetency + " is ");
      loadSlotsinCompetency();
    },
    error: function () {
      fails("Add new slot to " + nameCompetency + " is ");
    }
  });
}

function updateSlot(desc,evidence,level,competencyId,presentId) {
  $.ajax({
    type: "GET",
    url: "/slots/update_slot",
    data: {
      desc: desc,
      evidence: evidence,
      level: level,
      competency_id: competencyId,
      id: presentId
    },
    dataType: "json",
    success: function (response) {
      success("Update slot is ");
      loadSlotsinCompetency();
    },
    error: function () {
      fails("Update slot is ");
    }
  });
}

function delSlot (id,tr){
  bootbox.confirm({
		message: "Are you sure want to delete this slot?",
		buttons: {
			confirm: {
				label: "Yes",
				className: "btn-primary"
			},
			cancel: {
				label: "No",
				className: "btn-danger"
			}
		},
		callback: function (result) {
			if (result) {
				$.ajax({
					url: "/slots/delete_slot",
					data: {
            id: id
					},
					type: "GET",
					success: function (response) {
            success("Delete slot is");
            $("#table_slot").dataTable().fnDeleteRow(tr);
            checkSlotinTemplate(1); //check lại button Finnish
					},
					error: function () {
						fails("Delete slot is");
					}
				});
			}
		}
	});
}
function  changeBtnFinish(direction) {
  if(direction == "-1")
  {
    $("#btnFinish").attr("disabled", true);
    $("#btnFinish").removeClass("btn-primary").addClass("btn-secondary")
  }
  else
  {
    $("#btnFinish").attr("disabled", false);
    $("#btnFinish").addClass("btn-primary").removeClass("btn-secondary")
  }
}
function  changeBtnSave(direction) {
  if(direction == "-1")
  {
    $("#addSlot").attr("disabled", true);
    $("#addSlot").removeClass("btn-primary").addClass("btn-secondary")
  }
  else
  {
    $("#addSlot").attr("disabled", false);
    $("#addSlot").addClass("btn-primary").removeClass("btn-secondary")
  }
}
function checkSlotinTemplate (templateId){
  $.ajax({
    type: "GET",
    url: "/slots/check_slot_in_template",
    data: {
      template_id: templateId
    },
    dataType: "json",
    success: function (response) {
      changeBtnFinish(response);
    }
  });
}
function chooseSelect(nameSelect,value) {
  $("#"+ nameSelect).each(function(){ 
    $(this).find('option[value="'+ value +'"]').prop('selected', true); 
  });
}
function checkDataDesc() {
  if($("#descSlot").val())
    changeBtnSave("1")
  else
    changeBtnSave("-1")
}
function finnish (templateId)
{
  $.ajax({
    type: "GET",
    url: "/slots/update_status_template",
    data: {
      template_id: templateId
    },
    dataType: "json",
    success: function (response) {
      success("change status this template is");
      changeBtnFinish("-1")
    },
    error: function () {
      fails("change status this template is");
    }
  });
}
$(document).on('click','.btnUpSlot', function(){
  var row_id = $(this).closest('tr').index();
  var id = $(this).attr('value');
  table =  $("#table_slot").DataTable();
  if (row_id != 0)
    moveRow(id,row_id,-1,table);
});
$(document).on('click','.btnDownSlot', function(){
  var row_id = $(this).closest('tr').index();
  var id = $(this).attr('value');
  table =  $("#table_slot").DataTable();
  moveRow(id,row_id,1,table)
});
function moveRow (id,row_id, direction,table){
  $.ajax({
    type: "GET",
    url: "/slots/change_slot_id",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    data: {
      id: id, direction: direction
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "max")
        fails("The slot is last in Its level. Move ")
      else if (response.status == "min")
        fails("The slot is first in Its level. Move ")
      else
      {
        var num = parseInt(direction);
        current_row_data = table.row(row_id).data();
        previous_row_data = table.row(row_id + num).data();

        table.row(row_id + num).data(current_row_data).draw();
        table.row(row_id).data(previous_row_data).draw();        
        success("Move ");
      }
    },
    error: function () {
      fails("Move ");
    }
  });
}

