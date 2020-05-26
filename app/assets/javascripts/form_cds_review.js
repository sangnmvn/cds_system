
function LoadDataAssessmentListManager()  
{
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
      for (var i = 0; i < response.length; i++) {
        var form = response[i];
        var this_element = `<tr id='period_id_{id}'> 
            <td>{no}</td> 
            <td><a href='#'>{period}</a></td> 
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
              <a data-id='{id}' href='/forms/cds_assessment?form_id={id}'><i class='fa fa-pencil icon' style='color:#fc9803'></i></a> 
              <a class='delete-cds' data-id='{id}' data-period-cds='{period}' href='#'>
                <i class='fa fa-trash icon' style='color:red'></i>
              </a> 
            </td> 
          </tr>`.formatUnicorn({ no: i + 1, id: form.id, email: form.email, user_name: form.user_name, project: form.project, review_date: form.review_date, submit_date: form.submit_date, period: form.period_name, role: form.role_name, level: form.level, rank: form.rank, title: form.title, status: form.status });
        temp += this_element;
      };
      $(".table-cds-assessment-manager-list tbody").html(temp);
    }
  })
    
}
$(document).ready(function()
{
  LoadDataAssessmentListManager();
} 

)