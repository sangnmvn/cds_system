/*jshint esversion: 6 */
function drawPyramidChart(data, total, id, name, text_legend) {
  // remove old chart
  var margin = { top: 10, right: 20, bottom: 10, left: 20, middle: 0 }
  var width = $(id).width() - 50 - margin.left - margin.right
  var height_root = $(id).height() - 30 - margin.top - margin.bottom;

  var height = height_root * data.length / 6;
  $(id).html(`<div class="col title">${name} (${total} employees)</div> <div style="height: ${height_root - height}px;"></div>`);

  var legendRectSize = 18;
  var legendSpacing = 4;
  // the width of each side of the chart
  var regionWidth = width / 2;

  // these are the x-coordinates of the y-axes
  var pointA = width / 4
  var pointB = width / 4;

  // GET THE TOTAL POPULATION SIZE AND CREATE A FUNCTION FOR RETURNING THE PERCENTAGE
  // var totalPopulation = d3.sum(data, function (d) { return d.left + d.right; }),
  var percentage = function (d) { return d; };

  var color = d3.scaleOrdinal()
    .domain(data.map(function (d) { return d.group; }))
    .range(arrColor)

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
    d3.max(data, function (d) { return percentage(d.left + d.right); }),
  );

  // SET UP SCALES
  // the xScale goes from 0 to the width of a region
  //  it will be reversed for the left x-axis
  var xScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, regionWidth]);

  var yScale = d3.scaleBand()
    .domain(data.map(function (d) { return d.group; }))
    .rangeRound([height, 0])
    .padding(0.03);
  var barHeight = yScale.bandwidth()// > 50 ? 50 : yScale.bandwidth();

  // MAKE GROUPS FOR EACH SIDE OF CHART
  // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
  var leftBarGroup = svg.append('g')
    .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
  var rightBarGroup = svg.append('g')
    .attr('transform', translation(pointB, 0));
  // DRAW BARS
  leftBarGroup.selectAll('.bar.left')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar left')
    .attr('x', 0)
    .attr('y', function (d) { return yScale(d.group); })
    .attr('width', function (d) { return xScale(percentage(d.left)); })
    .attr('height', barHeight)
    .attr('fill', function (d) { return (color(d.group)); })

  rightBarGroup.selectAll('.bar.right')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar right')
    .attr('x', 0)
    .attr('y', function (d) { return yScale(d.group); })
    .attr('width', function (d) { return xScale(percentage(d.right)); })
    .attr('height', barHeight)
    .attr('fill', function (d) { return (color(d.group)); });

  rightBarGroup.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function (d) {
      var value = d.right + d.left;
      var percent = (value / total * 100).toFixed(2)
      return value + ' (' + percent + '%)';
    })
    .attr("x", 0)
    .attr("y", function (d) { return yScale(d.group) + barHeight / 2; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");

  svg.append("svg:text")
    .attr("class", "title")
    .attr("x", width * 0.75)
    .attr('y', height * 0.25)
    .text(text_legend)
    .style("font-size", "14px");

  var legend = svg.selectAll('.legend')
    .data(color.domain().reverse())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) {
      var vert = i * (legendRectSize + legendSpacing + 5);
      return 'translate(' + (width * 0.75) + ',' + (vert + height / 3) + ')';
    });

  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color);

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function (d) { return d; });

  // so sick of string concatenation for translations
  function translation(x, y) {
    return 'translate(' + x + ',' + y + ')';
  }
}