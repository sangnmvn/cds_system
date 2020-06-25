$(document).ready(function(){
  data_filter = {form_id: 3};
  $.ajax({
    url: "/forms/data_view_result",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      formatData(response.data);
    }
  });
})



function formatData(data) {
  var length = data.length;
  if (length == 0)
    return `<tr><td colspan="8" class="type-icon">No data available in table</td></tr>`

  tpl = ""
  data.forEach(function (val, i) {
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
          <td class="type-text" rowspan="${length}">{expected_title}</td>
          <td class="type-number" rowspan="${length}">{expected_rank}</td>
          <td class="type-number" rowspan="${length}">{expected_level}</td>
          <td class="type-text" rowspan="${length}">{next_title}</td>
          <td class="type-number" rowspan="${length}">{next_rank}</td>
          <td class="type-number" rowspan="${length}">{next_level}</td>
        </tr>`
    else {
      tpl += `
      <tr>
        <td class="type-text">{competency_name}</td>
        <td class="type-text">{title_by_competency}</td>
        <td class="type-number">{rank_by_competency}</td>
        <td class="type-number">{level_by_competency}</td>
      </tr>`
    }
  });
  return tpl;
}