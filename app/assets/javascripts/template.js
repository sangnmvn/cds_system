$(document).ready(function () {
  var current_fs, next_fs, previous_fs; //fieldsets
  var opacity;

  $(".next").click(function () {
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    //Add Class Active
    $(".steps .step").eq($("fieldset").index(next_fs)).addClass("step-active");
    $(".steps .step").eq($("fieldset").index(current_fs)).removeClass("step-active");
    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          // for making fielset appear animation
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
    //Remove class active
    $(".steps .step").eq($("fieldset").index(current_fs)).removeClass("step-active");
    // $(".steps .step").eq($("fieldset").index(next_fs)).removeClass("step-active");
    $(".steps .step").eq($("fieldset").index(previous_fs)).addClass("step-active");
    //show the previous fieldset
    previous_fs.show();

    //hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          // for making fielset appear animation
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
});

$(document).on("click", "#btn-add-competency", function () {
  name = $('.form-add-competency #name').val();
  type = $('.form-add-competency #type').val();
  slot = $('.form-add-competency #slot').val();
  alert(name);
  $.ajax({
    url: "/competencies",
    type: "POST",
    headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
    data: { name: name, type: type, slot: slot }
  });
});



$(document).ready(function () {
	var table = $('#table_add_competency').DataTable({
    "info" : false,
    "bPaginate": false,
    "searching": false,
    "ordering": true
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


function loadDataCompetencies (){
  $.ajax({
    type: "GET",
    url: "/competencies/load",
    data: {
      id: 1
    },
    dataType: "json",
    success: function (response) {
      $(response).each(
        function (i, e) { //duyet mang doi tuong
          var tr = $("<tr value='"+ e.id +"'/>");
          $("<td/>").htnl(e.name).appendTo(tr);
          tr.appendTo($("#table_add_competency"))
        }
      );
    }
  });
}
loadDataCompetencies();