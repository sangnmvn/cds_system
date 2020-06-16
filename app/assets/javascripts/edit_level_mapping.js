$(document).ready(function () {
  var list_del = []
  loadLevelMapping(count)
  changeBtnSave(false)
  checkPrivilege($("#can_edit_level_mapping").val(), global_can_view)
  $('#table_edit_level_mapping').on('click', '#btn_add_required', function () {
    changeBtnSave(false)
    var row = $(this).parent().parent()
    var quantity = row.find('input')[0].value
    var type = row.find('select')[0].value
    var rank = row.find('select')[1].value
    if (quantity == "" || type == "-1" || rank == "-1") {
      fails("Has a blank field")
    } else {
      $(this).closest('td').append(createNewRowRequire(count))
      $(this).parent().children()[1].classList.remove('invisible')
      $(this).addClass("invisible")
    }
  });
  $('#table_edit_level_mapping').on('click', '#btn_remove_required', function () {
    if ($(this).parent().parent().nextAll().length == 0) {
      if ($(this).parent().parent().prevAll().length == 1) {
        $(this).parent().parent().prev().children()[3].children[1].classList.add('invisible')
      }
      $(this).parent().parent().prev().children()[3].children[0].classList.remove('invisible')
    }
    if ($(this).parent().parent().nextAll().length == 1 && $(this).parent().parent().prevAll().length == 0) {
      $(this).parent().parent().next().children()[3].children[1].classList.add('invisible')
    }
    list_del.push($(this).parent().parent().data("level-mapping-id"))
    $(this).parent().parent().remove()
    checkData()
  });
  $('#table_edit_level_mapping').on('click', '#btn_add_level', function () {
    changeBtnSave(false)
    var tr = $(this).closest('tr')
    var title = tr.children()[0].textContent
    var rank = tr.children()[1].textContent
    var level = parseInt(tr.children()[2].textContent) + 1
    var row = createNewRowLevel(count)
    var title_id = tr.data('title-id')
    $(this).addClass("invisible").removeClass("visible")
    var newRow = document.getElementById("table_edit_level_mapping").insertRow(tr.index() + 2);
    newRow.setAttribute("data-title-id", title_id)
    newRow.insertCell(0);
    newRow.cells[0].innerHTML = title;
    newRow.insertCell(1);
    newRow.cells[1].innerHTML = rank;
    newRow.insertCell(2);
    newRow.cells[2].innerHTML = level;
    newRow.insertCell(3);
    newRow.cells[3].innerHTML = row;
    newRow.insertCell(4);
    newRow.cells[4].innerHTML =
      `<a type='button' class='btnAction' title='Add more levels' id="btn_add_level"><i class='fa fa-plus btnAdd'></i></a>
    <a type='button' class='btnAction' title='Remove level' id="btn_remove_level"><i class='fas fa-times btnDel'></i></a>`;

  });
  $('#table_edit_level_mapping').on('click', '#btn_remove_level', function () {
    var current_tr = $(this).parent().parent()
    var nextRow = current_tr.next()
    var colNextRow = nextRow.children()[2]
    if (colNextRow == null || (parseInt(colNextRow.textContent)) - 1 < 1)
      current_tr.prev().find('#btn_add_level').addClass("visible").removeClass("invisible")
    else {
      while (colNextRow != null) {
        var level = parseInt(colNextRow.textContent) - 1
        if (level < 1)
          break;
        colNextRow.innerText = level
        nextRow = nextRow.next()
        colNextRow = nextRow.children()[2]
      }
    }
    var lst = $(this).closest('td').prev().children()
    var count = lst.length
    for (var i = 0; i < count; i++) {
      if (lst[i].getAttributeNames().includes("data-level-mapping-id") == true) {
        list_del.push(lst[i].attributes[1].value)
      }
    }
    $(this).parent().parent().remove()
    checkData()
  });
  $('#table_edit_level_mapping').on('change', '#select_type', function () {
    checkData()
    checkDuplicateRequired($(this))
    $(this).parent().parent().attr('data-is_change', 'true');
    checkRow($(this).parent().parent())
  });
  $('#table_edit_level_mapping').on('keyup', 'input', function (e) {
    checkData()
    checkRow($(this).parent().parent())
    $(this).parent().parent().attr('data-is_change', 'true');
  });
  $('#table_edit_level_mapping').on('change', 'input', function (e) {
    checkData()
    checkRow($(this).parent().parent())
    $(this).parent().parent().attr('data-is_change', 'true');
  });
  $('#table_edit_level_mapping').on('blur', 'input', function () {
    var num = parseInt($(this).val())
    if (num < 1)
      $(this).val(1)
    if (num > max_quantity)
      $(this).val(max_quantity)
  });
  $('#table_edit_level_mapping').on('change', '#select_rank', function () {
    checkData()
    checkDuplicateRequired($(this))
    checkRow($(this).parent().parent())
    $(this).parent().parent().attr('data-is_change', 'true');
  });
  $('#btn_save').on('click', function () {
    changeBtnSave(false)
    var list_edit = []
    var list_new = []
    var tr = $("#table_edit_level_mapping").find("tr")
    var lenght = tr.length
    for (var i = 1; i < lenght; i++) {
      var listLevelMapping = tr[i].children[3].children
      var lenghtRow = listLevelMapping.length
      for (var j = 0; j < lenghtRow; j++) {
        if (listLevelMapping[j].getAttributeNames().includes("data-level-mapping-id") == false) {
          var list = []
          list.push(tr[i].getAttribute('data-title-id'))
          list.push(tr[i].children[2].innerHTML)
          list = getDatainRow(listLevelMapping[j].children, list)
          if (list != "")
            list_new.push(list)
          else {
            fails("Has a empty field!")
            return
          }
        } else {
          if (listLevelMapping[j].attributes["data-is_change"].value == 'true') {
            var id_level_mapping = listLevelMapping[j].attributes[1].value
            if (id_level_mapping) {
              var list = []
              list.push(id_level_mapping)
              list.push(listLevelMapping[j].children[0].children[0].value)
              list.push(listLevelMapping[j].children[1].children[0].value)
              list.push(listLevelMapping[j].children[2].children[0].value)
              if (list[0] != "")
                list_edit.push(list)
              else {
                fails("Has a empty field!")
                return
              }
            }
          }
        }
      }
    }
    saveLevelMapping(list_new, list_del, list_edit)
  })
});

function createNewRowRequire(count) {
  var temp = "";
  temp += `<div class="row">
    <div class='col-3'>
      <input type="number" class="form-control" min="1" max="10" placeholder='Quantity'>
    </div>
    <div class='col-5'>
      <select class="form-control" id="select_type">
        <option value='-1' disabled selected>Competency type</option>
        <option value='All'>All</option>
        <option value='General'>General</option>
        <option value='Specialized'>Special</option>
      </select>
    </div>
    <div class='col-2'>
      <select class="form-control" id="select_rank">
        <option value='-1' disabled selected>Rank</option>`
  for (var i = 1; i <= count; i++) {
    temp += "<option value='" + i + "'>" + i + "</option>"
  }
  temp += `
      </select>
      </div>
      <div class='col-2 divIcon'>
        <a type='button' class='btnAction disabled' title='Add a required competency' id="btn_add_required"><i class='fas fa-plus-circle btnAdd'></i></a>
        <a type='button' class='btnAction' title='Delete a required competency' id="btn_remove_required"><i class='fas fa-times btnDel'></i></a>
      </div>
      </div>`
  return temp
}

function createNewRowLevel(count) {
  var temp = "";
  temp += `<div class="row">
    <div class='col-3'>
      <input type="number" class="form-control" min="1" max="10" placeholder='Quantity'>
    </div>
    <div class='col-5'>
      <select class="form-control" id="select_type">
        <option value='-1' disabled selected>Competency type</option>
        <option value='All'>All</option>
        <option value='General'>General</option>
        <option value='Specialized'>Special</option>
      </select>
    </div>
    <div class='col-2'>
      <select class="form-control" id="select_rank">
        <option value='-1' disabled selected>Rank</option>`
  for (var i = 1; i <= count; i++) {
    temp += "<option value='" + i + "'>" + i + "</option>"
  }
  temp += `
      </select>
      </div>
      <div class='col-2 divIcon'>
        <a type='button' class='btnAction disabled' title='Add a required competency' id="btn_add_required"><i class='fas fa-plus-circle btnAdd'></i></a>
        <a type='button' class='btnAction invisible' title='Delete a required competency' id="btn_remove_required"><i class='fas fa-times btnDel'></i></a>
      </div>
      </div>`
  return temp
}
function checkRow(row) {
  if (row.children()[0].children[0].value == "" || row.children()[1].children[0].value == "-1" || row.children()[2].children[0].value == "-1") {
    row.children()[3].children[0].classList.add('disabled')
  }
  else {
    row.children()[3].children[0].classList.remove('disabled')
  }
}
function checkData() {
  var row = $("#table_edit_level_mapping").find('.row').children()
  var count = row.length
  for (var i = 0; i < count; i++) {
    if (row[i].children[0].value == "" || row[i].children[0].value == "-1") {
      changeBtnSave(false)
      return
    }
  }
  changeBtnSave(true)
}

function checkDuplicateRequired(td) {
  td.css('color', 'black')
  var listRow = td.closest('td').children()
  var lenght = listRow.length
  if (td.parent().nextAll().length > 1) {
    var selectType = td.parent().children().val()
    var selectRank = td.parent().next().children()[0].value
  } else {
    var selectRank = td.parent().children().val()
    var selectType = td.parent().prev().children()[0].value
  }
  var count = 0;
  for (var i = 0; i < lenght; i++) {
    var type = listRow[i].children[1].children[0].value
    var rank = listRow[i].children[2].children[0].value
    if ((selectType == all || type == all) && rank == selectRank) {
      count++
    } else {
      if (type == selectType && rank == selectRank)
        count++
    }
  }
  if (count > 1) {
    fails('The field is duplicate!')
    td.find('option[value="-1"]').prop('selected', true)
    td.css('color', 'red')
    td.find('option').css('color', 'black')
  }
}

function changeBtnSave(bool) {
  if (bool == true) {
    $('#btn_save').attr("disabled", false);
    $('#btn_save').addClass("btn-primary").removeClass("btn-secondary")
  } else {
    $('#btn_save').attr("disabled", true);
    $('#btn_save').removeClass("btn-primary").addClass("btn-secondary")
  }

}

function saveLevelMapping(list_new, list_del, list_edit) {
  $.ajax({
    url: "/level_mappings/save_level_mapping",
    data: {
      list_new: list_new,
      list_del: list_del,
      list_edit: list_edit,
    },
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      if (response.status == "success")
        editTitleMapping()
      else
        fails("The level mapping for role " + $("#role_name").val() + " has been updated fail.")
    }
  });
}

function getDatainRow(lst, list) {
  var length = lst.length;
  for (var i = 0; i < length - 1; i++) {
    var data = lst[i].children[0].value;
    if (data == "" || data == "-1")
      return ""
    list.push(lst[i].children[0].value)
  }
  return list
}
//-------------- Edit --------------------------
function editTitleMapping() {
  record = [];
  $(".table-edit-title-mapping > tbody > tr").each(function () {
    current_row = $(this);
    title_id = current_row.data("title_id");
    competency_ids = []
    $(".dynamic_title_header_col").each(function () {
      competency_ids.push($(this).data("competency-id"));
    })

    element_to_read = '.table-edit-title-mapping tbody tr[data-title_id={title_id}] .competency_value'.formatUnicorn({
      title_id: title_id
    })

    for (i = 0; i < competency_ids.length; i++) {
      var current_competency_id = competency_ids[i];

      value = $(element_to_read)[i].value;

      is_changed = $(element_to_read)[i].getAttribute('data-is_changed');

      if (is_changed != "true") {
        continue;
      }

      current_data = {
        value: value,
        title_id: title_id,
        competency_id: current_competency_id
      };
      record.push(current_data);
    }

  });
  if (record.length > 0) {
    $.ajax({
      type: "POST",
      url: "/level_mappings/edit_title_mapping/",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      data: {
        records: record
      },
      dataType: "json",
      success: function (response) {
        if (response.status == "success") {
          localStorage.setItem("role_name", $("#role_name").val());
          localStorage.setItem("type", "updated");
          $(location).attr('href', "/level_mappings/")
        } else
          fails("The level mapping for role " + $("#role_name").val() + " has been updated fail.")
      }
    })
  } else {
    localStorage.setItem("role_name", $("#role_name").val());
    localStorage.setItem("type", "updated");
    $(location).attr('href', "/level_mappings/")
  }
}

function loadLevelMapping(count) {
  $("#table_edit_level_mapping tbody tr").each(function (index, value) {
    var tr = $(this)
    fillSelectType(tr.find('#select_type'), tr.find('#select_type').val())
    fillSelectRank(tr.find('#select_rank'), tr.find('#select_rank').val(), count)
    if (tr.data('title-id') == tr.prev().data('title-id') && tr.children()[2].innerHTML == tr.prev().children()[2].innerHTML) {
      tr.prev().children()[3].append(tr.children()[3].children[0]) //gộp các level mapping cùng 1 bậc
      tr.remove()
    }
  })
  $("#table_edit_level_mapping tbody tr").each(function (index, value) {
    var rows = $(this).find('.row')
    if (rows.length > 1) {
      rows.each(function () {
        $(this).children()[3].children[1].classList.remove('invisible')
        $(this).children()[3].children[0].classList.add('invisible')
      })
      rows.last().find('#btn_add_required').addClass('visible').removeClass('invisible')
    }
    var tr = $(this)
    if (tr.data('title-id') != tr.next().data('title-id'))
      tr.children()[4].children[0].classList.remove('invisible')
    if (tr.data('title-id') != tr.prev().data('title-id'))
      tr.children()[4].children[1].classList.add('invisible')
  })
}

function fillSelectType(select, value) {
  select.find("option").remove()
  $('<option value="All"/>').html("All").appendTo(select)
  $('<option value="General"/>').html("General").appendTo(select)
  $('<option value="Specialized"/>').html("Special").appendTo(select)
  select.find("option[value='" + value + "']").prop('selected', true)
}

function fillSelectRank(select, value, count) {
  select.find("option").remove()
  for (var i = 1; i <= count; i++) {
    $("<option value='" + i + "'/>").html(i).appendTo(select)
  }
  select.find("option[value='" + value + "']").prop('selected', true)
}

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

function checkPrivilege(edit, view) {
  if (!edit && !view)
    window.location.replace = ""
  else {
    if (view && edit == "false") {
      $(".btnAction").remove()
      $(".btn-save").remove()
    }
  }
}