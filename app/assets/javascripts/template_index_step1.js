$(document).ready(function () {
  checkPrivileges()
  if ($('.template-table tbody tr').length == 0) {
    $('.template-table tbody').html("<tr><td colspan='8' class='notice'>No data available</td></tr>")
  }
  save_button(0)
  next_button(0)
  checkValidation()
  checkModalCancel()
  checkChangeUpdate()
  if ($('#msform .row .id-template').attr('value') === undefined) {
    next_button(0)
  } else {
    next_button(1)
  }
  postDeleteTemplate()
})

function clickSaveButton() {
  $('.save.step1').off('click').on('click', function () {
    name = $('.step1 #template').val()
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
    $('.save').removeClass("btn-primary").addClass("btn-secondary")
  } else {
    $('.save').prop("disabled", false)
    $('.save').removeClass("btn-secondary").addClass("btn-primary")
  }
}

function next_button(flag) {
  if (flag == 0) {
    $('.next').prop("disabled", true)
    $('.next').removeClass("btn-primary").addClass("btn-secondary")
  } else {
    $('.next').prop("disabled", false)
    $('.next').removeClass("btn-secondary").addClass("btn-primary")
  }
}

function checkValidation() {
  $('.step1 #template').on('keyup', function () {
    if ($(this).closest('div').children('.error').text().length != 0 && $(this).val().length != 0) {
      $(this).closest('div').children('.error').hide()
    } else {
      $(this).closest('div').children('.error').show()
    }
  })
}

function checkChangeUpdate() {
  $('.step1 #template').on('keyup', function () {
    var name = $('.step1 #template').val()
    var role = $('.step1 #role').val()
    if (name.length != 0 && role.length != 0) {
      save_button(1)
      clickSaveButton()
    } else {
      save_button(0)
    }
    checkModalCancel()
  })
  $('.step1 #role').on('click', function () {
    var name = $('.step1 #template').val()
    var role = $('.step1 #role').val()
    if (name.length != 0 && role.length != 0) {
      save_button(1)
      clickSaveButton()
    } else {
      save_button(0)
    }
    checkModalCancel()
  })
  $('.step1 #description').on('keyup', function () {
    var name = $('.step1 #template').val()
    var role = $('.step1 #role').val()
    if (name.length != 0 && role.length != 0) {
      save_button(1)
      clickSaveButton()
    } else {
      save_button(0)
    }
  })
}

function checkModalCancel() {
  var name = $('.step1 #template').val()
  var role = $('.step1 #role').val()
  if (name !== undefined || role !== undefined){
    if (name.length == 0 && role.length == 0) {
      $('.step1_cancel').attr('data-target', "")
      $('.step1_cancel').click(function () {
        $(location).attr('href', '/templates')
      })
    } else {
      $('.step1_cancel').attr('data-target', "#modal_warning_close")
    }
  }    
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
  if (name == 'undefined') {
    if ($(`#step1 .name`).closest('div').children('.error').length == 0) {
      $(`#step1 .role`).closest('div').append(`<div class="error">Please enter a template name</div>`)
    } else {
      $(`#step1 .name`).closest('div').children('.error').html(`Please enter a template name`)
    }
  } else if (role == 'undefined') {
    if ($(`#step1 .role`).closest('div').children('.error').length == 0) {
      $(`#step1 .role`).closest('div').append(`<div class="error">Please select a role</div>`)
    } else {
      $(`#step1 .role`).closest('div').children('.error').html(`Please select a role`)
    }
  } else {
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
        success("The template has been created successfully.")
        save_button(0)
      },
      error: function (response) {
        var json_response = response.responseJSON.errors;
        $('.step2.previous').click()
        $.each(json_response, function (key, value) {
          if ($(`#step1 .${key}`).closest('div').children('.error').length == 0) {
            if (key == "role") {
              $(`#step1 .role`).closest('div').append(`<div class="error">Please select a role</div>`)
            } else {
              $(`#step1 .${key}`).closest('div').append(`<div class="error">${value}</div>`)
            }
          } else {
            if (key == "role") {
              $(`#step1 .role`).closest('div').children('.error').html(`Please select a role`)
            } else {
              $(`#step1 .${key}`).closest('div').children('.error').html(`${value}`)
            }
          }
        })
        fails("Can't creat Template")
      }
    });
  }
}

function applyEditTemplate(id, name, role, description) {
  if (name !== undefined || role !== undefined) {
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
        success("The template has been edited successfully.")
        save_button(0)
      },
      error: function (response) {
        var json_response = response.responseJSON.errors;
        $('.step2.previous').click()
        $.each(json_response, function (key, value) {
          if ($(`#step1 .${key}`).closest('div').children('.error').length == 0) {
            if (key == "role") {
              $(`#step1 .role`).closest('div').append(`<div class="error">Please select a role</div>`)
            } else {
              $(`#step1 .${key}`).closest('div').append(`<div class="error">${value}</div>`)
            }
          } else {
            if (key == "role") {
              $(`#step1 .role`).closest('div').append(`<div class="error">Please select a role</div>`)
            } else {
              $(`#step1 .${key}`).closest('div').children('.error').html(`${value}`)
            }
          }
          fails("Can't edit template")
        })
      }
    });
  }
}

function postDeleteTemplate() {
  $('.delete_icon').on('click', function () {
    clicked = $(this)
    var template_id = $(this).attr("value")
    $('#modal_warning_close button.btn-primary').on('click', function () {
      if ($(this).text() == "Save" && $('#modal_warning_close .modal-footer a').attr("href") == "#") {
        $.ajax({
          type: "DELETE",
          url: `/templates/${template_id}`,
          headers: {
            "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
          },
          dataType: "json",
          success: function (response) {
            success("The template has been deleted successfully.")
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

function checkPrivileges() {
  $.ajax({
    type: "GET",
    url: "/competencies/check_privileges",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    dataType: "json",
    success: function (response) {
      if (response.privileges == "view") {
        $('#add_template_button').remove()
        $('.delete_icon').removeAttr("data-target")
        $('.delete_icon i').css("color", "#000")
        $('#step1 #template').prop("disabled", true)
        $('#step1 #role').prop("disabled", true)
        $('#step1 #description').prop("disabled", true)
      }
    },
  });
}

//capitalize
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}