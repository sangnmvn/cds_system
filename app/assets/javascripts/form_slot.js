$(document).ready(function () {
  $(".left-panel-competency").hide();
  $("#body-row .collapse").collapse("hide");
  StartLeftPanel();
  $("[data-toggle=sidebar-colapse]").click(function () {
    SidebarCollapse();
  });
  // $("[data-toggle=collapse]").click(function () {
  //   $(".card table thead tr").css("background-color", "#ccc");
  //   $(this).closest("tr").css("background-color", "#bbcbea");
  // });

  function StartLeftPanel() {
    $("#collapse0").addClass("show");
    $(".table0 tr").css("background-color", "#bbcbea");
  }
  $(".card table thead tr").click(function () {
    $(".collapse").removeClass("show");
    $(".card-header table tr").css("background-color", "#ccc");
    id = $(this).data("target");
    $(id).addClass("show");
    num = id.split("#collapse");
    $(".table" + Number(num[1]) + " tr").css("background-color", "#bbcbea");
  });

  function SidebarCollapse() {
    $("#sidebar-container").toggleClass("sidebar-expanded sidebar-collapsed");

    if ($(".card").is(":visible")) {
      $(".card").hide();
      $("#accordion table").hide();
      $(".left-panel-competency").show();
    } else {
      $(".card").show();
      $("#accordion table").show();
      $(".left-panel-competency").hide();
    }
    $("#collapse-icon").toggleClass(
      "fa-angle-double-left fa-angle-double-right"
    );
  }
  // filter
  $("#filter-form-slots").multiselect({
    includeSelectAllOption: true,
    selectAllValue: "select-all-value",
  });
  // $('.filter-slots .multiselect-selected-text').hide();
  // $('.filter-slots ul li').addClass('active');
});
// end
