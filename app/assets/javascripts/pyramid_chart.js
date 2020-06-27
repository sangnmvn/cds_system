/*jshint esversion: 6 */
function drawPyramidChart(data, id, text_y, name) {
  // remove old chart
  $(id).html(`<div class="col title">${name}</div>`);

  var margin = { top: 25, right: 20, bottom: 20, left: 20, middle: 20 },
    width = $(id).width() - 50 - margin.left - margin.right,
    height = $(id).height() - 30 - margin.top - margin.bottom;
  // the width of each side of the chart
  var regionWidth = width / 2 - margin.middle;

  // these are the x-coordinates of the y-axes
  var pointA = regionWidth,
    pointB = width - regionWidth;
  // GET THE TOTAL POPULATION SIZE AND CREATE A FUNCTION FOR RETURNING THE PERCENTAGE
  // var totalPopulation = d3.sum(data, function (d) { return d.males + d.females; }),
  var percentage = function (d) { return d; };

  var color = d3.scaleOrdinal()
  .domain(data.map(function (d) { return d.group; }))
  .range(d3.schemeDark2);

  // CREATE SVG
  var svg = d3.select(id).append('svg')
    .attr('width', margin.left + width + margin.right)
    .attr('height', margin.top + height + margin.bottom)
    // ADD A GROUP FOR THE SPACE WITHIN THE MARGINS
    .append('g')
    .attr('transform', translation(margin.left, margin.top));

  // find the maximum data value on either side
  //  since this will be shared by both of the x-axes
  var maxValue = Math.max(
    d3.max(data, function (d) { return percentage(d.males); }),
    d3.max(data, function (d) { return percentage(d.females); })
  );

  // SET UP SCALES
  // the xScale goes from 0 to the width of a region
  //  it will be reversed for the left x-axis
  var xScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, regionWidth]);

  var xScaleLeft = d3.scaleLinear()
    .domain([0, maxValue])
    .range([regionWidth, 0]);

  var xScaleRight = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, regionWidth]);

  var yScale = d3.scaleBand()
    .domain(data.map(function (d) { return d.group; }))
    .rangeRound([height, 0])
    .padding(0.03);

  // SET UP AXES
  var yAxisLeft = d3.axisRight()
    .scale(yScale)
    .tickSize(4, 0)
    .tickPadding(margin.middle - 4);

  var yAxisRight = d3.axisLeft()
    .scale(yScale)
    .tickSize(4, 0)
    .tickFormat('');

  var xAxisRight = d3.axisBottom()
    .scale(xScale)
    .ticks(4);

  var xAxisLeft = d3.axisBottom()
    // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
    .scale(xScale.copy().range([pointA, 0]))
    .ticks(4);

  // MAKE GROUPS FOR EACH SIDE OF CHART
  // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
  var leftBarGroup = svg.append('g')
    .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
  var rightBarGroup = svg.append('g')
    .attr('transform', translation(pointB, 0));
  //title	  
  svg.append("svg:text")
    .attr("class", "title")
    .attr("x", 0)
    .attr("y", 0)
    .text("Male")
    .style("font-size", "12px");

  svg.append("svg:text")
    .attr("class", "title")
    .attr("x", width - 25)
    .attr("y", 0)
    .text("Female")
    .style("font-size", "12px");

  svg.append("svg:text")
    .attr("class", "title")
    .attr("x", width / 2 - 13)
    .attr("y", 0)
    .text(text_y)
    .style("font-size", "12px");

  // DRAW AXES
  svg.append('g')
    .attr('class', 'axis y left')
    .attr('transform', translation(pointA, 0))
    .call(yAxisLeft)
    .selectAll('text')
    .style('text-anchor', 'middle');

  svg.append('g')
    .attr('class', 'axis y right')
    .attr('transform', translation(pointB, 0))
    .call(yAxisRight);

  svg.append('g')
    .attr('class', 'axis x left')
    .attr('transform', translation(0, height))
    .call(xAxisLeft);

  svg.append('g')
    .attr('class', 'axis x right')
    .attr('transform', translation(pointB, height))
    .call(xAxisRight);

  // DRAW BARS
  leftBarGroup.selectAll('.bar.left')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar left')
    .attr('x', 0)
    .attr('y', function (d) { return yScale(d.group); })
    .attr('width', function (d) { return xScale(percentage(d.males)); })
    .attr('height', yScale.bandwidth())
    .attr("text-anchor", "left")
    .text(function(d) { return d.males; })
    .attr('fill', function (d) { return (color(d.group)); });

  rightBarGroup.selectAll('.bar.right')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar right')
    .attr('x', 0)
    .attr('y', function (d) { return yScale(d.group); })
    .attr('width', function (d) { return xScale(percentage(d.females)); })
    .attr('height', yScale.bandwidth())
    .attr('fill', function (d) { return (color(d.group)); });

  // so sick of string concatenation for translations
  function translation(x, y) {
    return 'translate(' + x + ',' + y + ')';
  }
}