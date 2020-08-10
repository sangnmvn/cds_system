/*jshint esversion: 6 */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var arrColor = ["#5ddd92", "#e3c334", "#4ca8e0", "#628fe2", "#4cb9ab", "#73a2b9", "#028090", "#00f5ff",
  "#e34856", "#8a103d", "#255381", "#8077b6", "#0193cf", "#49176e", "#273691", "#0596d7"
];

function drawChartGender(data_filter) {
  $.ajax({
    url: "/dashboards/data_users_by_gender",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      drawPieChart(response, response.total, "#chart_gender", "Number of Employee(s) by Gender");
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
      drawPieChart(response, response.total, "#chart_role", "Number of Employee(s) by Role");
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
      sleep(1000);
      drawPyramidChart(response.data, response.total, "#chart_title", "Number of Employee(s) by Title", "Rank");
    }
  });
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
      drawPyramidChart(response.data, response.total, "#chart_seniority", "Number of Employee(s) by Seniority", "Year");
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
      sleep(1000);
      if (response.data == "fails" || response.data.length <= 1) {
        $("#my_career ").html('');
        $("#my_career").css('height', 'auto');
      } else
        drawLineChart(response.data, response.has_cdp, "#chart_my_career");
    }
  });
}

function drawChart(data_filter = {}) {
  // get data and draw chart gender
  drawChartGender(data_filter);
  // get data and draw chart role
  drawChartRole(data_filter);
  sleep(1000);
  // get data and draw chart seniority
  drawChartSeniority(data_filter);
  // get data and draw chart title
  drawChartTitle(data_filter);
  // get data and draw chart my career
}

$(document).ready(function () {
  $(".btn-filter-dashboard").click(function () {
    $(".filter-condition").toggle();
    $('.btn-filter-dashboard i').toggleClass('fa-chevron-down fa-chevron-up');
  });

  loadDataFilter();
  $(".apply-filter").click(function () {
    data_filter = paramFilter();
    drawChart(data_filter);
    loadDataUpTitle(data_filter);
    loadDataDownTitle(data_filter);
    loadDataKeepTitle(data_filter);
  });

  $('.item-filter-dashboard').change(function () {
    $('.reset-filter').removeClass('disabled');
  });

  $(".reset-filter").click(function () {
    $(this).addClass('disabled');
    loadDataFilter();
  });
  // draw chart career
  drawChartCareer();

  $('#select_type_keep').on('change', function () {
    var data_filter = paramFilter();
    data_filter.number_period_keep = $(this).val();
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

  $(document).on('click', '.link-icon', function () {
    $.ajax({
      url: "/dashboards/load_form_cds_staff",
      data: {
        user_id: $(this).parents('tr').data('id')
      },
      type: "POST",
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      success: function (response) {
        if (response.data == 'fails')
          fails("This user has not had CDS/CDP on the system");
        else
          window.location.href = response.data;
      },
    });
  });
});

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
      if (response.status == "fails") return;
      setupDataFilter("company_filter", '.company-filter', response.companies);
      setupDataFilter("project_filter", '.project-filter', response.projects);
      setupDataFilter("role_filter", '.role-filter', response.roles);
      curr_company_ids = $('#company_filter').val();
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
    company_id: $('#company_filter').val(),
    project_id: $('#project_filter').val(),
    role_id: $('#role_filter').val(),
  };
}

function setupDataFilter(id, class_name, data) {
  $(class_name).html(`<select name="${id}" id="${id}" class="filter-input" multiple="multiple" style="width: 100%"></select>`);
  id = '#' + id;
  if (data && data.length > 1)
    $('<option value="All" selected>All</option>').appendTo(id);
  data.forEach(function (value, index) {
    if (index == 0 && data.length == 1)
      $('<option value="' + value.id + '" selected>' + value.name + "</option>").appendTo(id);
    else
      $('<option value="' + value.id + '">' + value.name + "</option>").appendTo(id);
  });
  $(id).bsMultiSelect({
    setSelected: (opt, val) => {
      opt.selected = val;
      let rs = $(id).val();
      if (!val)
        if (opt.innerText == "All") {
          if (rs.length == 0 || rs[0] == "All") {
            if (id == "#company_filter")
              loadProjectFilter();
          }
        } else {
          if (rs[0] != "All") {
            if (id == "#company_filter")
              loadProjectFilter();
          }
        }
    }
  });

  if (data.length == 0) {
    $(class_name + ' input').attr('placeholder', 'No data');
    return;
  }
  $(class_name + " ul.dropdown-menu li").click(function () {
    max = $(class_name + ' ul.dropdown-menu li').length;
    length = $(class_name + ' .form-control li.badge').length;
    arr = [];
    locate_all = 0;
    all = false;
    current = $(this).text();
    for (i = 1; i <= length; i++) {
      text = $(class_name + ' .form-control li.badge:nth-child(' + i + ') span').text().slice(0, -1);
      if (text != "All")
        arr.push(i);
      else if (text == "All") {
        all = true;
        locate_all = i;
      }
    }
    if (current == "All") {
      $.each(arr, function (index, value) {
        $(class_name + ' .form-control li.badge:nth-child(' + value + ') .close').click();
      });
      if (id == "#company_filter")
        loadProjectFilter(["All"]);
      return "";
    } else if (current != "All" && locate_all != 0) {
      $.each(arr, function (index, value) {
        $(class_name + ' .form-control li.badge:nth-child(' + locate_all + ') .close').click();
      });
    }
    if (arr.length == max - 1 && all == false) {
      $(class_name + ' ul.dropdown-menu li:nth-child(1)').click();
    }
    if (id == "#company_filter")
      loadProjectFilter();
  });

}

function loadProjectFilter(company_id = []) {
  var arrCompany = $('#company_filter').val();
  if (arrCompany.length > 0 && arrCompany[0] == "All")
    arrCompany.splice(0, 1);
  if (_.isEmpty(company_id))
    company_id = _.isEmpty(arrCompany) ? ["All"] : arrCompany;

  $.ajax({
    url: "/dashboards/data_filter_projects",
    data: {
      company_id: company_id
    },
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      setupDataFilter("project_filter", '.project-filter', response.projects);
    }
  });
}