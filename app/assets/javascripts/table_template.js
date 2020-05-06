
$(document).ready(function () {
	var table = $('#table_template').DataTable({
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
function loadDataSlot (){
  $.ajax({
    type: "GET",
    url: "/templates/loadSlot",
    data: {
      id: 1
    },
    dataType: "json",
    success: function (response) {
      $(response).each(
        function (i, e) { //duyet mang doi tuong
          var tr = $("<tr value='"+ e.id +"'/>");
          $("<td/>").htnl(e.name).appendTo(tr);
          tr.appendTo($("#dataTemplate"))
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
