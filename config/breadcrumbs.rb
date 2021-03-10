crumb :root do
  link " Home ", root_path
end

crumb :level_mapping do
  link " Level Mapping Management", "/level_mappings"
  parent :root
end

crumb :level_mapping_edit do |item|
  link "Level Mapping Detail of #{item.name}", "/level_mappings/edit?role_id=#{item.id}"
  parent :level_mapping, :root
end

crumb :level_mapping_new do |item|
  link "Create Level Mapping for #{item.name}", "/level_mappings/add?role_id=#{item.id}"
  parent :level_mapping, :root
end

crumb :forms do
  link "CDS Assessment", "/forms/index_cds_cdp"
  parent :root
end

crumb :new_cds do
  link "CDS Staff", "/forms/cds_assessment"
  parent :forms
end

crumb :cds_review do
  link "CDS & CDP Review", "/forms/cds_review"
  parent :root
end

crumb :new_cdp do |title_history_id|
  link "CDS & CDP Assessment", "/forms/cdp_assessment"
  user_id = TitleHistory.find_by_id(title_history_id)&.user_id
  if user_id == current_user.id
    parent :forms
  else
    parent :cds_review, :root
  end
end

crumb :view_result_assessment do |form_id|
  user_id = Form.find_by_id(form_id)&.user_id
  link "View Result", "/forms/preview_result_new?form_id=#{form_id}"
  if user_id == current_user.id
    parent :new_cdp
  else
    parent :cds_cdp_review, form_id, user_id
  end
end

crumb :view_suggest_cds_cdp do |form_id|
  user_id = Form.find_by_id(form_id)&.user_id
  link "View Suggest CDS/CDP", "/forms/suggest_cds_cdp?form_id=#{form_id}"
  if user_id == current_user.id
    parent :new_cdp
  else
    parent :cds_cdp_review, form_id, user_id
  end
end

crumb :cds_cdp_review do |form_id, user_id|
  link "CDS & CDP Review Details", "/forms/cds_cdp_review?form_id=#{form_id}&user_id=#{user_id}"
  parent :cds_review, :root
end

crumb :template_management do
  link "Template Management", "/templates/"
  parent :root
end

crumb :edit_templates do
  link "Template Detail", "/templates/"
  parent :template_management, :root
end

crumb :users do
  link "User Management", "/users"
  parent :root
end

crumb :groups do
  link "User Group Management", "/groups"
  parent :root
end

crumb :schedules do
  link "Schedule Management", "/schedules"
  parent :root
end

crumb :user_profile do
  link "View your profile", "/users/user_profile"
  parent :root
end

crumb :organization_settings do
  link "Organization Settings", "/organization_settings"
  parent :root
end

crumb :help do
  link "Help", "/help"
  parent :root
end
