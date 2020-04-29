
$('#open_modal').click(function () {
  var id = $('#open_modal').val();
  $.ajax({
      type: "GET",
      url: "/user_groups/test",
      data: {
          id: id
      },
      dataType: "json",
      success: function (response) {
          $(response).each(
              function (i, e) { //duyet mang doi tuong
                var tr = $("<tr id="+ e.id +"/>");
                $("<td style='text-align: right'/>").html("1").appendTo(tr);
                $("<td/>").html("<input type='checkbox' class='mycontrol'/>").appendTo(tr);
                $("<td/>").html(e.first_name).appendTo(tr);
                $("<td/>").html(e.last_name).appendTo(tr);
                $("<td/>").html(e.email).appendTo(tr);
                $("#table_right").DataTable().fnClearTable();
                $("#table_right").DataTable().fnAddData([
                  "<td style='text-align: right'>1</td>","<input type='checkbox' class='mycontrol'/>",e.first_name,e.last_name,e.email
                ]);
              }
          );
      }
  });
});