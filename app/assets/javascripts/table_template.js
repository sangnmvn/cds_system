
$(document).ready(function () {
	var table = $('#table_slot').DataTable({
    "info" : false,
    "bPaginate": false,
    "searching": false,
    "ordering": false
  });
  $(".btnUp").click(function(){
    var id = $(this).closest('tr').attr('value');
    moveRowbyAjax(-1);
    //var index = table.row($(this).closest('tr')).index()
    //moveRow('up',"table_template",index)
  });
  $(".btnDown").click(function(){
    var id = $(this).closest('tr').attr('value');
    moveRowbyAjax(1);
    //var index = table.row($(this).closest('tr')).index()
    //moveRow('down',"table_template",index)
  });
  $('#selectCompetency').change(function(){
    alert($(this).val());
  });
});

// function moveRow (direction,tableName,index)
// {
//   var table = $('#' + tableName).DataTable()
//   var order = -1
//   if (direction === 'down')
//   {
//     order = 1
//   }

//   var data1 = table.row(index).data();

//   var data2 = table.row(parseInt(index) + order).data();

//   table.row(index).data(data2);
//   table.row(index + order).data(data1);
// }
function loadSlotByCompetencyId (competencyId)
{
  $.ajax({
    type: "GET",
    url: "/templates/loadSlot",
    data: {
      id: id //direction phân biệt up hay down để change data cho phù hợp
    },
    dataType: "json",
    success: function (response) {
      $(response).each(
        function (i, e) { //duyet mang doi tuong
          $("#table_slot").dataTable().fnAddData([
            "<td class='td_num'>"+ e.level +"</td>", e.description , e.evidence, "<td class='td_action'><button class='btn btn-light'><i class='fa fa-pencil icon' style='color:#FFCC99'></i></button>" +
            "<button class='btn btn-light'><i class='fa fa-trash icon' style='color:red'></i></button><button class='btn btn-primary btnUp' ><i class='fa fa-arrow-circle-up'></i></button>" +
            "<button class='btn btn-primary btnDown'><i class='fa fa-arrow-circle-down'></i></button></td>"]);
        }
      );
    }
  });
}
function moveRowbyAjax(direction){
  $.ajax({
    type: "GET",
    url: "/templates/moveTemplate",
    data: {
      id: id, direction:direction //direction phân biệt up hay down để change data cho phù hợp
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
