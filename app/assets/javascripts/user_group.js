$(document).ready(function () {
	myJS();
	myAjax();
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
				checkboxes[i].closest('tr').style.color = "#990000";
				change_button_right(0);
			}
		} else {
			for (var i = 0; i < checkboxes.length; i++) {
				checkboxes[i].checked = false;
				checkboxes[i].closest('tr').style.color = "black";
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
				checkboxes[i].closest('tr').style.color = "#990000";
				change_button_left(0);
			}
		} else {
			for (var i = 0; i < checkboxes.length; i++) {
				checkboxes[i].checked = false;
				checkboxes[i].closest('tr').style.color = "black";
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
			$this.closest('tr').css('color', "#990000");
			change_button_right(0);
		} else {
			if ($("#table_left tbody :checkbox:checked").length == 0) {
				change_button_right(1);
			}
			$this.closest('tr').css('color', "black");
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
			$this.closest('tr').css('color', "#990000");
		} else {
			if ($("#table_right tbody :checkbox:checked").length == 0) {
				change_button_left(1);
			}
			$this.closest('tr').css('color', "black");
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
				tr.style.color = "black";
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
				tr.style.color = "black";
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

	$('#table_left').DataTable().on('order.dt search.dt', function () {
		$('#table_left').DataTable().column(0, {
			search: 'applied',
			order: 'applied'
		}).nodes().each(function (cell, i) {
			cell.innerHTML = i + 1;
		});
	}).draw();

	$('#table_right').DataTable().on('order.dt search.dt', function () {
		$('#table_right').DataTable().column(0, {
			search: 'applied',
			order: 'applied'
		}).nodes().each(function (cell, i) {
			cell.innerHTML = i + 1;
		});
	}).draw();
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
						success();
						$("#AssignModal").modal('hide');
					},
					error: function () {
						fails();
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