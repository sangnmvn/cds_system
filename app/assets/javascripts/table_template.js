$(document).ready(function () {
  var templateId = 1;
  loadSlotsinCompetency();
  checkSlotinTemplate(templateId);
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
  $("#tbdTemplate").on('click', '.btnDel', function () {
    var id = $(this).attr('value');
    var tr = $(this).closest('tr'); //loại bỏ hàng đó khỏi UI
    delSlot(id,tr);
  });
  $("#tbdTemplate").on('click', '.btnEdit', function () {
    var id = $(this).attr('value');
    var tr = $(this).closest('tr').children();
    $("#descSlot").val(tr[1].textContent);
    $("#evidenceSlot").val(tr[2].textContent);
    chooseSelect("selectLevel",tr[0].textContent);
    $("#hideIdSlot").html(id); //xóa id ẩn 
    checkSlotinTemplate(templateId);
  });
  changeBtnSave("-1");
  $("#table_slot").removeClass("dataTable")
  $('.dataTables_length').attr("style", "display:none");
  $("#btnFinish").click(function(){
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
    url: "/templates/load_slot",
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
          var btnUpDown = "<button class='btn btn-primary btnAction btnUp' ><i class='fa fa-arrow-circle-up icon'></i></button>" +
          "<button class='btn btn-primary btnAction btnDown'><i class='fa fa-arrow-circle-down icon'></i></button>"
          if (search)
            btnUpDown = "";
          table.fnAddData([
            "<td class='td_num'>" + e.level + "</td>", e.desc, e.evidence, "<td class='td_action'><button class='btn btn-light btnAction btnEdit' value='"+ e.id +"'><i class='fa fa-pencil icon' style='color:#FFCC99'></i></button>" +
            "<button class='btn btn-light btnAction btnDel' value='"+ e.id +"'><i class='fa fa-trash icon' style='color:red'></i></button>"+ btnUpDown +"</td>"
          ]);
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

function moveRowbyAjax(direction) {
  $.ajax({
    type: "GET",
    url: "/templates/moveTemplate",
    data: {
      id: id,
      direction: direction //direction phân biệt up hay down để change data cho phù hợp
    },
    dataType: "json",
    success: function (response) {
      $(response).each(
        function (i, e) { //duyet mang doi tuong
          loadDataSlot(); //load lại table sau khi up or down
        }
      );
    }
  });
}

function addNewSlot(desc,evidence,level,competencyId,nameCompetency) {
  $.ajax({
    type: "GET",
    url: "/templates/new_slot",
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
    url: "/templates/update_slot",
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
					url: "/templates/delete_slot",
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
    url: "/templates/check_slot_in_template",
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
    url: "/templates/update_status_template",
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