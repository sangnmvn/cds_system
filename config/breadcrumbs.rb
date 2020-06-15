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
  link "New Level Mapping for #{item.name}", "/level_mappings/add?role_id=#{item.id}"
  parent :level_mapping, :root
end

crumb :forms do
  link "Forms", "/forms"
  parent :root
end