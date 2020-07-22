function loadDataAssessment(data_filter) {
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
    },
    dataType: "json",
    success: function (response) {
      var temp = '';
      if (response.length == 0)
        temp = `<tr><td colspan="13" style="text-align:center">No data available in table</td></tr>`;
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
            <td class="type-text">{submit_date}</td>
            <td class="type-text">{review_date}</td>
            <td class="type-text" id="status">{status}</td> 
            <td class="type-icon"> 
              <a href='/forms/preview_result?form_id={id}'>
                <i class='far fa-eye icon-list' style='color:#4F94CD'></i>
              </a>
              &nbsp;`.formatUnicorn({
          no: i + 1,
          id: form.id,
          email: form.email,
          user_name: form.user_name,
          project: form.project,
          review_date: form.review_date,
          submit_date: form.submit_date,
          period: form.period_name,
          role: form.role_name,
          level: form.level,
          rank: form.rank,
          title: form.title,
          status: form.status,
          user_id: form.user_id
        });
        if (form.is_approver) {
          if (form.status == "Done" && form.is_open_period) {
            this_element += `<a class='reject-cds-cdp' data-id='${form.id}' data-user-id='${form.user_id}' data-period-cds='${form.period_name}' href='#'>
          <i class='fas fa-thumbs-down icon-list icon-reject' style='color:blue'></i>
              </a> 
            </td> 
          </tr>`
          } else {
            this_element += `<a class='reject-cds-cdp disabled' data-id='${form.id}' data-user-id='${form.user_id}' data-period-cds='${form.period_name}' href='#'>
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
      $(".table-cds-assessment-manager-list tbody").html(temp);
    }
  })
}

function loadFilterReview() {
  $(".filter_review").click(function () {
    $(".filter-condition").toggle();
    if ($('a.filter_review i').hasClass('fa-chevron-down'))
      $('a.filter_review i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    else
      $('a.filter_review i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
  });
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
      if (response.companies.length > 1)
        $('<option value="0" selected>All</option>').appendTo("#company_filter");
      if (response.roles.length > 1)
        $('<option value="0" selected>All</option>').appendTo("#role_filter");
      if (response.projects.length > 1)
        $('<option value="0" selected>All</option>').appendTo("#project_filter");
      if (response.users.length > 1)
        $('<option value="0" selected>All</option>').appendTo("#user_filter");

      $.each(response.companies, function (k, v) {
        if (k == 0 && response.companies.length == 1)
          $('<option value="' + v.id + '" selected>' + v.name + "</option>").appendTo("#company_filter");
        else
          $('<option value="' + v.id + '">' + v.name + "</option>").appendTo("#company_filter");
      });
      $.each(response.projects, function (k, v) {
        if (k == 0 && response.projects.length == 1)
          $('<option value="' + v.id + '" selected>' + v.name + "</option>").appendTo("#project_filter");
        else
          $('<option value="' + v.id + '">' + v.name + "</option>").appendTo("#project_filter");
      });
      $.each(response.roles, function (k, v) {
        if (v) {
          if (k == 0 && response.roles.length == 1)
            $('<option value="' + v.id + '" selected>' + v.name + "</option>").appendTo("#role_filter");
          else
            $('<option value="' + v.id + '">' + v.name + "</option>").appendTo("#role_filter");
        }
      });
      $.each(response.users, function (k, v) {
        if (k == 0 && response.users.length == 1)
          $('<option value="' + v.id + '" selected>' + v.name + "</option>").appendTo("#user_filter");
        else
          $('<option value="' + v.id + '">' + v.name + "</option>").appendTo("#user_filter");
      });
      $.each(response.periods, function (k, v) {
        if (k == 0)
          $('<option value="' + v.id + '" selected>' + v.name + "</option>").appendTo("#period_filter");
        else
          $('<option value="' + v.id + '">' + v.name + "</option>").appendTo("#period_filter");
      });
      $("#company_filter,#project_filter,#role_filter,#user_filter,#period_filter").bsMultiSelect({});
      customizeFilter();
      data_filter = apllyFilter();
      loadDataAssessment(data_filter)
    }
  });
}

function apllyFilter() {
  var data = {
    company: $('#company_filter').val().join(),
    project: $('#project_filter').val().join(),
    role: $('#role_filter').val().join(),
    user: $('#user_filter').val().join(),
    period: $('#period_filter').val().join(),
  }
  return data
}

function customizeFilter() {
  $(".company-filter .dashboardcode-bsmultiselect ul.dropdown-menu li").click(function () {
    max = $('.company-filter .dashboardcode-bsmultiselect ul.dropdown-menu li').length;
    length = $('.company-filter .dashboardcode-bsmultiselect .form-control li.badge').length;
    arr = [];
    locate_all = 0;
    all = false;
    current = $(this).text();
    for (i = 1; i <= length; i++) {
      text = $('.company-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + i + ') span').text().slice(0, -1);
      if (text != "All")
        arr.push(i)
      else if (text == "All") {
        all = true
        locate_all = i
      }
    }
    if (current == "All") {
      $.each(arr, function (index, value) {
        $('.company-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      return ""
    } else if (current != "All" && locate_all != 0) {
      $.each(arr, function (index, value) {
        $('.company-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + locate_all + ') .close').click();
      });
    }
    if (arr.length == max - 1 && all == false) {
      $.each(arr, function (index, value) {
        $('.company-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      $('.company-filter .dashboardcode-bsmultiselect ul.dropdown-menu li:nth-child(1)').click();
    }
  });
  $(".role-filter .dashboardcode-bsmultiselect ul.dropdown-menu li").click(function () {
    max = $('.role-filter .dashboardcode-bsmultiselect ul.dropdown-menu li').length;
    length = $('.role-filter .dashboardcode-bsmultiselect .form-control li.badge').length;
    arr = [];
    locate_all = 0;
    all = false;
    current = $(this).text();
    for (i = 1; i <= length; i++) {
      text = $('.role-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + i + ') span').text().slice(0, -1);
      if (text != "All")
        arr.push(i)
      else if (text == "All") {
        all = true
        locate_all = i
      }
    }
    if (current == "All") {
      $.each(arr, function (index, value) {
        $('.role-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      return ""
    } else if (current != "All" && locate_all != 0) {
      $.each(arr, function (index, value) {
        $('.role-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + locate_all + ') .close').click();
      });
    }
    if (arr.length == max - 1 && all == false) {
      $.each(arr, function (index, value) {
        $('.role-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      $('.role-filter .dashboardcode-bsmultiselect ul.dropdown-menu li:nth-child(1)').click();
    }
  });
  $(".project-filter .dashboardcode-bsmultiselect ul.dropdown-menu li").click(function () {
    max = $('.project-filter .dashboardcode-bsmultiselect ul.dropdown-menu li').length;
    length = $('.project-filter .dashboardcode-bsmultiselect .form-control li.badge').length;
    arr = [];
    locate_all = 0;
    all = false;
    current = $(this).text();
    for (i = 1; i <= length; i++) {
      text = $('.project-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + i + ') span').text().slice(0, -1);
      if (text != "All")
        arr.push(i)
      else if (text == "All") {
        all = true
        locate_all = i
      }
    }
    if (current == "All") {
      $.each(arr, function (index, value) {
        $('.project-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      return ""
    } else if (current != "All" && locate_all != 0) {
      $.each(arr, function (index, value) {
        $('.project-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + locate_all + ') .close').click();
      });
    }
    if (arr.length == max - 1 && all == false) {
      $.each(arr, function (index, value) {
        $('.project-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      $('.project-filter .dashboardcode-bsmultiselect ul.dropdown-menu li:nth-child(1)').click();
    }
    $(this).closest('tr').find('#user_name').html()
  });
  $(".user-filter .dashboardcode-bsmultiselect ul.dropdown-menu li").click(function () {
    max = $('.user-filter .dashboardcode-bsmultiselect ul.dropdown-menu li').length;
    length = $('.user-filter .dashboardcode-bsmultiselect .form-control li.badge').length;
    arr = [];
    locate_all = 0;
    all = false;
    current = $(this).text();
    for (i = 1; i <= length; i++) {
      text = $('.user-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + i + ') span').text().slice(0, -1);
      if (text != "All")
        arr.push(i)
      else if (text == "All") {
        all = true
        locate_all = i
      }
    }
    if (current == "All") {
      $.each(arr, function (index, value) {
        $('.user-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      return ""
    } else if (current != "All" && locate_all != 0) {
      $.each(arr, function (index, value) {
        $('.user-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + locate_all + ') .close').click();
      });
    }
    if (arr.length == max - 1 && all == false) {
      $.each(arr, function (index, value) {
        $('.user-filter .dashboardcode-bsmultiselect .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      $('.user-filter .dashboardcode-bsmultiselect ul.dropdown-menu li:nth-child(1)').click();
    }
  });
}

$(document).ready(function () {
  loadFilterReview();
  loadDataFilter();
  $(".apply-filter").click(function () {
    data_filter = apllyFilter();
    loadDataAssessment(data_filter);
  });

  $(".reset-filter").click(function () {
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
          success(`The CDS/CDP assessment of ${response.user_name} has been rejected successfully.`);
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