$(document).ready(function() {
    $(".left-panel-competency").hide();
    $("#body-row .collapse").collapse("hide");
    drawColorTitleFormPreviewResult(3, 9, "#FAD7A0");
    drawColorTitleFormPreviewResult(10, 16, "#d4f6ff");
    drawColorTitleFormPreviewResult(17, 23, "#feffd4");
    drawColorTitleFormPreviewResult(24, 30, "#d4f6ff");
    drawColorTitleFormPreviewResult(31, 37, "#FAD7A0");

    $("[data-toggle=sidebar-colapse]").click(function() {
        SidebarCollapse();

    });

    function drawColorTitleFormPreviewResult(start, end, color) {
        for (i = start; i <= end; i++) {
            $(".table-preview-result thead tr td:nth-child(" + i + ")").css(
                "background-color",
                color
            );
        }
    }

    function SidebarCollapse() {
        $("#sidebar-container").toggleClass("sidebar-expanded sidebar-collapsed");
        if ($(".card").is(":visible")) {
            $(".card").hide();
            $("#accordion table").hide();
            $(".left-panel-competency").show();
        } else {
            $(".card").show();
            $("#accordion table").show();
            $(".left-panel-competency").hide();
        }
        $("#collapse-icon").toggleClass(
            "fa-angle-double-left fa-angle-double-right"
        );
    }
    // filter
    $("#filter-form-slots").multiselect({});
    $(".filter-slots .multiselect-selected-text").hide();
    // $('.filter-slots ul li').addClass('active');
});

function loadDataPanel(form_id) {
    data = {}
    if (form_id)
        data.form_id = form_id;
    else if (title_history_id)
        data.title_history_id = title_history_id;
    $.ajax({
        type: "POST",
        url: "/forms/get_competencies/",
        headers: {
            "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
        },
        data: data,
        dataType: "json",
        success: function(response) {
            var temp = '';
            var i = 0;
            for (competency in response) {
                temp += ` <div class="card">
                            <div class="card-header">
                                <table class="table table-primary table-responsive-sm table-mytable table${i}">
                                    <thead>
                                        <tr class="d-flex" data-target="#collapse${i}" id="card${i}" data-id-competency="${response[competency].id}">
                                            <td class="col-2">${response[competency].type}</td>
                                            <td class="col-7" style=" padding-right: 10px; padding-left: 10px; text-align: left">  
                                            ${competency}
                                            </td>
                                            <td class="col-3">1</td>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div id="collapse${i}" class="collapse" data-parent="#accordion" data-competency-id="${response[competency].id}">
                                <div class="card-body">
                                    <div class="competency">
                                        <table class="table table-primary table-responsive-sm table-mytable table-left-panel">
                                            <tbody>`
                var l = '';
                var levels = response[competency].levels
                for (level in levels) {
                    l += ` <tr class="d-flex">
                                <td class="col-2"></td>
                                <td class="col-7">Level ${level}</td>
                                <td class="col-3">${levels[level].current}/${levels[level].total}</td>
                            </tr>`
                }
                temp += l
                temp += `           </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>`
                i += 1;
            };
            $('#competency_panel').html(temp);
            $(".card table thead tr").click(function() {
                $(".collapse").removeClass("show");
                $(".card-header table tr").css("background-color", "#bbcbea");
                id = $(this).data("target");
                $(id).addClass("show");
                num = id.split("#collapse");
                $(".table" + Number(num[1]) + " tr").css("background-color", "#7ba2ed");
            });
            $('#card0').click()
        }
    });
}

function resize_textarea() {
    $(".autoresizing").on("input", function() {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    });

    $(".autoresizing").each((i, el) => {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    })

}

function check(x, y) {
    if (x == y)
        return "selected"
    return ""
}

function checkCommmit(is_commit) {
    if (is_commit)
        return "selected"
    return ""
}

function checkUncommmit(is_commit) {
    if (!is_commit)
        return "selected"
    return ""
}

function checkReviewer(reviewers) {
    for (i = 0; i < reviewers.length; i++) {
        if (reviewers[i].flag == "yellow") {
            var a = "";
            if (reviewers[i].given_point == 5)
                a = "Outstanding";
            if (reviewers[i].given_point == 4)
                a = "Exceeds Expectations";
            if (reviewers[i].given_point == 3)
                a = "Meets Expectations";
            if (reviewers[i].given_point == 2)
                a = "Needs Improvement";
            if (reviewers[i].given_point == 1)
                a = "Does Not Meet Minimun Standards";

            return [reviewers[i].name, a, reviewers[i].recommends]
        }
    }
    return ""
}

function getValueStringPoint(point) {
    switch (point) {
        case 1:
            return "1 - Does Not Meet Minimun Standards";
        case 2:
            return "2 - Needs Improvement";
        case 3:
            return "3 - Meets Expectations";
        case 4:
            return "4 - Exceeds Expectations";
        case 5:
            return "5 - Outstanding";
    }
}

function checkDisableFormSlotsStaff(is_reviewer, user_id) {
    if (is_reviewer == false)
        return "disabled"
    else
        return checkDisableFormSlotsUser(user_id);
}

function checkDisableFormSlotsReviewer(is_reviewer) {
    if (is_reviewer == true)
        return "disabled"
    else
        return ""
}

function checkDisableFormSlotsUser(user_id) {
    if (user_id != user_current)
        return "disabled"
    else
        return ""
}

function loadDataSlots(response) {
    var temp = "";
    $(response).each(function(i, e) {
        length = e.tracking.recommends == undefined ? 0 : e.tracking.recommends.length;
        rowspan = length || 1;
        flag = ""
        class_flag = "flag-red"
        for (i in e.tracking.recommends) {
            if (e.tracking.recommends[i].flag == "yellow") {
                flag = "yellow";
                class_flag = "flag-yellow";
                break
            } else if (e.tracking.recommends[i].flag == "green") {
                flag = "green";
                class_flag = "flag-green";
                break
            }
        }
        temp += ` 
        <tr id="${e.id}" class="tr_slot">
            <td style="text-align:cent<Slot ID>er" rowspan="${rowspan}">${e.slot_id}</td>
            <td style="position: relative;" rowspan="${rowspan}">
                <div>${e.desc}</div>
                <br>
                <div id="slot_description_${e.slot_id}" style="display: none;">${e.evidence}</div>
                <br>
                <a id="${e.slot_id}" class="line-slot" href="javascript:void(0)" style="bottom:0; left:0; position: absolute;">View Details</a>
            </td>
            <td class="${checkDisableFormSlotsReviewer(is_reviewer)}" colspan="2" rowspan="${rowspan}">
                <select class="commit-select" ${checkDisableFormSlotsReviewer(is_reviewer)}>
                    <option value="true" ${checkCommmit(e.tracking.is_commit)}>Commit</option>
                    <option value="fasle" ${checkUncommmit(e.tracking.is_commit)}>Uncommit</option>
                </select>
            </td>
            <td class="${checkDisableFormSlotsReviewer(is_reviewer)}" colspan="4" rowspan="${rowspan}">
                <select class="point-select" ${checkDisableFormSlotsReviewer(is_reviewer)}>
                    <option></option> 
                    <option value="5" ${check(e.tracking.point, 5)}>5 - Outstanding</option>
                    <option value="4" ${check(e.tracking.point, 4)}>4 - Exceeds Expectations</option>
                    <option value="3" ${check(e.tracking.point, 3)}>3 - Meets Expectations</option>
                    <option value="2" ${check(e.tracking.point, 2)}>2 - Needs Improvement</option>
                    <option value="1" ${check(e.tracking.point, 1)}>1 - Does Not Meet Minimun Standards</option>
                </select>
            </td>
            <td class="${checkDisableFormSlotsReviewer(is_reviewer)}" colspan="5" rowspan="${rowspan}"><textarea class="evidence autoresizing" ${checkDisableFormSlotsReviewer(is_reviewer)}>${e.tracking.evidence}</textarea></td>`;
        if (length != 0) {
            temp += `
                <td class="${checkDisableFormSlotsStaff(is_reviewer,e.tracking.recommends[0].user_id)}" colspan="2" >
                    <textarea style="resize:none" ${checkDisableFormSlotsStaff(is_reviewer,e.tracking.recommends[0].user_id)}>${e.tracking.recommends[0].recommends}</textarea>
                </td>
                <td class="${checkDisableFormSlotsStaff(is_reviewer,e.tracking.recommends[0].user_id)}">
                    <select class="given-point-select" ${checkDisableFormSlotsStaff(is_reviewer,e.tracking.recommends[0].user_id)}>
                        <option></option>
                        <option value="5" ${check(e.tracking.recommends[0].given_point, 5)}>5 - Outstanding</option>
                        <option value="4" ${check(e.tracking.recommends[0].given_point, 4)}>4 - Exceeds Expectations</option>
                        <option value="3" ${check(e.tracking.recommends[0].given_point, 3)}>3 - Meets Expectations</option>
                        <option value="2" ${check(e.tracking.recommends[0].given_point, 2)}>2 - Needs Improvement</option>
                        <option value="1" ${check(e.tracking.recommends[0].given_point, 1)}>1 - Does Not Meet Minimun Standards</option>
                    </select>
                </td>flag
                <td class="disabled" ><textarea style="resize:none" disabled>${e.tracking.recommends[0].name}</textarea></td>`;
        } else {
            temp += `
                <td class="disabled" colspan="2" ><textarea style="resize:none" disabled></textarea></td>
                <td class="disabled" >
                    <select class="given-point-select" disabled>
                        <option></option>
                    </select>
                </td>
                <td class="disabled"><textarea style="resize:none" disabled></textarea></td>`;
        }
        temp += `<td rowspan="${rowspan}">
                    <a href="javascript:void(0)" style="color:green;" class="icon modal-view-assessment-history" data-id="${e.id}" data-slot-id="${e.slot_id}"><i class="fas fa-history"></i></a>
                    </br>
                    <a href="javascript:void(0)" class="flag-cds-assessment icon ${class_flag}" data-click="${flag}" data-form-slot-id="${e.tracking.id}" data-slot-id="${e.id}" ><i style="color: ${e.tracking.flag};" class="far fa-flag"></i></a>
                    </br>`;
        if (e.tracking.is_passed)
            temp += `<a href="javascript:void(0)" class="icon modal-view-re-assess" data-id="${e.id}" data-slot-id="${e.slot_id}"><i class="fas fa-redo-alt"></i></a>`;
        else
            temp += `<a href="javascript:void(0)" style="color:gray;" class="icon"><i class="fas fa-redo-alt"></i></a>`
        temp += `</td></tr>`;

        if (length > 1) {
            for (i = 1; i < length; i++) {
                temp += `
                    <tr>
                        <td class="${checkDisableFormSlotsStaff(is_reviewer,e.tracking.recommends[i].user_id)}" colspan="2" ><textarea style="resize:none"  ${checkDisableFormSlotsStaff(is_reviewer,e.tracking.recommends[i].user_id)}>${e.tracking.recommends[i].recommends}</textarea></td>
                        <td class="${checkDisableFormSlotsStaff(is_reviewer,e.tracking.recommends[i].user_id)}" >
                            <select class="given-point-select" ${checkDisableFormSlotsStaff(is_reviewer,e.tracking.recommends[i].user_id)}>
                                <option></option>
                                <option value="5" ${check(e.tracking.recommends[i].given_point, 5)}>5 - Outstanding</option>
                                <option value="4" ${check(e.tracking.recommends[i].given_point, 4)}>4 - Exceeds Expectations</option>
                                <option value="3" ${check(e.tracking.recommends[i].given_point, 3)}>3 - Meets Expectations</option>
                                <option value="2" ${check(e.tracking.recommends[i].given_point, 2)}>2 - Needs Improvement</option>
                                <option value="1" ${check(e.tracking.recommends[i].given_point, 1)}>1 - Does Not Meet Minimun Standards</option>
                            </select>
                        </td>
                        <td class="${checkDisableFormSlotsStaff(is_reviewer,e.tracking.recommends[i].user_id)}" ><textarea style="resize:none" disabled>${e.tracking.recommends[i].name}</textarea></td>
                    </tr>`;
            }
        }

    });
    if (jQuery.isEmptyObject(response)) {
        temp = '<td colspan="18" style="text-align:center">No data available in table</td>';
    }
    $('.csd-assessment-table table tbody').html(temp);
    resize_textarea();
}

$(document).on("click", ".line-slot", function() {
    if (document.getElementById("slot_description_" + this.id).style.display == "block") {
        document.getElementById("slot_description_" + this.id).style.display = "none";
        document.getElementById(this.id).innerText = "ViewDetails";
    } else {
        document.getElementById("slot_description_" + this.id).style.display = "block";
        document.getElementById(this.id).innerText = "Hide Details";
    }
});

// left panel 
$(document).on("click", ".card table thead tr", function() {
    var data = getParams();
    if (form_id)
        data.form_id = form_id;
    else if (title_history_id)
        data.title_history_id = title_history_id;

    $.ajax({
        type: "POST",
        url: "/forms/get_cds_assessment",
        data: data,
        headers: {
            "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
        },
        dataType: "json",
        success: function(response) {
            loadDataSlots(response);
            checkStatusFormStaff(status);
        }
    });
});

$(document).on("click", ".modal-view-assessment-history", function() {
    $('#modal_history_assessment').modal('show');
    var slot_id = $(this).data("slot-id");
    var id = $(this).data("id");
    id = $(".card").find('.show').attr('id').split("collapse");
    competency_name = $('.card .card-header .table' + id[1] + ' thead tr td:nth-child(2)').text();
    competency_name = $.trim(competency_name);
    $('#assessment_history_competency_name').text(competency_name);
    $('#assessment_history_slot_id').text(slot_id);
    $.ajax({
        type: "POST",
        url: "/forms/get_cds_histories",
        data: {
            form_slot_id: $(this).data("id")
        },
        headers: {
            "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
        },
        dataType: "json",
        success: function(response) {
            temp = '';
            if (jQuery.isEmptyObject(response)) {
                temp = `
                    <tr>
                        <td colspan="7" style="text-align:center">No data available in table</td>
                    </tr>`;
                $("#modal_history_assessment table").removeClass("table-responsive");
            }
            for (i in response) {
                length = response[i].recommends.length;
                temp += `
                <tr>
                    <td rowspan="${length}">${i}</td>
                    <td rowspan="${length}">${getValueStringPoint(response[i].point)}</td>
                    <td rowspan="${length}">${response[i].evidence}</td>
                    <td>${response[i].recommends[0].recommends}</td>
                    <td>${getValueStringPoint(response[i].recommends[0].given_point)}</td>
                    <td>${response[i].recommends[0].name}</td>
                    <td>${response[i].recommends[0].reviewed_date}</td>
                </tr> `;
                for (x = 1; x < length; x++) {
                    temp += `
                <tr>
                    <td>${response[i].recommends[x].recommends}</td>
                    <td>${getValueStringPoint(response[i].recommends[x].given_point)}</td>
                    <td>${response[i].recommends[x].name}</td>
                    <td>${response[i].recommends[x].reviewed_date}</td>
                </tr>`;
                }
            };
            $('.table-view-assessment-history tbody').html(temp);
        }
    });
});

function getParams() {
    var data = {
        competency_id: $('#competency_panel').find('.show').data('competency-id'),
        search: $(".search-assessment").val(),
        filter: ""
    }
    filter = [];
    $('#filter-form-slots :selected').each(function(i, sel) {
        filter.push($(sel).val())
    });
    data.filter = filter.join();
    return data;
}


function checkStatusFormStaff(status) {
    switch (status) {
        case "New":
            break;
        case "Done":
            $("a.preview-result i").css("color", "#ccc");
            $('a.preview-result')[0].href = "#";
            $('a.preview-result')[0].target = "";
            $("a.submit-assessment .fa-file-import").css("color", "#ccc");
            $('a.submit-assessment').removeClass('submit-assessment');
            $('.tr_slot td:nth-child(3),.tr_slot td:nth-child(4),.tr_slot td:nth-child(5)').addClass('disabled');
            $('.tr_slot td:nth-child(3) select,.tr_slot td:nth-child(4) select').prop('disabled', 'disabled');
            $('.tr_slot td:nth-child(5) textarea').prop('disabled', 'disabled');
            break;
        case "Awaiting Review":
            $("a.submit-assessment .fa-file-import").css("color", "#ccc");
            $('a.submit-assessment').removeClass('submit-assessment');
            $('.tr_slot td:nth-child(3),.tr_slot td:nth-child(4),.tr_slot td:nth-child(5)').addClass('disabled');
            $('.tr_slot td:nth-child(3) select,.tr_slot td:nth-child(4) select').prop('disabled', 'disabled');
            $('.tr_slot td:nth-child(5) textarea').prop('disabled', 'disabled');
            break;
    }
}

function checkStatusFormReview(status) {
    switch (status) {
        case "New":
            // $('a.submit-assessment').addClass('submit-assessment');
            break;
        case "Awaiting Review":
            // $("a.submit-assessment .fa-file-import").css("color","#ccc");
            // $('a.submit-assessment').removeClass('submit-assessment');
            break;
    }
}

$(document).on("change", ".search-assessment", function() {
    var data = getParams();
    if (form_id)
        data.form_id = form_id;
    else if (title_history_id)
        data.title_history_id = title_history_id;

    $.ajax({
        type: "POST",
        url: "/forms/get_cds_assessment",
        data: data,
        headers: {
            "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
        },
        dataType: "json",
        success: function(response) {
            loadDataSlots(response);
        }
    });
});



$(document).on("change", "#filter-form-slots", function() {
    var data = getParams();
    if (form_id)
        data.form_id = form_id;
    else if (title_history_id)
        data.title_history_id = title_history_id;

    $.ajax({
        type: "POST",
        url: "/forms/get_cds_assessment",
        data: data,
        headers: {
            "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
        },
        dataType: "json",
        success: function(response) {
            loadDataSlots(response);
        }
    });
});


$(document).on("change", ".csd-assessment-table table tbody .tr_slot", function() {
    if ($(this).find('.point-select').val().length > 0 && $(this).find('.evidence').val().length > 0) {
        var slot_id = $(this)[0].id;
        var is_commit = $(this).find('.commit-select').val();
        var point = $(this).find('.point-select').val();
        var evidence = $(this).find('.evidence').val();
        temp = $(this).children('td:nth-child(1)').text();
        $.ajax({
            type: "POST",
            url: "/forms/save_cds_assessment_staff",
            data: {
                form_id: form_id,
                is_commit: is_commit,
                point: parseInt(point),
                evidence: evidence,
                slot_id: slot_id,
            },
            headers: {
                "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
            },
            success: function(response) {
                
                current = $('div.show table tr:nth-child('+temp.charAt(0)+') td:nth-child(3)').text().split('/');
                max = parseInt(current[1]);
                current_change = 0
                $('div.csd-assessment-table table tbody tr.tr_slot').each(function(i, sel) {
                    level = $(this).children('td:nth-child(1)').text();
                    index = i + 1
                    val = $('div.csd-assessment-table table tbody tr:nth-child('+index+') td:nth-child(4) select option:selected').val();
                    if (level.charAt(0) == temp.charAt(0) && val != "") 
                        current_change += 1;
                });
                if (current_change <= max)
                    current_change = current_change;
                else 
                    current = max;
                $('div.show table tr:nth-child('+temp.charAt(0)+') td:nth-child(3)').text(current_change + '/' + max);
            }
        });
    }
});

$(document).on("click", ".submit-assessment", function() {
    $('#modal_period').modal('show');
});

$(document).on("click", "#confirm_submit_cds", function() {
    $.ajax({
        type: "POST",
        url: "/forms/submit",
        data: {
            form_id: form_id,
            period_id: parseInt($('#modal_period #period_id').val())
        },
        headers: {
            "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
        },
        dataType: "json",
        success: function(response) {
            $('#modal_period').modal('hide');
            if (response.status == "success") {
                success("This CDS for " + $("#modal_period #period_id option:selected").text() + " has been submit successfully.");
                $("a.submit-assessment .fa-file-import").css("color", "#ccc");
                $('a.submit-assessment').removeClass('submit-assessment');
                checkStatusFormStaff(status)
            } else {
                fails("Can't submit CDS.");
            }
        }
    });
});
// approve cds
$(document).on("click", "#confirm_yes_approve_cds", function() {
    $('#modal_approve_cds').modal('hide');
    $.ajax({
        type: "POST",
        url: "/forms/approve_cds",
        data: {
            form_id: form_id,
        },
        headers: {
            "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
        },
        dataType: "json",
        success: function(response) {
            if (response.status == "success") {
                success("This CDS has been approve successfully.");
            } else {
                fails("Can't approve CDS.");
            }
        }
    });
});
$(document).on("click", ".flag-cds-assessment", function() {
    if ($(this).data("click") != "yellow")
        return;
    var form_slot_id = $(this).data("form-slot-id");
    var slot_id = $(this).data("slot-id");

    $.ajax({
        type: "POST",
        url: "/forms/get_data_slot",
        data: {
            form_slot_id: form_slot_id,
        },
        headers: {
            "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
        },
        dataType: "json",
        success: function(response) {
            $('#modal_add_more_evidence').modal('show');
            $('#add_more_evidence_competency_name').text(response.competency_name);
            $('#add_more_evidence_slot_id').text(response.slot_id);
            $('#add_more_evidence_slot_desc').text(response.slot_desc);
            $('#add_more_evidence_evidence_guildeline').text(response.slot_evidence);
            $('#add_more_evidence_reviewer').text(response.reviewer_name);
            $('#add_more_evidence_out').text(response.line_given_point);
            $('#add_more_evidence_recommends').text(response.line_recommends);
            $('#add_more_evidence_commit option[value=' + response.comment_is_commit + ']').prop("selected", true);
            $('#add_more_evidence_self_assessment option[value=' + response.comment_point + ']').prop("selected", true);
            $('#add_more_evidence_evidence').text(response.comment_evidence);
            $('#add_more_evidence_id').val(slot_id);
        }
    });
});

$(document).on("click", "#btn_save", function() {
    if ($('#add_more_evidence_commit').find('.commit-select').val() == "0")
        is_commit = false
    else
        is_commit = true
    point = $('#add_more_evidence_self_assessment').find('.point-select').val();
    evidence = $('#add_more_evidence_evidence').val();
    slot_id = $('#add_more_evidence_id').val();
    competancename = $('#add_more_evidence_competency_name').text();
    $.ajax({
        type: "POST",
        url: "/forms/save_add_more_evidence",
        data: {
            form_id: form_id,
            is_commit: is_commit,
            point: parseInt(point),
            evidence: evidence,
            slot_id: slot_id,
            competance_name: competancename,
        },
        headers: {
            "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
        },
        dataType: "json",
        success: function(response) {
            $('#modal_add_more_evidence').modal('hide');
            loadDataPanel(form_id);
        }
    });
});
// re-assess slot
$(document).on("click", ".modal-view-re-assess", function () {
  $('#modal_re_assess_slots').modal('show');
  var slot_id = $(this).data("slot-id");
  var id = $(this).data("id");
  id = $(".card").find('.show').attr('id').split("collapse");
  competency_name = $('.card .card-header .table' + id[1] + ' thead tr td:nth-child(2)').text();
  competency_name = $.trim(competency_name);
  $('#competency_name_re_assess').text(competency_name);
  $('#slot_id_re_assess').text(slot_id);
  $('#confirm_yes_re_assess_slot').val($(this).data("id"));
});
$(document).on("click", "#confirm_yes_re_assess_slot", function () {
  slot_id = $(this).val();
  $.ajax({
    type: "POST",
    url: "/forms/re_assess_slot",
    data: {
      form_id: form_id,
      slot_id: slot_id,
    },  
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "json",
    success: function (response) {
     
    }
  });
});