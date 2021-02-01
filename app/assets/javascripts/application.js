//= require chartkick
//= require Chart.bundle
//= require jquery3
//= require popper
//= require bootstrap
//= require bootstrap-datepicker
//= require select_all.js
//= require select_all.js

// add formatUnicorn function to string
var full_access_on_all_companies = "1";
var view_user_on_my_company = "2";
var add_approver_to_user_on_my_project = "3";
var add_reviewers_to_user_on_my_project = "4";
var full_access_on_my_company = "5";
var full_access_on_user_group_management = "6";
var view_user_group_management = "7";
var full_access_on_template_management = "9";
var view_template_management = "10";
var full_access_on_schedule_company = "13";
var full_access_on_schedule_project = "14";
var full_access_on_my_CDS_CDP_assessment = "15";
var review_CDS_CDP_assessment = "16";
var approve_CDS_CDP_assessment = "17";
var view_all_CDS_CDP_Assessment = "24";
var view_CDS_CDP_Assessment_my_company = "27";
var high_level_approve_CDS_CDP = "26";
var full_access_on_level_mapping_management = "18";
var view_level_mapping_management = "19";
var full_access_on_all_companies_dashboard = "20";
var full_access_on_my_company_dashboard = "21";
var full_access_on_my_project = "22";
var view_my_dashboard = "23";
var organization = "25";

"use strict";
String.prototype.formatUnicorn =
  String.prototype.formatUnicorn ||
  function () {
    var str = this.toString();
    if (arguments.length) {
      var t = typeof arguments[0];
      var key;
      var args =
        "string" === t || "number" === t ?
          Array.prototype.slice.call(arguments) :
          arguments[0];
      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }
    return str;
  };

// sort json arary by keys
function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key];
    var y = b[key];
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
    $('li.active').find("a").css('background-color', '#4472c4').css('color', '#fff');
  } else {
    $('li.active').removeClass('active');

    $('a[href="' + location.pathname + '"]').closest('li').addClass('active');
    $('a[href="' + location.pathname + '"]').addClass('active');
    $('li.active').find(".dropdown-toggle").css('background-color', '#4472c4').css('color', '#fff');
    $('li.active').find("a.active").css('background-color', '#4472c4').css('color', '#fff');
  }
  checkPrivilege();
});

function checkPrivilege() {
  if (!privilege_array) return;
  if (!privilege_array.split(",").includes(organization)) {
    $(".privilate-organization-settings").css("display", "none");
  }
  if (!privilege_array.split(",").includes(view_user_group_management) && !privilege_array.split(",").includes(full_access_on_user_group_management)) {
    $(".privilate-user-group-management").css("display", "none");
  }
  if (!privilege_array.split(",").includes(full_access_on_template_management) && !privilege_array.split(",").includes(view_template_management)) {
    $(".privilate-template").css("display", "none");
  }
  if (!privilege_array.split(",").includes(view_level_mapping_management) && !privilege_array.split(",").includes(full_access_on_level_mapping_management)) {
    $(".privilate-level-mapping").css("display", "none");
  }
  if (!privilege_array.split(",").includes(view_user_on_my_company) && !privilege_array.split(",").includes(full_access_on_all_companies) && !privilege_array.split(",").includes(add_reviewers_to_user_on_my_project) && !privilege_array.split(",").includes(add_approver_to_user_on_my_project) && !privilege_array.split(",").includes(full_access_on_my_company)) {
    $(".privilate-user-management").css("display", "none");
  }
  if (!privilege_array.split(",").includes(full_access_on_schedule_project) && !privilege_array.split(",").includes(full_access_on_schedule_company)) {
    $(".privilate-schedule-management").css("display", "none");
  }
  if (!privilege_array.split(",").includes(full_access_on_all_companies_dashboard) && !privilege_array.split(",").includes(full_access_on_my_company_dashboard) && !privilege_array.split(",").includes(full_access_on_my_project) && !privilege_array.split(",").includes(view_my_dashboard)) {
    $(".privilate-cds-dashboard").css("display", "none");
  }
  if (!privilege_array.split(",").includes(review_CDS_CDP_assessment) && !privilege_array.split(",").includes(approve_CDS_CDP_assessment) && !privilege_array.split(",").includes(high_level_approve_CDS_CDP) && !privilege_array.split(",").includes(view_all_CDS_CDP_Assessment) && !privilege_array.split(",").includes(view_CDS_CDP_Assessment_my_company)) {
    $(".privilate-cds-cdp-review").css("display", "none");
  }
  if (!privilege_array.split(",").includes(full_access_on_my_CDS_CDP_assessment)) {
    $(".privilate-cds-cdp-assessment").css("display", "none");
  }
}
// modified from https://stackoverflow.com/a/52008131/1461204
const zoomEvent = new Event('zoom')
let currentRatio = window.devicePixelRatio

function checkZooming() {
  if (currentRatio !== window.devicePixelRatio) {
    window.dispatchEvent(zoomEvent)
  }
}
window.addEventListener('resize', checkZooming)

$(document).on('click', '.logout-icon', function () {
  $('#logout')[0].click();
})