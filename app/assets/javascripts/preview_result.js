$(document).ready(function () {
  data_filter = { form_id: 3 };
  $.ajax({
    url: "/forms/data_view_result",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      $('#view_results_new tbody').html(formatData(response.data));
    }
  });

  $("#btn_view_result").on('click', function() {
    $(this).find('i').toggleClass("fa-caret-down fa-caret-up")
  })
})

function formatData(data) {
  var length = data.competencies.length;
  if (length == 0)
    return `<tr><td colspan="13" class="type-icon">No data available in table</td></tr>`

  tpl = ""
  data.competencies.forEach(function (val, i) {
    if (i == 0)
      tpl += `
        <tr>
          <td class="type-text">{competency_name}</td>
          <td class="type-text">{title_by_competency}</td>
          <td class="type-number">{rank_by_competency}</td>
          <td class="type-number">{level_by_competency}</td>

          <td class="type-text" rowspan="${length}">{curent_title}</td>
          <td class="type-number" rowspan="${length}">{current_rank}</td>
          <td class="type-number" rowspan="${length}">{current_level}</td>

          <td class="type-text currently-td" rowspan="${length}">{expected_title}</td>
          <td class="type-number currently-td" rowspan="${length}">{expected_rank}</td>
          <td class="type-number currently-td" rowspan="${length}">{expected_level}</td>

          <td class="type-text" rowspan="${length}">{next_title}</td>
          <td class="type-number" rowspan="${length}">{next_rank}</td>
          <td class="type-number" rowspan="${length}">{next_level}</td>
        </tr>`.formatUnicorn({
        competency_name: val.name, title_by_competency: val.title_name, rank_by_competency: val.rank,
        level_by_competency: val.level, curent_title: data.current_title.title, current_rank: data.current_title.rank,
        current_level: data.current_title.level, expected_title: data.expected_title.title, expected_rank: data.expected_title.rank,
        expected_level: data.expected_title.level, next_title: data.cdp.title, next_rank: data.cdp.rank, next_level: data.cdp.level,
      })
    else {
      tpl += `
      <tr>
        <td class="type-text">{competency_name}</td>
        <td class="type-text">{title_by_competency}</td>
        <td class="type-number">{rank_by_competency}</td>
        <td class="type-number">{level_by_competency}</td>
      </tr>`.formatUnicorn({
        competency_name: val.name, title_by_competency: val.title_name, rank_by_competency: val.rank, level_by_competency: val.level
      })
    }
  });
  return tpl;
}