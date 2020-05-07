$(document).ready(function(){
  $('.next.step1').on('click', function(){
    var name = $('.step1 #name').val()
    var role = $('.step1 #role').val()
    var description = $('.step1 #description').val()
    getNewTemplate(name,role,description)
  })
})
function getNewTemplate(name,role,description){
  $.ajax({
    type: "GET",
    url: "/templates/new",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      name: name,
      role: role,
      description: description
    },
    dataType: "json",
    success: function (response) {
      $('#msform .row .id-template').attr("value", response)
    },
    error: function(response) {
      var json_response = response.responseJSON.errors;
      $.each(json_response, function(key,value){
        $('.step2.previous').click()
        if(key == "desc")
        $(`.step1 #description`).closest('div').children('.error').html(`Description ${value}`)
        else{
          $(`.step1 input#${key}`).closest('div').children('.error').html(`${key.capitalize()} ${value}`)
        }
      })
    }
  });
}
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}