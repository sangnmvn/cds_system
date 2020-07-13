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
  link "CDS Assessment", "/forms/"
  parent :root
end

crumb :new_cds do
  link "CDS Staff", "/forms/cds_assessment"
  parent :forms
end

crumb :cds_review do
  link "CDS Review List", "/forms/cds_review"
  parent :root
end

crumb :new_cdp do
  link "CDP Staff", "/forms/cdp_assessment"
  parent :root
end

crumb :view_result_assessment do |form_id|
  link "View Result", "/forms/preview_result_new?form_id=#{form_id}"
  parent :new_cdp
end

crumb :cds_cdp_review do
  link "CDS Review", "/forms/cds_cdp_review"
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
