/*jshint esversion: 6 */
function drawPieChart(data, total, id, name) {
  // set the dimensions and margins of the graph
  var width = $(id).width();
  var height = $(id).height() - 30;
  var legendRectSize = 18;
  var legendSpacing = 4;
  var fix_width = 110;
  var is_small_screen = document.body.offsetWidth < 1500;
  if (is_small_screen) {
    fix_width = 80;
    data = data.data_small ||  data.data; // gender's chart hasn't data small
  } else {
    data = data.data;
  }

  if (data.length == 0)
    return;
  $(id).html(`<div class="col title">${name}</div>`);
  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - 30;

  // append the svg object to the div called id (variable)
  var svg = d3.select(id)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("class", "root")
    .attr("transform", "translate(" + (width / 4 + 60) + "," + height / 2 + ")");

  // append text total to avg
  svg.append('text')
    .attr('dy', -10)
    .html(total)
    .style('font-size', '30px')
    .style('text-anchor', 'middle');
  svg.append('text')
    .attr('dy', 10)
    .html('employees')
    .style('font-size', '20px')
    .style('text-anchor', 'middle');

  var color = d3.scaleOrdinal()
    .domain(Object.keys(data))
    .range(arrColor);

  var pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.value; });
  var data_ready = pie(d3.entries(data));

  // The arc generator
  var arc = d3.arc()
    .innerRadius(radius * 0.5)         // This is the size of the donut hole
    .outerRadius(radius * 0.8);

  // Another arc that won't be drawn. Just for labels positioning
  var outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg
    .selectAll('allSlices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function (d,i) {
      d3.select(this).attr('class','path ' + "a"+ i)
      return (color(d.data.key)); 
    })
    .attr("stroke", "white")
    .style("stroke-width", "1px") .on("mouseover", function (d) {
      d3.select(this).attr('transform', 'scale(1.20)')

      chart = svg.selectAll(".legend").filter("." + d3.select(this).attr("class").split(" ")[1])
      chart.attr('transform', chart.attr("transform").split(" ")[0] + ' scale(1.20)').attr("font-weight","bold").attr("fill", "rgb(19, 103, 0)").raise()

      chart_text = svg.selectAll(".text").filter("." + d3.select(this).attr("class").split(" ")[1])
      chart_text.attr('transform', chart_text.attr("transform").split(" ")[0] + ' scale(1.52)').attr("font-weight","bold").attr("fill", "rgb(19, 103, 0)")
      this_svg = svg.append("rect").attr("class","rect-hover").attr('transform', chart_text.attr("transform")).style("fill","#dae7ff").style("width","64px").style("height","20px").style("y","-10").style("text-anchor","start")
      if(chart_text.attr("transform").split(",")[0].split("(")[1] < 0)
      {
        let x = chart_text.attr("transform").split(",")[0].split("(")[1] - 96
        let y = chart_text.attr("transform").split(",")[1].split(" ")[0].split(")")[0]
        this_svg.attr('transform', "translate(" + x + "," + y + ")").style("width","94px").style("height","30px").style("y","-18")
      }
      chart_text.raise()
    })
    .on("mouseout", function (d) {
      d3.select(this).attr('transform', 'scale(1)')

      chart = svg.selectAll(".legend").filter("." + d3.select(this).attr("class").split(" ")[1])
      chart.attr('transform', chart.attr("transform").split(" ")[0] + ' scale(1)').attr("font-weight","none").attr("fill", "#000").lower()

      chart_text = svg.selectAll(".text").filter("." + d3.select(this).attr("class").split(" ")[1])
      chart_text.attr('transform', chart_text.attr("transform").split(" ")[0] + ' scale(1)').attr("font-weight","none").attr("fill", "#000")
      d3.select(".rect-hover").remove(0)
    });

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
      var posA = arc.centroid(d); // line insertion in the slice
      var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC];
    });

  // Add the polylines between chart and labels:
  svg
    .selectAll('allLabels')
    .data(data_ready)
    .enter()
    .append('text')
    .text(function (d,i) { 
      d3.select(this).attr('class','text ' + "a"+ i)
      return d.data.value + ' (' + (d.data.value / total * 100).toFixed(2) + '%)'; 
    })
    .attr('transform', function (d) {
      var pos = outerArc.centroid(d);
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      return 'translate(' + pos + ')';
    })
    .style('font-size', '12px')
    .style('text-anchor', function (d) {
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      return (midangle < Math.PI ? 'start' : 'end');
    });

  var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) {
      d3.select(this).attr('class','legend ' + "a" + i)
      var maxItemOneColumn = Math.ceil(color.domain().length / 2);
      if (maxItemOneColumn < 3)
        maxItemOneColumn = color.domain().length;
      var vert = ((i < maxItemOneColumn) ? i : (i - maxItemOneColumn)) * (legendRectSize + legendSpacing + 5);

      var w = (i < maxItemOneColumn) ? ((width / 3 ) + (is_small_screen ? 15 : -55)) : (width / 3 + fix_width);
      var h = vert - height / 4 - 40;

      return 'translate(' + w + ',' + h + ')';
    })
    .on("mouseover", function (d) {
      d3.select(this).attr('transform',  d3.select(this).attr("transform").split(" ")[0] + ' scale(1.20)').attr("font-weight","bold").attr("fill", "rgb(19, 103, 0)").raise()
      
      svg.selectAll(".path").filter("." + d3.select(this).attr("class").split(" ")[1]).attr('transform', 'scale(1.20)')

      chart_text = svg.selectAll(".text").filter("." + d3.select(this).attr("class").split(" ")[1])
      chart_text.attr('transform', chart_text.attr("transform").split(" ")[0] + ' scale(1.52)').attr("font-weight","bold").attr("fill", "rgb(19, 103, 0)").raise()
      this_svg = svg.append("rect").attr("class","rect-hover").attr('transform', chart_text.attr("transform")).style("fill","#dae7ff").style("width","64px").style("height","20px").style("y","-14").style("text-anchor","start")
      if(chart_text.attr("transform").split(",")[0].split("(")[1] < 0)
      {
        let x = chart_text.attr("transform").split(",")[0].split("(")[1] - 96
        let y = chart_text.attr("transform").split(",")[1].split(" ")[0].split(")")[0]
        this_svg.attr('transform', "translate(" + x + "," + y + ")").style("width","94px").style("height","30px").style("y","-20")
      }
      chart_text.raise()
    })
    .on("mouseout", function (d) {
      d3.select(this).attr('transform',  d3.select(this).attr("transform").split(" ")[0] + ' scale(1)').attr("font-weight","none").attr("fill", "#000").lower()
      
      svg.selectAll(".path").filter("." + d3.select(this).attr("class").split(" ")[1]).attr('transform', 'scale(1)')

      chart_text = svg.selectAll(".text").filter("." + d3.select(this).attr("class").split(" ")[1])
      chart_text.attr('transform', chart_text.attr("transform").split(" ")[0] + ' scale(1)').attr("font-weight","none").attr("fill", "#000")
      d3.select(".rect-hover").remove(0)
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
    .style('stroke', color);

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function (d) { return d; });
}