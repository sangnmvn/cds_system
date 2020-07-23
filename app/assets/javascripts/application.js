//= require chartkick
//= require Chart.bundle
//= require jquery3
//= require popper
//= require bootstrap
//= require bootstrap-datepicker
//= require select_all.js
//= require select_all.js

// add formatUnicorn function to string
"use strict";
String.prototype.formatUnicorn =
  String.prototype.formatUnicorn ||
  function () {
    var str = this.toString();
    if (arguments.length) {
      var t = typeof arguments[0];
      var key;
      var args =
        "string" === t || "number" === t
          ? Array.prototype.slice.call(arguments)
          : arguments[0];
      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }
    return str;
  };

// sort json arary by keys
function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key]; var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
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
// alert warning
function warning(content) {
  $("#content-alert-warning").html(content);
  $("#alert-warning").fadeIn();
  window.setTimeout(function () {
    $("#alert-warning").fadeOut(1000);
  }, 5000);
}

$(document).ready(function () {
  if (location.pathname == '/') {
    $('li.active').find("a").css('background-color', '#CFD5eA');
  } else {
    $('li.active').removeClass('active');

    $('a[href="' + location.pathname + '"]').closest('li').addClass('active');
    $('li.active').find("a").css('background-color', '#CFD5eA');
  }
  CheckPrivilege();
});

function CheckPrivilege() {
  if (!privilege_array.includes("25")) {  
    $(".privilate-organization-settings").css("display", "none");
  }
  if (!privilege_array.includes("4") && !privilege_array.includes("5")) {  
    $(".privilate-user-group-management").css("display", "none");
  }
  if (!privilege_array.includes("18") && !privilege_array.includes("19")) {  
    $(".privilate-template").css("display", "none");
  }
  if (!privilege_array.includes("9") && !privilege_array.includes("10")) {  
    $(".privilate-level-mapping").css("display", "none");
  }
  if (!privilege_array.includes("1") && !privilege_array.includes("2")) {  
    $(".privilate-user-management").css("display", "none");
  }  
  if (!privilege_array.includes("13") && !privilege_array.includes("14")) {  
    $(".privilate-schedule-management").css("display", "none");
  } 
  if (!privilege_array.includes("20") && !privilege_array.includes("21") && !privilege_array.includes("22") && !privilege_array.includes("23")) {  
    $(".privilate-cds-dashboard").css("display", "none");
  }
  if (!privilege_array.includes("16") && !privilege_array.includes("17") && !privilege_array.includes("24")) {  
    $(".privilate-cds-cdp-review").css("display", "none");
  }  
  if (!privilege_array.includes("15") && !privilege_array.includes("24")) {  
    $(".privilate-cds-cdp-assessment").css("display", "none");
  }
}

$(document).on('click', '.logout-icon', function () {
  $('#logout')[0].click();
})