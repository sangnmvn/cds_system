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
});

$(document).on('click', '.logout-icon', function () {
  $('#logout')[0].click();
})