function loadDataAssessment(data_filter) {
  var temp = "";
  $.ajax({
    type: "POST",
    url: "/forms/get_list_cds_assessment_manager",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      company_ids: data_filter.company,
      project_ids: data_filter.project,
      role_ids: data_filter.role,
      user_ids: data_filter.user,
      period_ids: data_filter.period,
      status: data_filter.status,
    },
    dataType: "json",
    success: function (response) {
      if (response.length == 0) {
        temp = '<tr><td colspan="16" class="type-icon">No data available in this table</td></tr>'
        $('.paginate_button').addClass('disabled')
      }
      for (var i = 0; i < response.length; i++) {
        var form = response[i];
        var this_element = `<tr id='period_id_{id}'> 
            <td class="type-number">{no}</td> 
            <td class="type-text">{period}</td> 
            <td class="type-text"><a href='/forms/cds_cdp_review?form_id={id}&user_id={user_id}' id='user_name'>{user_name}</a></td>
            <td class="type-text">{project}</td>
            <td class="type-text">{email}</td>
            <td class="type-text">{role}</td> 
            <td class="type-text">{title}</td> 
            <td class="type-number">{rank}</td> 
            <td class="type-number">{level}</td> 
            <td class="type-text">{caculate_title}</td>
            <td class="type-number">{caculate_rank}</td> 
            <td class="type-number">{caculate_level}</td> 
            <td class="type-text">{submit_date}</td>
            <td class="type-text">{approved_date}</td>
            <td class="type-text">{count_cds}</td>
            <td class="type-text" id="status">{status}</td> 
            <td class="type-icon"> 
              <a href='/forms/preview_result?form_id={id}' title="View result">
                <i class='far fa-eye icon-list' style='color:#4F94CD'></i>
              </a>
              &nbsp;`.formatUnicorn({
          no: i + 1,
          id: form.id,
          email: form.email,
          user_name: form.user_name,
          project: form.project,
          approved_date: form.approved_date,
          submit_date: form.submit_date,
          period: form.period_name,
          role: form.role_name,
          level: form.level,
          rank: form.rank,
          title: form.title,
          status: form.status,
          user_id: form.user_id,
          caculate_level: form.caculate_level,
          caculate_rank: form.caculate_rank,
          caculate_title: form.caculate_title,
          count_cds: form.count_cds,
        });
        if (form.is_approver) {
          if (form.status == "Done" && form.is_open_period) {
            this_element += `<a class='reject-cds-cdp' data-id='${form.id}' data-user-id='${form.user_id}' data-period-cds='${form.period_name}' href='#' title="Reject CDS/CDP">
          <i class='fas fa-thumbs-down icon-list icon-reject' style='color:blue'></i>
              </a> 
            </td> 
          </tr>`
          } else {
            this_element += `<a class='reject-cds-cdp disabled' data-id='${form.id}' data-user-id='${form.user_id}' data-period-cds='${form.period_name}' href='#' title="Approve CDS/CDP">
          <i class='fas fa-thumbs-down icon-list icon-reject' style='color:#6c757d'></i>
              </a> 
            </td> 
          </tr>`
          }
        } else {
          this_element += `</td></tr>`
        }
        temp += this_element;
      };
      if (response.length > 0)
        $(".table-cds-assessment-manager-list").DataTable().destroy();
      $(".table-cds-assessment-manager-list tbody").html(temp);
      if (response.length > 0){
        var table = $(".table-cds-assessment-manager-list").DataTable({
          "bLengthChange": false,
          "bFilter": false,
          "bAutoWidth": false,
          "bDestroy": true,
          "columnDefs": [
            {
              "searchable": false,
              "orderable": false,
              "targets": 0,
            }
          ],
          "order": [[1, "desc"]],
        });
        table.on("order.dt search.dt", function () {
          table.column(0, { search: "applied", order: "applied" })
            .nodes().each(function (cell, i) {
              cell.innerHTML = i + 1;
            });
        }).draw();
      }
    },
    error: function () {
      $(".table-cds-assessment-manager-list tbody").html('<tr><td colspan="16" class="type-icon">No data available in this table</td></tr>');
    }
  })
  $.fn.dataTable.ext.errMode = 'none';
}

function loadDataFilter() {
  $.ajax({
    type: "GET",
    url: "/forms/get_filter",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {},
    dataType: "json",
    success: function (response) {
      setupDataFilter('company_filter', '.company-filter', response.companies);
      setupDataFilter('project_filter', '.project-filter', response.projects);
      setupDataFilter('role_filter', '.role-filter', response.roles);
      setupDataFilter('user_filter', '.user-filter', response.users);
      setupDataFilter('period_filter', '.period-filter', response.periods);
      setupDataFilter('status_filter', '.status-filter', [{id: "Done", name: "Done"},{id: "Awaiting Review", name: "Awaiting Review"},{id: "Awaiting Approval", name: "Awaiting Approval"}]);
      data_filter = apllyFilter();
      loadDataAssessment(data_filter)
    }
  });
}

function apllyFilter() {
  var data = {
    company: $('#company_filter').val(),
    project: $('#project_filter').val(),
    role: $('#role_filter').val(),
    user: $('#user_filter').val(),
    period: $('#period_filter').val(),
    status: $('#status_filter').val(),
  }
  return data
}

$(document).ready(function () {
  $(".filter_review").click(function () {
    $(".filter-condition").toggle();
    $('a.filter_review i').toggleClass('fa-chevron-down fa-chevron-up');
  });
  loadDataFilter();
  $(".apply-filter").click(function () {
    data_filter = apllyFilter();
    localStorage.filterReviewList = JSON.stringify(data_filter);
    loadDataAssessment(data_filter);
  });

  $('.item-filter-review').change(function () {
    $('.reset-filter').removeClass('disabled');
  });

  $(".reset-filter").click(function () {
    localStorage.filterReviewList = "";
    $(this).addClass('disabled');
    loadDataFilter();
  });

  $(document).on("click", ".reject-cds-cdp", function () {
    user_name = $(this).closest('tr').find('#user_name').html()
    user_id = $(this).data('userId')
    form_id = $(this).data('id')
    $("#content_reject").html("Are you sure you want to reject CDS/CDP assessment of " + user_name + "?");
    $('#modal_reject_cds').modal('show');
  })

  $(document).on("click", "#confirm_yes_reject_cds", function () {
    $.ajax({
      type: "POST",
      url: "/forms/reject_cds",
      data: {
        form_id,
        user_id,
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      dataType: "json",
      success: function (response) {
        if (response.status == "success") {
          warning(`The CDS/CDP assessment of ${response.user_name} has been rejected successfully.`);
          $(document).find('#period_id_' + form_id).find(".reject-cds-cdp").addClass('disabled')
          $(document).find('#period_id_' + form_id).find(".icon-reject").css('color', '##6c757d')
        } else {
          fails("Can't rejected CDS/CDP.");
        }
      }
    });
    $('#modal_reject_cds').modal('hide');
  });
});

function setupDataFilter(id, class_name, data) {
  $(class_name).html(`<select name="${id}" id="${id}" class="filter-input" multiple="multiple" style="width: 100%"></select>`);
  key_filter = id.split('_')[0]
  id = '#' + id
  if (data.length > 1 && id != "#period_filter")
    $('<option value="0" selected>All</option>').appendTo(id);
  $.each(data, function (k, v) {
    if (k == 0 && (id == "#period_filter" || data.length == 1))
      $('<option value="' + v.id + '" selected>' + v.name + "</option>").appendTo(id);
    else
      $('<option value="' + v.id + '">' + v.name + "</option>").appendTo(id);
  });
  if (localStorage.filterReviewList && id != "#status_filter"){
    $('.reset-filter').removeClass('disabled');
    let filter = JSON.parse(localStorage.filterReviewList);
    $(id).val(filter[key_filter]);
  }

  $(id).bsMultiSelect({
    setSelected: (opt, val) => {
      opt.selected = val
      let rs = $(id).val()
      if (!val)
        if (opt.innerText == "All") {
          if (rs.length == 0 || rs[0] == "0") {
            if (id == "#company_filter") {
              loadProjectFilter();
              loadUserFilter();
            } else if (id == "#role_filter" || id == "#project_filter")
              loadUserFilter();
          }
        } else {
          if (rs[0] != "0") {
            if (id == "#company_filter") {
              loadProjectFilter();
              loadUserFilter();
            } else if (id == "#role_filter" || id == "#project_filter")
              loadUserFilter();
          }
        }
    }
  });

  if (data.length == 0) {
    $(class_name + ' input').attr('placeholder', 'No data');
    return;
  }
  $(class_name + " .dashboardcode-bsmultiselect ul.dropdown-menu li").click(function () {
    max = $(class_name + ' .dashboardcode-bsmultiselect ul.dropdown-menu li').length;
    length = $(class_name + ' .dashboardcode-bsmultiselect .form-control li.badge').length;
    arr = [];
    locate_all = 0;
    all = false;
    current = $(this).text();
    for (i = 1; i <= length; i++) {
      text = $(class_name + ' .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + i + ') span').text().slice(0, -1);
      if (text != "All")
        arr.push(i)
      else if (text == "All") {
        all = true
        locate_all = i
      }
    }

    if (current == "All") {
      $.each(arr, function (index, value) {
        $(class_name + ' .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + value + ') .close').click();
      });

      if (id == "#company_filter") {
        loadProjectFilter(["0"]);
        loadUserFilter();
      } else if (id == "#role_filter" || id == "#project_filter")
        loadUserFilter();
      return ""
    } else if (current != "All" && locate_all != 0) {
      $.each(arr, function (index, value) {
        $(class_name + ' .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + locate_all + ') .close').click();
      });
    }
    if (arr.length == max - 1 && all == false) {
      $(class_name + ' .dashboardcode-bsmultiselect ul.dropdown-menu li:nth-child(1)').click();
    }

    if (id == "#company_filter") {
      loadProjectFilter();
      loadUserFilter();
    } else if (id == "#role_filter" || id == "#project_filter")
      loadUserFilter();
  });
}

function loadProjectFilter(company_id = []) {
  var arrCompany = $('#company_filter').val();
  if (arrCompany.length > 0 && arrCompany[0] == "0")
    arrCompany.splice(0, 1);
  if (_.isEmpty(company_id))
    var company_id = _.isEmpty(arrCompany) ? ["0"] : arrCompany;

  $.ajax({
    url: "/forms/data_filter_projects",
    data: {
      company_id: company_id
    },
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      setupDataFilter("project_filter", '.project-filter', response.projects)
    }
  });
}

function loadUserFilter() {
  let arrCompany = $('#company_filter').val();
  if (arrCompany.length > 0 && arrCompany[0] == "0")
    arrCompany.splice(0, 1);
  let company_id = _.isEmpty(arrCompany) ? ["0"] : arrCompany;

  let arrProject = $('#project_filter').val();
  if (arrProject.length > 0 && arrProject[0] == "0")
    arrProject.splice(0, 1);
  let project_id = _.isEmpty(arrProject) ? ["0"] : arrProject;

  let arrRole = $('#role_filter').val();
  if (arrRole.length > 0 && arrRole[0] == "0")
    arrRole.splice(0, 1);
  let role_id = _.isEmpty(arrRole) ? ["0"] : arrRole;

  $.ajax({
    url: "/forms/data_filter_users",
    data: {
      company_id: company_id,
      project_id: project_id,
      user_id: user_id,
      role_id: role_id
    },
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      setupDataFilter("user_filter", '.user-filter', response.users)
    }
  });
}