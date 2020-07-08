$(document).ready(function() {
  $("#edit_contact").click(function(){
    var gender = $("#gender").text() == "Male" ? "1" : "0"
    var first_name = $("#full_name").text().split(' ')[0]
    $("#phone_number").val($("#phone").text().trim())
    $("#skype_id").val($("#skype").text().trim())
    $("#identity_card_no").val($("#CMND").text().trim())
    $("#first_name").val(first_name.trim())
    $("#last_name").val($("#full_name").text().replace(first_name, "").trim())
    $("#birthday").val($("#birthday").text().trim())
    $("#gender").find('option[value='+ gender +']').prop('selected', true)
    $("#modal_edit_contact").modal("show");
  })
  $("#edit_location").click(function(){
    $("#modal_edit_location").modal("show");
  })
})