$(document).ready(function () {
  checkPrivilege($("#can_edit_level_mapping").val(),global_can_view)
  changeBtnSave(false)
  $('#btn_add_required').on('click', function () {
    changeBtnSave(false)
    var row = $(this).parent().parent()
    var quantity = row.find('input')[0].value
    var type = row.find('select')[0].value
    var rank = row.find('select')[1].value
    if(quantity == "" || type == "-1" || rank == "-1")
    {
      fails("Has a blank field")
    }
    else
      {
        $(this).closest('td').append(createNewRowRequire(count))
        $(this).parent().children()[1].classList.remove('invisible')
        $(this).addClass("invisible").removeClass("visible")
      }
  });
  $('#table_level_mapping').on('click', '#btn_remove_required', function () {
    if($(this).parent().parent().next().length == 0)
    {
      if($(this).parent().parent().prevAll().length == 1)
      {
        $(this).parent().parent().prev().children()[3].children[1].classList.add('invisible')
      }
      $(this).parent().parent().prev().children()[3].children[0].classList.remove('invisible')
    }
    $(this).parent().parent().remove()
  });
  $('#table_level_mapping').on('click', '#btn_add_level', function () {
    changeBtnSave(false)
    var tr = $(this).closest('tr')
    var title = tr.children()[0].textContent
    var rank = tr.children()[1].textContent
    var level = parseInt(tr.children()[2].textContent) + 1
    var row = createNewRowLevel(count)
    var title_id = tr.data('title-id')
    $(this).addClass("invisible").removeClass("visible")
    var newRow= document.getElementById("table_level_mapping").insertRow(tr.index() + 2);
    newRow.setAttribute("data-title-id", title_id)
    newRow.insertCell(0);
    newRow.cells[0].innerHTML= title;
    newRow.insertCell(1);
    newRow.cells[1].innerHTML= rank;
    newRow.insertCell(2);
    newRow.cells[2].innerHTML=level;
    newRow.insertCell(3);
    newRow.cells[3].innerHTML=row;
    newRow.insertCell(4);
    newRow.cells[4].innerHTML=
    `<a type='button' class='btnAction' title='Add more levels' id="btn_add_level"><i class='fa fa-plus btnAdd'></i></a>
    <a type='button' class='btnAction' title='Remove level' id="btn_remove_level"><i class='fas fa-times btnDel'></i></a>`
;

  });
  $('#table_level_mapping').on('click', '#btn_remove_level', function () {
    var current_tr = $(this).parent().parent()
    
    var nextRow = current_tr.next()
    var colNextRow = nextRow.children()[2]
    if(colNextRow == null || (parseInt(colNextRow.textContent)) - 1 < 1)
      current_tr.prev().find('#btn_add_level').addClass("visible").removeClass("invisible")
    else
    {
      while(colNextRow != null)
      {
        var level = parseInt(colNextRow.textContent) - 1
        if(level < 1)
          break;
        colNextRow.innerText = level
        nextRow = nextRow.next()
        colNextRow = nextRow.children()[2]
      }
    }
    $(this).parent().parent().remove()
  });
  $('#table_level_mapping').on('change', '#select_type', function () {
    checkData()
    checkDuplicateRequired($(this))
  });
  $('#table_level_mapping').on('keyup', 'input', function () {
    checkData()
  });
  $('#table_level_mapping').on('blur', 'input', function () {
    var num = parseInt($(this).val())
    if(num < 1)
      $(this).val(1)
    if(num > 20)
    $(this).val(20)
  });
  $('#table_level_mapping').on('change', '#select_rank', function () {
    checkData()
    checkDuplicateRequired($(this))
  });
  $('#btn_save').on('click', function () {
    var tr = $("#table_level_mapping").find("tr")
    var lenght = tr.length
    for(var i = 1; i < lenght; i++)
    {
      var listLevelMapping = tr[i].children[3].children
      var lenghtRow = listLevelMapping.length
      for(var j = 0; j < lenghtRow; j++)
      {
        var list = []
        list.push(tr[i].getAttribute('data-title-id'))
        list.push(tr[i].children[2].innerHTML)
        list = getDatainRow(listLevelMapping[j].children, list)
        if(list != "")
          saveLevelMapping(list)
        else
        {
          fails("Has an empty field!")
          return
        }
      }
    }
    saveTitleMapping()
    window.location.href = "/level_mappings/";
  })
});
function createNewRowRequire (count)
{
  var temp = "";
  temp += `<div class="row">
    <div class='col-3'>
      <input type="number" class="form-control" min="1" max="10" placeholder='Quantity'>
    </div>
    <div class='col-5'>
      <select class="form-control" id="select_type">
        <option value='-1' disabled selected>Competency type</option>
        <option value='0'>All</option>
        <option value='1'>General</option>
        <option value='2'>Special</option>
      </select>
    </div>
    <div class='col-2'>
      <select class="form-control" id="select_rank">
        <option value='-1' disabled selected>Rank</option>`
    for(var i = 1; i <= count; i++)
    {
      temp += "<option value='"+ i +"'>"+ i +"</option>"
    }
    temp += `
      </select>
      </div>
      <div class='col-2 divIcon'>
        <a type='button' class='btnAction' title='Add more Required' id="btn_add_required"><i class='fas fa-plus-circle btnAdd'></i></a>
        <a type='button' class='btnAction' title='Remove Required' id="btn_remove_required"><i class='fas fa-times btnDel'></i></a>
      </div>
      </div>`
  return temp
}
function createNewRowLevel (count)
{
  var temp = "";
  temp += `<div class="row">
    <div class='col-3'>
      <input type="number" class="form-control" min="1" max="10" placeholder='Quantity'>
    </div>
    <div class='col-5'>
      <select class="form-control" id="select_type">
        <option value='-1' disabled selected>Competency type</option>
        <option value='0'>All</option>
        <option value='1'>General</option>
        <option value='2'>Special</option>
      </select>
    </div>
    <div class='col-2'>
      <select class="form-control" id="select_rank">
        <option value='-1' disabled selected>Rank</option>`
    for(var i = 1; i <= count; i++)
    {
      temp += "<option value='"+ i +"'>"+ i +"</option>"
    }
    temp += `
      </select>
      </div>
      <div class='col-2 divIcon'>
        <a type='button' class='btnAction' title='Add more Required' id="btn_add_required"><i class='fas fa-plus-circle btnAdd'></i></a>
        <a type='button' class='btnAction invisible' title='Remove Required' id="btn_remove_required"><i class='fas fa-times btnDel'></i></a>
      </div>
      </div>`
  return temp
}
function checkData ()
{
  var row = $("#table_level_mapping").find('.row').children()
  var count = row.length
  for(var i = 0; i < count; i++)
  {
    if(row[i].children[0].value == "" || row[i].children[0].value == "-1")
    {
      changeBtnSave(false)
      return
    }
  }
  changeBtnSave(true)
}
function checkDuplicateRequired (td)
{
  td.css('color','black')
  var listRow = td.closest('td').children()
  var lenght = listRow.length
  if(td.parent().nextAll().length > 1)
  {
    var selectType = td.parent().children().val()
    var selectRank = td.parent().next().children()[0].value
  }
  else
  {
    var selectRank = td.parent().children().val()
    var selectType = td.parent().prev().children()[0].value
  }
    var count = 0;
    for(var i = 0; i < lenght; i++)
    {
      var type = listRow[i].children[1].children[0].value
      var rank = listRow[i].children[2].children[0].value
      if((selectType == "0" || type == "0" ) && rank == selectRank)
      {
        count++
      }
      else{
        if(type == selectType && rank == selectRank)
          count++
      }
    }
    if(count > 1){
      fails('The field is duplicate!')
      td.find('option[value="-1"]').prop('selected', true)
      td.css('color','red')
      td.find('option').css('color','black')
    }
}
function changeBtnSave (bool)
{
  if (bool == true) {
    $('#btn_save').attr("disabled", false);
    $('#btn_save').addClass("btn-primary").removeClass("btn-secondary")
  }
  else
  {
    $('#btn_save').attr("disabled", true);
    $('#btn_save').removeClass("btn-primary").addClass("btn-secondary")
  }
  
}
function saveLevelMapping (arr)
{
  $.ajax({
    url: "/level_mappings/save_level_mapping",
    data: {
      title_id: arr[0],
      level: arr[1],
      quantity: arr[2],
      type: arr[3],
      rank: arr[4],
    },
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
    }
  });
}
function saveTitleMapping()
{
  record = [];
  $(".table-new-title-mapping > tbody > tr").each(function()
  {
    current_row = $(this);
    title_id = current_row.data("title_id");
    competency_ids = []
    $(".dynamic_title_header_col").each(function(){
      competency_ids.push($(this).data("competency-id"));
    })
    
    element_to_read = '.table-new-title-mapping tbody tr[data-title_id={title_id}] .competency_value'.formatUnicorn({title_id: title_id})

    for (i=0; i < competency_ids.length; i++)
    {
      var current_competency_id = competency_ids[i];      
            
      value = $(element_to_read)[i].value;
      current_data = {value: value, title_id: title_id, competency_id: current_competency_id};
      console.log(current_data);
      record.push(current_data);      
    }
    
  }  
  );  
  
  var status = null;
  var keep_looping = true;
  $.ajax({    
    type: "POST",
    url: "/level_mappings/save_title_mapping/" ,
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    data: {records: record},
    dataType: "json",
    success: function (response) {      
      status = response['status']
    }
  })

  var startTime = Date.now();
  while ((Date.now() - startTime) < 15000) {
    if (status != null)
    {
      break;
    }
}
  return status;
}
function getDatainRow (lst,list)
{
  var length = lst.length;
  for(var i = 0; i < length - 1; i++)
  {
    var data = lst[i].children[0].value ;
    if(data == "" || data == "-1")
      return ""
    list.push(lst[i].children[0].value)
  }
  return list
}
// alert success
function success(content) {
  $("#content-alert-success").html(content);
  $("#alert-success").fadeIn();
  window.setTimeout(function () {
    $("#alert-success").fadeOut(1000);
  }, 4000);
}
// alert fails
function fails(content) {
  $("#content-alert-fail").html(content);
  $("#alert-danger").fadeIn();
  window.setTimeout(function () {
    $("#alert-danger").fadeOut(1000);
  }, 4000);
}
function checkPrivilege (edit,view)
{
  if(edit == "false" && !view)
    window.location.replace = ""
  else
  {
    if(view && edit == "false")
    {
      $(".btnAction").remove()
      $(".btn-save").remove()
    }
  }
}