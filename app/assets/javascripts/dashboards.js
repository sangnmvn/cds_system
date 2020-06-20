function drawPieChart(data, total, id) {
  $(id).html('')
  // set the dimensions and margins of the graph
  var width = $(id).width() - 50;
  var height = $(id).height() - 20;
  var margin = 40;
  var legendRectSize = 18;
  var legendSpacing = 4;
  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin

  // append the svg object to the div called id (variable)
  var svg = d3.select(id)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 4 + "," + height / 2 + ")");

  // append text total to avg
  svg.append('text')
    .attr('dy', -10) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
    .html(total)
    .style('font-size', '30px')
    .style('text-anchor', 'middle'); // centres text in tooltip
  svg.append('text')
    .attr('dy', 10) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
    .html('employees')
    .style('font-size', '20px')
    .style('text-anchor', 'middle');

  var color = d3.scaleOrdinal()
    .domain(Object.keys(data))
    .range(d3.schemeDark2);

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .sort(null) // Do not sort group by size
    .value(function (d) { return d.value; })
  var data_ready = pie(d3.entries(data))

  // The arc generator
  var arc = d3.arc()
    .innerRadius(radius * 0.5)         // This is the size of the donut hole
    .outerRadius(radius * 0.8)

  // Another arc that won't be drawn. Just for labels positioning
  var outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg
    .selectAll('allSlices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function (d) { return (color(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")

  // Add the polylines between chart and labels:
  svg
    .selectAll('allPolylines')
    .data(data_ready)
    .enter()
    .append('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function (d) {
      var posA = arc.centroid(d) // line insertion in the slice
      var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

  // Add the polylines between chart and labels:
  svg
    .selectAll('allLabels')
    .data(data_ready)
    .enter()
    .append('text')
    .text(function (d) { return d.data.value })
    .attr('transform', function (d) {
      var pos = outerArc.centroid(d);
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      return 'translate(' + pos + ')';
    })
    .style('text-anchor', function (d) {
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      return (midangle < Math.PI ? 'start' : 'end')
    })

  var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) {
      var vert = i * (legendRectSize + legendSpacing + 5);
      // return 'translate(' + width / 3 + ',' + - height / 4 + ')';
      return 'translate(' + (width / 3) + ',' + (vert - height / 4) + ')';
    });

  var title = svg.selectAll('.total')
    .attr('transform', function (d, i) {
      var vert = i * (legendRectSize + legendSpacing + 5);
      return 'translate(' + (width / 3) + ',' + (vert - height / 4) + ')';
    });

  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color)

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function (d) { return d; });
};

function drawChartGender(id, data_filter = {}) {
  $.ajax({
    url: "/dashboards/data_users_by_gender",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      drawPieChart(response.data, response.total, id)
    }
  });
};
function drawChartRole(id, data_filter = {}) {
  $.ajax({
    url: "/dashboards/data_users_by_role",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      drawPieChart(response.data, response.total, id)
    }
  });
}
function drawChartSeniority() {
  $.ajax({
    url: "/dashboards/data_users_by_seniority",
    data: {},
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
    }
  });
}
function drawChartRank() {
  $.ajax({
    url: "/dashboards/data_users_by_rank",
    data: {},
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
    }
  });
}
$(document).ready(function () {
  loadFilterReview();
  loadDataFilter();
  $(".apply-filter").click(function () {
    data_filter = apllyFilter();
    drawChartGender("#chart_gender", data_filter);
    drawChartRole("#chart_role", data_filter);
  });

  $(".reset-filter").click(function () {
    data_filter = {
      company: "0",
      project: "0",
      role: "0",
      user: "0",
      period: $("#period_filter").children()[0].value,
    };
    drawChartGender("#chart_gender", data_filter);
    drawChartRole("#chart_role", data_filter);
  });

  drawChartGender("#chart_gender");
  drawChartRole("#chart_role");

  var exampleData = [
    { rank: '1', males: 66, females: 66, total: 132 },
    { rank: '2', males: 55, females: 55, total: 110 },
    { rank: '3', males: 44, females: 44, total: 88 },
    { rank: '4', males: 33, females: 33, total: 66 },
    { rank: '5', males: 22, females: 22, total: 44 },
  ];
  drawPyramidChart(exampleData, "#chart_seniority");
  drawPyramidChart(exampleData, "#chart_rank");
});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
      data_filter = apllyFilter();
    }
  });
}
function apllyFilter() {
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