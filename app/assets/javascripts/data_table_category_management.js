$(document).ready(function () {
  loadDataSettingCompany();
  setDisplay("#box_company", "#table_setting_company");
  loadCompanyName();

  $(".btn-company").click(function () {
    setDisplay("#box_company", "#table_setting_company");
    loadDataSettingCompany();
  });
  $(".btn-project").click(function () {
    setDisplay("#box_project", "#table_setting_project");
    loadDataSettingProject();
  });
  $(".btn-role").click(function () {
    setDisplay("#box_role", "#table_setting_role");
    loadDataSettingRole();
  });
  $(".btn-title").click(function () {
    setDisplay("#box_title", "#table_setting_title");
    loadDataSettingTitle();
  });

  $(".joined-date").datepicker({
    todayBtn: "linked",
    todayHighlight: true,
    autoclose: true,
    format: "M dd, yyyy"
  });


});
$(document).on("click", ".edit-setting-company", function () {
  $("#btn_save").removeClass("btn-save-company btn-save-project btn-save-role btn-save-title")
  $("#btn_save").addClass("btn-save-company");

  $(".company-id").val($(this).data("id"));
  $(".company-name").val($(this).data("name"));
  $(".company-abbreviation").val($(this).data("abbreviation"));
  $(".company-establishment").val($(this).data("establishment"));
  $(".company-phone").val($(this).data("phone"));
  $(".company-fax").val($(this).data("fax"));
  $(".company-email").val($(this).data("email"));
  $(".company-website").val($(this).data("website"));
  $(".company-address").val($(this).data("address"));
  $(".company-description").val($(this).data("description"));
  $(".company-ceo").val($(this).data("ceo"));
  $(".company-tax_code").val($(this).data("tax_code"));
  $(".company-note").val($(this).data("note"));
  $(".company-quantity").val($(this).data("quantity"));
  $(".company-email-group-staff").val($(this).data("email_group_staff"));
  $(".company-email-group-hr").val($(this).data("email_group_hr"));
  $(".company-email-group-fa").val($(this).data("email_group_fa"));
  $(".company-email-group-it").val($(this).data("email_group_it"));
  $(".company-email-group-admin").val($(this).data("email_group_admin"));
  $(".company-parent-company-id").val($(this).data("parent_company_id"));
});

$(document).on("click", ".btn-save-company", function () {
  $.ajax({
    type: "POST",
    url: "/category_management/save_setting_company",
    data: {
      company_id: $(".company-id").val(),
      company_name: $(".company-name").val(),
      company_abbreviation: $(".company-abbreviation").val(),
      company_establishment: $(".company-establishment").val(),
      company_phone: $(".company-phone").val(),
      company_fax: $(".company-fax").val(),
      company_email: $(".company-email").val(),
      company_website: $(".company-website").val(),
      company_address: $(".company-address").val(),
      company_description: $(".company-description").val(),
      company_ceo: $(".company-ceo").val(),
      company_tax_code: $(".company-tax_code").val(),
      company_note: $(".company-note").val(),
      company_quantity: $(".company-quantity").val(),
      company_email_group_staff: $(".company-email-group-staff").val(),
      company_email_group_hr: $(".company-email-group-hr").val(),
      company_email_group_fa: $(".company-email-group-fa").val(),
      company_email_group_it: $(".company-email-group-it").val(),
      company_email_group_admin: $(".company-email-group-admin").val(),
      parent_company_id: $(".company-parent-company-id").val(),
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      if (response.status == "success") {
        // $(".btn-company").click();
        setDisplay("#box_company", "#table_setting_company");
        loadDataSettingCompany();
        success("These company save successfully.");
      }
      else {
        fails("Fails!!!.")
      }
    }
  });
});
function success(content) {
  $("#content-alert-success").html(content);
  $("#alert-success").fadeIn();
  window.setTimeout(function () {
    $("#alert-success").fadeOut(1000);
  }, 5000);
}
// alert fails
function fails(content) {
  $("#content-alert-fail").html(content);
  $("#alert-danger").fadeIn();
  window.setTimeout(function () {
    $("#alert-danger").fadeOut(1000);
  }, 5000);
}
$(document).on("click", "#btn_add", function () {

  $("#btn_save").removeClass("btn-save-company btn-save-project btn-save-role btn-save-title")
  $("#btn_save").addClass("btn-save-company");

  $(".company-id").val("");
  $(".company-name").val("");
  $(".company-abbreviation").val("");
  $(".company-establishment").val("");
  $(".company-phone").val("");
  $(".company-fax").val("");
  $(".company-email").val("");
  $(".company-website").val("");
  $(".company-address").val("");
  $(".company-description").val("");
  $(".company-ceo").val("");
  $(".company-tax_code").val("");
  $(".company-note").val("");
  $(".company-quantity").val("");
  $(".company-email-group-staff").val("");
  $(".company-email-group-hr").val("");
  $(".company-email-group-fa").val("");
  $(".company-email-group-it").val("");
  $(".company-email-group-admin").val("");
  $(".company-parent-company-id").val("");
});
$(document).on("click", ".status_icon", function () {
  company_id = $(this).data("company_id");
  debugger
  $.ajax({
    url: "/category_management/status_setting",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      company_id:company_id,
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        if (response.change == false) {
          $('a.status_icon[data-company_id="' + company_id + '"]').html(
            '<i class="fa fa-toggle-off"></i>'
          );
        } else {
          $('a.status_icon[data-company_id="' + company_id + '"]').html(
            '<i class="fa fa-toggle-on"></i>'
          );
        }
        success("The status has been changed successfully.");
      } else if (response.status == "fail") {
        fails("The status hasn't been changed.");
      }
    },
  });
});
function setDisplay(id, id_header) {
  $("#box_company").css("display", "none");
  $("#box_project").css("display", "none");
  $("#box_role").css("display", "none");
  $("#box_title").css("display", "none");

  $("#table_setting_company").css("display", "none");
  $("#table_setting_project").css("display", "none");
  $("#table_setting_role").css("display", "none");
  $("#table_setting_title").css("display", "none");

  $("#table_setting_company_wrapper").css("display", "none");
  $("#table_setting_project_wrapper").css("display", "none");
  $("#table_setting_role_wrapper").css("display", "none");
  $("#table_setting_title_wrapper").css("display", "none");

  $(id).css("display", "");
  $(id_header).css("display", "");
}

function loadDataSettingCompany(data_filter = {}) {
  $.ajax({
    url: "/category_management/data_setting_company",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      $("#table_setting_company tbody").html(appendDataToTableCompany(response.data));
      if (response.data.length > 0) {
        $('#table_setting_company').DataTable({
          "bLengthChange": false,
          "bFilter": false,
          "bAutoWidth": false,
          "destroy": true,
          "iDisplayLength": 3,
        });
      }

    }
  });
}
function appendDataToTableCompany(data) {
  tpl = ``
  if (data.length == 0)
    return tpl += `<tr><td colspan="8" class="type-icon">No data available in table</td></tr>`;
  data.forEach(function (user, i) {
    tpl += `
        <tr>
          <td style="width:3%" class="type-number item-row number">{number}</td>
          <td style="width:15%" class="type-text item-row name">{name}</td>
          <td style="width:12%" class="type-text item-row establishment">{establishment}</td>
          <td style="width:12%" class="type-text item-row phone">{phone}</td>
          <td style="width:15%" class="type-text item-row email">{email}</td>
          <td class="type-text item-row ceo">{ceo}</td>
          <td style="width:12%" class="type-number item-row quantity">{quantity}</td>
          <td style="width:8%" class="type-icon item-row action">
           <a href="javascript:;" class="edit-setting-company" data-id="{id}" data-name="{name}" data-abbreviation="{abbreviation}" data-phone="{phone}" data-email="{email}" data-ceo="{ceo}" data-establishment="{establishment}" data-fax="{fax}" data-website="{website}" data-address="{address}" data-description="{description}" data-tax_code="{tax_code}" data-note="{note}" data-quantity="{quantity}" data-email_group_staff="{email_group_staff}" data-email_group_hr="{email_group_hr}" data-email_group_fa="{email_group_fa}" data-email_group_it="{email_group_it}" data-email_group_admin="{email_group_admin}"  data-parent_company_id="{parent_company_id}">
            <i class="fa fa-file-code-o" aria-hidden="true" title="edit"></i>
            </a>`.formatUnicorn({ number: i + 1, id: user.id, name: user.name, abbreviation: user.abbreviation, establishment: user.establishment, phone: user.phone, fax: user.fax, email: user.email, website: user.website, address: user.address, description: user.description, ceo: user.ceo, quantity: user.quantity, tax_code: user.tax_code, note: user.note, email_group_staff: user.email_group_staff, email_group_hr: user.email_group_hr, email_group_fa: user.email_group_fa, email_group_it: user.email_group_it, email_group_admin: user.email_group_admin, parent_company_id: user.parent_company_id});
            if( user.status == 2 )
              tpl += `
              <a class="action_icon status_icon" title="Disable/Enable company" data-company_id="{id}" href="javascript:;">
              <i class="fa fa-toggle-off"></i>
              </a>`.formatUnicorn({id: user.id})
            else
              tpl += `
              <a class="action_icon status_icon" title="Disable/Enable company" data-company_id="{id}" href="javascript:;">
              <i class="fa fa-toggle-on"></i>
              </a>`.formatUnicorn({id: user.id})
    tpl += `</td></tr>`
  });
  return tpl;
}
function loadDataSettingProject(data_filter = {}) {
  $.ajax({
    url: "/category_management/data_setting_project",
    data: {
      company_ids: data_filter.company,
    },
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      $("#table_setting_project tbody").html(appendDataToTableProject(response.data));
      if (response.data.length > 0) {
        $('#table_setting_project').DataTable({
          "bLengthChange": false,
          "bFilter": false,
          "bAutoWidth": false,
          "destroy": true,
        });
      }

    }
  });
}
function appendDataToTableProject(data) {
  tpl = ``
  if (data.length == 0)
    return tpl += `<tr><td colspan="9" class="type-icon">No data available in table</td></tr>`;
  data.forEach(function (user, i) {
    tpl += `
        <tr>
          <td style="width:3%" class="type-number item-row number">{number}</td>
          <td style="width:10%" class="type-text item-row company_name">{company_name}</td>
          <td style="width:12%"class="type-text item-row name">{name}</td>
          <td style="width:6%"class="type-text item-row establishment">{establishment}</td>
          <td class="type-text item-row project_manager">{project_manager}</td>
          <td class="type-text item-row customer">{customer}</td>
          <td style="width:18%"class="type-text item-row email">{email}</td>
          <td style="width:12%" class="type-text item-row quantity">{quantity}</td>
          <td class="type-icon item-row action">`.formatUnicorn({ number: i + 1, company_name: user.company_name, name: user.name, establishment: user.establishment, project_manager: user.project_manager, customer: user.customer, email: user.email, quantity: user.quantity });
    tpl += `<a href="javascript:;" class="link-icon">
            <i class="fa fa-file-code-o" aria-hidden="true" title="edit"></i>
            </a>
            <a class="action_icon status_icon" title="Disable/Enable User" data-user_id="36" data-user_account="env" href="javascript:;">
            <i class="fa fa-toggle-on"></i>
            </a>`
    tpl += `</td></tr>`
  });
  return tpl;
}
function loadDataSettingRole(data_filter = {}) {
  $.ajax({
    url: "/category_management/data_setting_role",
    data: {
      role_ids: data_filter.role_ids,
    },
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {

      $("#table_setting_role tbody").html(appendDataToTableRole(response.data));
      if (response.data.length > 0) {
        $('#table_setting_role').DataTable({
          "bLengthChange": false,
          "bFilter": false,
          "bAutoWidth": false,
          "destroy": true
        });
      }
    }
  });
}
function appendDataToTableRole(data) {
  tpl = ``
  if (data.length == 0)
    return tpl += `<tr><td colspan="6" class="type-icon">No data available in table</td></tr>`
  data.forEach(function (user, i) {
    tpl += `
        <tr>
          <td style="width:3%" class="type-number item-row number">{number}</td>
          <td class="type-text item-row name">{name}</td>
          <td class="type-text item-row abbreviation">{abbreviation}</td>
          <td class="type-text item-row description">{description}</td>
          <td class="type-text item-row note">{note}</td>
          <td class="type-icon item-row action">`.formatUnicorn({ number: i + 1, name: user.name, abbreviation: user.abbreviation, description: user.description, note: user.note });
    tpl += `
            <a href="javascript:;" class="link-icon">
            <i class="fa fa-file-code-o" aria-hidden="true" title="edit"></i>
            </a>
            <a class="action_icon status_icon" title="Disable/Enable User" data-user_id="36" data-user_account="env" href="javascript:;">
            <i class="fa fa-toggle-on"></i>
            </a>`
    tpl += `</td></tr>`
  });
  return tpl;
}
function loadDataSettingTitle(data_filter = {}) {
  $.ajax({
    url: "/category_management/data_setting_title",
    data: {
      company_ids: data_filter.company,
    },
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      $("#table_setting_title tbody").html(appendDataToTableTitle(response.data));
      if (response.data.length > 0) {
        $('#table_setting_title').DataTable({
          "bLengthChange": false,
          "bFilter": false,
          "bAutoWidth": false,
          "destroy": true
        });
      }
    }
  });
}
function appendDataToTableTitle(data) {
  tpl = ``
  if (data.length == 0)
    return tpl += `<tr><td colspan="8" class="type-icon">No data available in table</td></tr>`


  data.forEach(function (user, i) {
    tpl += `
        <tr>
          <td style="width:3%" class="type-number item-row number">{number}</td>
          <td class="type-text item-row role_name">{role_name}</td>
          <td class="type-text item-row name">{name}</td>
          <td class="type-text item-row abbreviation">{abbreviation}</td>
          <td class="type-text item-row rank">{rank}</td>
          <td class="type-text item-row description">{description}</td>
          <td class="type-text item-row note">{note}</td>
          <td class="type-icon item-row action">`.formatUnicorn({ number: i + 1, role_name: user.role_name, name: user.name, abbreviation: user.abbreviation, rank: user.rank, description: user.description, note: user.note });
    tpl += `
            <a href="javascript:;" class="link-icon">
            <i class="fa fa-file-code-o" aria-hidden="true" title="edit"></i>
            </a>
            <a class="action_icon status_icon" title="Disable/Enable User" data-user_id="36" data-user_account="env" href="javascript:;">
            <i class="fa fa-toggle-on"></i>
            </a>`
    tpl += `</td></tr>`
  });
  return tpl;
}

function loadCompanyName(data_filter = {}) {
  $.ajax({
    url: "/category_management/data_setting_load_company",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (response) {
      tpl = `<option></option>`;
      response.forEach(element => {
        tpl += `<option value=` + element.id + `>` + element.name + `</option>`
      });
      $(".project-company").html(tpl);
      $(".company-parent-company-id").html(tpl);
    }
  });
}