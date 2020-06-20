function drawPyramidChart(data, id) {
  const width = $(id).width() - 50,
    height = $(id).height() - 20;

  const svg = d3.select(id).append("svg")
    .attr("width", width)
    .attr("height", height);
  dom_year = d3.extent( data, d => d.total )
  cx = width / 2
  dom_age = d3.extent( data, d => d.rank )
  pyramid_h = height - 10
  const t = d3.transition()
    .duration(0);

  const xScaleMale = d3.scaleLinear()
    .range([0, width / 4]),
    xScaleFemale = d3.scaleLinear()
      .range([0, width / 4]),
    yScale = d3.scaleBand()
      .rangeRound([height, 0])
      .padding(.01);

  var number_columns = ["rank", "females", "males", "total"];
  data.forEach(d => {
    number_columns.forEach(c => {
      d[c] = +d[c];
    });
    return d;
  });

  yScale.domain(data.map(d => d.rank));

  redraw(data, "total");


  function redraw(data) {

    // sort data by age
    data = arr.sort(data, d => d.rank);

    // update x scales
    const maxMale = d3.max(data, d => d["males"]),
      maxFemale = d3.max(data, d => d["females"]),
      max = d3.max([maxMale, maxFemale]);

    xScaleMale.domain([0, max]);
    xScaleFemale.domain([0, max]);

    // JOIN
    var maleBar = svg.selectAll(".bar.male")
      .data(data, d => d.rank);

    var femaleBar = svg.selectAll(".bar.female")
      .data(data, d => d.rank);

    // EXIT
    maleBar.exit().remove();
    femaleBar.exit().remove();

    // year axis
    var s_year = d3.scaleLinear(dom_year)
      .range([0, 400])
      .clamp(true);

    var ax_year = d3.axisBottom(s_year)
      .ticks(8)
      .tickFormat(String);

    var svg_axis_year = svg.append('g')
      .attr('class', 'axis year')
      .attr('transform', `translate(${cx - 200},${pyramid_h + 85})`)
      .call(ax_year);

    // age axis
    var s_age = d3.scaleLinear()
      .domain(dom_age.concat().reverse())
      .range([0, pyramid_h]);

    var ax_age_l = d3.axisLeft(s_age)
      .tickFormat(d => s_age(d) ? '' + d : '');

    var ax_age_svg = svg.append('g')
      .attr('class', 'axis age')
      .attr('transform', `translate(${cx + 30 / 2 + 10},0)`)
      .call(ax_age_l);

    ax_age_svg.append('text')
      .attr('dy', '.32em')
      .text('Age');

    ax_age_svg.selectAll('text')
      .attr('x', -30 / 2 - 10)
      .style('text-anchor', 'middle');

    var ax_age_r = d3.axisRight(s_age)
      .tickFormat(d => '');

    svg.append('g')
      .attr('class', 'axis age')
      .attr('transform', `translate(${cx - 30 / 2 - 10},0)`)
      .call(ax_age_r);

    // UPDATE
    maleBar
      .transition(t)
      .attr("width", d => xScaleMale(d["males"]));

    femaleBar
      .transition(t)
      .attr("x", d => width / 4 - xScaleFemale(d["females"]))
      .attr("width", d => xScaleFemale(d["females"]));

    // ENTER
    maleBar.enter().append("rect")
      .attr("class", "bar male")
      .attr("x", width / 4)
      .attr("y", d => yScale(d.rank))
      .attr("width", d => xScaleMale(d["males"]))
      .attr("height", yScale.bandwidth())
      .attr("fill", "steelblue");

    femaleBar.enter().append("rect")
      .attr("class", "bar female")
      .attr("x", d => width / 4 - xScaleFemale(d["females"]))
      .attr("y", d => yScale(d.rank))
      .attr("width", d => xScaleFemale(d["females"]))
      .attr("height", yScale.bandwidth())
      .attr("fill", "tomato");
  }
}