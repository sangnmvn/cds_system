function loadDataUpTitle(data_filter = {}) {
  $.ajax({
    url: "/dashboards/data_users_up_title",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    success: function (response) {
      $("#table_up tbody").html(appendDataToTable(response.data));
      if (response.data.length > 0)
        setupDataTable("#table_up");
    },
  });
}

function loadDataDownTitle(data_filter = {}) {
  $.ajax({
    url: "/dashboards/data_users_down_title",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    success: function (response) {
      $("#table_down tbody").html(appendDataToTable(response.data, false));
      if (response.data.length > 0)
        setupDataTable("#table_down");
    },
  });
}
function loadDataKeepTitle(data_filter = {}) {
  $.ajax({
    url: "/dashboards/data_users_keep_title",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    success: function (response) {
      $("#table_keep tbody").html(appendDataToTable(response.data, false, false));
      if (response.data.length > 0)
        setupDataTable("#table_keep", 8);
    },
  });
}

function appendDataToTable(data, is_up = true, has_old = true) {
  if (data.length == 0)
    return `<tr><td colspan="11" class="type-icon">No data available in this table</td></tr>`;
  tpl = "";
  data.forEach(function (user, i) {
    tpl += `
      <tr class="{class}">
        <td class="type-number item-row number">{number}</td>
        <td class="type-text item-row name">{name}</td>
        <td class="type-text item-row email">{email}</td>
        <td class="type-text item-row role">{role}</td>`.formatUnicorn({
      class: user.class, number: i + 1, name: user.full_name, email: user.email, role: user.role
    });
    if (has_old)
      tpl += `
        <td class="type-text item-row title-h">{old_title}</td>
        <td class="type-number item-row rank">{old_rank}</td>
        <td class="type-number item-row level">{old_level}</td>`.formatUnicorn({
        old_title: user.old_title, old_rank: user.old_rank, old_level: user.old_level,
      })

    tpl += `
      <td class="type-text item-row title-h">{title}</td>
      <td class="type-number item-row rank">{rank}</td>
      <td class="type-number item-row level">{level}</td>`.formatUnicorn({
      title: user.title, rank: user.rank, level: user.level
    });
    if (!has_old)
      tpl += '<td class="type-number item-row level">' + user.period_keep + '</td>'
    tpl += `<td class="type-icon item-row action">`

    if (is_up) {
      tpl += `
        <a href="javascript:;" class="link-icon">
          <i class="fa fa-file-code-o" aria-hidden="true" title="view CDS/CDP Details"></i>
        </a>`;
    } else {
      tpl += `
        <a href="javascript:;" class="link-icon">
          <i class="fa fa-search" aria-hidden="true" title="View slots missed to archive next level"></i>
        </a>
        &nbsp;
        <a href="javascript:;" class="link-icon">
          <i class="fa fa-file-code-o" aria-hidden="true" title="view CDS/CDP Details"></i>
        </a>
      `;
    }
    tpl += `</td></tr>`;
  });
  return tpl;
}

function setupDataTable(id, last_column_no = 10) {
  var table = $(id).DataTable({
    "bLengthChange": false,
    "bFilter": false,
    "bAutoWidth": false,
    "columnDefs": [
      {
        "searchable": false,
        "orderable": false,
        "targets": 0,
      },
      {
        "searchable": false,
        "orderable": false,
        "targets": last_column_no,
      },
    ],
    "order": [[1, "asc"]],
  });
  $(".dataTables_length").addClass("bs-select");

  table.on("order.dt search.dt", function () {
    table.column(0, { search: "applied", order: "applied" })
      .nodes().each(function (cell, i) {
        cell.innerHTML = i + 1;
      });
  }).draw();
}