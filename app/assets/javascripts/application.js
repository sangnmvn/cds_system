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
String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
  function () {
    var str = this.toString();
    if (arguments.length) {
      var t = typeof arguments[0];
      var key;
      var args = ("string" === t || "number" === t) ? Array.prototype.slice.call(arguments) : arguments[0];
      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }
    return str;
  };
