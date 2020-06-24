function loadDataUpTitle(data_filter = {}) {
  $.ajax({
    url: "/dashboards/data_users_up_title",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      $("#table_up tbody").html(appendDataToTable(response.data));
      if (response.data.length > 0) {
        $('#table_up').DataTable({
          "bLengthChange": false,
          "bFilter": false,
          "bAutoWidth": false
        });
        $('.dataTables_length').addClass('bs-select');
      }
    }
  });
}

function loadDataKeepTitle(data_filter = {}) {
  $.ajax({
    url: "/dashboards/data_users_keep_title",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      $("#table_keep tbody").html(appendDataToTable(response.data, false));
      if (response.data.length > 0) {
        $('#table_keep').DataTable({
          "bLengthChange": false,
          "bFilter": false,
          "bAutoWidth": false,
          "columnDefs": [ {
            "targets"  : 'no-sort',
            "orderable": false,
          }]
        });
        $('.dataTables_length').addClass('bs-select');
      }
    }
  });
}

function appendDataToTable(data, is_up = true) {
  if (data.length == 0)
    return `<tr><td colspan="8" class="type-icon">No data available in table</td></tr>`

  tpl = ""
  data.forEach(function (user, i) {
    
    tpl += `
      <tr class="{class}">
        <td class="type-number item-row number">{number}</td>
        <td class="type-text item-row name">{name}</td>
        <td class="type-text item-row email">{email}</td>
        <td class="type-text item-row role">{role}</td>
        <td class="type-text item-row title-h">{title}</td>
        <td class="type-number item-row rank">{rank}</td>
        <td class="type-number item-row level">{level}</td>
        <td class="type-icon item-row action">`.formatUnicorn({class: user.class, number: i + 1, name: user.full_name, email: user.email, title: user.title,role: user.role, rank: user.rank, level: user.level });
    if (is_up) {
      tpl += `
        <a href="javascript:;" class="link-icon">
          <i class="fa fa-file-code-o" aria-hidden="true" title="view CDS/CDP Details"></i>
        </a>`
    } else {
      tpl += `
        <a href="javascript:;" class="link-icon">
          <i class="fa fa-search" aria-hidden="true" title="view slots missed to archive next level"></i>
        </a>
        &nbsp;
        <a href="javascript:;" class="link-icon">
          <i class="fa fa-file-code-o" aria-hidden="true" title="view CDS/CDP Details"></i>
        </a>
      `
    }
    tpl += `</td></tr>`
  });
  return tpl;
}