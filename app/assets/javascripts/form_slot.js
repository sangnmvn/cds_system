$(document).ready(function () {
  $(".left-panel-competency").hide();
  $("#body-row .collapse").collapse("hide");
  StartLeftPanel();

  $("[data-toggle=sidebar-colapse]").click(function () {
    SidebarCollapse();
  });
  $("[data-toggle=collapse]").click(function () {
    $(".card table thead tr").css("background-color", "#ccc");
    $(this).closest("tr").css("background-color", "#8da8db");
  });

  function StartLeftPanel() {
    $("#collapse0").addClass("show");
    $(".table0 tr").css("background-color", "#8da8db");
  }


  function SidebarCollapse() {
    $(".menu-collapsed").toggleClass("d-none");
    $(".sidebar-submenu").toggleClass("d-none");
    $(".submenu-icon").toggleClass("d-none");
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
});
// end
