function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var arrColor = ["#5ddd92", "#e3c334", "#4ca8e0", "#628fe2", "#4cb9ab", "#73a2b9", "#028090", "#00f5ff", "#e34856", "#8a103d", "#255381"]

function drawChartGender(data_filter) {
  $.ajax({
    url: "/dashboards/data_users_by_gender",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      drawPieChart(response.data, response.total, "#chart_gender", "Number of Employees by Gender")
    }
  });
}

function drawChartRole(data_filter) {
  $.ajax({
    url: "/dashboards/data_users_by_role",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      drawPieChart(response.data, response.total, "#chart_role", "Number of Employees by Role")
    }
  });
}

function drawChartTitle(data_filter) {
  $.ajax({
    url: "/dashboards/calulate_data_user_by_title",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      sleep(1000)
      drawPyramidChart(response.data, response.total, "#chart_title", "Number of Employees by Title", "Rank");
    }
  })
}

function drawChartSeniority(data_filter) {
  $.ajax({
    url: "/dashboards/calulate_data_user_by_seniority",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      drawPyramidChart(response.data, response.total, "#chart_seniority", "Number of Employees by Seniority", "Year");
    }
  });
}

function drawChartCareer() {
  $.ajax({
    url: "/dashboards/data_career_chart",
    data: {},
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      sleep(1000)
      if (response.data == "fails" || response.data.length <= 1) {
        $("#my_career ").html('')
        $("#my_career").css('height', 'auto')
      }
      else
        drawLineChart(response.data, response.has_cdp, "#chart_my_career");
    }
  })
}

function drawChart(data_filter = {}) {
  // get data and draw chart gender
  drawChartGender(data_filter)
  // get data and draw chart role
  drawChartRole(data_filter)
  sleep(1000)
  // get data and draw chart seniority
  drawChartSeniority(data_filter)
  // get data and draw chart title
  drawChartTitle(data_filter)
  // get data and draw chart my career
}

$(document).ready(function () {
  loadFilterReview();
  loadDataFilter();
  $(".apply-filter").click(function () {
    data_filter = paramFilter();
    drawChart(data_filter);
  });

  $(".reset-filter").click(function () {
    loadDataFilter();
  });
  // draw chart career
  drawChartCareer();

  $('#select_type_keep').on('change', function () {
    var data_filter = paramFilter();
    data_filter.number_period_keep = $(this).val();
    $('#layout_table_keep').html(
      `<table id="table_keep" class="table table-striped table-bordered table-sm" cellspacing="0" width="100%">
        <thead>
          <tr>
            <th class="th-sm number">No.</th>
            <th class="th-sm name">Full Name</th>
            <th class="th-sm email">Email</th>
            <th class="th-sm role">Role</th>
            <th class="th-sm title-h">Title</th>
            <th class="th-sm rank">Rank</th>
            <th class="th-sm level">Level</th>
            <th class="th-sm period-keep">Period Keep</th>
            <th class="th-sm action">Action</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>`)
    loadDataKeepTitle(data_filter);
  });

  if (is_staff) {
    $.ajax({
      type: "POST",
      url: "/dashboards/data_latest_baseline",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      data: {},
      dataType: "json",
      success: function (response) {
        if (response.data == "fails")
          return;
        $('#title_previous').html(response.data.current_title.title);
        $('#title_current').html(response.data.expected_title.title);
        $('#title_plan').html(response.data.cdp.title);
        $('#rank_previous').html(response.data.current_title.rank);
        $('#rank_current').html(response.data.expected_title.rank);
        $('#rank_plan').html(response.data.cdp.rank);
        $('#level_previous').html(response.data.current_title.level);
        $('#level_current').html(response.data.expected_title.level);
        $('#level_plan').html(response.data.cdp.level);
      }
    });
  }
});

function loadFilterReview() {
  $(".btn-filter-dashboard").click(function () {
    $(".filter-condition").toggle();
    if ($('btn-filter-dashboard i').hasClass('fa-chevron-down'))
      $('btn-filter-dashboard i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    else
      $('btn-filter-dashboard i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
  });
}

function loadDataFilter() {
  $.ajax({
    type: "POST",
    url: "/dashboards/data_filter",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {},
    dataType: "json",
    success: function (response) {
      if (response.status == "fails")
        return;
      if (response.companies.length > 1)
        $('<option value="All" selected>All</option>').appendTo("#company_filter");
      if (response.roles.length > 1)
        $('<option value="All" selected>All</option>').appendTo("#role_filter");
      if (response.projects.length > 1)
        $('<option value="All" selected>All</option>').appendTo("#project_filter");

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
        if (k == 0 && response.roles.length == 1)
          $('<option value="' + v.id + '" selected>' + v.name + "</option>").appendTo("#role_filter");
        else
          $('<option value="' + v.id + '">' + v.name + "</option>").appendTo("#role_filter");
      });
      $("#company_filter, #project_filter, #role_filter").bsMultiSelect({});
      customizeFilter();
      data_filter = paramFilter();
      drawChart(data_filter);
      loadDataUpTitle(data_filter);
      loadDataDownTitle(data_filter);
      loadDataKeepTitle(data_filter);
    }
  });
}

function paramFilter() {
  return {
    company_id: $('#company_filter').val().join(),
    project_id: $('#project_filter').val().join(),
    role_id: $('#role_filter').val().join(),
  }
}

function customizeFilter() {
  $(".company-filter ul.dropdown-menu li").click(function () {
    max = $('.company-filter ul.dropdown-menu li').length;
    length = $('.company-filter .form-control li.badge').length;
    arr = [];
    locate_all = 0;
    all = false;
    current = $(this).text();
    for (i = 1; i <= length; i++) {
      text = $('.company-filter .form-control li.badge:nth-child(' + i + ') span').text().slice(0, -1);
      if (text != "All")
        arr.push(i)
      else if (text == "All") {
        all = true
        locate_all = i
      }
    }
    if (current == "All") {
      $.each(arr, function (index, value) {
        $('.company-filter .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      return ""
    } else if (current != "All" && locate_all != 0) {
      $.each(arr, function (index, value) {
        $('.company-filter .form-control li.badge:nth-child(' + locate_all + ') .close').click();
      });
    }
    if (arr.length == max - 1 && all == false) {
      $.each(arr, function (index, value) {
        $('.company-filter .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      $('.company-filter ul.dropdown-menu li:nth-child(1)').click();
    }
  });
  $(".role-filter ul.dropdown-menu li").click(function () {
    max = $('.role-filter ul.dropdown-menu li').length;
    length = $('.role-filter .form-control li.badge').length;
    arr = [];
    locate_all = 0;
    all = false;
    current = $(this).text();
    for (i = 1; i <= length; i++) {
      text = $('.role-filter .form-control li.badge:nth-child(' + i + ') span').text().slice(0, -1);
      if (text != "All")
        arr.push(i)
      else if (text == "All") {
        all = true
        locate_all = i
      }
    }
    if (current == "All") {
      $.each(arr, function (index, value) {
        $('.role-filter .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      return ""
    } else if (current != "All" && locate_all != 0) {
      $.each(arr, function (index, value) {
        $('.role-filter .form-control li.badge:nth-child(' + locate_all + ') .close').click();
      });
    }
    if (arr.length == max - 1 && all == false) {
      $.each(arr, function (index, value) {
        $('.role-filter .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      $('.role-filter ul.dropdown-menu li:nth-child(1)').click();
    }
  });
  $(".project-filter ul.dropdown-menu li").click(function () {
    max = $('.project-filter ul.dropdown-menu li').length;
    length = $('.project-filter .form-control li.badge').length;
    arr = [];
    locate_all = 0;
    all = false;
    current = $(this).text();
    for (i = 1; i <= length; i++) {
      text = $('.project-filter .form-control li.badge:nth-child(' + i + ') span').text().slice(0, -1);
      if (text != "All")
        arr.push(i)
      else if (text == "All") {
        all = true
        locate_all = i
      }
    }
    if (current == "All") {
      $.each(arr, function (index, value) {
        $('.project-filter .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      return ""
    } else if (current != "All" && locate_all != 0) {
      $.each(arr, function (index, value) {
        $('.project-filter .form-control li.badge:nth-child(' + locate_all + ') .close').click();
      });
    }
    if (arr.length == max - 1 && all == false) {
      $.each(arr, function (index, value) {
        $('.project-filter .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      $('.project-filter ul.dropdown-menu li:nth-child(1)').click();
    }
  });
  $(".user-filter ul.dropdown-menu li").click(function () {
    max = $('.user-filter ul.dropdown-menu li').length;
    length = $('.user-filter .form-control li.badge').length;
    arr = [];
    locate_all = 0;
    all = false;
    current = $(this).text();
    for (i = 1; i <= length; i++) {
      text = $('.user-filter .form-control li.badge:nth-child(' + i + ') span').text().slice(0, -1);
      if (text != "All")
        arr.push(i)
      else if (text == "All") {
        all = true
        locate_all = i
      }
    }
    if (current == "All") {
      $.each(arr, function (index, value) {
        $('.user-filter .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      return ""
    } else if (current != "All" && locate_all != 0) {
      $.each(arr, function (index, value) {
        $('.user-filter .form-control li.badge:nth-child(' + locate_all + ') .close').click();
      });
    }
    if (arr.length == max - 1 && all == false) {
      $.each(arr, function (index, value) {
        $('.user-filter .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      $('.user-filter ul.dropdown-menu li:nth-child(1)').click();
    }
  });
}