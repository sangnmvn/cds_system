$(document).ready(function(){
  if($('.btn-delete-tempalte').length == 0){
    $('.template-table tbody').after("<tr><td colspan='8' class='notice'>No data</td></tr>")
  }
  $('.next.step1').on('click', function(){
    var name = $('.step1 #name').val()
    var role = $('.step1 #role').val()
    var description = $('.step1 #description').val()
    if($('#msform .row .id-template').attr('value')===undefined){
      getNewTemplate(name,role,description)
    }
    else{
      var id = $('#msform .row .id-template').attr('value')
      getEditTemplate(id,name,role,description)
    }
    
  })
  postDeleteTemplate()
  checkValidation()
})
function checkValidation(){
  $('#name').on('keyup',function(){
    if($(this).closest('div').children('.error').text().length != 0 && $(this).val().length != 0){
      $(this).closest('div').children('.error').hide()
    }
    else{
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
function getNewTemplate(name,role,description){
  $.ajax({
    type: "GET",
    url: "/templates/new",
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
    error: function(response) {
      var json_response = response.responseJSON.errors;
      $.each(json_response, function(key,value){
        $('.step2.previous').click()
        if(key == "description")
        $(`.step1 #description`).closest('div').children('.error').html(`Description ${value}`)
        else{
          $(`.step1 .${key}`).closest('div').children('.error').html(`${key.capitalize()} ${value}`)
        }
        fails("Can't creat Template")
      })
    }
  });
}
function getEditTemplate(id,name,role,description){
  $.ajax({
    type: "GET",
    url: `/templates/${id}/edit`,
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      type: "Edit",
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
      $.each(json_response, function(key,value){
        $('.step2.previous').click()
        if(key == "description")
        $(`.step1 #description`).closest('div').children('.error').html(`Description ${value}`)
        else{
          $(`.step1 .${key}`).closest('div').children('.error').html(`${key.capitalize()} ${value}`)
        }
        fails("Can't edit template")
      })
    }
  });
}
function postDeleteTemplate(){
  $('.btn-delete-tempalte').on('click',function(){
    confirm("Are you sure you want to delete this template?")
    clicked = $(this)
    template_id = $(this).attr('value')
    $.ajax({
      type: "POST",
      url: `/templates/delete/${template_id}`,
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        success("Template is deleted")
        clicked.closest('tr').remove();
        if($('.btn-delete-tempalte').length == 0){
          $('.template-table tbody').after("<tr><td colspan='8' class='notice'>No data</td></tr>")
        }
      }
    });    
  })
}
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}