$(document).ready(function () {
  var templateId = $('#msform .row .id-template').attr("value")
  checkSlotinTemplate(templateId);
  $('#table_slot').DataTable({
    "info": false, //không hiển thị số record / tổng số record
    "searching": false,
    "order": [[0, 'asc']]
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
      addNewSlot(desc,evidence,level,competencyId,nameCompetency,templateId);
    else
      updateSlot(desc,evidence,level,competencyId,presentId,templateId);
    $("#descSlot").val("");
    $("#evidenceSlot").val("");
    loadSlotsinCompetency();
    changeBtnSave(-1)
  });
  $("#table_slot").on('click', '.btnDel', function () {
    var id = $(this).attr('value');
    var tr = $(this).closest('tr'); //loại bỏ hàng đó khỏi UI
    delSlot(id,tr,templateId);
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
  });
  changeBtnSave(-1);
  $("#table_slot").removeClass("dataTable")
  $('.dataTables_length').attr("style", "display:none");

  $("#btnFinish").click(function(){
    if (checkStatusTemplate() == 0)
      $('#messageModal').modal('show')
  })
  $('#btnEnable').click(function() {
    finnish(templateId);
    $('#messageModal').modal('hide')
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
  $(".nexttoStep3").click(function(){
    loadCompetency(templateId);
    checkStatusTemplate(templateId);
  });
  //-----------------------------------------------------
});
//--------------------------------------------------------
function loadSlotsinCompetency(search) {
  var id = $('#selectCompetency').val();
  $("#nameCompetency").html($('#selectCompetency option:selected').text() + "'s Slots");
  $.ajax({
    type: "GET",
    url: "/slots/load",
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
              e.level, e.desc, e.evidence,"<a class='btnAction btnUpSlot' href='#' value='"+ e.id +"'><i class='fa fa-arrow-circle-up icon'></i></a>" + 
              "<a href='#' class='btnAction btnDownSlot' value='"+ e.id +"'><i class='fa fa-arrow-circle-down icon'></i></a>" +
              "<a href='#' type='button'  class='btnAction btnEdit' value='"+ e.id +"' disabled><i class='fa fa-pencil icon' style='color:#FFCC99'></i></a>" 
              + "<a href='#' class='btnAction btnDel' value='"+ e.id +"'><i class='fa fa-trash icon' style='color:red'></i></a>" 
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


function addNewSlot(desc,evidence,level,competencyId,nameCompetency,templateId) {
  $.ajax({
    type: "GET",
    url: "/slots/new",
    data: {
      desc: desc,
      evidence: evidence,
      level: level,
      competency_id: competencyId
    },
    dataType: "json",
    success: function () {
      success("Add new slot to " + nameCompetency + " is ");
      loadSlotsinCompetency();
      checkSlotinTemplate(templateId)
    },
    error: function (response) {
      fails("Add new slot to " + nameCompetency + " is ");
    }
  });
}

function updateSlot(desc,evidence,level,competencyId,presentId,templateId) {
  $.ajax({
    type: "GET",
    url: "/slots/update",
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
      checkSlotinTemplate(templateId)
    },
    error: function () {
      fails("Update slot is ");
    }
  });
}

function delSlot (id,tr,templateId){
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
					url: "/slots/delete",
					data: {
            id: id
					},
					type: "GET",
					success: function (response) {
            success("Delete slot is");
            $("#table_slot").dataTable().fnDeleteRow(tr);
            checkSlotinTemplate(templateId)
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
  if(checkStatusTemplate() == 1)
  {
    $("#btnFinish").attr("disabled", true);
    $("#btnFinish").removeClass("btn-primary").addClass("btn-secondary")
  }
  else
  {
    if(direction == -1)
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
}
function  changeBtnSave(direction) {
  if(direction == -1)
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
      changeBtnFinish(parseInt(response));
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
    changeBtnSave(1)
  else
    changeBtnSave(-1)
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
      changeBtnFinish(-1)
      window.setTimeout(function () {
        location.replace("../templates")
      }, 800);
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

function loadCompetency (templateId)
{
  $.ajax({
    type: "GET",
    url: "/slots/load_competency",
    data: {
      template_id: templateId
    },
    dataType: "json",
    success: function (response) {
      $("#selectCompetency").html("");
      $(response).each(
        function (i, e) { //duyet mang doi tuong
          $("<option value='" + e.id + "'/>").html(e.name).appendTo("#selectCompetency");
        });
        loadSlotsinCompetency();
        checkSlotinTemplate(templateId);
    }
  });
}

function checkStatusTemplate()
{
  if ($('#msform .row .status-template').attr("value") == "true" )
    return 1
  else
    return 0
}

