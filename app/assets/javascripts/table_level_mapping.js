$(document).ready(function () {
  changeBtnSave(false)
  $('#table_level_mapping').on('click', '#btnAddRequired', function () {
    changeBtnSave(false)
    var row = $(this).parent().parent()
    var quantity = row.find('input')[0].value
    var type = row.find('select')[0].value
    var rank = row.find('select')[1].value
    if(quantity == "" || type == "-1" || rank == "-1")
    {
      $("#contentMessageValidate").html("All fields can't be blank");
      $("#messageValidate").modal('show');
    }
    else
      {
        $(this).closest('td').append(createNewRowLevel(listRank))
        $(this).attr('style','display:none')
        $(this).parent().children()[1].removeAttribute('style','display:none')
      }
  });
  $('#table_level_mapping').on('click', '#btnRemoveRequired', function () {
    $(this).parent().parent().remove()
  });
  $('#table_level_mapping').on('click', '#btnAddLevel', function () {
    changeBtnSave(false)
    var tr = $(this).closest('tr')
    var title = tr.children()[0].textContent
    var rank = tr.children()[1].textContent
    var level = parseInt(tr.children()[2].textContent) + 1
    var row = createNewRowLevel(listRank)
    $(this).attr('style','display:none')
    var newRow= document.getElementById("table_level_mapping").insertRow(tr.index() + 2);
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
    `<a type='button' class='btnAction' title='Add more levels' id="btnAddLevel"><i class='fa fa-plus btnAdd'></i></a>
    <a type='button' class='btnAction' title='Remove level' id="btnRemoveLevel"><i class='fas fa-times btnDel'></i></a>`
;

  });
  $('#table_level_mapping').on('click', '#btnRemoveLevel', function () {
    var current_tr = $(this).parent().parent()
    
    var nextRow = current_tr.next()
    var colNextRow = nextRow.children()[2]
    if(colNextRow == null || (parseInt(colNextRow.textContent)) - 1 < 1)
      current_tr.prev().find('#btnAddLevel').removeAttr('style','display:none')
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
  $('#table_level_mapping').on('change', '#selectType', function () {
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
    if(num > 10)
    $(this).val(10)
  });
  $('#table_level_mapping').on('change', '#selectRank', function () {
    checkData()
    checkDuplicateRequired($(this))
  });
  $('#btnSave').on('click', function () {
    var tr = $("#table_level_mapping").find("tr")
    var lenght = tr.length
    for(var i = 1; i < lenght; i++)
    {
      var listLevelMapping = tr[i].children[3].children
      var lenghtRow = listLevelMapping.length
      for(var j = 0; j < lenghtRow; j++)
      {
        var list = []
        list.push(tr[i].id)
        list.push(tr[i].children[2].innerHTML)
        list = getDatainRow(listLevelMapping[j].children, list)
        if(list != "")
          saveLevelMapping(list)
        else
        {
          $("#contentMessageValidate").html("Has a empty field!");
          $("#messageValidate").modal('show');
          return
        }
      }
    }
    $("#contentMessageValidate").html("Add level mapping has been successed");
    $("#messageValidate").modal('show');
  })
});
function createNewRowLevel (arr)
{
  var temp = "";
  temp += `<div class="row">
    <div class='col-3'>
      <input type="number" class="form-control" min="1" max="10" placeholder='Quantity'>
    </div>
    <div class='col-5'>
      <select class="form-control" id="selectType">
        <option value='-1' disabled selected>Competency type</option>
        <option value='0'>All</option>
        <option value='1'>General</option>
        <option value='2'>Special</option>
      </select>
    </div>
    <div class='col-2'>
      <select class="form-control" id="selectRank">
        <option value='-1' disabled selected>Rank</option>`
    arr.forEach(function(item){
      temp += "<option>"+ item +"</option>"
    })
    temp += `
      </select>
      </div>
      <div class='col-2 divIcon'>
        <a type='button' class='btnAction' title='Add more Required' id="btnAddRequired"><i class='fas fa-plus-circle btnAdd'></i></a>
        <a type='button' class='btnAction' title='Remove Required' style="display:none" id="btnRemoveRequired"><i class='fas fa-times btnDel'></i></a>
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
  var selectRank = td.parent().children().val()
  var selectType = td.parent().prev().children()[0].value
    var count = 0;
    for(var i = 0; i < lenght; i++)
    {
      var type = listRow[i].children[1].children[0].value
      var rank = listRow[i].children[2].children[0].value
      if((type == selectType || selectType == "0" || type == "0" ) && rank == selectRank )
        count++
    }
    if(count > 1){
      $("#contentMessageValidate").html("The field is duplicate!");
      $("#messageValidate").modal('show');
      td.find('option[value="-1"]').prop('selected', true)
      td.css('color','red')
    }
}
function changeBtnSave (bool)
{
  if (bool == true) {
    $('#btnSave').attr("disabled", false);
    $('#btnSave').addClass("btn-primary").removeClass("btn-secondary")
  }
  else
  {
    $('#btnSave').attr("disabled", true);
    $('#btnSave').removeClass("btn-primary").addClass("btn-secondary")
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