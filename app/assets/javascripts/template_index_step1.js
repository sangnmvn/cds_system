$(document).ready(function () {
  if ($('.template-table tbody tr').length == 0) {
    $('.template-table tbody').html("<tr><td colspan='8' class='notice'>No data available</td></tr>")
  }
  save_button(0)
  next_button(0)
  checkValidation()
  if ($('#msform .row .id-template').attr('value') === undefined) {
    next_button(0)
  }
  else{
    next_button(1)
  }
  postDeleteTemplate()
})

function clickSaveButton() {
  $('.save.step1').off('click').on('click', function () {
    name = $('.step1 #name').val()
    role = $('.step1 #role').val()
    description = $('.step1 #description').val()
    if ($('#msform .row .id-template').attr('value') === undefined) {
      postCreateTemplate(name, role, description)
    } else {
      var id = $('#msform .row .id-template').attr('value')
      applyEditTemplate(id, name, role, description)
    }
    next_button(1)
  });
}

function save_button(flag) {
  if (flag == 0) {
    $('.save').prop("disabled", true)
    $('.save').removeClass("btn-info").addClass("btn-secondary")
  } else {
    $('.save').prop("disabled", false)
    $('.save').removeClass("btn-secondary").addClass("btn-primary")
  }
}

function next_button(flag) {
  if (flag == 0) {
    $('.next').prop("disabled", true)
    $('.next').removeClass("btn-info").addClass("btn-secondary")
  } else {
    $('.next').prop("disabled", false)
    $('.next').removeClass("btn-secondary").addClass("btn-info")
  }
}
function disabledTemplateStep1(flag) {
  if (flag == 0) {
    $('#name').prop("disabled", true)
    $('#role').prop("disabled", true)
    $('#discription').prop("disabled", true)
  } else {
    $('#name').prop("disabled", false)
    $('#role').prop("disabled", false)
    $('#discription').prop("disabled", false)
  }
}

function checkValidation() {
  $('.step1 #name').on('keyup', function () {
    var name = $('.step1 #name').val()
    var role = $('.step1 #role').val()
    var description = $('.step1 #description').val()
    if (name.length != 0 && role.length != 0) {
      save_button(1)
      clickSaveButton()
    } else {
      save_button(0)
    }

    if ($(this).closest('div').children('.error').text().length != 0 && $(this).val().length != 0) {
      $(this).closest('div').children('.error').hide()
    } else {
      $(this).closest('div').children('.error').show()
    }
  })
}

function success(content) {
  $('#content-alert-success').html(content);
  $("#alert-success").fadeIn();
  window.setTimeout(function () {
    $("#alert-success").fadeOut(1000);
  }, 2000);
}
// alert fails
function fails(content) {
  $('#content-alert-fail').html(content);
  $("#alert-danger").fadeIn();
  window.setTimeout(function () {
    $("#alert-danger").fadeOut(1000);
  }, 2000);
}

function postCreateTemplate(name, role, description) {
  $.ajax({
    type: "POST",
    url: "/templates",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      name: name,
      role_id: role,
      description: description
    },
    dataType: "json",
    success: function (response) {
      $('#msform .row .id-template').attr("value", response)
      success("Template is created")
    },
    error: function (response) {
      var json_response = response.responseJSON.errors;
      $('.step2.previous').click()
      $.each(json_response, function (key, value) {
        if ($(`#step1 .${key}`).closest('div').children('.error').length == 0) {
          $(`#step1 .${key}`).closest('div').append(`<div class="error">${key.capitalize()} ${value}</div>`)
        }
        else{
          $(`#step1 .${key}`).closest('div').children('.error').html(`${key.capitalize()} ${value}`)
        }
      })
      fails("Can't creat Template")
    }
  });
}

function applyEditTemplate(id, name, role, description) {
  $.ajax({
    type: "PATCH",
    url: `/templates/${id}`,
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      name: name,
      role_id: role,
      description: description
    },
    dataType: "json",
    success: function (response) {
      success("Template is edited")
    },
    error: function (response) {
      var json_response = response.responseJSON.errors;
      $('.step2.previous').click()
      $.each(json_response, function (key, value) {
        if ($(`#step1 .${key}`).closest('div').children('.error').length == 0) {
          $(`#step1 .${key}`).closest('div').append(`<div class="error">${key.capitalize()} ${value}</div>`)
        }
        else{
          $(`#step1 .${key}`).closest('div').children('.error').html(`${key.capitalize()} ${value}`)
        }
        fails("Can't edit template")
      })
    }
  });
}

function postDeleteTemplate() {
  $('.delete_icon').on('click', function () {
    clicked = $(this)
    var template_id = $(this).attr("value")
    $('#modal_warning_close button').on('click', function () {
      if ($(this).text() == "Yes" && $('#modal_warning_close a').attr("href") == "#") {
        $.ajax({
          type: "DELETE",
          url: `/templates/${template_id}`,
          headers: {
            "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
          },
          dataType: "json",
          success: function (response) {
            success("Template is deleted")
            clicked.closest('tr').remove();
            if ($('.template-table tbody tr').length == 0) {
              $('.template-table tbody').html("<tr><td colspan='8' class='notice'>No data available</td></tr>")
            }
            $('#modal_warning_close').modal('hide');
          }
        });
      }
    })
  })
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
