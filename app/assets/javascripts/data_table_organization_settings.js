$(document).ready(function () {
  loadDataCompany();
  setDisplay("#box_company", "#table_company", "btn-add-company", "btn-save-company");
  loadCompanyName();
  $(".btn-company").css("background-color","#8da8db");
  loadRoleName();
  $(".btn-company").click(function () {
    setDisplay("#box_company", "#table_company", "btn-add-company", "btn-save-company");
    loadDataCompany();
    $(".left-panel table tr").css("background-color","#4472c4");
    $(".btn-company").css("background-color","#8da8db");
  });
  $(".btn-project").click(function () {
    setDisplay("#box_project", "#table_project", "btn-add-project", "btn-save-project");
    loadDataProject();
    $(".left-panel table tr").css("background-color","#4472c4");
    $(".btn-project").css("background-color","#8da8db");
  });
  $(".btn-role").click(function () {
    setDisplay("#box_role", "#table_role", "btn-add-role", "btn-save-role");
    loadDataRole();
    $(".left-panel table tr").css("background-color","#4472c4");
    $(".btn-role").css("background-color","#8da8db");
  });
  $(".btn-title").click(function () {
    setDisplay("#box_title", "#table_title", "btn-add-title", "btn-save-title");
    loadDataTitle();
    $(".left-panel table tr").css("background-color","#4472c4");
    $(".btn-title").css("background-color","#8da8db");
  });

  $(".joined-date").datepicker({
    todayBtn: "linked",
    todayHighlight: true,
    autoclose: true,
    format: "M dd, yyyy",
  });
});
$(document).on("click", ".edit-company", function () {
  $("#btn_save").removeClass(
    "btn-save-company btn-save-project btn-save-role btn-save-title"
  );
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
  $(".company-desc").val($(this).data("desc"));
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
$(document).on("click", ".edit-project", function () {
  $("#btn_save").removeClass(
    "btn-save-company btn-save-project btn-save-role btn-save-title"
  );
  $("#btn_save").addClass("btn-save-project");

  $(".project-id").val($(this).data("id"));
  $(".project-company-name").val($(this).data("company_name"));
  $(".project-name").val($(this).data("name"));
  $(".project-abbreviation").val($(this).data("abbreviation"));
  $(".project-establishment").val($(this).data("establishment"));
  $(".project-closed-date").val($(this).data("closed_date"));
  $(".project-manager").val($(this).data("project_manager"));
  $(".project-customer").val($(this).data("customer"));
  $(".project-sponsor").val($(this).data("sponsor"));
  $(".project-email").val($(this).data("email"));
  $(".project-quantity").val($(this).data("quantity"));
  $(".project-desc").val($(this).data("desc"));
  $(".project-note").val($(this).data("note"));
});
$(document).on("click", ".edit-role", function () {
  $("#btn_save").removeClass(
    "btn-save-company btn-save-project btn-save-role btn-save-title"
  );
  $("#btn_save").addClass("btn-save-role");

  $(".role-id").val($(this).data("id"));
  $(".role-name").val($(this).data("name"));
  $(".role-abbreviation").val($(this).data("abbreviation"));
  $(".role-desc").val($(this).data("desc"));
  $(".role-note").val($(this).data("note"));
});
$(document).on("click", ".edit-title", function () {
  $("#btn_save").removeClass(
    "btn-save-company btn-save-project btn-save-role btn-save-title"
  );
  $("#btn_save").addClass("btn-save-title");

  $(".title-id").val($(this).data("id"));
  $(".title-name").val($(this).data("name"));
  $(".title-role-name").val($(this).data("role_id"));
  $(".title-abbreviation").val($(this).data("abbreviation"));
  $(".title-establishment").val($(this).data("establishment"));
  $(".title-rank").val($(this).data("rank"));
  $(".title-desc").val($(this).data("desc"));
  $(".title-note").val($(this).data("note"));
});
var regEx = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
$(document).on("click", ".btn-save-company", function () {
  $(".error-company").remove();
  if ($(".company-name").val().length < 1) {
    $(".company-name").after(
      '<span class="error-company">Please enter Company Name</span>'
    );
  } else if ($(".company-name").val().length > 255 || $(".company-name").val().length < 2) {
    $(".company-name").after(
      '<span class="error-company">‘Please enter Company Name with characters from 2 to 255 characters.</span>'
    );
  }
  if ($(".company-establishment").val().length < 1) {
    $(".company-establishment").after(
      '<span class="error-company">Please enter Establishment</span>'
    );
  }
  if ($(".company-phone").val().length < 1) {
    $(".company-phone").after(
      '<span class="error-company">Please enter Phone</span>'
    );
  } else if ($(".company-phone").val().length > 12 || $(".company-phone").val().length < 10) {
    $(".company-phone").after(
      '<span class="error-company">Please enter Phone with characters from 10 to 12 characters.</span>'
    );
  }
  if ($(".company-email").val().length < 1) {
    $(".company-email").after(
      '<span class="error-company">Please enter Email</span>'
    );
  } else if ($(".company-email").val().length > 255) {
    $(".company-email").after(
      '<span class="error-company">Maximum length is 255 characters.</span>'
    );
  } else {
    var valid_email = regEx.test($(".company-email").val());
    if (!valid_email) {
      $(".company-email").after(
        '<span class="error-company">Please enter a valid email address. For example: abc@domain.com.</span>'
      );
    }
  }
  if ($(".company-address").val().length < 1) {
    $(".company-address").after(
      '<span class="error-company">Please enter Address</span>'
    );
  } else if ($(".company-address").val().length > 255) {
    $(".company-address").after(
      '<span class="error-company">Maximum length is 255 characters.</span>'
    );
  }
  if ($(".company-ceo").val().length < 1) {
    $(".company-ceo").after(
      '<span class="error-company">Please enter CEO</span>'
    );
  } else if ($(".company-address").val().length > 255) {
    $(".company-address").after(
      '<span class="error-company">Maximum length is 255 characters.</span>'
    );
  }
  if ($(".company-email-group-staff").val().length > 0) {
    var valid_email = regEx.test($(".company-email-group-staff").val());
    if (!valid_email) {
      $(".company-email-group-staff").after(
        '<span class="error-company">Please enter a valid email address. For example: abc@domain.com.</span>'
      );
    } else if ($(".company-email-group-staff").val().length > 255) {
      $(".company-email-group-staff").after(
        '<span class="error-company">Maximum length is 255 characters.</span>'
      );
    }
  }
  if ($(".company-email-group-hr").val().length > 0) {
    var valid_email = regEx.test($(".company-email-group-hr").val());
    if (!valid_email) {
      $(".company-email-group-hr").after(
        '<span class="error-company">Please enter a valid email address. For example: abc@domain.com.</span>'
      );
    } else if ($(".company-email-group-hr").val().length > 255) {
      $(".company-email-group-hr").after(
        '<span class="error-company">Maximum length is 255 characters.</span>'
      );
    }
  }
  if ($(".company-email-group-fa").val().length > 0) {
    var valid_email = regEx.test($(".company-email-group-fa").val());
    if (!valid_email) {
      $(".company-email-group-fa").after(
        '<span class="error-company">Please enter a valid email address. For example: abc@domain.com.</span>'
      );
    } else if ($(".company-email-group-fa").val().length > 255) {
      $(".company-email-group-fa").after(
        '<span class="error-company">Maximum length is 255 characters.</span>'
      );
    }
  }
  if ($(".company-email-group-it").val().length > 0) {
    var valid_email = regEx.test($(".company-email-group-it").val());
    if (!valid_email) {
      $(".company-email-group-it").after(
        '<span class="error-company">Please enter a valid email address. For example: abc@domain.com.</span>'
      );
    } else if ($(".company-email-group-it").val().length > 255) {
      $(".company-email-group-it").after(
        '<span class="error-company">Maximum length is 255 characters.</span>'
      );
    }
  }
  if ($(".company-email-group-admin").val().length > 0) {
    var valid_email = regEx.test($(".company-email-group-admin").val());
    if (!valid_email) {
      $(".company-email-group-admin").after(
        '<span class="error-company">Please enter a valid email address. For example: abc@domain.com.</span>'
      );
    } else if ($(".company-email-group-admin").val().length > 255) {
      $(".company-email-group-admin").after(
        '<span class="error-company">Maximum length is 255 characters.</span>'
      );
    }
  }
  if ($(".company-desc").val().length > 500) {
    $(".company-desc").after(
      '<span class="error-company">Maximum length is 500 characters.</span>'
    );
  }
  if ($(".company-note").val().length > 500) {
    $(".company-note").after(
      '<span class="error-company">Maximum length is 500 characters.</span>'
    );
  }

  if ($(".error-company").length == 0) {
    $.ajax({
      type: "POST",
      url: "/organization_settings/save_company",
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
        company_desc: $(".company-desc").val(),
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
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      success: function (response) {
        if (response.status == "success") {
          setDisplay("#box_company", "#table_company", "btn-add-company", "btn-save-company");
          loadDataCompany();
          warning("These company save successfully.");
        } else if (response.status == "exist") {
          $(".error-company").remove();
          $(".company-name").after(
            '<span class="error-company">Name already exsit</span>'
          );
        } else {
          fails("Fails!!!.");
        }
      },
    });
  }
});
$(document).on("click", ".btn-save-project", function () {
  $(".error-project").remove();
  if ($(".project-company-name").val().length < 1) {
    $(".project-company-name").after(
      '<span class="error-project">Please enter Company Name</span>'
    );
  }
  if ($(".project-name").val().length < 1) {
    $(".project-name").after(
      '<span class="error-project">Please enter Project Name</span>'
    );
  } else if ($(".project-name").val().length > 255) {
    $(".project-name").after(
      '<span class="error-project">Maximum length is 255 characters.</span>'
    );
  }
  if ($(".project-establishment").val().length > 255) {
    $(".project-establishment").after(
      '<span class="error-project">Maximum length is 255 characters.</span>'
    );
  }
  if ($(".project-manager").val().length < 1) {
    $(".project-manager").after(
      '<span class="error-project">Please enter Project Manager</span>'
    );
  } else if ($(".project-manager").val().length > 255) {
    $(".project-manager").after(
      '<span class="error-project">Maximum length is 255 characters.</span>'
    );
  }
  if ($(".project-email").val().length > 255) {
    $(".project-email").after(
      '<span class="error-project">Maximum length is 255 characters.</span>'
    );
  } else {
    var valid_email = regEx.test($(".project-email").val());
    if (!valid_email) {
      $(".project-email").after(
        '<span class="error-project">Please enter a valid email address. For example: abc@domain.com.</span>'
      );
    } else if ($(".project-email").val().length > 255) {
      $(".project-email").after(
        '<span class="error-project">Maximum length is 255 characters.</span>'
      );
    }
  }
  if ($(".project-note").val().length > 500) {
    $(".project-note").after(
      '<span class="error-project">Maximum length is 500 characters.</span>'
    );
  }
  if ($(".project-desc").val().length > 500) {
    $("project-desc").after(
      '<span class="error-project">Maximum length is 500 characters.</span>'
    );
  }
  if ($(".project-abbreviation").val().length > 255) {
    $(".project-abbreviation").after(
      '<span class="error-project">Maximum length is 255 characters.</span>'
    );
  }
  if ($(".project-customer").val().length > 255) {
    $(".project-customer").after(
      '<span class="error-project">Maximum length is 255 characters.</span>'
    );
  }
  if ($(".project-sponsor").val().length > 255) {
    $(".project-sponsor").after(
      '<span class="error-project">Maximum length is 255 characters.</span>'
    );
  }

  if ($(".error-project").length == 0) {
    $.ajax({
      type: "POST",
      url: "/organization_settings/save_project",
      data: {
        project_id: $(".project-id").val(),
        project_company_name: $(".project-company-name").val(),
        project_name: $(".project-name").val(),
        project_abbreviation: $(".project-abbreviation").val(),
        project_establishment: $(".project-establishment").val(),
        project_email: $(".project-email").val(),
        project_desc: $(".project-desc").val(),
        project_note: $(".project-note").val(),
        project_quantity: $(".project-quantity").val(),
        project_closed_date: $(".project-closed-date").val(),
        project_manager: $(".project-manager").val(),
        project_customer: $(".project-customer").val(),
        project_sponsor: $(".project-sponsor").val(),
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      success: function (response) {
        if (response.status == "success") {
          setDisplay("#box_project", "#table_project", "btn-add-project", "btn-save-project");
          loadDataProject();
          warning("These project save successfully.");
        } else if (response.status == "exist") {
          $(".error-project").remove();
          $(".project-name").after(
            '<span class="error-project">Name already exsit</span>'
          );
        } else {
          fails("Fails!!!.");
        }
      },
    });
  }
});
$(document).on("click", ".btn-save-role", function () {
  $(".error-role").remove();
  if ($(".role-name").val().length < 1) {
    $(".role-name").after(
      '<span class="error-role">Please enter Role Name</span>'
    );
  } else if ($(".role-name").val().length > 255) {
    $(".role-name").after(
      '<span class="error-role">Maximum length is 255 characters.</span>'
    );
  }
  if ($(".role-note").val().length > 500) {
    $(".role-note").after(
      '<span class="error-role">Maximum length is 500 characters.</span>'
    );
  }
  if ($(".role-desc").val().length > 500) {
    $(".role-desc").after(
      '<span class="error-role">Maximum length is 500 characters.</span>'
    );
  }
  if ($(".role-abbreviation").val().length > 255) {
    $(".role-abbreviation").after(
      '<span class="error-role">Maximum length is 255 characters.</span>'
    );
  }
  if ($(".error-role").length == 0) {
    $.ajax({
      type: "POST",
      url: "/organization_settings/save_role",
      data: {
        role_id: $(".role-id").val(),
        role_name: $(".role-name").val(),
        role_abbreviation: $(".role-abbreviation").val(),
        role_desc: $(".role-desc").val(),
        role_note: $(".role-note").val(),
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      success: function (response) {
        if (response.status == "success") {
          setDisplay("#box_role", "#table_role", "btn-add-role", "btn-save-role");
          loadDataRole();
          warning("These role has been saved successfully..");
        } else if (response.status == "exist") {
          $(".error-role").remove();
          $(".role-name").after(
            '<span class="error-role">Name already exsit</span>'
          );
        } else {
          fails("Fails!!!.");
        }
      },
    });
  }
});
$(document).on("click", ".btn-save-title", function () {
  $(".error-title").remove();
  if ($(".title-role-name").val().length < 1) {
    $(".title-role-name").after(
      '<span class="error-title">Please enter Role Name</span>'
    );
  } else if ($(".title-role-name").val().length > 255) {
    $(".title-role-name").after(
      '<span class="error-title">Maximum length is 255 characters.</span>'
    );
  }
  if ($(".title-name").val().length < 1) {
    $(".title-name").after(
      '<span class="error-title">Please enter Title Name</span>'
    );
  } else if ($(".title-name").val().length > 255) {
    $(".title-name").after(
      '<span class="error-title">Maximum length is 255 characters.</span>'
    );
  }
  if ($(".title-rank").val().length < 1) {
    $(".title-rank").after(
      '<span class="error-title">Please enter Rank</span>'
    );
  } else if ($(".title-rank").val().length > 10) {
    $(".title-rank").after(
      '<span class="error-title">Please enter less than 10 character</span>'
    );
  }
  if ($(".title-desc").val().length > 500) {
    $(".title-desc").after(
      '<span class="error-title">Maximum length is 500 characters.</span>'
    );
  }
  if ($(".title-note").val().length > 500) {
    $(".title-note").after(
      '<span class="error-title">Maximum length is 500 characters.</span>'
    );
  }
  if ($(".title-abbreviation").val().length > 255) {
    $(".title-abbreviation").after(
      '<span class="error-title">Maximum length is 255 characters.</span>'
    );
  }

  if ($(".error-title").length == 0) {
    $.ajax({
      type: "POST",
      url: "/organization_settings/save_title",
      data: {
        title_id: $(".title-id").val(),
        title_role_name: $(".title-role-name").val(),
        title_name: $(".title-name").val(),
        title_abbreviation: $(".title-abbreviation").val(),
        title_desc: $(".title-desc").val(),
        title_note: $(".title-note").val(),
        title_rank: $(".title-rank").val(),
      },
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      success: function (response) {
        if (response.status == "success") {
          setDisplay("#box_title", "#table_title", "btn-add-title", "btn-save-title");
          loadDataTitle();
          warning("The title has been saved successfully.");
        } else if (response.status == "exist") {
          $(".error-title").remove();
          $(".title-name").after(
            '<span class="error-title">Name already exsit</span>'
          );
        } else {
          fails("Fails!!!.");
        }
      },
    });
  }
});

$(document).on("click", ".btn-add-company", function () {
  $(".error-company").remove();

  $(".company-id").val("");
  $(".company-name").val("");
  $(".company-abbreviation").val("");
  $(".company-establishment").val("");
  $(".company-phone").val("");
  $(".company-fax").val("");
  $(".company-email").val("");
  $(".company-website").val("");
  $(".company-address").val("");
  $(".company-desc").val("");
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
$(document).on("click", ".btn-add-project", function () {
  $(".error-project").remove();

  $(".project-id").val("");
  $(".project-name").val("");
  $(".project-company-name").val("");
  $(".project-abbreviation").val("");
  $(".project-establishment").val("");
  $(".project-email").val("");
  $(".project-address").val("");
  $(".project-desc").val("");
  $(".project-note").val("");
  $(".project-quantity").val("");
  $(".project-closed-date").val("");
  $(".project-customer").val("");
  $(".project-sponsor").val("");
  $(".project-manager").val("");
});
$(document).on("click", ".btn-add-role", function () {
  $(".error-role").remove();

  $(".role-id").val("");
  $(".role-name").val("");
  $(".role-abbreviation").val("");
  $(".role-desc").val("");
  $(".role-note").val("");
});
$(document).on("click", ".btn-add-title", function () {
  $(".error-title").remove();

  $(".title-id").val("");
  $(".title-name").val("");
  $(".title-role-name").val("");
  $(".title-abbreviation").val("");
  $(".title-rank").val("");
  $(".title-address").val("");
  $(".title-desc").val("");
  $(".title-note").val("");
});

$(document).on("click", ".status-icon-company", function () {
  var company_id = $(this).data("company_id");
  $.ajax({
    url: "/organization_settings/change_status_company",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    data: {
      company_id: company_id,
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        if (response.change == false) {
          $('a.status-icon-company[data-company_id="' + company_id + '"]').html(
            '<i class="fa fa-toggle-off"></i>'
          );
          warning("The company has been disabled successfully.");
        } else {
          $('a.status-icon-company[data-company_id="' + company_id + '"]').html(
            '<i class="fa fa-toggle-on"></i>'
          );
          warning("The company has been enabled successfully.");
        }
      } else if (response.status == "fail") {
        fails("The status hasn't been changed.");
      }
    },
  });
});
$(document).on("click", ".status-icon-project", function () {
  var project_id = $(this).data("project_id");
  $.ajax({
    url: "/organization_settings/change_status_project",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    data: {
      project_id: project_id,
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        if (response.change == false) {
          $('a.status-icon-project[data-project_id="' + project_id + '"]').html(
            '<i class="fa fa-toggle-off"></i>'
          );
          warning("The project has been disabled successfully.");
        } else {
          $('a.status-icon-project[data-project_id="' + project_id + '"]').html(
            '<i class="fa fa-toggle-on"></i>'
          );
          warning("The project has been enable successfully.");
        }
      } else if (response.status == "fail") {
        fails("The status hasn't been changed.");
      }
    },
  });
});
$(document).on("click", ".status-icon-role", function () {
  var role_id = $(this).data("role_id");
  $.ajax({
    url: "/organization_settings/change_status_role",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    data: {
      role_id: role_id,
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        if (response.change == false) {
          $('a.status-icon-role[data-role_id="' + role_id + '"]').html(
            '<i class="fa fa-toggle-off"></i>'
          );
          warning("The role has been disabled successfully.");
        } else {
          $('a.status-icon-role[data-role_id="' + role_id + '"]').html(
            '<i class="fa fa-toggle-on"></i>'
          );
          warning("The role has been enabled successfully.");
        }
      } else if (response.status == "fail") {
        fails("The status hasn't been changed.");
      }
    },
  });
});
$(document).on("click", ".status-icon-title", function () {
  var title_id = $(this).data("title_id");
  $.ajax({
    url: "/organization_settings/change_status_title",
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    data: {
      title_id: title_id,
    },
    dataType: "json",
    success: function (response) {
      if (response.status == "success") {
        if (response.change == false) {
          $('a.status-icon-title[data-title_id="' + title_id + '"]').html(
            '<i class="fa fa-toggle-off"></i>'
          );
          warning("The title has been disabled successfully.");
        } else {
          $('a.status-icon-title[data-title_id="' + title_id + '"]').html(
            '<i class="fa fa-toggle-on"></i>'
          );
          warning("The title has been enabled successfully.");
        }
      } else if (response.status == "fail") {
        fails("The status hasn't been changed.");
      }
    },
  });
});

$(document).on("click", ".delete-company", function () {
  $("#data_confirm_company").val($(this).data("company_id"));
  $("#modal_delete_company").modal("show");
});
$(document).on("click", ".delete-project", function () {
  $("#data_confirm_project").val($(this).data("project_id"));
  $("#modal_delete_project").modal("show");
});
$(document).on("click", ".delete-role", function () {
  $("#data_confirm_role").val($(this).data("role_id"));
  $("#modal_delete_role").modal("show");
});
$(document).on("click", ".delete-title", function () {
  $("#data_confirm_title").val($(this).data("title_id"));
  $("#modal_delete_title").modal("show");
});

$(document).on("click", "#confirm_yes_delete_company", function () {
  $.ajax({
    type: "DELETE",
    url: "/organization_settings/delete_company",
    data: {
      company_id: $("#data_confirm_company").val(),
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    success: function (response) {
      $("#modal_delete_company").modal("hide");
      if (response.status == "success") {
        setDisplay("#box_company", "#table_company", "btn-add-company");
        loadDataCompany();
        warning("The company has been deleted successfully.");
      } else {
        fails("Fails!!!.");
      }
    },
  });
});
$(document).on("click", "#confirm_yes_delete_project", function () {
  $.ajax({
    type: "DELETE",
    url: "/organization_settings/delete_project",
    data: {
      project_id: $("#data_confirm_project").val(),
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    success: function (response) {
      $("#modal_delete_project").modal("hide");
      if (response.status == "success") {
        setDisplay("#box_project", "#table_project", "btn-add-project");
        loadDataProject();
        warning("The project has been deleted successfully.");
      } else {
        fails("Fails!!!.");
      }
    },
  });
});
$(document).on("click", "#confirm_yes_delete_role", function () {
  $.ajax({
    type: "DELETE",
    url: "/organization_settings/delete_role",
    data: {
      role_id: $("#data_confirm_role").val(),
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    success: function (response) {
      $("#modal_delete_role").modal("hide");
      if (response.status == "success") {
        setDisplay("#box_role", "#table_role", "btn-add-role");
        loadDataRole();
        warning("The role has been deleted successfully.");
      } else {
        fails("Fails!!!.");
      }
    },
  });
});
$(document).on("click", "#confirm_yes_delete_title", function () {
  title_id = $(this).data("title_id");
  $.ajax({
    type: "DELETE",
    url: "/organization_settings/delete_title",
    data: {
      title_id: $("#data_confirm_title").val(),
    },
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    success: function (response) {
      $("#modal_delete_title").modal("hide");
      if (response.status == "success") {
        setDisplay("#box_title", "#table_title", "btn-add-title");
        loadDataTitle();
        warning("The title has been deleted successfully.");
      } else {
        fails("Fails!!!.");
      }
    },
  });
});

function setDisplay(id, id_header, add_class, save_class) {
  $("#box_company").css("display", "none");
  $("#box_project").css("display", "none");
  $("#box_role").css("display", "none");
  $("#box_title").css("display", "none");

  $("#table_company").css("display", "none");
  $("#table_project").css("display", "none");
  $("#table_role").css("display", "none");
  $("#table_title").css("display", "none");

  $("#table_company_wrapper").css("display", "none");
  $("#table_project_wrapper").css("display", "none");
  $("#table_role_wrapper").css("display", "none");
  $("#table_title_wrapper").css("display", "none");

  $("#btn_add").removeClass(
    "btn-add-company btn-add-project btn-add-role btn-add-title"
  );
  $("#btn_add").addClass(add_class);

  $("#btn_save").removeClass(
    "btn-save-company btn-save-project btn-save-role btn-save-title"
  );
  $("#btn_save").addClass(save_class);

  $(id).css("display", "");
  $(id_header).css("display", "");
}

function loadDataCompany(data_filter = {}) {
  $.ajax({
    url: "/organization_settings/data_company",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    success: function (response) {
      $("#table_company").DataTable().destroy();
      $("#table_company tbody").html(
        appendDataToTableCompany(response.data)
      );
      if (response.data.length > 0) {
        setupDataTable("#table_company");
      }
    },
  });
}

function appendDataToTableCompany(data) {
  tpl = ``;
  if (data.length == 0)
    return `<tr><td colspan="8" class="type-icon">No data available in table</td></tr>`;
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
           <a href="javascript:;" class="edit-company" data-id="{id}" data-name="{name}" data-abbreviation="{abbreviation}" data-phone="{phone}" data-email="{email}" data-ceo="{ceo}" data-establishment="{establishment}" data-fax="{fax}" data-website="{website}" data-address="{address}" data-desc="{desc}" data-tax_code="{tax_code}" data-note="{note}" data-quantity="{quantity}" data-email_group_staff="{email_group_staff}" data-email_group_hr="{email_group_hr}" data-email_group_fa="{email_group_fa}" data-email_group_it="{email_group_it}" data-email_group_admin="{email_group_admin}"  data-parent_company_id="{parent_company_id}" title="Edit company">
             <i class='fa fa-pencil icon' style='color:#fc9803'></i>
            </a>`.formatUnicorn({
      number: i + 1,
      id: user.id,
      name: user.name,
      abbreviation: user.abbreviation,
      establishment: user.establishment,
      phone: user.phone,
      fax: user.fax,
      email: user.email,
      website: user.website,
      address: user.address,
      desc: user.desc,
      ceo: user.ceo,
      quantity: user.quantity,
      tax_code: user.tax_code,
      note: user.note,
      email_group_staff: user.email_group_staff,
      email_group_hr: user.email_group_hr,
      email_group_fa: user.email_group_fa,
      email_group_it: user.email_group_it,
      email_group_admin: user.email_group_admin,
      parent_company_id: user.parent_company_id,
    });
    if (user.is_enabled)
      tpl += `
              <a class="action-icon status-icon-company" title="Disable/Enable company" data-company_id="{id}" href="javascript:;">
              <i class="fa fa-toggle-on"></i>
              </a>`.formatUnicorn({
        id: user.id
      });
    else
      tpl += `
              <a class="action-icon status-icon-company" title="Disable/Enable company" data-company_id="{id}" href="javascript:;">
              <i class="fa fa-toggle-off"></i>
              </a>`.formatUnicorn({
        id: user.id
      });
    if (user.is_not_used)
      tpl += `
            <a class="delete-company" title="Delete company" data-company_id="{id}" href="javascript:;">
            <i class="fa fa-trash"></i>
            </a>`.formatUnicorn({
        id: user.id
      });
      else
      tpl += `
            <a class="delete-company disabled" title="Delete company" data-company_id="{id}" href="javascript:;" >
            <i class="fa fa-trash"></i>
            </a>`.formatUnicorn({
        id: user.id
      });
    tpl += `</td></tr>`;
  });
  return tpl;
}

function loadDataProject(data_filter = {}) {
  $.ajax({
    url: "/organization_settings/data_project",
    data: {
      company_ids: data_filter.company,
    },
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    success: function (response) {
      $("#table_project").DataTable().destroy();
      $("#table_project tbody").html(
        appendDataToTableProject(response.data)
      );
      if (response.data.length > 0) {
        setupDataTable("#table_project");
      }
    },
  });
}

function appendDataToTableProject(data) {
  tpl = ``;
  if (data.length == 0)
    return `<tr><td colspan="9" class="type-icon">No data available in table</td></tr>`;
  data.forEach(function (user, i) {
    tpl += `
        <tr>
          <td class="type-number item-row number">{number}</td>
          <td class="type-text item-row company-name">{company_name}</td>
          <td class="type-text item-row name">{name}</td>
          <td class="type-text item-row establishment">{establishment}</td>
          <td class="type-text item-row project-manager">{project_manager}</td>
          <td class="type-text item-row customer">{customer}</td>
          <td class="type-text item-row email">{email}</td>
          <td class="type-number item-row quantity">{quantity}</td>
          <td class="type-icon item-row action">
          <a href="javascript:;" class="edit-project" data-id="{id}" data-company_name="{company_id}" data-name="{name}" data-abbreviation="{abbreviation}" data-establishment="{establishment}" data-closed_date="{closed_date}" data-project_manager="{project_manager}" data-customer="{customer}" data-sponsor="{sponsor}" data-email="{email}"data-quantity="{quantity}" data-desc="{desc}" data-note="{note}" title="Edit project">
             <i class='fa fa-pencil icon' style='color:#fc9803'></i>
          </a>`.formatUnicorn({
      number: i + 1,
      id: user.id,
      company_id: user.company_id,
      company_name: user.company_name,
      name: user.name,
      abbreviation: user.abbreviation,
      establishment: user.establishment,
      closed_date: user.closed_date,
      project_manager: user.project_manager,
      customer: user.customer,
      sponsor: user.sponsor,
      email: user.email,
      quantity: user.quantity,
      desc: user.desc,
      note: user.note,
    });
    if (user.is_enabled)
      tpl += `
            <a class="action-icon status-icon-project" title="Disable/Enable project" data-project_id="{id}" href="javascript:;">
            <i class="fa fa-toggle-on"></i>
            </a>`.formatUnicorn({
        id: user.id
      });
    else
      tpl += `
            <a class="action-icon status-icon-project" title="Disable/Enable project" data-project_id="{id}" href="javascript:;">
            <i class="fa fa-toggle-off"></i>
            </a>`.formatUnicorn({
        id: user.id
      });
    if (user.is_not_used)
      tpl += `
            <a class="delete-project" title="Delete project" data-project_id="{id}" href="javascript:;">
            <i class="fa fa-trash"></i>
            </a>`.formatUnicorn({
        id: user.id
      });
    else
      tpl += `
            <a class="delete-project disabled" title="Delete project" data-project_id="{id}" href="javascript:;" >
            <i class="fa fa-trash"></i>
            </a>`.formatUnicorn({
        id: user.id
      });
    tpl += `</td></tr>`;
  });
  return tpl;
}

function loadDataRole(data_filter = {}) {
  $.ajax({
    url: "/organization_settings/data_role",
    data: {
      role_ids: data_filter.role_ids,
    },
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    success: function (response) {
      $("#table_role").DataTable().destroy();
      $("#table_role tbody").html(appendDataToTableRole(response.data));
      if (response.data.length > 0) {
        setupDataTable("#table_role");
      }
    },
  });
}

function appendDataToTableRole(data) {
  tpl = ``;
  if (data.length == 0)
    return `<tr><td colspan="6" class="type-icon">No data available in table</td></tr>`;
  data.forEach(function (user, i) {
    tpl += `
        <tr>
          <td class="type-number item-row number">{number}</td>
          <td class="type-text item-row name">{name}</td>
          <td class="type-text item-row abbreviation">{abbreviation}</td>
          <td class="type-text item-row desc">{desc}</td>
          <td class="type-text item-row note">{note}</td>
          <td class="type-icon item-row action">
            <a href="javascript:;" class="edit-role" data-id="{id}" data-name="{name}" data-abbreviation="{abbreviation}" data-desc="{desc}" data-note="{note}" title="Edit role">
             <i class='fa fa-pencil icon' style='color:#fc9803'></i>
            </a>`.formatUnicorn({
      number: i + 1,
      id: user.id,
      name: user.name,
      abbreviation: user.abbreviation,
      desc: user.desc,
      note: user.note,
    });
    if (user.is_enabled)
      tpl += `
            <a class="action-icon status-icon-role" title="Disable/Enable role" data-role_id="{id}" href="javascript:;">
            <i class="fa fa-toggle-on"></i>
            </a>`.formatUnicorn({
        id: user.id
      });
    else
      tpl += `
             <a class="action-icon status-icon-role" title="Disable/Enable role" data-role_id="{id}" href="javascript:;">
             <i class="fa fa-toggle-off"></i>
             </a>`.formatUnicorn({
        id: user.id
      });
    if (user.is_not_used)
      tpl += `
            <a class="delete-role" title="Delete role" data-role_id="{id}" href="javascript:;">
            <i class="fa fa-trash"></i>
            </a>`.formatUnicorn({
        id: user.id
      });
    else
      tpl += `
            <a class="delete-role disabled" title="Delete role" data-role_id="{id}" href="javascript:;" >
            <i class="fa fa-trash"></i>
            </a>`.formatUnicorn({
        id: user.id
      });
    tpl += `</td></tr>`;
  });
  return tpl;
}

function loadDataTitle(data_filter = {}) {
  $.ajax({
    url: "/organization_settings/data_title",
    data: {
      company_ids: data_filter.company,
    },
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    success: function (response) {
      $("#table_title").DataTable().destroy();
      $("#table_title tbody").html(
        appendDataToTableTitle(response.data)
      );
      if (response.data.length > 0) {
        setupDataTable("#table_title");
      }
    },
  });
}

function appendDataToTableTitle(data) {
  tpl = ``;
  if (data.length == 0)
    return `<tr><td colspan="9" class="type-icon">No data available in table</td></tr>`;

  data.forEach(function (user, i) {
    tpl += `
        <tr>
          <td class="type-number item-row number">{number}</td>
          <td class="type-text item-row role-name">{role_name}</td>
          <td class="type-text item-row title-name">{name}</td>
          <td class="type-text item-row abbreviation">{abbreviation}</td>
          <td class="type-number item-row rank">{rank}</td>
          <td class="type-text item-row desc">{desc}</td>
          <td class="type-text item-row note">{note}</td>
          <td class="type-icon item-row action">
            <a href="javascript:;" class="edit-title" data-id="{id}" data-role_id="{role_id}" data-role_name="{role_name}" data-name="{name}" data-abbreviation="{abbreviation}" data-rank="{rank}" data-desc="{desc}" data-note="{note}" title="Edit title">
             <i class='fa fa-pencil icon' style='color:#fc9803'></i>
            </a>`.formatUnicorn({
      number: i + 1,
      id: user.id,
      role_id: user.role_id,
      role_name: user.role_name,
      name: user.name,
      abbreviation: user.abbreviation,
      rank: user.rank,
      desc: user.desc,
      note: user.note,
    });
    if (user.is_enabled)
      tpl += `
             <a class="action-icon status-icon-title" title="Disable/Enable title" data-title_id="{id}" href="javascript:;">
             <i class="fa fa-toggle-on"></i>
             </a>`.formatUnicorn({
        id: user.id
      });
    else
      tpl += `
             <a class="action-icon status-icon-title" title="Disable/Enable title" data-title_id="{id}" href="javascript:;">
             <i class="fa fa-toggle-off"></i>
             </a>`.formatUnicorn({
        id: user.id
      });
    if (user.is_not_used)
      tpl += `
            <a class="delete-title" title="Delete title" data-title_id="{id}" href="javascript:;">
            <i class="fa fa-trash"></i>
            </a>`.formatUnicorn({
        id: user.id
      });
    else
      tpl += `
            <a class="delete-title disabled" title="Delete title" data-title_id="{id}" href="javascript:;" >
            <i class="fa fa-trash"></i>
            </a>`.formatUnicorn({
        id: user.id
      });
    tpl += `</td></tr>`;
  });
  return tpl;
}

function loadCompanyName(data_filter = {}) {
  $.ajax({
    url: "/organization_settings/data_load_company",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    success: function (response) {
      tpl = `<option></option>`;
      response.forEach((element) => {
        tpl += `<option value=` + element[0] + `>` + element[1] + `</option>`;
      });
      $(".project-company-name").html(tpl);
      $(".company-parent-company-id").html(tpl);
    },
  });
}

function loadRoleName(data_filter = {}) {
  $.ajax({
    url: "/organization_settings/data_load_role",
    data: data_filter,
    type: "POST",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    success: function (response) {
      tpl = `<option></option>`;
      response.forEach((element) => {
        tpl += `<option value=` + element[0] + `>` + element[1] + `</option>`;
      });
      $(".title-role-name").html(tpl);
    },
  });
}

function setupDataTable(id, last_column_no = 10) {
  var table = $(id).DataTable({
    "bLengthChange": false,
    "bFilter": false,
    "bAutoWidth": false,
    "destroy": true,
    "columnDefs": [{
      "searchable": false,
      "orderable": false,
      "targets": 0,
    }, ],
    "order": [
      [1, "asc"]
    ],
  });

  table.on("order.dt search.dt", function () {
    table.column(0, {
        search: "applied",
        order: "applied"
      })
      .nodes().each(function (cell, i) {
        cell.innerHTML = i + 1;
      });
  }).draw();
}

$(".company-name").keyup(function () {
  $(".message-company-name .error-company").remove();
  if ($(".company-name").val().length < 1) {
    $(".company-name").after(
      '<span class="error-company">Please enter Company Name</span>'
    );
  } else if ($(".company-name").val().length > 255 || $(".company-name").val().length < 2) {
    $(".company-name").after(
      '<span class="error-company">‘Please enter Company Name with characters from 2 to 255 characters.</span>'
    );
  }
})
$(".company-establishment").change(function () {
  $(".message-company-establishment .error-company").remove();
  if ($(".company-establishment").val().length < 1) {
    $(".company-establishment").after(
      '<span class="error-company">Please enter Establishment</span>'
    );
  }
})
$(".company-phone").keyup(function () {
  $(".message-company-phone .error-company").remove();
  if ($(".company-phone").val().length < 1) {
    $(".company-phone").after(
      '<span class="error-company">Please enter Phone</span>'
    );
  } else if ($(".company-phone").val().length > 12 || $(".company-phone").val().length < 10) {
    $(".company-phone").after(
      '<span class="error-company">Please enter Phone with characters from 10 to 12 characters.</span>'
    );
  }
})
$(".company-email").keyup(function () {
  $(".message-company-email .error-company").remove();
  if ($(".company-email").val().length < 1) {
    $(".company-email").after(
      '<span class="error-company">Please enter Email</span>'
    );
  } else if ($(".company-email").val().length > 255) {
    $(".company-email").after(
      '<span class="error-company">Maximum length is 255 characters.</span>'
    );
  } else {
    var valid_email = regEx.test($(".company-email").val());
    if (!valid_email) {
      $(".company-email").after(
        '<span class="error-company">Please enter a valid email address. For example: abc@domain.com.</span>'
      );
    }
  }
})
$(".company-address").keyup(function () {
  $(".message-company-address .error-company").remove();
  if ($(".company-address").val().length < 1) {
    $(".company-address").after(
      '<span class="error-company">Please enter Address</span>'
    );
  } else if ($(".company-address").val().length > 255) {
    $(".company-address").after(
      '<span class="error-company">Maximum length is 255 characters.</span>'
    );
  }
})
$(".company-ceo").keyup(function () {
  $(".message-company-ceo .error-company").remove();
  if ($(".company-ceo").val().length < 1) {
    $(".company-ceo").after(
      '<span class="error-company">Please enter CEO</span>'
    );
  } else if ($(".company-address").val().length > 255) {
    $(".company-address").after(
      '<span class="error-company">Maximum length is 255 characters.</span>'
    );
  }
})
$(".company-email-group-staff").keyup(function () {
  $(".message-company-email-group-staff .error-company").remove();
  if ($(".company-email-group-staff").val().length > 0) {
    var valid_email = regEx.test($(".company-email-group-staff").val());
    if (!valid_email) {
      $(".company-email-group-staff").after(
        '<span class="error-company">Please enter a valid email address. For example: abc@domain.com.</span>'
      );
    } else if ($(".company-email-group-staff").val().length > 255) {
      $(".company-email-group-staff").after(
        '<span class="error-company">Maximum length is 255 characters.</span>'
      );
    }
  }
})
$(".company-email-group-hr").keyup(function () {
  $(".message-company-email-group-hr .error-company").remove();
  if ($(".company-email-group-hr").val().length > 0) {
    var valid_email = regEx.test($(".company-email-group-hr").val());
    if (!valid_email) {
      $(".company-email-group-hr").after(
        '<span class="error-company">Please enter a valid email address. For example: abc@domain.com.</span>'
      );
    } else if ($(".company-email-group-hr").val().length > 255) {
      $(".company-email-group-hr").after(
        '<span class="error-company">Maximum length is 255 characters.</span>'
      );
    }
  }
})
$(".company-email-group-fa").keyup(function () {
  $(".message-company-email-group-fa .error-company").remove();
  if ($(".company-email-group-fa").val().length > 0) {
    var valid_email = regEx.test($(".company-email-group-fa").val());
    if (!valid_email) {
      $(".company-email-group-fa").after(
        '<span class="error-company">Please enter a valid email address. For example: abc@domain.com.</span>'
      );
    } else if ($(".company-email-group-fa").val().length > 255) {
      $(".company-email-group-fa").after(
        '<span class="error-company">Maximum length is 255 characters.</span>'
      );
    }
  }
})
$(".company-email-group-it").keyup(function () {
  $(".message-company-email-group-it .error-company").remove();
  if ($(".company-email-group-it").val().length > 0) {
    var valid_email = regEx.test($(".company-email-group-it").val());
    if (!valid_email) {
      $(".company-email-group-it").after(
        '<span class="error-company">Please enter a valid email address. For example: abc@domain.com.</span>'
      );
    } else if ($(".company-email-group-it").val().length > 255) {
      $(".company-email-group-it").after(
        '<span class="error-company">Maximum length is 255 characters.</span>'
      );
    }
  }
})
$(".company-email-group-admin").keyup(function () {
  $(".message-company-email-group-admin .error-company").remove();
  if ($(".company-email-group-admin").val().length > 0) {
    var valid_email = regEx.test($(".company-email-group-admin").val());
    if (!valid_email) {
      $(".company-email-group-admin").after(
        '<span class="error-company">Please enter a valid email address. For example: abc@domain.com.</span>'
      );
    } else if ($(".company-email-group-admin").val().length > 255) {
      $(".company-email-group-admin").after(
        '<span class="error-company">Maximum length is 255 characters.</span>'
      );
    }
  }
})
$(".company-desc").keyup(function () {
  $(".message-company-desc .error-company").remove();
  if ($(".company-desc").val().length > 500) {
    $(".company-desc").after(
      '<span class="error-company">Maximum length is 500 characters.</span>'
    );
  }
})
$(".company-note").keyup(function () {
  $(".message-company-note .error-company").remove();
  if ($(".company-note").val().length > 500) {
    $(".company-note").after(
      '<span class="error-company">Maximum length is 500 characters.</span>'
    );
  }
})

$(".project-company-name").change(function () {
  $(".message-project-company-name .error-project").remove();
  if ($(".project-company-name").val().length < 1) {
    $(".project-company-name").after(
      '<span class="error-project">Please enter Company Name</span>'
    );
  }
})
$(".project-name").keyup(function () {
  $(".message- .error-project").remove();
  $(".message-project-name .error-project").remove();
  if ($(".project-name").val().length < 1) {
    $(".project-name").after(
      '<span class="error-project">Please enter Project Name</span>'
    );
  } else if ($(".project-name").val().length > 255) {
    $(".project-name").after(
      '<span class="error-project">Maximum length is 255 characters.</span>'
    );
  }
})
$(".project-establishment").change(function () {
  $(".message-project-establishment .error-project").remove();
  if ($(".project-establishment").val().length > 255) {
    $(".project-establishment").after(
      '<span class="error-project">Maximum length is 255 characters.</span>'
    );
  }
})


$(".project-manager").keyup(function () {
  $(".message-project-manager .error-project").remove();
  if ($(".project-manager").val().length < 1) {
    $(".project-manager").after(
      '<span class="error-project">Please enter Project Manager</span>'
    );
  } else if ($(".project-manager").val().length > 255) {
    $(".project-manager").after(
      '<span class="error-project">Maximum length is 255 characters.</span>'
    );
  }
})
$(".project-email").keyup(function () {
  $(".message-project-email .error-project").remove();
  if ($(".project-email").val().length > 255) {
    $(".project-email").after(
      '<span class="error-project">Maximum length is 255 characters.</span>'
    );
  } else if ($(".project-email").val().length > 1) {
    var valid_email = regEx.test($(".project-email").val());
    if (!valid_email) {
      $(".project-email").after(
        '<span class="error-project">Please enter a valid email address. For example: abc@domain.com.</span>'
      );
    } else if ($(".project-email").val().length > 255) {
      $(".project-email").after(
        '<span class="error-project">Maximum length is 255 characters.</span>'
      );
    }
  }
})
$(".project-note").keyup(function () {
  $(".message-project-note .error-project").remove();
  if ($(".project-note").val().length > 500) {
    $(".project-note").after(
      '<span class="error-project">Maximum length is 500 characters.</span>'
    );
  }
})
$(".project-desc").keyup(function () {
  $(".message-project-desc .error-project").remove();
  if ($(".project-desc").val().length > 500) {
    $("project-desc").after(
      '<span class="error-project">Maximum length is 500 characters.</span>'
    );
  }
})
$(".project-abbreviation").keyup(function () {
  $(".message-project-abbreviation .error-project").remove();
  if ($(".project-abbreviation").val().length > 255) {
    $(".project-abbreviation").after(
      '<span class="error-project">Maximum length is 255 characters.</span>'
    );
  }
})
$(".project-customer").keyup(function () {
  $(".message-project-customer .error-project").remove();
  if ($(".project-customer").val().length > 255) {
    $(".project-customer").after(
      '<span class="error-project">Maximum length is 255 characters.</span>'
    );
  }
})
$(".project-sponsor").keyup(function () {
  $(".message-project-sponsor .error-project").remove();
  if ($(".project-sponsor").val().length > 255) {
    $(".project-sponsor").after(
      '<span class="error-project">Maximum length is 255 characters.</span>'
    );
  }
})

$(".role-name").keyup(function () {
  $(".message-role-name .error-role").remove();
  if ($(".role-name").val().length < 1) {
    $(".role-name").after(
      '<span class="error-role">Please enter Role Name</span>'
    );
  } else if ($(".role-name").val().length > 255) {
    $(".role-name").after(
      '<span class="error-role">Maximum length is 255 characters.</span>'
    );
  }
})
$(".role-note").keyup(function () {
  $(".message-role-note .error-role").remove();
  if ($(".role-note").val().length > 500) {
    $(".role-note").after(
      '<span class="error-role">Maximum length is 500 characters.</span>'
    );
  }
})
$(".role-desc").keyup(function () {
  $(".message-role-desc .error-role").remove();
  if ($(".role-desc").val().length > 500) {
    $(".role-desc").after(
      '<span class="error-role">Maximum length is 500 characters.</span>'
    );
  }
})
$(".role-abbreviation").keyup(function () {
  $(".message-role-abbreviation .error-role").remove();
  if ($(".role-abbreviation").val().length > 255) {
    $(".role-abbreviation").after(
      '<span class="error-role">Maximum length is 255 characters.</span>'
    );
  }
})

$(".title-role-name").change(function () {
  $(".message-title-role-name .error-title").remove();
  if ($(".title-role-name").val().length < 1) {
    $(".title-role-name").after(
      '<span class="error-title">Please enter Role Name</span>'
    );
  } else if ($(".title-role-name").val().length > 255) {
    $(".title-role-name").after(
      '<span class="error-title">Maximum length is 255 characters.</span>'
    );
  }
})
$(".title-name").keyup(function () {
  $(".message-title-name .error-title").remove();
  if ($(".title-name").val().length < 1) {
    $(".title-name").after(
      '<span class="error-title">Please enter Title Name</span>'
    );
  } else if ($(".title-name").val().length > 255) {
    $(".title-name").after(
      '<span class="error-title">Maximum length is 255 characters.</span>'
    );
  }
})
$(".title-rank").keyup(function () {
  $(".message-title-rank .error-title").remove();
  if ($(".title-rank").val().length < 1) {
    $(".title-rank").after(
      '<span class="error-title">Please enter Rank</span>'
    );
  } else if ($(".title-rank").val().length > 10) {
    $(".title-rank").after(
      '<span class="error-title">Please enter less than 10 character</span>'
    );
  }
})
$(".title-desc").keyup(function () {
  $(".message-title-desc .error-title").remove();
  if ($(".title-desc").val().length > 500) {
    $(".title-desc").after(
      '<span class="error-title">Maximum length is 500 characters.</span>'
    );
  }
})
$(".title-note").keyup(function () {
  $(".message-title-note .error-title").remove();
  if ($(".title-note").val().length > 500) {
    $(".title-note").after(
      '<span class="error-title">Maximum length is 500 characters.</span>'
    );
  }
})
$(".title-abbreviation").keyup(function () {
  $(".message-title-abbreviation .error-title").remove();
  if ($(".title-abbreviation").val().length > 255) {
    $(".title-abbreviation").after(
      '<span class="error-title">Maximum length is 255 characters.</span>'
    );
  }
})