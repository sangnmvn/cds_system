
function LoadDataAssessmentListManager()  
{
  var data = {
    search: $('.search-review').val(),
    filter: ""
  }
  $.ajax({
    type: "GET",
    url: "/forms/get_list_cds_assessment_manager",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {

    },
    dataType: "json",
    success: function (response) {
      var temp = '';
      if (response.length == 0)
        temp = `<tr><td colspan="13" style="text-align:center">No data available in table</td></tr>`;
      for (var i = 0; i < response.length; i++) {
        var form = response[i];
        var this_element = `<tr id='period_id_{id}'> 
            <td>{no}</td> 
            <td><a href='/forms/cds_cdp_review?form_id={id}&user_id={user_id}'>{period}</a></td> 
            <td>{user_name}</td>
            <td>{project}</td>
            <td>{email}</td>
            <td>{role}</td> 
            <td>{level}</td> 
            <td>{rank}</td> 
            <td>{title}</td> 
            <td>{submit_date}</td>
            <td>{review_date}</td>
            <td>{status}</td> 
            <td> 
              <a data-id='{id}' href='/forms/cds_cdp_review?form_id={id}&user_id={user_id}'><i class='fa fa-pencil icon' style='color:#fc9803'></i></a> 
              <a class='delete-cds' data-id='{id}' data-period-cds='{period}' href='#'>
                <i class='fa fa-trash icon' style='color:red'></i>
              </a> 
            </td> 
          </tr>`.formatUnicorn({ no: i + 1, id: form.id, email: form.email, user_name: form.user_name, project: form.project, review_date: form.review_date, submit_date: form.submit_date, period: form.period_name, role: form.role_name, level: form.level, rank: form.rank, title: form.title, status: form.status, user_id: form.user_id});
        temp += this_element;
      };
      $(".table-cds-assessment-manager-list tbody").html(temp);
    }
  })
    
}
function loadFilterReview(){
  $(".filter_review").click(function() {
    $(".filter-condition").toggle();
    if ( $('a.filter_review i').hasClass('fa-chevron-down') )
      $('a.filter_review i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    else
      $('a.filter_review i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
  });
}
$(document).ready(function(){
  LoadDataAssessmentListManager();
  loadFilterReview();
  $("#company_filter").multiselect({
    enableFiltering: true,
    filterPlaceholder: 'Search for something...',
    includeSelectAllOption: true,
    selectAllValue: 0
  });
  $(".search-review").change(function() {
    LoadDataAssessmentListManager();
  });
});