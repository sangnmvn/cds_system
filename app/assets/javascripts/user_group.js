$(document).ready(function () {
	myJS();
  myAjax();
  privilegeJS();
  privilegeAjax();
	$('.dataTables_length').attr("style", "display:none");
	$('.dataTables_paginate').addClass("mypaging");
});

function myJS() {
	var table_left = $('#table_left').dataTable({
		info: false
	});
	var table_right = $('#table_right').dataTable({
		info: false
	});
	document.getElementById("check_all_choose").onclick = function () {
		// Lấy danh sách checkbox
		var checkboxes = $("#table_left tbody").find('input:checkbox');
		if ($("#check_all_choose").is(':checked')) {
			// Lặp và thiết lập checked
			for (var i = 0; i < checkboxes.length; i++) {
				checkboxes[i].checked = true;
				checkboxes[i].closest('tr').style.backgroundColor = "pink";
				change_button_right(0);
			}
		} else {
			for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
        if (i % 2 == 0){
          checkboxes[i].closest('tr').style.backgroundColor = "#E9ebf5";
        }else{
          checkboxes[i].closest('tr').style.backgroundColor = "#cfdcea";
        }
				change_button_right(1);
			}
		}
	};
	document.getElementById("check_all_remove").onclick = function () {
		// Lấy danh sách checkbox
		var checkboxes = $("#table_right tbody").find('input:checkbox');
		if ($("#check_all_remove").is(':checked')) {
			// Lặp và thiết lập checked
			for (var i = 0; i < checkboxes.length; i++) {
				checkboxes[i].checked = true;
				checkboxes[i].closest('tr').style.backgroundColor = "pink";
				change_button_left(0);
			}
		} else {
			for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
        if (i % 2 == 0){
          checkboxes[i].closest('tr').style.backgroundColor = "#E9ebf5";
        }else{
          checkboxes[i].closest('tr').style.backgroundColor = "#cfdcea";
        }
				change_button_left(1);
			}
		}
	};
	// click checkbox item on left
	$('#table_left tbody').on('click', 'input:checkbox', function () {
		$this = $(this);
		if ($this.is(':checked')) {
			if ($("#table_left tbody :checkbox:not(:checked)").length == 0) {
				$('#check_all_choose').prop("checked", true);
			}
			$this.closest('tr').css('background-color', "pink");
			change_button_right(0);
		} else {
			if ($("#table_left tbody :checkbox:checked").length == 0) {
				change_button_right(1);
      }
      if ($this.closest('tr').attr('class') == "odd"){
      $this.closest('tr').css('background-color', "#cfdcea");}
      else{
      $this.closest('tr').css('background-color', "#E9ebf5");
      }
			$('#check_all_choose').prop("checked", false);
		}
	});
	// click checkbox item on right
	$('#table_right tbody').on('click', 'input:checkbox', function () {
		$this = $(this);
		if ($this.is(':checked')) {
			if ($("#table_right tbody :checkbox:not(:checked)").length == 0) {
				$('#check_all_remove').prop("checked", true);
			}
			change_button_left(0);
			$this.closest('tr').css('background-color', "pink");
		} else {
			if ($("#table_right tbody :checkbox:checked").length == 0) {
				change_button_left(1);
      }
      if ($this.closest('tr').attr('class') == "odd"){
        $this.closest('tr').css('background-color', "#cfdcea");}
        else{
        $this.closest('tr').css('background-color', "#E9ebf5");
        }
		
			$('#check_all_remove').prop("checked", false);
		}
	});
	// click button to right =>
	$('#to_right').click(function () {
		var checkboxes = $("#table_left tbody").find('input:checkbox');
		for (var i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i].checked == true) {
				checkboxes[i].checked = false;
				var tr = checkboxes[i].closest("tr");
				tr.style.backgroundColor = "white";
				//$("#table_right tbody").append(tr);
				var tr_add = table_left.fnGetData(tr);
				table_right.fnAddData(tr_add);
				// table_right.row.add(tr).draw();
				table_left.fnDeleteRow(tr);
				//table_left.row(tr).remove();
			}
		}
		$('#check_all_choose').prop("checked", false);
		$('#check_all_remove').prop("checked", false);
		change_button_right(1);
		change_button_save(0);
	});
	// click button to left <=
	$('#to_left').click(function () {
		var checkboxes = $("#table_right tbody").find('input:checkbox');
		for (var i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i].checked == true) {
				checkboxes[i].checked = false;
				var tr = checkboxes[i].closest("tr");
				tr.style.backgroundColor = "white";
				var tr_add = table_right.fnGetData(tr);
				table_left.fnAddData(tr_add);
				table_right.fnDeleteRow(tr);
				//table_right.row(tr).remove();
			}
		}
		$('#check_all_choose').prop("checked", false);
		$('#check_all_remove').prop("checked", false);
		change_button_left(1);
		change_button_save(0);
	});

	$('.close_modal').click(function () {
		if ($('#save').attr("disabled") != "disabled") {
			save();
		}
		$('#table_left').DataTable().search('');
		$('#table_right').DataTable().search('');
	});
// Add index column in table left
	$('#table_left').DataTable().on('order.dt search.dt', function () {
		$('#table_left').DataTable().column(0, {
			search: 'applied',
			order: 'applied'
		}).nodes().each(function (cell, i) {
			cell.innerHTML = i + 1;
		});
	}).draw();
// Add index column in table right
	$('#table_right').DataTable().on('order.dt search.dt', function () {
		$('#table_right').DataTable().column(0, {
			search: 'applied',
			order: 'applied'
		}).nodes().each(function (cell, i) {
			cell.innerHTML = i + 1;
		});
	}).draw();

	//alert success
	function success(content) {
		$('#content-alert-success').html(content);
		$("#alert-success").fadeIn();
		window.setTimeout(function () {
			$("#alert-success").fadeOut(1000);
		}, 5000);
	}
	// alert fails
	function fails(content) {
		$('#content-alert-fail').html(content);
		$("#alert-danger").fadeIn();
		window.setTimeout(function () {
			$("#alert-danger").fadeOut(1000);
		}, 5000);
	}
}

function change_button_left(flag) {
	if (flag == 0) {
		$('#to_left').attr("disabled", false);
		$('#to_left').removeClass("btn-secondary").addClass("btn-info");
	} else {
		$('#to_left').attr("disabled", true);
		$('#to_left').removeClass("btn-info").addClass("btn-secondary");
	}
}

function change_button_right(flag) {
	if (flag == 0) {
		$('#to_right').attr("disabled", false);
		$('#to_right').removeClass("btn-secondary").addClass("btn-info");
	} else {
		$('#to_right').attr("disabled", true);
		$('#to_right').removeClass("btn-info").addClass("btn-secondary");
	}
}

function change_button_save(flag) {
	if (flag == 0) {
		$('#save').attr("disabled", false);
		$('#save').removeClass("btn-secondary").addClass("btn-info");
	} else {
		$('#save').attr("disabled", true);
		$('#save').removeClass("btn-info").addClass("btn-secondary");
	}
}

function save() {
	bootbox.confirm({
		message: "Are you sure want to save users for this group?",
		buttons: {
			confirm: {
				label: "Yes",
				className: "btn-primary"
			},
			cancel: {
				label: "No",
				className: "btn-danger"
			}
		},
		callback: function (result) {
			if (result) {
				var checkboxes = $("#table_right").DataTable().rows().data();
				var id_group = $("#title_group h1").text();
				var list = [];
				for (var i = 0; i < checkboxes.length; i++) {
					list.push($(checkboxes[i][1]).val());
				}
				change_button_save(1);
				$.ajax({
					url: "/user_groups/save_user_group",
					data: {
						list: list,
						id: id_group
					},
					type: "GET",
					success: function (response) {
						success("Assign user to this group is ");
						$("#AssignModal").modal('hide');
					},
					error: function () {
						fails("Assign user to this group is ");
					}
				});
			}
		}
	});
}

function myAjax() {
	$('.user_group_icon').click(function () {
		$("#table_right").dataTable().fnClearTable(); //xoa du lieu cũ của table
		var id = $(this).attr("data-id");
		//$('#table_left_filter input').html("");
		//ajax load bảng user_group
		$.ajax({
			type: "GET",
			url: "/user_groups/load_user_group",
			data: {
				id: id
			},
			dataType: "json",
			success: function (response) {
				$(response).each(
					function (i, e) { //duyet mang doi tuong
						// console.log(e);
						$("#table_right").dataTable().fnAddData([
							"<td style='text-align: right'></td>", "<input type='checkbox' class='mycontrol cb_right' value='" + e.admin_user_id + "'/>", e.first_name, e.last_name, e.email
						]);
					}
				);
			}
		});
	});
	$('.user_group_icon').click(function () {
		$("#table_left").dataTable().fnClearTable(); //xoa du lieu cũ của table
		var id = $(this).attr("data-id");
		//ajax load bảng user
		$.ajax({
			type: "GET",
			url: "/user_groups/load_user",
			data: {
				id: id
			},
			dataType: "json",
			success: function (response) {
				$(response).each(
					function (i, e) { //duyet mang doi tuong
						$("#table_left").dataTable().fnAddData([
							"<td style='text-align: right'></td>", "<input type='checkbox' class='mycontrol cb_left'value='" + e.id + "'/>", e.first_name, e.last_name, e.email
						]);
					}
				);
			}
		});
	});
	$('.user_group_icon').click(function () {
		$('#save').attr("disabled", true);
		$('#save').removeClass("btn-info").addClass("btn-secondary");
		var id = $(this).attr("data-id");
		//ajax load bảng group
		$.ajax({
			type: "GET",
			url: "/user_groups/load_group",
			data: {
				id: id
			},
			dataType: "json",
			success: function (response) {
				$(response).each(
					function (i, e) { //duyet mang doi tuong
						$("#title_group").html("Assign Users to Group " + e.name + "<h1 style='display:none'>" + e.id + "</h1>");
					}
				);
			}
		});
	});
	$('#save').click(function () {
		save();
	});
}
//=================================================================================
//Privilege
function privilegeJS() {
  var group_id
  $('.key_icon').click(function () {
    save_button(0)
    group_id = $(this).closest('a').attr("data-id")
    $(`#modalPrivilege_${group_id} #save_group_${group_id}`).unbind('click').on('click', function (e) {
      var save_arr = []
      $(`#modalPrivilege_${group_id} .table_right tbody :checkbox`).each(function (key, value) {
        save_arr.push($(value).val())
      })
      save_group_privileges(group_id, save_arr)
      save_arr.length = 0
      save_button(0)
    })

    $(`#modalPrivilege_${group_id} .table_left`).on('click', "tbody input[type='checkbox']", function () {
      if ($(this).is(':checked')) {
        if ($(`#modalPrivilege_${group_id} .table_left tbody :checkbox:not(:checked)`).length == 0) {
          $(`#modalPrivilege_${group_id} .selectAll1`).prop("checked", true)
        }
        $(this).closest('tr').css('background-color', "pink");
      } else {
        
        if (parseInt($(this).closest('tr').attr('id').split('_')[1]) % 2 == 0){
          $(this).closest('tr').css('background-color', "#cfdcea");}
          else{
            $(this).closest('tr').css('background-color', "#E9ebf5");
          }
        $(`#modalPrivilege_${group_id} .selectAll1`).prop("checked", false)
      }
      if ($(`#modalPrivilege_${group_id} .table_left tbody :checkbox:checked`).length == 0) {
        to_right_button(0)
      } else {
        to_right_button(1)
      }
    })
    //Checkbox table_right
    $(`#modalPrivilege_${group_id} .table_right`).on('click', ' tbody input[type=checkbox]', function () {
      if ($(this).is(':checked')) {
        if ($(`#modalPrivilege_${group_id} .table_right tbody :checkbox:not(:checked)`).length == 0) {
          $(`#modalPrivilege_${group_id} .selectAll2`).prop("checked", true)
        }
        $(this).closest('tr').css('background-color', "pink");
      } else {
        
        if (parseInt($(this).closest('tr').attr('id').split('_')[1]) % 2 == 0){
          $(this).closest('tr').css('background-color', "#cfdcea");}
          else{
            $(this).closest('tr').css('background-color', "#E9ebf5");
          }
        $(`#modalPrivilege_${group_id} .selectAll2`).prop("checked", false)
      }
      if ($(`#modalPrivilege_${group_id} .table_right tbody :checkbox:checked`).length == 0) {
        to_left_button(0)
      } else {
        to_left_button(1)
      }
    })
    //CheckAll table
    $(`#modalPrivilege_${group_id} .selectAll1`).on('click', function () {
      $(`#modalPrivilege_${group_id} .table_left tbody input[type=checkbox]`).prop('checked', $(this).prop('checked'))
      if ($(this).is(':checked')) {
        $(`#modalPrivilege_${group_id} .table_left tbody tr`).css('background-color', "pink")
        $(`#modalPrivilege_${group_id} .table_left tbody tr:nth-of-type(odd) th`).css('background-color', "#cfdcea");
        $(`#modalPrivilege_${group_id} .table_left tbody tr:nth-of-type(even) th`).css('background-color', "#E9ebf5");
        to_right_button(1)
      } else {
        
        $(`#modalPrivilege_${group_id} .table_left tbody tr:nth-of-type(odd)`).css('background-color', "#cfdcea");
        $(`#modalPrivilege_${group_id} .table_left tbody tr:nth-of-type(even)`).css('background-color', "#E9ebf5");
        to_right_button(0)
      }
    })
    $(`#modalPrivilege_${group_id} .selectAll2`).on('click', function () {
      $(`#modalPrivilege_${group_id} .table_right tbody input[type=checkbox]`).prop('checked', $(this).prop('checked'))
      if ($(this).is(':checked')) {
        $(`#modalPrivilege_${group_id} .table_right tbody tr`).css('background-color', "pink")
        $(`#modalPrivilege_${group_id} .table_right tbody tr:nth-of-type(odd) th`).css('background-color', "#cfdcea");
        $(`#modalPrivilege_${group_id} .table_right tbody tr:nth-of-type(even) th`).css('background-color', "#E9ebf5");
        to_left_button(1)
      } else {
        $(`#modalPrivilege_${group_id} .table_right tbody tr:nth-of-type(odd)`).css('background-color', "#cfdcea");
        $(`#modalPrivilege_${group_id} .table_right tbody tr:nth-of-type(even)`).css('background-color', "#E9ebf5");
        to_left_button(0)
      }
    })

    //Search form
    $(`#form_search_left_${group_id}`).unbind('click').on('click', `#search_click_${group_id}`, function () {
      var table = $(`#key_left_${group_id}`).attr("value")
      var search = $(`#search_left_${group_id}`).val()
      search_group_privileges(group_id, table, search)
    })
    $(`#form_search_right_${group_id}`).unbind('click').on('click', `#search_click_${group_id}`, function () {
      var table = $(`#key_right_${group_id}`).attr("value")
      var search = $(`#search_right_${group_id}`).val()
      search_group_privileges(group_id, table, search)
    })
  })
}

function LeftToRight(group_id) {
  $(`#modalPrivilege_${group_id} .table_left tbody :checkbox:checked`).closest('tr').each(function () {
    var title = this.className
    var name = this.id
    if ($(`#modalPrivilege_${group_id} .table_right .privilege-name.${title}`).length == 0) {
      $(`#modalPrivilege_${group_id} .table_left .privilege-name.${title}`).closest('tr').clone().appendTo(".table_right tbody")
    }
    $(`#modalPrivilege_${group_id} .${title}#${name}`).insertAfter($(`#modalPrivilege_${group_id} .table_right tbody .privilege-name.${title}`).parent('tr'))
    $(`#modalPrivilege_${group_id} .selectAll1`).prop("checked", false)
    $(`#modalPrivilege_${group_id} .${title}#${name}`).find(':checkbox').prop("checked", false)
    $(`#modalPrivilege_${group_id} .${title}#${name}`).children('td').css('color', "black")
    to_right_button(0)
    if ($(`#modalPrivilege_${group_id} .table_left .${title}`).length == 1) {
      $(`#modalPrivilege_${group_id} .table_left .privilege-name.${title}`).closest('tr').remove()
    }
  })
  var num = 1
  $(`#modalPrivilege_${group_id} .table_right tbody`).find('td.num').each(function () {
    $(this).text(num)
    num += 1
  })
  var num = 1
  $(`#modalPrivilege_${group_id} .table_left tbody`).find('td.num').each(function () {
    $(this).text(num)
    num += 1
  })
  if ($(`#modalPrivilege_${group_id} .table_left tbody :checkbox`).length == 0 && $(`.table_left .notice`).length == 0) {
    $(`#modalPrivilege_${group_id} .table_left tbody`).append('<tr class="notice" style="text-align:center;"><th class="privilege-name" colspan=3>No matching records found</th></tr>')
    $(`#modalPrivilege_${group_id} .table_right tbody .notice`).remove()
  }
  if ($(`#modalPrivilege_${group_id} .table_right tbody :checkbox:checked`).length > 0) {
    $(`#modalPrivilege_${group_id} .table_right tbody .notice`).remove()
  }
  // var save_arr = []
  // $(`#modalPrivilege_${group_id} .table_right tbody :checkbox`).each(function(key,value){
  //   save_arr.push($(value).val())
  // })
  // save_group_privileges(group_id,save_arr)
  // save_arr.length = 0
  save_button(1)
}

function RightToLeft(group_id) {
  $(`#modalPrivilege_${group_id} .table_right tbody :checkbox:checked`).closest('tr').each(function () {
    var title = this.className
    var name = this.id
    if ($(`#modalPrivilege_${group_id} .table_left .privilege-name.${title}`).length == 0) {
      $(`#modalPrivilege_${group_id} .table_right .privilege-name.${title}`).closest('tr').clone().appendTo(`#modalPrivilege_${group_id} .table_left tbody`)
    }
    $(`#modalPrivilege_${group_id} .${title}#${name}`).insertAfter($(`#modalPrivilege_${group_id} .table_left tbody .privilege-name.${title}`).parent('tr'))
    $(`#modalPrivilege_${group_id} .selectAll2`).prop("checked", false)
    $(`#modalPrivilege_${group_id} .${title}#${name}`).find(':checkbox').prop("checked", false)
    $(`#modalPrivilege_${group_id} .${title}#${name}`).children('td').css('color', "black")
    to_left_button(0)
    if ($(`#modalPrivilege_${group_id} .table_right .${title}`).length == 1) {
      $(`#modalPrivilege_${group_id} .table_right .privilege-name.${title}`).closest('tr').remove()
    }
  })
  var num = 1
  $(`#modalPrivilege_${group_id} .table_right tbody`).find('td.num').each(function () {
    $(this).text(num)
    num += 1
  })
  var num = 1
  $(`#modalPrivilege_${group_id} .table_left tbody`).find('td.num').each(function () {
    $(this).text(num)
    num += 1
  })
  if ($(`#modalPrivilege_${group_id} .table_right tbody :checkbox`).length == 0 && $(`.table_right .notice`).length == 0) {
    $(`#modalPrivilege_${group_id} .table_right tbody`).append('<tr class="notice" style="text-align:center;"><th class="privilege-name" colspan=3>No matching records found</th></tr>')
    $(`#modalPrivilege_${group_id} .table_left tbody .notice`).remove()
  }
  if ($(`#modalPrivilege_${group_id} .table_left tbody :checkbox:checked`).length > 0) {
    $(`#modalPrivilege_${group_id} .table_left tbody .notice`).remove()
  }
  // var save_arr = []
  // $(`#modalPrivilege_${group_id} .table_right tbody :checkbox`).each(function(key,value){
  //   save_arr.push($(value).val())
  // })
  // save_group_privileges(group_id,save_arr)
  // save_arr.length = 0
  save_button(1)
}

function to_right_button(flag) {
  if (flag == 0) {
    $('.to_right').prop("disabled", true)
    $('.to_right').removeClass("btn-info").addClass("btn-secondary")
  } else {
    $('.to_right').prop("disabled", false)
    $('.to_right').removeClass("btn-secondary").addClass("btn-info")
  }
}

function to_left_button(flag) {
  if (flag == 0) {
    $('.to_left').prop("disabled", true)
    $('.to_left').removeClass("btn-info").addClass("btn-secondary")
  } else {
    $('.to_left').prop("disabled", false)
    $('.to_left').removeClass("btn-secondary").addClass("btn-info")
  }
}

function save_button(flag) {
  if (flag == 0) {
    $('.save').prop("disabled", true)
    $('.save').removeClass("btn-info").addClass("btn-secondary")
  } else {
    $('.save').prop("disabled", false)
    $('.save').removeClass("btn-secondary").addClass("btn-info")
  }
}
function privilegeAjax() {
  $('.key_icon').on('click', function () {
    var group_id = $(this).closest('a').attr("data-id")
    $(`#modalPrivilege_${group_id} .table_left tbody`).children('tr').remove()
    $(`#modalPrivilege_${group_id} .table_right tbody`).children('tr').remove()
    $.ajax({
      type: "GET",
      url: `user_groups/show_privileges/${group_id}`,
      dataType: "json",
      success: function (response) {
        $.each(response, function (key, value) {
          if (key == "left") {
            var old_name = []
            var num = 1
            $(value).each(function (k, v) {
              if (old_name.includes(v.TitleName) == false) {
                $(`#modalPrivilege_${group_id} .table_${key} tbody`).append(`<tr><th class="privilege-name ${v.title_privilege_id}" colspan=3 style="text-align: left;">${v.TitleName}</th></tr>`)
              }
              $(`#modalPrivilege_${group_id} .table_${key} tbody`).append(`<tr class="${v.title_privilege_id}" id="${group_id}_${v.id}"><td scope="row" class="num">${num}</td><td><input type="checkbox" value="${v.id}"></td><td style="text-align: left;">${v.name}</td></tr>`)
              old_name.push(v.TitleName)
              num += 1
            })
            if (value != null && value.length == 0) {
              $(`#modalPrivilege_${group_id} .table_${key} tbody`).append('<tr class="notice" style="text-align:center;"><th style="display:none"></th><th style="display:none"></th><th class="privilege-name" colspan=3>No matching records found</th></tr>')
            }
          }
          if (key == "right") {
            var old_name = []
            var num = 1
            $(value).each(function (k, v) {
              if (old_name.includes(v.TitleName) == false) {
                $(`#modalPrivilege_${group_id} .table_${key} tbody`).append(`<tr><th style="display:none"></th><th style="display:none"></th><th class="privilege-name ${v.title_privilege_id}" colspan=3 style="text-align: left;">${v.TitleName}</th></tr>`)
              }
              $(`#modalPrivilege_${group_id} .table_${key} tbody`).append(`<tr class="${v.title_privilege_id}" id="${group_id}_${v.privilege_id}"><td scope="row" class="num">${num}</td><td><input type="checkbox" value="${v.privilege_id}"></td><td style="text-align: left;">${v.name}</td></tr>`)
              old_name.push(v.TitleName)
              num += 1
            })
            if (value != null && value.length == 0) {
              $(`#modalPrivilege_${group_id} .table_${key} tbody`).append('<tr class="notice" style="text-align:center;"><th style="display:none"></th><th style="display:none"></th><th class="privilege-name" colspan=3>No matching records found</th></tr>')
            }
          }
          $(`#modalPrivilege_${group_id}`).on('click', `#to_left_${group_id}`, function () {
            LeftToRight(group_id)
            if ($(`#modalPrivilege_${group_id} .table_left tbody :checkbox`).length == 0 && $(`.table_left .notice`).length == 0) {
              $(`#modalPrivilege_${group_id} .table_left tbody`).append('<tr class="notice" style="text-align:center;"><th class="privilege-name" colspan=3>No matching records found</th></tr>')
              $(`#modalPrivilege_${group_id} .table_right tbody .notice`).remove()
            }
          })
          $(`#modalPrivilege_${group_id}`).on('click', `#to_right_${group_id}`, function () {
            RightToLeft(group_id)
            if ($(`#modalPrivilege_${group_id} .table_right tbody :checkbox`).length == 0 && $(`.table_right .notice`).length == 0) {
              $(`#modalPrivilege_${group_id} .table_right tbody`).append('<tr class="notice" style="text-align:center;"><th class="privilege-name" colspan=3>No matching records found</th></tr>')
              $(`#modalPrivilege_${group_id} .table_left tbody .notice`).remove()
            }
          })
        })
      },
      error: function (response) {
        fails()
      }
    })
    privilegeJS()
  })
}

function save_group_privileges(group_id, arr) {
  $.ajax({
    url: `user_groups/save_privileges`,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      group_id: group_id,
      data: arr
    },
    dataType: "json",
    success: function (response) {
      success()
    },
    error: function (response) {
      fails()
    }
  })
}

function search_group_privileges(group_id, table, search) {
  // var ids = []
  // $(`#modalPrivilege_${group_id} .table_right tbody :checkbox`).each(function(){
  //   ids.push($(this).attr("value"))
  // })
  $.ajax({
    url: `user_groups/search_privileges`,
    type: "GET",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      group_id: group_id,
      key: table,
      search: search
    },
    dataType: "json",
    success: function (response) {
      $.each(response, function (key, value) {
        if (key == "left") {
          $(`#table_left_${group_id} tbody`).empty()
          var old_name = []
          var num = 1
          $(value).each(function (k, v) {
            if (old_name.includes(v.TitleName) == false) {
              $(`#modalPrivilege_${group_id} .table_${key} tbody`).append(`<tr><th class="privilege-name ${v.title_privilege_id}" colspan=3>${v.TitleName}</th></tr>`)
            }
            $(`#modalPrivilege_${group_id} .table_${key} tbody`).append(`<tr class="${v.title_privilege_id}" id="${group_id}_${v.id}"><td scope="row" class="num">${num}</td><td><input type="checkbox" value="${v.id}"></td><td>${v.name}</td></tr>`)
            old_name.push(v.TitleName)
            num += 1
          })
          if (value.length == 0 && $(`.table_${key} .notice`) != null && $(`.table_${key} .notice`).length == 0) {
            $(`#modalPrivilege_${group_id} .table_${key} tbody`).append('<tr class="notice" style="text-align:center;"><th style="display:none"></th><th style="display:none"></th><th class="privilege-name" colspan=3>No matching records found</th></tr>')
          }
        }
        if (key == "right") {
          $(`#table_right_${group_id} tbody`).empty()
          var old_name = []
          var num = 1
          $(value).each(function (k, v) {
            if (old_name.includes(v.TitleName) == false) {
              $(`#modalPrivilege_${group_id} .table_${key} tbody`).append(`<tr><th class="privilege-name ${v.title_privilege_id}" colspan=3>${v.TitleName}</th></tr>`)
            }
            $(`#modalPrivilege_${group_id} .table_${key} tbody`).append(`<tr class="${v.title_privilege_id}" id="${group_id}_${v.privilege_id}"><td scope="row" class="num">${num}</td><td><input type="checkbox" value="${v.privilege_id}"></td><td>${v.name}</td></tr>`)
            old_name.push(v.TitleName)
            num += 1
          })
          if (value.length == 0 && $(`.table_${key} .notice`) != null && $(`.table_${key} .notice`).length == 0) {
            $(`#modalPrivilege_${group_id} .table_${key} tbody`).append('<tr class="notice" style="text-align:center;"><th style="display:none"></th><th style="display:none"></th><th class="privilege-name" colspan=3>No matching records found</th></tr>')
          }
        }

        $(`#modalPrivilege_${group_id}`).on('click', `#to_left_${group_id}`, function () {
          LeftToRight(group_id)
          if ($(`#modalPrivilege_${group_id} .table_left tbody :checkbox`).length == 0 && $(`.table_left .notice`) != null && $(`.table_left .notice`).length == 0) {
            $(`#modalPrivilege_${group_id} .table_left tbody`).append('<tr class="notice" style="text-align:center;"><th class="privilege-name" colspan=3>No matching records found</th></tr>')
            $(`#modalPrivilege_${group_id} .table_right tbody .notice`).remove()
          }
        })
        $(`#modalPrivilege_${group_id}`).on('click', `#to_right_${group_id}`, function () {
          RightToLeft(group_id)
          if ($(`#modalPrivilege_${group_id} .table_right tbody :checkbox`).length == 0 && $(`.table_right .notice`) != null && $(`.table_right .notice`).length == 0) {
            $(`#modalPrivilege_${group_id} .table_right tbody`).append('<tr class="notice" style="text-align:center;"><th class="privilege-name" colspan=3>No matching records found</th></tr>')
            $(`#modalPrivilege_${group_id} .table_left tbody .notice`).remove()
          }
        })
      })
      success()
    },
    error: function (response) {
      fails()
    }
  })
  privilegeJS()
}