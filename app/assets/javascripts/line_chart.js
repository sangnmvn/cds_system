/*jshint esversion: 6 */

function drawLineChart(data, has_cdp, id) {
  var margin = { top: 20, right: 20, bottom: 100, left: 50 },
    width = $(id).width() - margin.left - margin.right,
    height = $(id).height() - margin.top - margin.bottom;
  const DASH_LENGTH = 2
  const DASH_SEPARATOR_LENGTH = 2

  var parseTime = d3.timeParse("%Y/%m/%d");
  var x = d3.scaleBand()
    .domain(data.map(function (d) { return d.period; }))
    .rangeRound([0, width])

  var y = d3.scaleLinear()
    .range([height, 0]);

  var line = d3.line()
    .x(function (d) {
      return x(d.period) + x.bandwidth() / 2;
    })
    .y(function (d) {
      return y(d.rank);
    });

  var svg = d3.select(id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 50)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var color = d3.scaleOrdinal().domain(d3.keys(data[0]).filter(function (key) {
    return key !== "period";
  })).range(["#18b107", "#eab108", "#8d092d", "#dc3e3e"]);

  var roles = color.domain().map(function (name) {
    return {
      name: name,
      values: data.map(function (d) {
        return {
          period: d.period,
          rank: +d[name]
        };
      })
    };
  });

  var xAxis = d3.axisBottom(x)
    .ticks(data.length)
    .tickFormat(function (d) {
      if (d && d != 'Next Period')
        return moment(parseTime(d)).format('MMM YYYY')
      else if (d)
        return d
    })

  var yAxis = d3.axisLeft(y)

  var min = d3.min(roles, function (c) {
    return d3.min(c.values, function (v) {
      return v.rank;
    });
  })
  var max = d3.max(roles, function (c) {
    return d3.max(c.values, function (v) {
      return v.rank;
    });
  })

  y.domain([min, max]);

  function getDashArray(data, dashedRanges, path) {
    const lengths = data.map(d => getPathLengthAtX(path, x(d.period) + x.bandwidth() / 2))
    return buildDashArray(dashedRanges, lengths)
  }

  function getPathLengthAtX(path, x) {
    const EPSILON = 1
    let point
    let target
    let start = 0
    let end = path.getTotalLength()
    // Mad binary search, yo
    while (true) {
      target = Math.floor((start + end) / 2)
      point = path.getPointAtLength(target)

      if (Math.abs(point.x - x) <= EPSILON) break

      if ((target >= end || target <= start) && point.x !== x) {
        break
      }
      if (point.x > x) {
        end = target
      } else if (point.x < x) {
        start = target
      } else {
        break
      }
    }
    return target
  }

  function buildDashArray(dashedRanges, lengths) {
    return _.reduce([dashedRanges], (res, { start, end }, i) => {
      const prevEnd = i === 0 ? 0 : dashedRanges[i - 1].end

      const normalSegment = lengths[start] - lengths[prevEnd]
      const dashedSegment = getDashedSegment(lengths[end] - lengths[start])

      return res.concat([normalSegment, dashedSegment])
    }, [])
  }

  function getDashedSegment(length) {
    const totalDashLen = DASH_LENGTH + DASH_SEPARATOR_LENGTH
    const dashCount = Math.floor(length / totalDashLen)
    return _.range(dashCount)
      .map(() => DASH_SEPARATOR_LENGTH + ',' + DASH_LENGTH)
      .concat(length - dashCount * totalDashLen)
      .join(',')
  }

  var legend = svg.selectAll('g')
    .data(roles)
    .enter()
    .append('g')
    .attr('class', 'legend');

  legend.append('rect')
    .attr('x', function (d, i) {
      return width / 3 + i * 300;
    })
    .attr('y', height + 30)
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', function (d) {
      return color(d.name);
    });

  legend.append('text')
    .attr('x', function (d, i) {
      return width / 3 + i * 300 + 20;
    })
    .attr('y', height + 40)
    .text(function (d) {
      return d.name;
    });

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // svg.select('.x.axis')
  // .selectAll('text')
  // .attr('transform', 'translate(0,10)')
  // .attr('font-size', '1.5rem');

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis.ticks(max))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")

  var role = svg.selectAll(".role")
    .data(roles)
    .enter().append("g")
    .attr("class", "role");

  role.append("path")
    .attr("class", "line")
    .attr("d", function (dx) {
      return line(dx.values.filter(function (d) {
        return d.rank != 0;
      }));
    })
    .attr('stroke-dasharray', function (d) {
      var length = d.values.length - 1
      // if (length == 1) return [];
      if (has_cdp)
        return getDashArray(d.values, { start: length - 1, end: length }, this)
      return []
    })
    .style("stroke", function (d) {
      return color(d.name);
    })

  role.selectAll(".dot")
    .data(function (d) {
      let temp = d;
      return d.values.filter(function (d) {
        d.name = temp.name
        return d.rank != 0;
      })
    })
    .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function (d, i) {
      return x(d.period) + x.bandwidth() / 2;
    })
    .attr("cy", function (d) {
      return y(d.rank)
    })
    .attr("r", 5)
    .style("fill", function (d) {
      return color(d.name);
    });
}