$(document).ready(function () {
  myJS();
  myAjax();
  privilegeJS();
  privilegeAjax();
	$('.dataTables_length').attr("style", "display:none");
	$('.dataTables_paginate').addClass("mypaging");
});

function myJS_data_event()
{
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
        checkboxes[i].closest('tr').style.backgroundColor = "#cfd5ea";
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
        checkboxes[i].closest('tr').style.backgroundColor = "#cfd5ea";
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
    $this.closest('tr').css('background-color', "#cfd5ea");}
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
        $this.closest('tr').css('background-color', "#cfd5ea");}
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
                table_left  = $("#table_left").dataTable();
                table_right = $("#table_right").dataTable();

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

                table_left  = $("#table_left").dataTable();
                table_right = $("#table_right").dataTable();

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

    // $('.close_modal').click(function () {
    //     if ($('#save').attr("disabled") != "disabled") {
    //         save();
    //     }
    //     $('#table_left').DataTable().search('');
    //     $('#table_right').DataTable().search('');
    // });
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

function myJS() {
	var table_left = $('#table_left').dataTable({
		bInfo: false, bDestroy: true
	});
	var table_right = $('#table_right').dataTable({
		bInfo: false, bDestroy: true
  });
  
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
    $("#save").removeClass("btn-secondary").addClass("btn-primary");
	} else {
		$('#save').attr("disabled", true);
    $("#save").removeClass("btn-primary").addClass("btn-secondary");
	}
}

function save() {
        
				var checkboxes = $("#table_right").DataTable().rows().data();
				var id_group = $("#title_group h1").text();
        var list = [];
				for (var i = 0; i < checkboxes.length; i++) {
					list.push($(checkboxes[i][1].split("<div style='text-align:center'>")[1].split("</div>")[0]).val());
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
            success("Assign user to this group has been successfully! ");
            $("#AssignModal").modal('hide');
            $('.bootbox-confirm').modal('hide');	
            var table = $("#table_group").DataTable();
          var dataLength = table.rows().data().length;
          for (var i = 0; i < dataLength; i++) {
            
            
            var current_user_id = table.row(i).data()[0]
            .split("batch_action_item_")[1]
            .split('"')[0];
            current_user_id = parseInt(current_user_id);
            if (current_user_id == response.id) {
              var row_id = i;
              var updateData = [];
              updateData.push(
                '<div class="resource_selection_cell"><input type="hidden" id="batch_action_item_' +
              response.id +
              '" value="0" \
            class="collection_selection" name="collection_selection[]">'+
     
          '<input type="checkbox" id="group_ids[]" value="' +
          response.id +
          '" class="selectable selectable_check" name="checkbox"></div>'

              );
              var a=row_id+1;
              updateData.push('<div style="text-align:right">'+ a +'</div>');
              updateData.push(response.name);
              updateData.push(response.desc);
              updateData.push('<div style="text-align:right">'+response.number+'</div>');
              updateData.push(response.status_group);
              
              
              updateData.push(
                '<div style="text-align:center"><a class="action_icon edit_icon btn-edit-group" data-id="'+response.id +'" href="#">\
                <i class="fa fa-pencil icon" style="color:#fc9803"></i></a> \
                <a class="action_icon key_icon" data-target="#modalPrivilege" data-toggle="modal"  data-id="'+response.id+'" href="#" title="Assign Privileges To Group"><i class="fa fa-key"></i></a> \
                <a class="action_icon user_group_icon" data-toggle="modal" data-target="#AssignModal" title="Assign Users to Group" data-id="'+response.id +'" href="#"><i class="fa fa-users"></i></a>\
                <a class="action_icon del_btn" data-group="'+response.id +'" data-toggle="tooltip" title="Delete Group">\
                <i class="fa fa-trash icon" style="color:red"></i></a> </div>'
              );

              var delete_whole_row_constant = undefined;
              var redraw_table = false;
              table.row(row_id).data(updateData);
              myJS_data_event();
              myAjax();
              privilegeAjax();	
              privilegeJS();
              /*
              table.fnUpdate(
                updateData,
                row_id,
                delete_whole_row_constant,
                redraw_table
              );
              */ ;
            
            }
          }
					},
					error: function () {
            fails("Assign user to this group is ");
            $('.bootbox-confirm').modal('hide');;						
					}
				});
}


function myAjax() {
	$('.user_group_icon').click(function () {
    //xoa du lieu cũ của table
    var id = $(this).attr("data-id");
    //$('#table_left_filter input').html("");$('#to_left')
		//ajax load bảng user_group
		$.ajax({
			type: "GET",
			url: "/user_groups/load_user_group",
			data: {
				id: id
			},
			dataType: "json",
			success: function (response) {
        $('#check_all_choose').prop("checked", false);
        $('#to_left').prop("disabled", true);
        $('#to_right').prop("disabled", true);
        $('#to_left').removeClass("btn-info").addClass("btn-secondary");
        $('#to_right').removeClass("btn-info").addClass("btn-secondary");
        
        $("#table_right").dataTable().fnClearTable(); 
				$.each(response,function (i, e) { //duyet mang doi tuong
          table=$("#table_right").dataTable();
            table.fnAddData([
							"<td style='text-align: right'></td>", "<div style='text-align:center'><input type='checkbox' class='mycontrol cb_right' value='" + e.admin_user_id + "'/></div>", e.first_name, e.last_name
            
            ]);
         
          }
          
				);
			}
		});
	});
	$('.user_group_icon').click(function () {
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
        $("#table_left").dataTable().fnClearTable(); //xoa du lieu cũ của table
         //xoa du lieu cũ của table
				$(response).each(
          function (i, e) { //duyet mang doi tuong
            console.log(i + ' - ' + e);            
						$("#table_left").dataTable().fnAddData([
							"<td style='text-align: right'></td>", "<div style='text-align:center'><input type='checkbox' class='mycontrol cb_left'value='" + e.id + "'/></div>", e.first_name, e.last_name
						]);
					}
				);
			}
		});
	});
	$('.user_group_icon').click(function () {
		$('#save').attr("disabled", true);
    $("#save").removeClass("btn-primary").addClass("btn-secondary");
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
    $(`#modalPrivilege #save_group`).unbind('click').on('click', function (e) {
      var save_arr = []
      $(`#modalPrivilege .table_right tbody :checkbox`).each(function (key, value) {
        save_arr.push($(value).val())
      })
      save_group_privileges(group_id, save_arr)
      save_arr.length = 0
      save_button(0)
    })

    $(`#modalPrivilege .table_left`).on('click', "tbody input[type='checkbox']", function () {
      if ($(this).is(':checked')) {
        if ($(`#modalPrivilege .table_left tbody :checkbox:not(:checked)`).length == 0) {
          $(`#modalPrivilege .selectAll1`).prop("checked", true)
        }
        $(this).closest('tr').css('background-color', "pink");
      } else {
        
        
            $(this).closest('tr').css('background-color', "#E9ebf5");
      
        $(`#modalPrivilege .selectAll1`).prop("checked", false)
      }
      if ($(`#modalPrivilege .table_left tbody :checkbox:checked`).length == 0) {
        to_right_button(0)
      } else {
        to_right_button(1)
      }
    })
    //Checkbox table_right
    $(`#modalPrivilege .table_right`).on('click', ' tbody input[type=checkbox]', function () {
      if ($(this).is(':checked')) {
        if ($(`#modalPrivilege .table_right tbody :checkbox:not(:checked)`).length == 0) {
          $(`#modalPrivilege .selectAll2`).prop("checked", true)
        }
        $(this).closest('tr').css('background-color', "pink");
      } else {
        
       
            $(this).closest('tr').css('background-color', "#E9ebf5");
         
        $(`#modalPrivilege .selectAll2`).prop("checked", false)
      }
      if ($(`#modalPrivilege .table_right tbody :checkbox:checked`).length == 0) {
        to_left_button(0)
      } else {
        to_left_button(1)
      }
    })
    //CheckAll table
    $(`#modalPrivilege .selectAll1`).on('click', function () {
      $(`#modalPrivilege .table_left tbody input[type=checkbox]`).prop('checked', $(this).prop('checked'))
      if ($(this).is(':checked')) {
        $(`#modalPrivilege .table_left tbody tr`).css('background-color', "pink")
      
        $(`#modalPrivilege .table_left tbody tr:nth-of-type(even) th`).css('background-color', "#cfd5ea");
        to_right_button(1)
      } else {
        
     
        $(`#modalPrivilege .table_left tbody tr:nth-of-type(even)`).css('background-color', "#E9ebf5");
        to_right_button(0)
      }
    })
    $(`#modalPrivilege .selectAll2`).on('click', function () {
      $(`#modalPrivilege .table_right tbody input[type=checkbox]`).prop('checked', $(this).prop('checked'))
      if ($(this).is(':checked')) {
        $(`#modalPrivilege .table_right tbody tr`).css('background-color', "pink")
      
        $(`#modalPrivilege .table_right tbody tr:nth-of-type(even) th`).css('background-color', "#cfd5ea");
        to_left_button(1)
      } else {

        $(`#modalPrivilege .table_right tbody tr:nth-of-type(even)`).css('background-color', "#E9ebf5");
        to_left_button(0)
      }
    })
    $('#modalPrivilege #to_right').on('click', function() {
      LeftToRight(group_id)
    })
    $('#modalPrivilege #to_left').on('click', function() {
      RightToLeft(group_id)
    })
  })
}

function LeftToRight(group_id) {
  $(`#modalPrivilege .table_left tbody :checkbox:checked`).closest('tr').each(function () {
    var title = this.className
    var name = this.id
    if ($(`#modalPrivilege .table_right .privilege-name.${title}`).length == 0) {
      $(`#modalPrivilege .table_left .privilege-name.${title}`).closest('tr').clone().appendTo(".table_right tbody")
    }
    $(`#modalPrivilege .${title}#${name}`).insertAfter($(`#modalPrivilege .table_right tbody .privilege-name.${title}`).parent('tr'))
    $(`#modalPrivilege .selectAll1`).prop("checked", false)
    $(`#modalPrivilege .${title}#${name}`).find(':checkbox').prop("checked", false)
   
        $(`#modalPrivilege .${title}#${name}`).find(':checkbox').prop("checked", false).closest('tr').css('background-color', "#E9ebf5");
        $(`#modalPrivilege .${title}#${name}`).find(':checkbox').prop("checked", false).closest('th').css('background-color', "#cfd5ea");
    
  
    to_right_button(0)
    if ($(`#modalPrivilege .table_left .${title}`).length == 1) {
      $(`#modalPrivilege .table_left .privilege-name.${title}`).closest('tr').remove()
    }
    if ($(`#modalPrivilege .table_right tbody :checkbox`).length != 0 && $(`.table_right .notice`).length != 0) {
      $(`#modalPrivilege .table_right tbody .notice`).remove()
    }
  })
  var num = 1
  $(`#modalPrivilege .table_right tbody`).find('td.num').each(function () {
    $(this).text(num)
    num += 1
  })
  var num = 1
  $(`#modalPrivilege .table_left tbody`).find('td.num').each(function () {
    $(this).text(num)
    num += 1
  })
  if ($(`#modalPrivilege .table_left tbody :checkbox`).length == 0 && $(`.table_left .notice`).length == 0) {
    $(`#modalPrivilege .table_left tbody`).append('<tr class="notice" style="text-align:center;"><th class="privilege-name" style="background-color:#cfd5ea" colspan=3>No data available in table</th></tr>')
    $(`#modalPrivilege .table_right tbody .notice`).remove()
  }
  if ($(`#modalPrivilege .table_right tbody :checkbox:checked`).length > 0) {
    $(`#modalPrivilege .table_right tbody .notice`).remove()
  }
  save_button(1)
}

function RightToLeft(group_id) {
  $(`#modalPrivilege .table_right tbody :checkbox:checked`).closest('tr').each(function () {
    var title = this.className
    var name = this.id
    if ($(`#modalPrivilege .table_left .privilege-name.${title}`).length == 0) {
      $(`#modalPrivilege .table_right .privilege-name.${title}`).closest('tr').clone().appendTo(`#modalPrivilege .table_left tbody`)
    }
   
    $(`#modalPrivilege .${title}#${name}`).insertAfter($(`#modalPrivilege .table_left tbody .privilege-name.${title}`).parent('tr'))
    $(`#modalPrivilege .selectAll2`).prop("checked", false)
    
    $(`#modalPrivilege .${title}#${name}`).find(':checkbox').prop("checked", false)
  
        $(`#modalPrivilege .${title}#${name}`).find(':checkbox').prop("checked", false).closest('tr').css('background-color', "#E9ebf5");
        $(`#modalPrivilege .${title}#${name}`).find(':checkbox').prop("checked", false).closest('th').css('background-color', "#cfd5ea");
    to_left_button(0)
    if ($(`#modalPrivilege .table_right .${title}`).length == 1) {
      $(`#modalPrivilege .table_right .privilege-name.${title}`).closest('tr').remove()
    }
    if ($(`#modalPrivilege .table_right tbody :checkbox`).length != 0 && $(`.table_right .notice`).length != 0) {
      $(`#modalPrivilege .table_right tbody .notice`).remove()
    }
  })
  var num = 1
  $(`#modalPrivilege .table_right tbody`).find('td.num').each(function () {
    $(this).text(num)
    num += 1
  })
  var num = 1
  $(`#modalPrivilege .table_left tbody`).find('td.num').each(function () {
    $(this).text(num)
    num += 1
  })
  if ($(`#modalPrivilege .table_right tbody :checkbox`).length == 0 && $(`.table_right .notice`).length == 0) {
    $(`#modalPrivilege .table_right tbody`).append('<tr class="notice" style="text-align:center;"><th class="privilege-name" style="background-color:#cfd5ea" colspan=3>No data available in table</th></tr>')
    $(`#modalPrivilege .table_left tbody .notice`).remove()
  }
  if ($(`#modalPrivilege .table_left tbody :checkbox:checked`).length > 0) {
    $(`#modalPrivilege .table_left tbody .notice`).remove()
  }
  // var save_arr = []
  // $(`#modalPrivilege .table_right tbody :checkbox`).each(function(key,value){
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
    $(".save").removeClass("btn-primary").addClass("btn-secondary");
  } else {
    $('.save').prop("disabled", false)
    $(".save").removeClass("btn-secondary").addClass("btn-primary");
  }
}
function privilegeAjax() {

  $('.key_icon').on('click', function () {
        
    var group_id = $(this).closest('a').attr("data-id")
    $(`#modalPrivilege .table_left tbody`).children('tr').remove()
    $(`#modalPrivilege .table_right tbody`).children('tr').remove()
    $.ajax({
      type: "GET",
      url: `user_groups/show_privileges/${group_id}`,
      dataType: "json",
      success: function (response) {
        $.each(response, function (key, value) {
          $('#check_all_choose').prop("checked", false);
          $('#to_left').prop("disabled", true);
          $('#to_right').prop("disabled", true);
          $('#to_left').removeClass("btn-info").addClass("btn-secondary");
          $('#to_right').removeClass("btn-info").addClass("btn-secondary");
          // tranh gap bug khi goi ham 2 lan
          if ($(".table_right tbody tr").length > 0)
            return;

          if (key == "left") {
            var old_name = []
            var num = 1
            $(value).each(function (k, v) {
              if (old_name.includes(v.TitleName) == false) {
                $(`#modalPrivilege .table_${key} tbody`).append(`<tr><th class="privilege-name ${v.title_privilege_id}" colspan=3 style="text-align: left;">${v.TitleName}</th></tr>`)
              }
              $(`#modalPrivilege .table_${key} tbody`).append(`<tr class="${v.title_privilege_id}" id="${group_id}_${v.id}"><td scope="row" class="num">${num}</td><td><input type="checkbox" class="checkbox" value="${v.id}"></td><td style="text-align: left;">${v.name}</td></tr>`)
              old_name.push(v.TitleName)
              num += 1
            })
            if (value != null && value.length == 0) {
              $(`#modalPrivilege .table_${key} tbody`).append('<tr class="notice" style="text-align:center;"><th class="privilege-name" style="background-color:#cfd5ea" colspan=3>No data available in table</th></tr>')
            }
          }
          if (key == "right") {
            var old_name = []
            var num = 1
            $(value).each(function (k, v) {
              if (old_name.includes(v.TitleName) == false) {
                $(`#modalPrivilege .table_${key} tbody`).append(`<tr><th style="display:none"></th><th style="display:none"></th><th class="privilege-name ${v.title_privilege_id}" style="background-color:#cfd5ea" colspan=3 style="text-align: left;">${v.TitleName}</th></tr>`)
              }
              $(`#modalPrivilege .table_${key} tbody`).append(`<tr class="${v.title_privilege_id}" id="${group_id}_${v.privilege_id}"><td scope="row" class="num">${num}</td><td><input type="checkbox" class="checkbox" value="${v.privilege_id}"></td><td style="text-align: left;">${v.name}</td></tr>`)
              old_name.push(v.TitleName)
              num += 1
            })
            if (value != null && value.length == 0) {
              $(`#modalPrivilege .table_${key} tbody`).append('<tr class="notice" style="text-align:center;"><th class="privilege-name" style="background-color:#cfd5ea" colspan=3>No data available in table</th></tr>')
            }
          }
          $(`#modalPrivilege`).on('click', `#to_left`, function () {
            LeftToRight(group_id)
            if ($(`#modalPrivilege .table_left tbody :checkbox`).length == 0 && $(`.table_left .notice`).length == 0) {
              $(`#modalPrivilege .table_left tbody`).append('<tr class="notice" style="text-align:center;"><th class="privilege-name" style="background-color:#cfd5ea" colspan=3>No data available in table</th></tr>')
              $(`#modalPrivilege .table_right tbody .notice`).remove()
            }
          })
          $(`#modalPrivilege`).on('click', `#to_right`, function () {
            RightToLeft(group_id)
            if ($(`#modalPrivilege .table_right tbody :checkbox`).length == 0 && $(`.table_right .notice`).length == 0) {
              $(`#modalPrivilege .table_right tbody`).append('<tr class="notice" style="text-align:center;"><th class="privilege-name"style="background-color:#cfd5ea" colspan=3>No data available in table</th></tr>')
              $(`#modalPrivilege .table_left tbody .notice`).remove()
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
      $("#modalPrivilege").modal("hide");
      success('The group information has been updated privilege successfully.')
    },
    error: function (response) {
      fails()
    }
  })
}
