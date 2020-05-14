# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

#Delete all
Form.delete_all
Slot.delete_all
Competency.delete_all
Template.delete_all
Title.delete_all
Approver.delete_all
GroupPrivilege.delete_all
Privilege.delete_all
TitlePrivilege.delete_all
UserGroup.delete_all
Privilege.delete_all
Period.delete_all
Schedule.delete_all
AdminUser.delete_all
Role.delete_all
Project.delete_all
Company.delete_all
Group.delete_all
ProjectMember.delete_all
# Create role
role_create = [
  { id: 1, name: "QC", desc: "Quality Assurance" },
  { id: 2, name: "DEV", desc: "Developer" },
  { id: 3, name: "BA", desc: "Business Analyst" },
  { id: 4, name: "PM", desc: "Project Manager" },
  { id: 5, name: "SM", desc: "Scrum Master" },
  { id: 6, name: "HR", desc: "Human Resource" },
]
role_create.each do |s|
  Role.create!(id: s[:id], name: s[:name], desc: s[:desc])
end

# Create comany
Company.create!(id: 1, name: "Nam Minh", parent_company_id: "")
Company.create!(id: 2, name: "Atalink", parent_company_id: "1")
Company.create!(id: 3, name: "Bestarion", parent_company_id: "1")
Company.create!(id: 4, name: "Larion", parent_company_id: "1")

# Create Projects
Project.create!(id: 1, desc: "Project CDS/CDP", company_id: "3")
Project.create!(id: 2, desc: "Project Test 1", company_id: "3")
Project.create!(id: 3, desc: "Project Test 2", company_id: "2")

# Create users

AdminUser.create!(id: 1, email: "admin@example.com", password: "password", password_confirmation: "password", first_name: "admin", last_name: "admin", account: "admin", role_id: "1", company_id: "3") if Rails.env.development?
AdminUser.create!(id: 2, email: "duynt@bestarion.com", password: "password", password_confirmation: "password", first_name: "Duy", last_name: "Nguyen Thanh", account: "duynt", role_id: "1", company_id: "1")
AdminUser.create!(id: 3, email: "hieuam@bestarion.com", password: "password", password_confirmation: "password", first_name: "Hieu", last_name: "Ao Minh", account: "hieuam", role_id: "2", company_id: "1")
AdminUser.create!(id: 4, email: "hungdq@example.com", password: "password", password_confirmation: "password", first_name: "Hung", last_name: "Duong Quoc", account: "hungdq", role_id: "3", company_id: "1")
AdminUser.create!(id: 5, email: "vinhmx@example.com", password: "password", password_confirmation: "password", first_name: "Vinh", last_name: "Mai Xuan", account: "vinhmx", role_id: "4", company_id: "1")
AdminUser.create!(id: 6, email: "hoanphungthe@example.com", password: "password", password_confirmation: "password", first_name: "Hoan", last_name: "Phung The", account: "hoanpt", role_id: "5", company_id: "1")
AdminUser.create!(id: 7, email: "baonguyenquoc@example.com", password: "password", password_confirmation: "password", first_name: "Bao", last_name: "Nguyen Quoc", account: "baonq", role_id: "6", company_id: "1")
AdminUser.create!(id: 8, email: "phungnguyenvan@example.com", password: "password", password_confirmation: "password", first_name: "Phung", last_name: "Nguyen Van", account: "phungnv", role_id: "1", company_id: "2")
AdminUser.create!(id: 9, email: "locnguyenvan@example.com", password: "password", password_confirmation: "password", first_name: "Loc", last_name: "Nguyen Van", account: "locnv", role_id: "2", company_id: "2")
AdminUser.create!(id: 10, email: "ngocph@bestarion.com", password: "password", password_confirmation: "password", first_name: "Ngoc", last_name: "Pham Huu", account: "ngocph", role_id: "3", company_id: "2")
AdminUser.create!(id: 11, email: "phuctnh@bestarion.com", password: "password", password_confirmation: "password", first_name: "Phuc", last_name: "Tran Nguyen Hoang", account: "phuctnh", role_id: "4", company_id: "2")
AdminUser.create!(id: 12, email: "lamnguyenngoc@example.com", password: "password", password_confirmation: "password", first_name: "Lam", last_name: "Nguyen Ngoc", account: "lamng", role_id: "5", company_id: "2")
AdminUser.create!(id: 13, email: "linhlevu@example.com", password: "password", password_confirmation: "password", first_name: "Linh", last_name: "Le Vu", account: "linhlv", role_id: "6", company_id: "2")
AdminUser.create!(id: 14, email: "linhnguyenquang@example.com", password: "password", password_confirmation: "password", first_name: "Linh", last_name: "Nguyen Quang", account: "linhnq", role_id: "1", company_id: "3")
AdminUser.create!(id: 15, email: "hiendinhthuy@example.com", password: "password", password_confirmation: "password", first_name: "Hien", last_name: "Dinh Thuy", account: "hiendt", role_id: "2", company_id: "3")
AdminUser.create!(id: 16, email: "tientranquanhoang@example.com", password: "password", password_confirmation: "password", first_name: "Tien", last_name: "Tran Quang Hoang", account: "tientqh", role_id: "3", company_id: "3")
AdminUser.create!(id: 17, email: "tuyenhothikim@example.com", password: "password", password_confirmation: "password", first_name: "Tuyen", last_name: "Ho Thi Kim", account: "tuyenhtk", role_id: "4", company_id: "3")
AdminUser.create!(id: 18, email: "dongnguyenchinh@example.com", password: "password", password_confirmation: "password", first_name: "Dong", last_name: "Nguyen Chinh", account: "dongnc", role_id: "5", company_id: "3")
AdminUser.create!(id: 19, email: "dungphamthu@example.com", password: "password", password_confirmation: "password", first_name: "Dung", last_name: "Pham Thu", account: "dungpt", role_id: "6", company_id: "3")
AdminUser.create!(id: 20, email: "lydothi@example.com", password: "password", password_confirmation: "password", first_name: "Ly", last_name: "Do Thi", account: "lydt", role_id: "1", company_id: "4")
AdminUser.create!(id: 21, email: "tamleminh@example.com", password: "password", password_confirmation: "password", first_name: "Tam", last_name: "Le Minh", account: "tamlm", role_id: "2", company_id: "4")
AdminUser.create!(id: 22, email: "vandaonthihong@example.com", password: "password", password_confirmation: "password", first_name: "Van", last_name: "Doan Thi Hong", account: "vandth", role_id: "3", company_id: "4")
AdminUser.create!(id: 23, email: "vuvotruong@example.com", password: "password", password_confirmation: "password", first_name: "Vu", last_name: "Vo Truong", account: "vuvt", role_id: "4", company_id: "4")
AdminUser.create!(id: 24, email: "ninhnguyenthi@example.com", password: "password", password_confirmation: "password", first_name: "Ninh", last_name: "Nguyen Thi", account: "ninhnt", role_id: "5", company_id: "4")
AdminUser.create!(id: 25, email: "thangnguyentat@example.com", password: "password", password_confirmation: "password", first_name: "Thang", last_name: "Nguyen Tat", account: "thangnt", role_id: "6", company_id: "4")

ProjectMember.create!(admin_user_id: 8, project_id: 3, is_managent: "0")
ProjectMember.create!(admin_user_id: 9, project_id: 3, is_managent: "0")
ProjectMember.create!(admin_user_id: 10, project_id: 3, is_managent: "0")
ProjectMember.create!(admin_user_id: 11, project_id: 3, is_managent: "0")
ProjectMember.create!(admin_user_id: 12, project_id: 3, is_managent: "0")
ProjectMember.create!(admin_user_id: 14, project_id: 1, is_managent: "0")
ProjectMember.create!(admin_user_id: 15, project_id: 2, is_managent: "0")
ProjectMember.create!(admin_user_id: 15, project_id: 1, is_managent: "0")
ProjectMember.create!(admin_user_id: 16, project_id: 1, is_managent: "0")
ProjectMember.create!(admin_user_id: 16, project_id: 2, is_managent: "0")
ProjectMember.create!(admin_user_id: 17, project_id: 1, is_managent: "0")
ProjectMember.create!(admin_user_id: 17, project_id: 1, is_managent: "0")
ProjectMember.create!(admin_user_id: 18, project_id: 1, is_managent: "0")
ProjectMember.create!(admin_user_id: 19, project_id: 1, is_managent: "0")
ProjectMember.create!(admin_user_id: 19, project_id: 2, is_managent: "0")
# NB_USERS = 100
# NB_USERS.times do |n|
#   AdminUser.create! do |u|
#     u.id = 2 + n
#     u.email = "user_#{n}@example.com"
#     u.first_name = "Test"
#     u.last_name = "User #{n}"
#     u.account = "user#{n}"
#     u.password = u.password_confirmation = "password"
#     u.company_id = 1
#     u.role_id = 1
#   end
# end

# Create Project Memember
# 50.times { |x| ProjectMember.create!(admin_user_id: "#{x + 1}", project_id: 1 + rand(3).to_i, is_managent: "0") }

# NB_GROUPS = 30

# NB_GROUPS.times do |n|
#   Group.create! do |u|
#     # u.username = Faker::Internet.user_name + n.to_s
#     # u.email = Faker::Internet.email.gsub("@", "#{n}@")
#     u.id = 1 + n
#     u.name = "Group #{n}"
#     u.description = "Description of group #{n}"
#     u.status = (n % 2 == 0) ? true : false
#   rescue => exception
#   else
#   end
# end

# NB_USER_GROUPS = 30
# user_id = 1
# NB_USER_GROUPS.times do |n|
#   begin
#     chances = [3, 2, 3, 3, 5, 3, 3, 3, 3, 3, 2]

#     chances.each { |chance|
#       if rand(10) % chance == 0
#         UserGroup.create!(group_id: 1 + n, admin_user_id: user_id)
#         user_id += 1
#       end
#     }
#   rescue
#     next
#   end
# end

# Approver.create!(admin_user_id: 2, approver_id: 2)
# Approver.create!(admin_user_id: 3, approver_id: 2)
# Approver.create!(admin_user_id: 4, approver_id: 5)
# Approver.create!(admin_user_id: 6, approver_id: 1)

# Approver.create!(approver_id: 1, admin_user_id: 6)
# Approver.create!(approver_id: 1, admin_user_id: 2)
# Approver.create!(approver_id: 2, admin_user_id: 4)
# Approver.create!(approver_id: 3, admin_user_id: 5)

# Create Title
# QC
Title.create!(name: "Associate QC", desc: "Associate QC", role_id: "1")
Title.create!(name: "QC", desc: "QC", role_id: "1")
Title.create!(name: "Senior QC", desc: "Senior QC", role_id: "1")
# Dev
Title.create!(name: "Associate Developer", desc: "Associate Developer", role_id: "2")
Title.create!(name: "Developer", desc: "Developer", role_id: "2")
Title.create!(name: "Senior Developer", desc: "Senior Developer", role_id: "2")
Title.create!(name: "Associate Solution Architect", desc: "Associate Solution Architect", role_id: "2")
Title.create!(name: "Solution Architect", desc: "Solution Architect", role_id: "2")
Title.create!(name: "Senior Solution Architect", desc: "Senior Solution Architect", role_id: "2")
Title.create!(name: "Director of Technology", desc: "Director of Technology", role_id: "2")
# BA
Title.create!(name: "Senior Business Analyst", desc: "Senior Business Analyst", role_id: "3")
Title.create!(name: "Business Analyst", desc: "Business Analyst", role_id: "3")
Title.create!(name: "Associate Business Analyst", desc: "Associate Business Analyst", role_id: "3")
# PM
Title.create!(name: "Associate Project Manager", desc: "Associate Project Manager", role_id: "4")
Title.create!(name: "Project Manager", desc: "Project Manager", role_id: "4")
Title.create!(name: "Senior Project Manager", desc: "Senior Project Manager", role_id: "4")
# SM
Title.create!(name: "SM Test", desc: "SM Test", role_id: "5")
# HR
Title.create!(name: "HR Test", desc: "HR Test", role_id: "6")

# Create Template
Template.create!(id: 1, name: "CDS/CPB QC", description: "Template Career Development Plan / Career Development System For QC", role_id: "1", admin_user_id: 1)
Template.create!(id: 2, name: "CDS/CPB HR", description: "Template Career Development Plan / Career Development System For HR", role_id: "2", admin_user_id: 1)
Template.create!(id: 3, name: "CDS/CPB BA", description: "Template Career Development Plan / Career Development System For BA", role_id: "3", admin_user_id: 2)
Template.create!(id: 4, name: "CDS/CPB DEV", description: "Template Career Development Plan / Career Development System For DEV", role_id: "4", admin_user_id: 2)
# Template.create!(id: 5, name: "CDS/CPB SM", description: "Template Career Development Plan / Career Development System For DEV", role_id: "5",admin_user_id: 2 )
# Template.create!(id: 6, name: "CDS/CPB IT", description: "Template Career Development Plan / Career Development System For DEV", role_id: "6", admin_user_id: 1)
# Template.create!(id: 2, name: "CDS", description: "Career Development System")

# Create Form
Form.create!(id: 1, admin_user_id: "1", _type: "CDS", template_id: "1")
Form.create!(id: 2, admin_user_id: "1", _type: "CDP", template_id: "1")

# Create Competency
i_competency = 0
# QC - General
Competency.create!(id: "#{i_competency += 1}", name: "Productivity", desc: "Productivity", _type: "General", template_id: "1", location: 1)
Competency.create!(id: "#{i_competency += 1}", name: "Problem Solving", desc: "Problem Solving", _type: "General", template_id: "1", location: 2)
Competency.create!(id: "#{i_competency += 1}", name: "Communication", desc: "Communication", _type: "General", template_id: "1", location: 3)
Competency.create!(id: "#{i_competency += 1}", name: "Planning And Organizing", desc: "Planning & Organizing", _type: "General", template_id: "1", location: 4)

# QC - Specialized
Competency.create!(id: "#{i_competency += 1}", name: "Software Engineering and Computer Science", desc: "Software Engineering and Computer Science", _type: "Specialized", template_id: "1", location: 5)
Competency.create!(id: "#{i_competency += 1}", name: "Software Testing General", desc: "Software Testing General", _type: "Specialized", template_id: "1", location: 6)
Competency.create!(id: "#{i_competency += 1}", name: "Test Management", desc: "Test Management", _type: "Specialized", template_id: "1", location: 7)
Competency.create!(id: "#{i_competency += 1}", name: "Test Analysis and Design", desc: "Test Analysis and Design", _type: "Specialized", template_id: "1", location: 8)
Competency.create!(id: "#{i_competency += 1}", name: "Test Implementation, Execution and Reporting", desc: "Test Implementation, Execution and Reporting", _type: "Specialized", template_id: "1", location: 9)
Competency.create!(id: "#{i_competency += 1}", name: "Software Testing Specialization and Testing Tools", desc: "Software Testing Specialization and Testing Tools", _type: "Specialized", template_id: "1", location: 10)
# Dev - Specialized
Competency.create!(id: "#{i_competency += 1}", name: "Computer Science", desc: "Computer Science", _type: "Specialized", template_id: "2", location: 1)
Competency.create!(id: "#{i_competency += 1}", name: "Software Engineering", desc: "Software Engineering", _type: "Specialized", template_id: "2", location: 2)
Competency.create!(id: "#{i_competency += 1}", name: "Programming", desc: "Programming", _type: "Specialized", template_id: "2", location: 3)

# BA - Specialized
Competency.create!(id: "#{i_competency += 1}", name: "Requirement Elicitation", desc: "Requirement Elicitation", _type: "Specialized", template_id: "3", location: 1)
Competency.create!(id: "#{i_competency += 1}", name: "Requirement Analysis", desc: "Requirement Analysis", _type: "Specialized", template_id: "3", location: 2)
Competency.create!(id: "#{i_competency += 1}", name: "Requirement Specification", desc: "Requirement Specification", _type: "Specialized", template_id: "3", location: 3)
Competency.create!(id: "#{i_competency += 1}", name: "Requirement Verification & Validation", desc: "Requirement Verification & Validation", _type: "Specialized", template_id: "3", location: 4)
Competency.create!(id: "#{i_competency += 1}", name: "Requirement Monitoring & Controlling", desc: "Requirement Monitoring & Controlling", _type: "Specialized", template_id: "3", location: 5)

# PM - Specialized
Competency.create!(id: "#{i_competency += 1}", name: "Project Initiating", desc: "Project Initiating", _type: "Specialized", template_id: "4", location: 1)
Competency.create!(id: "#{i_competency += 1}", name: "Project Planning", desc: "Project Planning", _type: "Specialized", template_id: "4", location: 2)
Competency.create!(id: "#{i_competency += 1}", name: "Project Executing", desc: "Project Executing", _type: "Specialized", template_id: "4", location: 3)
Competency.create!(id: "#{i_competency += 1}", name: "Project Monitoring and Controlling", desc: "Project Monitoring and Controlling", _type: "Specialized", template_id: "4", location: 4)
Competency.create!(id: "#{i_competency += 1}", name: "Project Closing", desc: "Project Closing", _type: "Specialized", template_id: "4", location: 5)

# Create Slot
# QC - General
slot_create = [
  { desc: "Consistently perform well under supervision", evidence: "Nếu được giao việc và được hướng dẫn cách làm thì hoàn tất tốt công việc được giao trong mức độ năng suất hợp lý
    Nếu có sai sót trong quá trình làm việc và đã được nhắc nhở về những lỗi cụ thể thì không lặp lại những lỗi này.", level: 1, competency_id: "1", slot_id: 1 },
  { desc: "Recognized as a contributing member of the team.", evidence: "Là một thành viên đóng góp tích cực cho nhóm / dự án.
    <p>Những người khác không thấy nhân viên này là điểm yếu, là gánh nặng cho team trong productivity </p>
    <p>Phản ví dụ: Khoảng 4:00 PM thấy ứng dụng cho khách hàng [bản production] deploy tại www.abc.com bị down và không giải quyết được.</p>
    5:30 PM cứ thế đi về nhà mà không báo cho cấp trên để giải quyết triệt để", level: 1, competency_id: "1", slot_id: 2 },
  { desc: "Complete assigned tasks within scheduled completion dates. \
    Communicate potential issues as soon as you are known.", evidence: "Hoàn tất công việc được giao một cách đúng hạn, với chất lượng tốt.
    <p>Trao đổi, thông báo ngay về những vấn đề tiềm năng khi phát hiện ra chúng</p>", level: 1, competency_id: "1", slot_id: 3 },
  { desc: "Complete assigned tasks within scheduled completion dates. \ 
    Communicate potential issues as soon as you are known.", evidence: "Hiểu rõ và tuân thủ tốt các quy trình, quy định, \
    thủ tục, chuẩn do BESTARION đang áp dụng", level: 1, competency_id: "1", slot_id: 4 },
  { desc: "Capable of locating and effectively using detailed information from the BESTARION Portal, Mantis, SVN, HRM, …", evidence: "abc", level: 1, competency_id: "1", slot_id: 5 },
  { desc: "Recognized as a proactive member of the team.", evidence: "<p>Là một thành viên đóng góp tích cực cho nhóm / dự án.</p>
    <p>Nằm trong số những người đóng góp hàng đầu cho dự án.</p>
    <p>Phản ví dụ: Khoảng 4:00 PM thấy ứng dụng cho khách hàng [bản production] deploy tại www.abc.com  bị down và không giải quyết được.</p>
    \n 5:30 PM cứ thế đi về nhà mà không báo cho cấp trên để giải quyết triệt để", level: 2, competency_id: "1", slot_id: 1 },
  { desc: "Complete critical tasks on time", evidence: "Critical tasks: Những công việc quan trọng, chủ chốt, cốt lõi trong dự án, \
    trong bộ phận mà nhân viên tham gia, ở góc độ vai trò tương ứng. \n
    Ví dụ:  <p> Nhân viên làm Business Analyst trong một dự án thì critical tasks là những công việc chủ chốt, cốt lõi liên quan đến phân \
    tích yêu cầu khách hàng </>
    <p>Nhân viên làm Developer trong một dự án thì critical tasks là những công việc liên quan đến thiết kế / tài liệu hóa / lập trình / sửa bugs \
    của những thứ quan trọng, chủ chốt, cốt lõi. </p>
    <p>Nhân viên làm Tester trong một dự án thì thì critical tasks là những công việc liên quan đến việc phát triển test plan / test cases / tiến \
    hành test execution của những thứ quan trọng, chủ chốt, cốt lõi trong dự án.</p>", level: 2, competency_id: "1", slot_id: 2 },
  { desc: "Able to represent the skills and capabilities of your department/ practice unit/business unit. ", evidence: "Represent: Đại diện. \n
    <p>Có nhiều mức độ đại diện – ví dụ</p>
    <p>Đại diện cho dự án để training cho một nhân viên mới, training cho sinh viên thực tập về kiến thức, kỹ năng ở vai trò của mình; \n  
    Đại diện cho dự án để làm việc với dự án khác; đại diện cho dự án làm việc với khách hàng;</p>
    <p>Có khả năng chịu trách nhiệm chính trong dự án về chuyên môn mà mình đang đảm nhận;</p> 
    <p>Đại diện cho bộ phận chuyên môn của mình ở phạm vi công ty để làm việc với bất cứ đối tượng nào khi cần </p>  
    <p>Nhân viên sẽ được đánh giá pass slot này nếu có bằng chứng thuyết phục liên quan đến khả năng chịu trách nhiệm chính về chuyên môn \
    trong dự án hiện tại và có khả năng đại diện cho bộ phận chuyên môn của mình ở phạm vi công ty để làm việc với bất cứ đối tượng nào khi cần</p>", level: 2, competency_id: "1", slot_id: 3 },
  { desc: "Recognized internally as a solid knowledge resource.", evidence: "Cứ có vấn đề gì về mảng kiến thức mà cần trợ giúp / câu \
    trả lời là nghĩ ngay đến nhân viên này", level: 3, competency_id: "1", slot_id: 1 },
  { desc: "Successfully complete tasks and assignments independently and supervise the work of others as requested.",
    evidence: "Nhân viên sẽ được đánh giá pass slot này nếu có bằng chứng thuyết phục: \n
- Khi được giao việc thì hoàn tất được công việc một cách độc lập, không cần có sự chỉ dẫn về cách làm, và \n
- Có thể hướng dẫn, hỗ trợ, giám sát người khác [vài người] hoàn tất công việc", level: 3, competency_id: "1", slot_id: 2 },
  { desc: "Regularly requested by Company or Business Unit leadership and clients for advice and guidance.",
    evidence: "Có khả năng tư vấn, định hướng, dẫn đường cho công ty hoặc khách hàng về: \n
- Chuyên môn kỹ thuật ở vai trò mình nắm giữ, hoặc \n
- Trong những vấn đề liên quan đến hoạt động chung của công ty ", level: 3, competency_id: "1", slot_id: 3 },
  { desc: "Identify problems, think through potential solutions then communicate and/or escalate appropriately.",
    evidence: "Phản ví dụ: Khoảng 4:00 PM thấy ứng dụng cho khách hàng [bản production] deploy tại www.abc.com bị down \
     và không giải quyết được. 5:30 PM cứ thế đi về nhà mà không báo cho cấp trên để giải quyết triệt để", level: 1, competency_id: "2", slot_id: 1 },
  { desc: "Identify and solve simple problems independently (for example: recognizing changes in scope and communicating them).",
    evidence: "Không cần hỏi người khác về giải pháp cho vấn đề [đơn giản] đang gặp phải", level: 2, competency_id: "2", slot_id: 1 },
  { desc: "Provide assistance in solving complex problems (complex – technically difficult, opposing viewpoints, risky, and/or sensitive).",
    evidence: "Đề xuất, hỗ trợ được trong việc giải quyết các vấn đề phức tạp", level: 2, competency_id: "2", slot_id: 2 },
  { desc: "Lead simple meetings for internal or external clients. Peer and / or next level management are likely to \
    attend these meetings. ",
    evidence: "Bằng chứng thuyết phục là có dính dáng đến khách hàng bên ngoài", level: 2, competency_id: "2", slot_id: 3 },
  { desc: "Possess and use good diagnosis / troubleshooting skills.", evidence: "abc", level: 2, competency_id: "2", slot_id: 4 },
  { desc: "Identifies and solves complex or sensitive problems (for example: associate performance, project scope issues,\
    and priority changes or resolving multiple conflicting agendas). ",
    evidence: "<p>- Không cần hỏi người khác về giải pháp cho vấn đề phức tạp đang gặp phải.</p>
              <p>- Thế nào là vấn đề phức tạp hoặc nhạy cảm trong phát triển phần mềm?</p>
              <p>- Yêu cầu của khách hàng phức tạp, logic xử lý phức tạp, giải thuật phức tạp và có đòi hỏi cao về performance, \
              security; đòi hỏi hiểu biết cao để ứng dụng các frameworks sẵn có thay vì phải hiện thực từ đầu; phải xử lý các \
              vấn đề phức tạp đồng thời</p>", level: 3, competency_id: "2", slot_id: 1 },
  { desc: "Breaks down major issues and problems into workable pieces; sees whole situation behind a problem or issue; \
    understands the causes, effects, implications; sets priorities and takes right action for resolution.",
    evidence: "<p>- Có khả năng chia nhỏ vấn đề lớn, phức tạp thành những phần nhỏ hơn để xử lý;</p>
               <p>- Nắm được bức tranh tổng thể của một vấn đề phức tạp; hiểu rõ nguyên nhân, hậu quả, những vấn đề có liên quan; \
               thiết lập được độ ưu tiên, thứ tự và tiến hành các công việc phù hợp để giải quyết bài toán</p>", level: 3, competency_id: "2", slot_id: 2 },
  { desc: "Identify and solve complex or sensitive problems at the strategic executive level.",
    evidence: "<p>Ví dụ: </p>
    <p>Phát biểu bài toán 7 năm của công ty và giải quyết nó<p>           
    <p>Phát biểu bài toán technical lead của công ty và giải quyết nó</p>             
    <p>Phát biểu bài toán quản lý chi phí / năng suất của công ty và giải quyết nó</p>", level: 4, competency_id: "2", slot_id: 1 },
  { desc: "Anticipate project and/or assignment risks and provide potential solutions.",
    evidence: "abc", level: 4, competency_id: "2", slot_id: 2 },
  { desc: "Capable of internal interaction. This is evident in all core communications. Example: \n
    Writing: Weekly report, email, Bug tracker, update document, etc. \n
    Reading and understanding: Project documents, Company policy, Guideline(Bug tracker, SVN, HRM), etc. \n
    Communicating with team member: discuss and  raise issues as soon as they are known",
    evidence: "abc", level: 1, competency_id: "3", slot_id: 1 },
  { desc: "Effectively attend simple meetings",
    evidence: "abc", level: 1, competency_id: "3", slot_id: 2 },
  { desc: "Lead simple internal meetings.  Peers and/or next level management are likely to attend these meetings",
    evidence: "abc", level: 2, competency_id: "3", slot_id: 1 },
  { desc: "Capable of client interaction with supervision or guidance from management or team leadership",
    evidence: "abc", level: 2, competency_id: "3", slot_id: 2 },
  { desc: "Exhibit developed good written and verbal communications. This is evident in complete, accurate and timely status \
    reports and project deliverables as well as clear and concise direct communication.",
    evidence: "Good: Có khả năng tốt về written & verbal communications, ít khi phải hỏi ai về written & verbal communications. \
               Có thể chịu trách nhiệm chính về written & verbal communications cho 1 hay nhiều dự án [giới hạn ở vai trò của mình].", level: 2, competency_id: "3", slot_id: 3 },
  { desc: "Demonstrated ability to transfer knowledge to junior associates and thus serve as a mentor.",
    evidence: "Cho sinh viên thực tập hay cho nhân viên mới? Bao nhiêu người? Level mentoring cỡ nào?", level: 2, competency_id: "3", slot_id: 4 },
  { desc: "Effectively deliver unpopular and/or difficult messages with an understanding of the receiver’s viewpoint.",
    evidence: "Một key member [Senior Software Engineer hoặc tương ứng trở lên] muốn rời khỏi công ty, thậm chí đã gửi đơn xin nghỉ việc. \
    Thuyết phục người này ở lại bằng cách nào? \n
    Khách hàng không có ngân sách thuê ngoài dịch vụ training về quản lý dự án trong khi BESTARION lại .... \
    làm sao để thuyết phục khách hàng?\n             
    Tìm hiểu được thông tin từ khách hàng xem mức chi phí mà khách hàng chấp nhận cho 1 dự án fixed cost là bao nhiêu, \
    hourly rate khách hàng chấp nhận được là bao nhiêu, có xét tới lợi ích của công ty. Ví dụ cụ thể: Ước lượng chúng ta cần \
    charge khách hàng 530 working hours thì mới có mức lãi như kỳ vọng, nhưng chúng ta không biết mức độ chấp nhận của khách hàng \
    thế nào, cần tìm hiểu thông tin từ khách hàng trước khi gửi bản đề xuất chính thức
    ", level: 3, competency_id: "3", slot_id: 1 },
  { desc: "Demonstrate strong written and verbal communication skills. (Example: formal documents, client/peer or conference \
    presentations).",
    evidence: "Strong: written & verbal communications là sở trường, lợi thế, sở thích. Được khách hàng, đồng nghiệp, cấp trên khen ngợi, \
               bái phục. Được mọi người tham khảo ý kiến khi cần communicate cho tốt hơn\n
               Phản ví dụ: Khoảng 4:00 PM thấy ứng dụng cho khách hàng [bản production] deploy tại www.abc.com bị down và không giải quyết được. \
               5:30 PM cứ thế đi về nhà mà không báo cho cấp trên để giải quyết triệt để\n             
               Tìm hiểu được thông tin từ khách hàng xem mức chi phí mà khách hàng chấp nhận cho 1 dự án fixed cost là bao nhiêu, \
               hourly rate khách hàng chấp nhận được là bao nhiêu, có xét tới lợi ích của công ty. Ví dụ cụ thể: Ước lượng chúng ta \
               cần charge khách hàng 530 working hours thì mới có mức lãi như kỳ vọng, nhưng chúng ta không biết mức độ chấp nhận của khách hàng \
               thế nào, cần tìm hiểu thông tin từ khách hàng trước khi gửi bản đề xuất chính thức", level: 3, competency_id: "3", slot_id: 2 },
  { desc: "Lead or facilitate complex meetings for either internal or external clients. The next level of management likely attends \
    these meetings. (Example: formal reviews, workshops, requirements sessions).",
    evidence: "abc", level: 3, competency_id: "3", slot_id: 3 },
  { desc: "Display good negotiating skills. (Example: setting scope and time-lines with client, vendor discussions, and technical strategies.)",
    evidence: "Ví dụ 1 về good negotiating skills:\n
    Khách hàng nói: Dự án phải được hoàn tất trong phạm vi dưới 300 triệu đồng\n
    Khi dự toán thì thấy do phải mua một số components nên tổng dự toán của dự án là 340 triệu [280 + 60].\n             
    Nếu thương lượng được để khách hàng đồng ý trả chúng ta 280 triệu còn 60 triệu chi phí mua components khách hàng \
    thanh toán riêng ==> good negotiating skills\n             
    Ví dụ 2 về good negotiating skills:             
    Khách hàng muốn tiến hành dự án với 3 billable per month in 12 months. Tuy nhiên khách hàng lại muốn trả giá hourly \
    rate thật là thấp, giả sử US$ 8.00.\n             
    Nếu thương lượng được để khách hàng đồng ý trả chúng ta hourly rate US$ 12.00 với cam kết rằng khối lượng công việc \
    chúng ta hoàn tất được là xứng đáng với hourly rate US$ 12.00 ==> good negotiating skills
    Ví dụ 3 về good negotiating skills:
    Một key member muốn rời khỏi công ty, thậm chí đã gửi đơn xin nghỉ việc. Thuyết phục người này ở lại bằng cách nào?
    Ví dụ 4 về good negotiating skills:             
    Một key member đã rời công ty và đi làm ở công ty khác. Công ty cần người này làm part time vào các thứ bảy, chủ nhật, \
    buổi tối trong một khoảng thời gian. Vậy khoảng thời gian này có tính là overtime với hệ số 1,5 hay không? ==> thương lượng \
    là nó chỉ hệ số 1", level: 4, competency_id: "3", slot_id: 1 },
  { desc: "Exhibit the appropriate interpersonal skills required to establish effective working relationships with clients and/or \
    business partners",
    evidence: "Thế nào là interpersonal skills? http://en.wikipedia.org/wiki/Interpersonal 
               Nói về Interpersonal Relationship, dựa vào đó sẽ cần có các skills để Flourishing Relationships
               Hãy chứng minh bạn có Appropriate Interpersonal Skills!", level: 4, competency_id: "3", slot_id: 2 },
  { desc: "Demonstrate excellent written and verbal communication skills as well as facilitation skills.",
    evidence: "Không chỉ strong, mà còn phải biết hát. Là một người cực kỳ xuất sắc về communications. Rất hiếm người đạt được slot này.\n
    Nếu làm việc với khách hàng nước ngoài bằng tiếng Anh thì một điều kiện cần là TOEIC 900?", level: 4, competency_id: "3", slot_id: 3 },
  { desc: "Effectively communicate BESTARION’s capabilities to clients.",
    evidence: "Phải có bằng chứng làm việc với khách hàng bên ngoài – chịu trách nhiệm chính, nhất là trong các dự án mới với khách \
    hàng bên ngoài. \n
    Việc chịu trách nhiệm chính và biến dự án tiềm năng thành dự án thực tế cho công ty là bằng chứng rõ ràng.", level: 4, competency_id: "3", slot_id: 4 },
  { desc: "Lead or facilitate complex, multi-session, politically charged meetings for clients. The most senior members of the client\
    (internal or external) team are likely to attend these meetings representing their own group’s interest. ",
    evidence: "Chịu trách nhiệm chính từ phía BESTARION trong các buổi họp phức tạp, khó khăn, gồm nhiều buổi, có yếu tố political \
              [ví dụ tại sao lại outsource thay vì tự làm; tại sao lại outsource sang VN mà không phải là ở India, etc] liên quan đến khách hàng. \
              Các buổi họp này có đại diện cấp cao nhất của khách hàng tham gia.", level: 4, competency_id: "3", slot_id: 5 },
  { desc: "Independently interact with clients and provide guidance and supervision to others in this area ",
    evidence: "Giao tiếp độc lập với khách hàng và hướng dẫn, giám sát, trợ giúp người khác ", level: 4, competency_id: "3", slot_id: 6 },
  { desc: "Recognized as possessing excellent communication and facilitation skills as well as negotiation skills.",
    evidence: "Không chỉ excellent về communications mà còn là excellent về negotiation. Có thể thương lượng những vấn đề mà người khác không \
    thể thương lượng nổi", level: 5, competency_id: "3", slot_id: 3 },
  { desc: "Demonstrate effective skills in influencing Firm culture.",
    evidence: "Trong quá trình làm việc ở công ty: Có kỹ năng và ảnh hưởng ở mức độ văn hóa của tổ chức", level: 5, competency_id: "3", slot_id: 1 },
  { desc: "Demonstrate appropriate interpersonal skills required to serve as Executive Sponsor in key client relationships and/or represents \
    BESTARION in strategic business partnerships.",
    evidence: "Là người đại diện công ty để thiết lập và duy trì mối quan hệ với những khách hàng chủ chốt, quan trọng của công ty. Đại diện công \
               ty trong các mối quan hệ kinh doanh chiến lược. “Không có tôi thì không xong”", level: 5, competency_id: "3", slot_id: 2 },
  { desc: "Able to improve skill knowledge to adapt yourself to new requirements",
    evidence: "Bằng chứng [bao gồm, không chỉ gồm]:\n
    Đơn giản nhất là hoàn tất training plan cho newcomer và được đánh giá tốt [đúng hạn, kết quả kiểm tra tốt chẳng hạn]\n             
    Tham gia các khóa huấn luyện của công ty và thi lần đầu là pass ngay\n             
    Nâng cao trình độ Anh văn đúng thời điểm như đã cam kết với công ty\n             
    Tìm hiểu vấn đề mới để giải quyết công việc trong dự án đạt đúng ước lượng hợp lý đã đề ra", level: 1, competency_id: "4", slot_id: 1 },
  { desc: "Able to write report if having any request",
    evidence: "Good meeting minutes, các báo cáo về một vấn đề nào đó khi được yêu cầu", level: 1, competency_id: "4", slot_id: 2 },
  { desc: "Estimate how much time one has, to allocate it effectively, and to stay within time limits and deadlines.",
    evidence: "Thể hiện ở 2 khía cạnh:\n
    Với chừng đó thời gian có được thì cần hoàn tất khối lượng công việc tương xứng ==> đây là thứ cần được hỏi và trả lời \
    hàng ngày: Do I finish a reasonable amount of tasks today? Do the peer / direct manager / customer happy with my achievement? \
    Nếu thời gian đang được sử dụng không hiệu quả do yếu tố khách quan thì cần có phản hồi với những người có liên quan [ví dụ: suốt \
     ngày đi họp mà lại sử dụng thời gian họp kém hiệu quả …]\n             
    Với chừng đó thời gian có được thì không over-commit để rồi không đạt được commitment", level: 1, competency_id: "4", slot_id: 3 },
  { desc: "Arrange and finish tasks creatively ",
    evidence: "abc", level: 1, competency_id: "4", slot_id: 4 },
  { desc: "Complete assigned tasks within scheduled completion dates. Communicate potential issues as soon as they are known.",
    evidence: "abc", level: 1, competency_id: "4", slot_id: 5 },
  { desc: "Prioritize duties in a manner consistent with project objectives/ goal",
    evidence: "abc", level: 1, competency_id: "4", slot_id: 6 },
  { desc: "Organize tasks and make an effective plan for own task",
    evidence: "Hoàn tất tasks đúng hạn như ước lượng hợp lý đã đề ra", level: 2, competency_id: "4", slot_id: 1 },
  { desc: "Complete critical tasks on time.",
    evidence: "Hoàn tất critical tasks đúng hạn.", level: 2, competency_id: "4", slot_id: 2 },
  { desc: "Demonstrate exceptional time management and prioritization skills",
    evidence: "Khả năng quản lý thời gian mà mình có; khả năng đặt độ ưu tiên các tasks.\n
    Bằng chứng: Hoàn tất tốt công việc khi cùng lúc tham gia nhiều dự án / nhiều việc xen kẽ nhau", level: 2, competency_id: "4", slot_id: 3 },
  { desc: "Consistently deliver quality, on-time task assignment outcomes as a result of good planning and organizational skills.",
    evidence: "Nếu có bằng chứng consistently; không có phản ví dụ trong vòng xxx tháng [cả về chất lượng lẫn thời hạn]. Nếu hoàn tất \
    task trong 3 hours nhưng lại tốn thêm 2 hours trở lên để đi sửa ==> phản ví dụ ", level: 2, competency_id: "4", slot_id: 4 },
  { desc: "Assistant to develop project plans and then tracks tasks, manage scope and risk, accurately reports status to client / \
    project manager / delivery manager.",
    evidence: "Hỗ trợ làm các loại project plans, kiểm soát phạm vi và rủi ro, báo cáo tình trạng dự án cho khách hàng / trưởng dự án /\
                … Ít nhất cũng phải hỗ trợ trong khoảng 3 tháng trở lên", level: 2, competency_id: "4", slot_id: 5 },
  { desc: "Successfully complete tasks and assignments independently and supervise the work of others as requested.",
    evidence: "Hoàn tất tasks một cách độc lập [không cần hỏi người khác về cách giải quyết] và có thể kiểm tra, theo dõi, \
    hướng dẫn, hỗ trợ người khác. Bằng chứng có khả năng là phải hoàn tất được tasks một cách độc lập trong khoảng 3 tháng trở lên; \
    hỗ trợ được người khác ít nhất tương ứng 6 billable man-month trở lên", level: 2, competency_id: "4", slot_id: 6 },
  { desc: "Develop project plans and then track tasks, manage scope and risk, accurately report status to client / project manager /\
    delivery manager.",
    evidence: "Ít nhất 3 tháng trở lên?", level: 3, competency_id: "4", slot_id: 1 },
  { desc: "Develop estimates and schedules for potential follow on opportunities.",
    evidence: "Follow on opportunities: Cho khách hàng tiềm năng. Ít nhất cho 3 khách hàng tiềm năng với tổng số estimated effort ít nhất \
    khoảng 6 billable man-months", level: 3, competency_id: "4", slot_id: 2 },
  { desc: "Successfully manage scope and client expectations to deliver Task deliverables that meet and exceed client expectations",
    evidence: "Ít nhất 3 tháng trở lên? Phải có bằng chứng về việc quản lý client expectations và meet / exceed client expectations;", level: 3, competency_id: "4", slot_id: 3 },
  { desc: "Accountable for accurate and timely feedback to project associates through Task / Documents reviews and / or other forms \
    of formal feedback",
    evidence: "Có phản hồi chính xác và đúng hạn cho các đồng nghiệp / khách hàng hay không?", level: 3, competency_id: "4", slot_id: 4 },
  { desc: "Successfully handle and organize strategy task",
    evidence: "Một số ví dụ:\n
    Handle & Organize CMMI Level 3 project\n             
    Handle & Organize Portfolio Management \n             
    Handle & Organize: Quản lý năng suất tại công ty\n             
    Handle & Organize: Quản lý nhân sự tại công ty – bài toán giữ người, bài toán lương thưởng / phúc lợi", level: 4, competency_id: "4", slot_id: 1 },
  { desc: "Successfully manage and organize multiple tasks at the company level",
    evidence: "Vừa manage & organize CMMI Level 3 project, vừa quản lý phòng tổng hợp, vừa quản lý Dự án một cách thành công trong tối \
    thiểu 3 tháng chẳng hạn.\n
    Người đồng thời tham gia nhiều dự án [ví dụ 3 dự án phần mềm] nhưng không phải ở vị trí manager thì sao? Không được tính, chỉ \
    được tính vào slot 2c\n
    Người đồng thời làm manager ở vài dự án khác nhau thì sao?", level: 4, competency_id: "4", slot_id: 2 },
  { desc: "Accountable for developing his/ her own management skill set to meet the company expectation. ",
    evidence: "PMP, MBA là điều kiện cần\n
    Cần có bằng chứng về việc áp dụng management skill set thành công", level: 4, competency_id: "4", slot_id: 3 },
  { desc: "Able to use basic features of version control system, bug tracking system like git, svn, jira, mantis etc.",
    evidence: "Sử dụng tốt những chức năng cơ bản như là tạo/update thông tin task, bug một cách hiệu quả. Bằng chứng để pass slot này \
    là đã dùng các loại công cụ này một cách hiệu quả liên tục trong 6 tháng.", level: 1, competency_id: "5", slot_id: 1 },
  { desc: "Understand and follow project defined processes.",
    evidence: "Để pass slot này, tester cần có bằng chứng việc: \n
    - Đã được đào tạo về qui trình của dự án (project defined processes)\n
    -Tuân thủ các qui trình liên quan đến vị trí công việc của mình (số lượng non-compliance trong phạm vi cho phép, được qui định \
     cho từng dự án cụ thể). Việc tuân thủ tốt về qui trình ở ít nhất 2 dự án mà tester đã tham gia sẽ là bằng chứng tốt cho việc pass slot này.", level: 1, competency_id: "5", slot_id: 2 },
  { desc: "Demonstrate the ability to run simple scripts (like maven, bash scripts) to build software system for testing.",
    evidence: "Có bằng chứng chạy script đơn giản để có thể build ứng dụng phục vụ cho việc test.\n
    Căn bản: copy / move / delete files, setup environment variables, thay đổi các cấu hình (configuration files)", level: 1, competency_id: "5", slot_id: 3 },
  { desc: "Know about some alternatives to popular and standard tools that are required by the current position.",
    evidence: "- Kể tên  và những chức năng căn bản của một số tool (được sử dụng rộng rãi / nổi tiếng), và có thể đưa ra một vài so sánh \
    với tool hiện tại đang dùng. Ít nhất nên có thể kể thêm 1 tool, thuộc tất cả các thể loại sau: Automation testing tools, version \
    control system, bug tracking system.", level: 1, competency_id: "5", slot_id: 5 },
  { desc: "Able to understand important non-functional requirements (security, concurrency & capacity, performance, reliability, \
    maintainability, usability, documentation) and able to reflect those requirements in testing under supervision.",
    evidence: "Hiểu được ý nghĩa của những yêu cầu non-functional chính như liệt kê như trong slot, biết được thế nào thì được gọi là \
               đạt yêu cầu / không đạt yêu cầu. Khi được hướng dẫn thì có thể hiện thực được những yêu cầu này vào testing", level: 1, competency_id: "5", slot_id: 4 },
  { desc: "Able to understand important concepts, techniques about databases/SQL and able to apply for testing activities",
    evidence: "<p>Để pass slot này, tester cần có bằng chứng của việc:</p>
    <p>+ Hiểu được sự khác biệt của các loại database khác nhau</p>
    <p>+ Kết nối database sử dụng các loại SQL connection client khác nhau.</p>
    <p>+ Hiểu được sự khác biệt giữa datatable, keys và Index.</p>
    <p>+ Có thể viết các câu SQL đơn giản phục vụ cho việc truy vấn dữ liệu phục vụ cho việc testing.</p>
    Tester cần có bằng chứng cho việc đã truy vấn các loại dữ liệu từ database và so sánh dữ liệu đã truy vấn với dữ liệu được \
    hiển thị trên giao diện của ứng dụng (có bằng chứng ở ít nhất 2 dự án)", level: 2, competency_id: "5", slot_id: 1 },
  { desc: "Basic understanding of file management, process management, memory management, cpu management in Windows and Linux. ",
    evidence: "<p>Yêu cầu cả trên Windows và Linux, phải biết những thứ sau:</p>
    <p>- Biết được trong hệ điều hành có những file / folder nào, mục đích chính của chúng dùng để làm gì → để khi cần lấy file, \
    sửa đổi file thì có thể biết được ngay phải lấy ở đâu, có ảnh hưởng đến hệ thống không.</p>
    <p>- Biết được file / folder có những thuộc tính nào, cách thay đổi thuộc tính file / folder như thế nào → mức độ căn bản nhất của security</p>
    <p>- Có chút khái niệm về FAT, NTFS, Ext → hiểu sơ được file trong ổ cứng được quản lý thế nào</p>
    <p>- Biết được cách xem thông tin process trong hệ thống, cách terminate process</p>
    <p>- Biết sơ qua các loại memory như main memory, swap, page, cache memory, biết cách tìm thông tin memory trong hệ thống như thế nào</p>
    <p>- Có kiến thức cơ bản về CPU, như tốc độ CPU là gì, cache là gì, tìm những thông tin này ở đâu trong hệ điều hành, hệ điều hành phân \
    phát CPU cho các process như thế nào (mức độ căn bản)</p>
    <p>→ slot này giúp tester hiểu được sự tương tác giữa ứng dụng và hệ diều hành ở mức độ căn bản làm nền tãng quan trọng cho hoạt động testing</p>", level: 2, competency_id: "5", slot_id: 2 },
  { desc: "Able to understand software system specification",
    evidence: "- Có khả năng đọc hiểu các tài liệu đặc tả (Software Requirements Specification, Use Cases, High Level Design Specification,..) \
   bóc tách được các yêu cầu chức năng và phi chức năng, các risks, assumptions nhằm phục vụ hiệu quả cho các hoạt động testing", level: 2, competency_id: "5", slot_id: 3 },
  { desc: "Promote efficient and effective communication by using a common vocabulary for software testing",
    evidence: "+ Không sử dụng nhầm lẫn các khái niệm căn bản nhất về software testing:
    Testing vs Debugging
    Error vs Defect / Fault / Bug vs Failure 
    Test Levels: Component Testing, Intergration In Small Testing, System Testing, Intergration In Large Testing, UAT 
    Test types: functional vs non-functional, white-box testing, black-box testing 
    Confirmation testing (re-test) and Regression Testing 
    Typical Test design techniques (Equivalance partioining, Boundary Values Analysis, Decision Table, State Transition,..)
    + Giải thích một cách thuyết phục cho người khác về lý do tại sao phải thực hiện các hoạt động software testing trong dự án. Mô tả được \
     một cách chính xác và chi tiết các hoạt động test trong test process.
    + Có bằng chứng về việc sử dụng chính xác các thuật ngữ cơ bản về software testing trong ít nhất 1 dự án. Nếu bị khách hàng hay đồng nghiệp \
    complain về việc không dùng đúng thuật ngữ software testing --> Phản ví dụ cho slot này", level: 1, competency_id: "6", slot_id: 1 },
  { desc: "Understand fundamental concepts of software testing",
    evidence: "- Nắm được mục đích của Test Plan 
    - Hiểu được pros and cons của các Test Approaches khác nhau (quan trọng nhất là Test types and Test Levels được áp dụng vào dự án)  
    - Hiểu được cấu trúc của một test report tốt 
    - Hiểu được sự ảnh hưởng của configuration management đối với hoạt động testing 
    Nếu đã từng tham gia vào quá trình Create / Update hoặc review Test Plan and / or Test Report ờ ít nhất 1 dự án được xem là bằng chứng để pass slot này", level: 1, competency_id: "6", slot_id: 2 },
  { desc: "Demonstrate understanding of how different development and testing practices, and different constraints on testing may apply in \
    optimizing testing to different contexts",
    evidence: "- Hiểu được ngữ cảnh của dự án (industry domain, development methodology) và mối quan hệ giữa các hoạt động phát triển phần\
                mềm (Requirements Development and Management, Technical Solutiona and Product Integration, Release,..) 
               - Hiểu được lý do tại sao phải chọn mô hình / qui trình phát triển phần mềm phù hợp với ngữ cảnh của dự án và đặt tính của software \
                system mà dự án sẽ phát triển. 
               - Hiểu và xác định được các hoạt động test cần thực hiện vào bất kỳ giai đoạn nào của dự án (bao gồm cả giai đoạn maintenance)
               - Việc tham gia / đóng góp ý kiến cải tiến qui trình testing của dự án / công ty và được EPG đồng ý chỉnh sửa là bằng chứng để pass \
               slot này.", level: 1, competency_id: "6", slot_id: 3 },
  { desc: "Understand the value that software testing brings to stakeholders",
    evidence: "- Giải thích rõ ràng, xúc tích giá trị của hoạt động testing đang thực hiện trong dự án với bất kỳ đối tượng nào bên trong và \
    bên ngoài dự án bao gồm khách hàng của dự án (Ví dụ 1: dự án vào giai đoạn UAT, khách hàng không involve vào hoạt động test như kế hoạch \
     vì họ không hiểu được giá trị của hoạt động UAT, giải thích và thuyết phục được khách hàng làm UAT theo kế hoạch --> bằng chứng mạnh để \
     pass slot này. Ví dụ 2: Developer không thực hiện hoạt động Unit/Component testing hay Integration Testing vì không hiểu giá trị của các \
     hoạt động test này, giải thích và thuyết phục được developers thực hiện Unit Testing, Integration Testing --> 1 bằng chứng khác cho slot này) 
    - Giải thích được giá trị của việc dùng / bảo trì RTM đối với hoạt động testing. Việc cập nhật tài liệu RTM trong quá trình thực hiện các hoạt \
    động test là bằng chứng của slot này.", level: 2, competency_id: "6", slot_id: 1 },
  { desc: "Appreciate how testing activities and work products align with project objectives, measures and targets",
    evidence: "- Nắm được project objectives, measures và targets của dự án như (Deliverables, Release schedule, Defect Density, Defect Leakage, Test \
    Coverage,..) từ đó tìm ra cách thức thực hiện các hoạt động test (bao gồm việc thiết kế test cases, test procedures, execute test cases, report \
     defects) nhằm giúp dự án đạt được các objectives, measures và target. Để pass được slot này cần đảm bảo không có release nào của dự án bị trễ \
     deadline do việc chậm trễ của các hoạt động test.", level: 2, competency_id: "6", slot_id: 2 },
  { desc: "Determine the appropriate types of functional testing to be performed.",
    evidence: "- Xác định và lựa chọn đúng loại functional testing cần thực hiện dựa vào ngữ cảnh của dự án (Time, scope, cost, risk, \
    quality,..) nhằm đạt được các mục tiêu về quality như defect density, số lượng defect, defect leakage. Ví dụ như xác định được \
    phạm vi / mức độ / effort để thực hiện regression test / confirmation test khi có sự thay đổi trên software system (defects fixing, \
     change requests, migration,..).
    - Xác định được mức độ / effort cho việc thực hiện smoke testing / sanity testing trước khi release", level: 2, competency_id: "6", slot_id: 3 },
  { desc: "Determine the proper prioritization of the testing activities based on the information provided by the risk analysis.",
    evidence: " - Biết dựa vào các rủi ro (project and product risks) để xác định độ ưu tiên của: 
    + Test conditions (functions / features nào ưu tiến test trước) 
    + Test cases generation và đánh độ ưu tiên của các test cases 
    Ví dụ dự án gần đến dealines, thời gian test còn lại không nhiều thì cần thực hiện test tính năng nào trước, tính năng nào sao để đảm \
    bảo defect leakage là thấp nhất?", level: 2, competency_id: "6", slot_id: 4 },
  { desc: "Explain the benefits and drawbacks of independent testing",
    evidence: "
    Giải thích được lợi ích và nguy cơ của các cách thức tổ chức hoạt động testing trong dự án / công ty bao gồm các mức độ sau: 
    + Developer test code do chính họ khác viết ra 
    + Developer này test code do developer viết ra 
    + Có các bạn tester (QC) độc lập trong dự án sẽ thực hiện việc test app / system
    + Có team QC độc lập sẽ thực hiện hoạt động test app / system cho tất cả các dự án khác nhau  trong công ty 
    + Công ty bên ngoài làm dịch vụ test app / system cho các dự án khác nhau trong công ty 
    Ví dụ: khách hàng không muốn có vị trí QC trong dự án mà yêu cầu developer test --> có thể giải thích với khách hàng những nguy cơ có \
    thể có khi developer test app / system do họ viết ra (tính chủ quan cao)", level: 1, competency_id: "7", slot_id: 1 },
  { desc: "Identify factors that influence the effort related to testing and explain the difference between two estimation techniques: the \
    metrics-based technique and the expert-based technique",
    evidence: "- Xác định được các yếu tố ảnh hưởng đến testing effort (test iterations, reporting time, waiting time until developers finish \
               defects fixing, tester knowledge and skills,..) --> Là tiền đề cho việc estimate testing effort một cách chính xác. 
               - Trong ngữ cảnh cụ thể của dự án mình đang làm, có thể xác định được khi nào cần dùng kỹ thuật estimate dựa trên các số liệu (historical \
                data), khi nào cần dùng kỹ thuật estimate dựa trên ý kiến chuyên gia (expert-based)
               Khi được leader / manager / customer hỏi về estimate của 1 hay nhiều hoat động test --> có thể break down / giải thích một cách thuyết phục \
               tại sao estimate như thế.", level: 1, competency_id: "7", slot_id: 2 },
  { desc: "Identify the testing tasks at test levels or/and test phases and perform task estimation (under supervision)",
    evidence: "- Xác định được các công việc cụ thể cần làm trong mỗi test level. Ví dụ như trong giai đoạn làm System Test thì cần làm gì? Trong giai \
    đoạn UAT thì cần làm gì?. 
    - Có thể breakdown các công việc thành các công việc nhỏ và chi tiết hơn, từ đó thực hiện việc estimate chính xác cho các công việc này \
    (thông qua việc vận dụng các estimate techniques hợp lý, +/-10%)", level: 1, competency_id: "7", slot_id: 3 },
  { desc: "Differentiate between various test strategies",
    evidence: "Phân biệt được các test strategies khác nhau, trả lời được các câu hỏi sau một cách rõ ràng và chính xác:  
    - Test objetives của dự án là gì?  (ví dụ như: test coverage, #defect trên từng giai đoạn của dự án, Defect Density, Defect Leakage,..)\
    . Test objectives có tầm quan trọng như thế nào đối với sự thành công của dự án ít nhất là khía cạnh Quality.
    - Dự án cần thực hiện test levels nào? Tại sao cần thực hiện test levels đó? Mỗi test levels (Unit Testing, Integration Testing In Small \
     and In Large, System Testing, UAT) có mục tiêu như thế nào? Mục tiêu này góp phần như thế nào để đạt được Test Objectives? 
    - Các test types nào cần thực hiện? Tại sao lại thực hiện các test types nào? 
    - What are methods to conduct testing activities?", level: 1, competency_id: "7", slot_id: 4 },
  { desc: "Identify Entry and Exit criteria for testing activities at given projects.",
    evidence: "- Xác định được các điều kiện đầu vào (cần và đủ để 1 hoạt động test nào đó của dự án được tiến hành). Nếu developer giao ứng \
    dụng cứ thế test mà không kiểm tra điều kiện đầu vào thì không thể pass slot này được. QC chỉ tiến hành các hoạt động test khi ứng dụng \
    đạt được chất lượng thoả các điều kiện mô tả trong Entry Criteria (ví dụ vừa test được vài test cases mà quá nhiều defect --> có thể không \
     tiếp tục test nữa, trả về lại đội developer kiểm tra lại...) 
    - Xác định được khi nào dừng hoạt động test - là một dạng của definition of done (vd: quá nhiều defect được tìm thấy trên 1 tính năng, UI / \
     UX quá lệch so với design, các tính năng của ứng dụng quá khác so với yêu cầu của khách hàng, deadline đã đến,..). Việc QC cứ cố test bất chấp \
     Exit Criteria là phản ví dụ để pass slot này (đáng ra phải dừng hoạt động test để thực hiện các corrective actions khác,..)",
    level: "1",
    competency_id: "7", slot_id: 5 },
  { desc: "Able to write a defect report, covering defects found during testing",
    evidence: "- Có thể viết defect report để ghi nhận các defect tìm thấy trong suốt quá trình test. Một defect report tốt cần thoả ít \
    nhất các điều kiện sau: \n
    + SUT (System Under Test) version \n
    + Test Environment (Browsers, OS, Devices types, hardware,..) \n
    + Defect Description and Steps to re-produce the defect \n
    + Test Date / Tester \n
    Nếu viết defect report mà thường xuyên bị developer phản bác --> invalid defect -> phản ví dụ cho slot này. \n
    Nếu có nhiều defect không thể re-produce được (về nguyên tắc không thể ghi nhận như một defect) là phản ví dụ khác của slot này",
    level: "1",
    competency_id: "7", slot_id: 6 },
  {
    desc: "Understand test management principles for resources, strategies, planning, project control, and risk management",
    evidence: "Đây là slot đánh giá kiến thức về test management (nền tãng để bắt đầu việc lead một team QC / lead hoạt động test của dự án).\n 
             - Hiểu được các nguyên tắc chung trong việc quản lý resources, strategies, planning, project control và risks liên quan đến hoạt động \
             testing bao gồm: 
             + Xác định được Test strategies phù hợp với dự án: tương tự slot 1d \n
             + Hiểu được Test Plan contents \n
             + Xác định Test Approaches phù hợp cho dự án \n
             + Biết cách đánh độ ưu tiên cho hoạt động test bao gồm hoạt động viết test cases \n
             + Xác định được các yếu tố có ảnh hưởng đến effort của hoạt động testing \n
             + Xác định được testing scope và how to control it \n
             Nếu đã từng tham gia viết test plan cho ít nhất 1 dự án size từ 10 man-month trở lên được xem là bằng chứng cho slot này.",
    level: "2",
    competency_id: "7", slot_id: 1,
  },
  {
    desc: "Identify different options for test selection, test prioritization and effort allocation",
    evidence: "- Xác định được các options khác nhau trong việc lựa chọn cách thức test, test levels, test types, test suite \n
             - Xác định được độ ưu tiên của các hoạt động test (dựa trên các mục tiêu khác nhau của dự án) \n
             - Biết cách allocate resources cho testing activities của dự án \n
             - Nếu đã từng lead system testing (là người chịu trách nhiệm chính) cho ít nhất 1 release của dự án thì được xem là bằng chứng \
             để pass slot này",
    level: "2",
    competency_id: "7", slot_id: 2,
  },
  {
    desc: "For a given project, able to create an estimate for all test process activities, using all applicable estimation techniques",
    evidence: "- Nắm được các kỹ thuật estimate (metrics-based or expert-based), có thể tạo WBS và estimate chính xác (+/-10%) cho công việc \testing của dự án. Nếu đã từng tham gia estimate cho phần testing của các dự án tiềm năng thì là bằng chứng tốt cho slot này. 
    - Nếu có bất kỳ release nào của dự án bị trễ deadlines do hoạt động testing mà QC chịu trách nhiệm chính thì đây là phản ví dụ cho slot này.",
    level: "2",
    competency_id: "7", slot_id: 3,
  },
  {
    desc: "Able to assit in test plan creation",
    evidence: "- Tham gia vào quá trình tạo test plan (nhưng không phải là người ch��u trách nhiệm chính) ở ít nhất 2 dự án với qui mô 10 man \
    month trở lên hoặc chịu trách nhiệm chính trong việc tạo test plan của dự án với qui mô từ 20 man-month trở lên.",
    level: "2",
    competency_id: "7", slot_id: 4,
  },
  {
    desc: "Able to compare the different dimensions of test progress monitoring",
    evidence: "- Có khả năng xác định được các metrics / measures để monitor progress của hoạt động testing. Biết được tại sao lại sử dụng các \
    metrics / measures này. 
    - Đã từng monitor và control hoạt động testing ít nhất 1 release của dự án ",
    level: "2",
    competency_id: "7", slot_id: 5,
  },
  {
    desc: "Able to write a progress report for testing activities against test plan",
    evidence: "- Có khả năng viết test progress report (vs test plan) khi được yêu cầu bởi Project Manager hay customer.  
    - Đã viết Test Summary Report cho c������������������������c release được xem là bằng chứng của slot n����y.",
    level: "2",
    competency_id: "7", slot_id: 6,
  },
  {
    desc: "Identify, and assess product quality risks, summarizing the risks and their assessed level of risk based \
    on key project stakeholder perspectives",
    evidence: "- Tham gia vào quá trình xác định / đánh giá (có đề xuất được risk responses) các risks liên quan đến sản \
    phẩm (product risks). Có thể trình bày các risks này cho các stakeholders của dự án (bao gồm Project Manager vả Customer). \
    Nếu trong danh sach risks của dự án có ghi nhận risk do QC xác định, đánh giá thì đó là bằng chứng tốt cho slot này.",
    level: "2",
    competency_id: "7", slot_id: 7,
  },
  {
    desc: "Create and implement test plans consistent with project management plan",
    evidence: "- Là người chịu trách nhiệm chính (accountable) trong việc tạo Test Plan (ít nhất 2 dự án với qui mô từ 10 man-month trở lên)
    - Test Plan cần đảm bảo tương thích với các phần khác của Project Management Plan ",
    level: "3",
    competency_id: "7", slot_id: 1,
  },
  {
    desc: "Continuously monitor and control the test activities to achieve project objectives.",
    evidence: "- Là nguời chịu trách nhiệm chính cho toàn bộ hoạt ��ộng test của dự án 
    Đã lead testing activities thành công (các release thành công) ở ít nhất 2 dự án có qui mô từ 20 man-month trở lên được xem \
    là bằng chứng mạnh để pass slot này",
    level: "3",
    competency_id: "7", slot_id: 2,
  },
  {
    desc: "Assess and report relevant and timely test status to project stakeholders.",
    evidence: "- Là người nắm rõ nhất về trạng thái của các hoạt động testing trong dự án, có khả năng phân tích, đánh giá và viết báo \
    cáo về progress cũng như các khía cạnh khác của hoạt động test trong dự án như (test coverage, #defect, defect leakage,..) \n
    - Thường xuyên đưa ra các đề xuất, đánh giá hỗ trợ Project Manager / Customer ra các quyết định về release hay go-live",
    level: "3",
    competency_id: "7", slot_id: 3,
  },
  {
    desc: "Ensure proper communication within the test team and with other project stakeholders.",
    evidence: "- Slot này liên quan đến kỹ năng communication 
    - Có khả năng giao tiếp hiệu quả với những thành viên trong dự án cũng như customers về: test progress, defects, test coverage)",
    level: "3",
    competency_id: "7", slot_id: 4,
  },
  {
    desc: "Organize and lead risk identification and risk analysis sessions and use the results of such sessions for test estimation, \
    planning, monitoring and control.",
    evidence: "- Là người chịu trách nhiệm chính (lead) các hoạt động liên quan đến xác định và phân tích các risks liên quan đến testing \
    (bao gồm product and project risks). 
    - Có khả năng dựa vào kết quả phân tích risks để estimate, plan, monitor và control các hoạt động test của dự án. 
    - Đã từng lead hoạt động testing thành công ở ít nhất 1 dự án có qui mô từ 20 man-month trở lên và được đánh giá là dự án tight shedule.",
    level: "3",
    competency_id: "7", slot_id: 5,
  },
  {
    desc: "Identify skills and resource gaps in their test team and participate in sourcing adequate resources.",
    evidence: "- Đã từng lead 1 team ít nhất 3 QC, là người chịu trách nhiệm chính trong việc xác định training needs, tạo training plan cho \
    toàn bộ thành viên của team và tham gia phỏng vấn ứng viên cho vị trí QC (ít nhất 3 ứng viên) ở cấp độ công ty.",
    level: "3",
    competency_id: "7", slot_id: 6,
  },
  {
    desc: "Identify and plan necessary skills development within their test team.",
    evidence: "- Là người chịu trách nhiệm chính trong việc đào tạo, phát triển kỹ năng của team QC trong dự án hoặc đội ngũ QC trong công ty",
    level: "3",
    competency_id: "7", slot_id: 7,
  },
  {
    desc: "Manage a testing project by implementing the mission, goals and testing processes established for the testing organization.",
    evidence: "- Là Project Manager của một dự án về testing. 
    - Chịu trách nhiệm chính trong việc định nghĩa qui trình testing cho toàn bộ dự án (với qui mô từ 20 man-month trở lên) and / or xây dựng \
    qui trình testing cho công ty.
    - Là người chịu trách nhiệm chính trong việc xác định 1 testing tool, đưa testing tool này sử dụng thành công ở các dự án trong công ty \
    (như Defect Management System, Automation Testing tool,...)",
    level: "4",
    competency_id: "7", slot_id: 1,
  },
  {
    desc: "Propose a business case for test activities which outlines the costs and benefits expected.",
    evidence: "- Có thể viết 1 business case cho các hoạt động testing của dự án / cấp độ công ty thông qua các phân tích về cost -benefit? \
    Ví dụ như dự án / công ty muốn ",
    level: "4",
    competency_id: "7", slot_id: 2,
  },
  {
    desc: "Participate in and lead test process improvement initiatives.",
    evidence: "- Tham gia và lead các hoạt động cải tiến qui trình testing của công ty",
    level: "4",
    competency_id: "7", slot_id: 3,
  },
  {
    desc: "Able to identify test conditions (features to be tested) based on test basis (project documents related to testing activities)",
    evidence: "- Có khả năng xác định được những tính năng (functions / features) nào cần test dựa vào các tài liệu về requirements \
    (User Requirements Document, Software Requirement Specification, User Stories,..) 
    - Khả năng xác định test conditions tốt được thể hiện thông qua bộ test cases mà QC viết ra (bất kỳ feature nào cũng có bộ test cases \
      tương ứng để test). ",
    level: "1",
    competency_id: "8", slot_id: 1,
  },
  {
    desc: "Working knowledge of at least one test design techniques that matches the project's objectives",
    evidence: "- Có kiến thức hoặc đã được training ít nhất 1 test design techniques
    + Equivalence Partitioning 
    + Boundaries Value Analysis 
    + State Transition 
    + Decision Table 
    + Usage-based statistical  
    + Cause-Effect graphing 
    + Use Case testing",
    level: "1",
    competency_id: "8", slot_id: 2,
  },
  {
    desc: "Able to apply test design techniques to develop test cases for a given project",
    evidence: " Đã từng viết test cases cho ít nhất dự án có sử dụng 2/5 các kỹ thuật test design sau: 
    + Equivalence Partitioning 
    + Boundaries Value Analysis 
    + State Transition 
    + Decision Table 
    + Usage-based statistical  
    + Cause-Effect graphing 
    + Use Case testing",
    level: "1",
    competency_id: "8", slot_id: 3,
  },
  {
    desc: "Follow best practices for good test cases development",
    evidence: "- Tuân thủ các best practices for good test cases bao gồm: 
    + Effective to find defects 
    + Exemplary: represent others 
    + Evolvable: easy to maintain 
    + Economic: cheap to use 
    Nếu như viết test cases mà bị vi phạm một trong các nguyên tắc sau thì được xem là phản ví dụ cho slot này: 
    + Defect leakage không đạt mặc dù các test cases đã được run như kế hoạch (chứng tỏ test cases viết ra chưa hiệu quả để tìm defect dẫn đến còn nhiều defect trong ứng và khách hàng đã phát hiện được) 
    + Có nhiều test cases duplicate nhau (đặc biệt phần Test Cases procedure có nhiều bước giống nhau) 
    + Test case quá phức tạp để cập nhật khi có change request (về requirments) 
    + Test Case Procedure có quá nhiều step (>= 10 steps)",
    level: "1",
    competency_id: "8", slot_id: 4,
  },
  {
    desc: "Able to design test environment set-up and identify required infrastruture and tools for testing activities",
    evidence: "- Có thể set up test environment như được mô tả trong test plan. Nếu hoạt động test bị trễ do test environment chưa sẵn \
    sàng bao gồm (Hardware, Tools, OS, devices,..) thì được xem là phản ví dụ cho slot này. 
    - Test environment có thể được set up bởi developer trong một số tình huống như QC phải là người chịu trách nhiệm chính về việc \
    verify xem test environment đó đã sẵn sàng cho việc execute test hay chưa. 
    - Test evironment có thể thay đổi tuỳ theo giai đoạn test (System Testing / UAT)
    - Nếu có nhiều defect được report sau đó phát hiện là do mistakes của QC / Developer tạo ra trong quá trình set up test environment \
      thì cũng được xem là phản ví dụ cho slot này.",
    level: "1",
    competency_id: "8", slot_id: 5,
  },
  {
    desc: "ble to use traceability to check completeness and consistency of defined test conditions with respect to the test objectives, \
    test strategy, and test plan as well as designed test cases with respect to the defined test conditions",
    evidence: "- Có khả năng sử dụng 1 loại traceability matrix nào đó để theo dõi việc hoàn tất và tính nhất quán của test conditions (Features \
    to be tested) với test objectives, test strategies và test plan, test cases. 
    - Cập nhật Testing Traceabilty Matrix (vd: Test Case Specification) và các tools khác trong dự án để đảm bảo test conditions được trace nhiều \
    chiều: giữa các test conditions và giữa test conditions với test objectives, test strategies, test cases.
    Khi được hỏi thì mất không quá 5 phút để biết mối quan hệ giữa các giữa test conditions và test objectives, test strategies, test cases",
    level: "2",
    competency_id: "8", slot_id: 1,
  },
  {
    desc: "Able to use established techniques for designing tests at applicable test levels",
    evidence: "- Có khả năng sử dụng các k��� thuật thiết kế test (mô t��� trong slot 1c) đã được defined để thiết kế test cases, test suites. 
    - Năng lực này cần được thể hiện ở nhiều test levels khác nhau (System Testing và UAT support) 
    - Việc chịu trách nhiệm chính cho việc viết test cases cho ít nhất 2 module quan trọng của dự án  với qui mô từ 20 man-month trở lên được xem là \
    bằng chứng của slot nảy. ",
    level: "2",
    competency_id: "8", slot_id: 2,
  },
  {
    desc: "Able to describe pros and cons in the application of test design techniques ",
    evidence: "- Hiểu và mô tả được điểm mạnh và điểm yếu của từng loại test design techniques khác nhau. Áp dụng thành công 6/7 test design \
    techniques (slot 1c) ở ít nhất 2 dự án có qui mô từ 20 man-month trở lên.",
    level: "2",
    competency_id: "8", slot_id: 3,
  },
  {
    desc: "Able to conduct technical reviews for testing work products",
    evidence: "- Có khả năng tổ chức technical review (đóng vai trò lead / reviewer) cho testing work products:  
    + Test Plan 
    + Test Cases Specification  
    + Test Procedure 
    + Testing Traceability Matrix 
    - Là người chịu trách nhiệm chính trong việc tạo ra checklist cho technical review. Các checklist này phải hiệu quả để tìm ra \
    defect của những work product được đem ra review. 
    - Là người chịu trách nhiệm chính trong việc thực hiện các hoạt động follow-up sau technical review 
    - Cần thể hiện năng lực này ở ít nhất 2 dự án có qui mô 20 man-month trở lên hoặc 1 dự án có qui mô từ 30 man-month trở lên",
    level: "2",
    competency_id: "8", slot_id: 4,
  },
  {
    desc: "Display the ability to quickly absorb the core concepts of new testing techniques in personal context and can effectively apply it to the project (Note: the technology and concepts must be in demand within our client base \
    to be recognized here)",
    evidence: "- Có khả năng tiếp thu nhanh chóng những khái niệm cốt lõi của một kỹ thuật (test analysis and design techniques mới), \
    công nghệ mới (vd như new automation testing framwork, new testing mothodologies) ở vai trò của mình và áp dụng hiệu quả vào dự án.
    Hiệu quả công việc do áp dụng kiến thức vừa học là bằng chứng mạnh để đánh giá slot này.    
    Tổng thời gian áp dụng kiến thức mới vừa học vào dự án ít nhất 6 tháng và có kết quả chứng minh được hiệu quả của việc áp dụng.     
    Hoặc đã tìm hiểu và áp dụng được nhiều công nghệ mới vào dự án mà kết quả áp dụng các công nghệ đó được người  quản lý đánh giá cao. \
    Tổng thời gian áp dụng những công nghệ mới là 6 tháng     
    Phản ví dụ: Đã tìm hiểu nhưng hiểu sai, hiểu không chính xác những khái niệm cốt lõi của một công nghệ, kỹ thuật nào đó.    
    Phản ví dụ: Thi lần đầu bị failed    
    Kết quả thi là một bằng chứng để làm rõ thêm việc thấu hiểu các kiến thức đã học",
    level: "2",
    competency_id: "8", slot_id: 5,
  },
  {
    desc: "Select and apply appropriate testing techniques to ensure that tests provide an adequate level of confidence, \
    based on defined coverage criteria.",
    evidence: "- Lựa chọn và áp dụng thành công testing techniques phù hợp với dự án thông qua việc hiểu biết tốt về pros and cons \
    của từng testing technique. Việc lựa chọn đúng testing techniques giúp cho toàn bộ dự án đủ mức độ tự tin chuyển giao bất kỳ \
    release cho khách hàng. 
    - Việc lựa chọn và áp dụng thành công testing techniques phù hợp được thể hiện thông qua kết quả của hoạt động testing: 
    + Nếu là giai đoạn trước release: số lượng defect được tìm thấy là tối đa, tất cả các test conditions đều đã được test.
    + Nếu là giai đoạn sau release: defect leakage là tối thiểu 
    - Là người chịu trách nhiệm chính trong việc lựa chọn testing techniques của dự án (phần Test Strategy của Test Plan).  
    - Năng lực này cần được thể hiện ở ít nhất 2 dự án có qui mô 20 man-month trở lên hoặc 1 dự án từ 30-50 man-month trở lên",
    level: "3",
    competency_id: "8", slot_id: 6,
  },
  {
    desc: "Analyze a given scenario, including a project description and lifecycle model, to determine appropriate tasks for the Tester \
    during the analysis and design phases and to determine the most appropriate use for low-level (concrete) and high-level (logical) test cases",
    evidence: "- Là người chịu trách nhiệm chính cho toàn bộ quá trình phân tích và thiết kế test: 
    + Xác định test conditions 
    + Test Design: thiết kế test cases, thiết kế test suites 
    + Xác định được các mối quan hệ giữa test conditions, test cases, test suites
    + Đánh độ ưu tiên của test cases, test suites  
    + Thiết kế test environment và test data 
    - Năng lực này cần được thể hiện ở ít nhất 2 dự án có qui mô 20 man-month trở lên hoặc 1 dự án từ 30-50 man-month trở lên",
    level: "3",
    competency_id: "8", slot_id: 7,
  },
  {
    desc: "Analyze a system, or its requirement specification, in order to determine likely types of defects to be found and select \
    the appropriate testing technique(s)",
    evidence: "- Đây là slot thể hiện level cao về việc phân tích và thiết kế test. Người đạt được slot này có năng lực nhìn vào requirments \
    specification có thể xác định được loại defect nào sẽ có thể xảy ra trong dự án từ đó lựa chọn được các testing techniques phù hợp nhằm ngăn \
    chặn, tìm ra các loại defect này",
    level: "3",
    competency_id: "8", slot_id: 8,
  },
  {
    desc: "Able to interpret and execute tests from given test specifications",
    evidence: "- Có khả năng đọc hiểu các tài liệu đặc tả test bao gồm:
    + Test Case specification 
    + Test Procedure specification 
    + 'How to test' document
    - Có khả năng execute tests theo những gì đã được mô tả trong Test Procedure
    - Execute test mà không dựa vào bất cứ tài liệu hay đặc tả test nào thì được xem là phản ví dụ cho slot này. 
    - Đã từng tham gia excute test cho ít nhất 2 releases quan trọng của 1 dự án có qui mô từ 20 man-month trở lên hoặc chịu trách nhiệm chính \
    trong việc execute tests cho 1 release quan trọng của 1 dự án có qui mô từ 20 man-month trở lên.",
    level: "1",
    competency_id: "9", slot_id: 1,
  },
  {
    desc: "Able to log outcomes of test execution and able to compare actual outcome with expected outcome",
    evidence: "- Có khả năng ghi nhận chính xác, đầy đủ kết quả của test execution (quan trọng nhất là việc ghi nhận actual result và so sánh với expected results). Một actual result tốt cần: 
    + Dễ dàng so sánh với Expected Result --> Xác định xem có phải là 1 failures hay không 
    + Có đầy đủ thông tin để hỗ trợ tốt cho developer trong việc tìm ra nguyên nhân của defect / failures 
    + Customer hay higher management có thể dễ dàng hiểu được 
    - Nếu đã từng có kinh nghiệm tham gia execute tests, cập nhật kết quả test vào trong Test Cases Specification and / or Defect Tracking System / \
    viết Incident Report thì được xem là bằng chứng của slot này. Bằng chứng này cần được thể hiện ở ít nhất 2 dự án với qui mô bất kỳ.",
    level: "1",
    competency_id: "9", slot_id: 2,
  },
  {
    desc: "Able to re-execute the tests that previously failed in order to confirm a fix",
    evidence: " - Có khả năng thực hiện confirmation tests (sau khi fix bugs hoặc hiện thực change request) 
    - Là người chịu trách nhiệm chính về hoạt động test cho ít nhất 1 dự án đang trong giai đoạn maintenance (bằng chứng tốt cho slot này).  
    - Nếu có bất kỳ defect nào của dự án sau khi developers đã fix và QC đã confirmed mà sau đó bị re-open thì được xem là phản ví dụ cho slot này.",
    level: "1",
    competency_id: "9", slot_id: 3,
  },
  {
    desc: "Able to report test results in proper maner",
    evidence: "- Có năng lực viết các loại báo cáo kết quả test theo nhiều view khác nhau: 
    + Customer: dựa vào đánh giá được chất lượng của software system
    + Higher management: dự vào để theo dõi tiến độ dự án, mục tiêu dự án và ra quyết định release
    + QC team: dựa vào để theo dõi tiến độ, mục tiêu testing
    + Developer team: tìm root cause
    + QA team: cải tiến qui trình  
    - Nếu đã từng viết ít nhất 2 Test Summary Reports cho các releases của 1 dự án với qui mô từ 20 man-month trở lên và các Test Summary \
    Reports này \
    được chấp nhận bởi khách hàng hay higher mangement thì được xem là bằng chứng mạnh của slot này.",
    level: "1",
    competency_id: "9", slot_id: 4,
  },
  {
    desc: "Contribute effectively in project reviews",
    evidence: "- Tham gia hiệu quả các hoạt động review của dự án (đặc biệt là các buổi technical review) 
    - Trong vai trò reviewer, tham gia hiệu quả nghĩa là phải có bước chuẩn bị, tiến hành review và tìm ra được các defect tương ứng. \
    Nếu tham gia review nhưng không bao giờ hoặc tìm ra được rất ít defect hoặc không chuẩn bị trước review thì được xem là phản ví dụ của slot này. 
    - Nếu đã từng lead thành công ít nhất 2 technical reviews (có sự tham gia của Technical Expert bao gồm Technical Lead, QC Lead, BA Manager / \
      BA Lead) cho testing work products bao gồm: 
    + Test Case Specification 
    + Test Procedure Specification 
    thì được xem là bằng chứng mạnh cho slot này.",
    level: "1",
    competency_id: "9", slot_id: 5,
  },
  {
    desc: "Able to understand when to start test execution based on defined entry criteria",
    evidence: "- Xác định được các điều kiện đầu vào (cần và đủ để 1 hoạt động test nào đó của dự án được tiến hành). Nếu developer giao ứng dụng \
    cứ thế test mà không kiểm tra điều kiện đầu vào thì không thể pass slot này được. QC chỉ tiến hành các hoạt động test khi ứng dụng đạt được \
    chất lượng thoả các điều kiện mô tả trong Entry Criteria (ví dụ vừa test được vài test cases mà quá nhiều defect --> có thể không tiếp tục test \
      nữa, trả về lại đội developer kiểm tra lại...)  
    - Xác định được khi nào dừng hoạt động test - là một dạng của definition of done (vd: quá nhiều defect được tìm thấy trên 1 tính năng, UI/UX \
      quá lệch so với design, các tính năng của ứng dụng quá khác so với yêu cầu của khách hàng, deadline đã đến,..). Việc QC cứ cố test bất chấp \
      Exit Criteria là phản ví dụ để pass slot này (đáng ra phải dừng hoạt động test để thực hiện các corrective actions khác,..)",
    level: "1",
    competency_id: "9", slot_id: 6,
  },
  {
    desc: "Able to create test suites from the test cases and able to create test data for efficient test execution",
    evidence: "- Có khả năng tạo test suites từ các test case đã được viết trước đó. Mỗi release của dự án phải có ít nhất 1 test suite tương ứng.  
    - Có khả năng tạo test data cho test execution, test data có thể có nhiều định dạng khác nhau: 
    + Text --> có thể input trực tiếp vào mỗi test case  
    + Files (txt, doc, excel,..) 
    + Images, videos  
    + Database  
    + Any applicable format 
    - Nếu có bất kỳ sự chậm trễ nào của hoạt động test execution mà do test data bị sai hay chưa sẵn sàng thì xem là 1 phản ví dụ cho slot này. 
    - Tìm thấy defects nhưng sau đó trở thành invalid defects do dữ liệu test bị sai là 1 phản ví dụ khác của slot này. 
    - Sử dụng live data / dữ liệu thật của khách hàng cho hoạt động test là bị failed slot này. 
    - Nếu có khả năng generate test data bằng một công cụ hỗ trợ làm cho việc test của dự án hiệu quả hơn thì là bằng chứng mạnh để pass slot này. 
    - Cần có bằng chứng liên tục ở ít nhất 2 dự án có qui mô từ 20 man-month trở lên.",
    level: "2",
    competency_id: "9", slot_id: 1,
  },
  {
    desc: "For a given scenario, determine the steps and considerations that should be taken when executing tests",
    evidence: "- Có khả năng viết test procedures / test scripts cho 1 test execution session nào đó của dự án (thông thường là các release). \
    1 Test procedure / test script tốt thường gắn liền với khả năng phát triển các test suite tốt (slot 2a) và khả năng đánh độ ưu tiên hợp lý \
    cho các test cases / test suites 
    - Có khả năng viết các kịch bản test (test scenarios) theo các workflow mô tả trong các tài liệu về requirements. 
    - Nếu đã từng support khách hàng tiến hành UAT dựa trên các kịch bản (business scenarios) khác nhau trên thực tế được xem là bằng chứng của \
    slot này. 
    - Trước đây dự án chưa từng có Test Procedure mà cứ execute các test cases theo tính năng / nhóm tính năng --> hoạt động test không hiệu quả \
    --> QC viết Test Procedure --> hoạt động test hiệu quả hơn --> bằng chứng cho slot này. 
    - Nếu đã từng viết test scripts cho automation test thành công ở ít nhất 1 dự án được xem là bằng chứng mạnh cho slot này.",
    level: "2",
    competency_id: "9", slot_id: 2,
  },
  {
    desc: "Able to use traceability to monitor test progress for completeness and consistency with the test objectives, test strategy, and test plan",
    evidence: "- Có bằng chứng cho việc sử dụng một dạng traceability matrix hoặc 1 tool nào đó hỗ trợ việc trace tiến độ của hoạt động test với \
    test objectives, test stategies và test schedule. 
    - Nếu là người chịu trách nhiệm chính cho việc testing của 1 release nào đó của dự án, khi được yêu cầu có thể dùng traceability matrix để báo \
    cáo tiến độ testing cho higher management or customer 1 cách nhanh chóng. 
    - Chịu trách nhiệm update RTM (phần testing) cũng được xem là bằng chứng cho slot này.",
    level: "2",
    competency_id: "9", slot_id: 3,
  },
  {
    desc: "Effectively participate in formal and informal reviews with stakeholders, applying knowledge of typical mistakes made in work products.",
    evidence: "- Bằng chứng cho slot này giống slot 1e, tuy nhiên cần bổ sung thêm các bằng chứng liên quan đến khả năng có thể nhìn thấy trước các defect \
    điển hình / đặc thù trong từng loại Testing work products như Test Cases Specification, Test Procedure, Test environment. 
    - Thường xuyên đề xuất các giải pháp tốt để ngăn chặn các typical defects trên các Testing work products dựa trên sự hiếu biết, kinh nghiệm của \
    bản thân trong hoạt động technical review.",
    level: "2",
    competency_id: "9", slot_id: 4,
  },
  {
    desc: "Perform the appropriate testing activities based on the software development lifecycle being used.",
    evidence: "- Slot này thể hiện năng lựa lựa chọn các hoạt động test phù hợp cho dự án dựa trên software development lifecycle mà dự án áp dụng. \
    Ví dụ: Dự án theo mô hình Agile thì các hoạt động test sẽ được sắp xếp, tổ chức như thế nào? Việc viết test cases dựa trên user stories có khác \
    gì việc viết test cases dựa vào SRS? Có khác gì với dự án sử dụng mô hình Waterfall hay không? 
    - Trong từng giai đoạn trong software development lifecycle của dự án thì phải lựa chọn loại test nào phù hợp? Ví dụ như giai đoạn requirments, \
    design sử dụng nhiều hoạt động static testing hơn.. 
    - Đã từng tham gia và chịu trách nhiệm chính cho hoạt động test ở ít nhất 2 dự án sử dụng 2 software development lifecycle khác nhau được xem \
    là bằng chứng của slot này. 
    - Nếu là nguời tham gia đóng góp cải tiến qui trình test của dự án (ít nhất 2 dự án) hoặc ở cấp độ công ty cũng được xem là bằng chứng của slot \
    này.",
    level: "2",
    competency_id: "9", slot_id: 5,
  },
  {
    desc: "Assume responsibility for the usability testing for a given project.",
    evidence: "- Chịu trách nhiệm chính về usability testing ở ít nhất 2 dự án có qui mô từ 20 man-month trở lên",
    level: "2",
    competency_id: "9", slot_id: 6,
  },
  {
    desc: "Able to use defined exit criteria to evaluate when to stop testing activities",
    evidence: "- Biết dùng exit crieria để ra quyết định xem khi nào hoạt động test 1 release hay toàn bộ dự án được xem là hoàn tất. Ví dụ trước \
    khi release, còn 10 minor defects đã được tìm thấy nhưng vẫn chưa được fix thì QC có accept releases as 'QC Passed' hay tiếp tục chờ developers \
    fix hết các defects này sau đó làm confirmation test rồi mới accept 'QC passed'? 
    - Nếu dự án không có exit criteria thì sao? QC phải là người đề xuất, định nghĩa nó  
    - Nếu QC được hỏi 'hoạt động test hoàn tất chưa' mà không trả lời được 1 cách nhanh chóng thì xem là phản ví dụ cho slot này.",
    level: "2",
    competency_id: "9", slot_id: 7,
  },
  {
    desc: "Recognize and classify the typical risks associated with the performance, security, reliability, portability and maintainability \
    of software systems.",
    evidence: "- Xác định và phân loại được các rủi ro liên quan đến non-functional của hệ thống như về performance, security, reliability, portability \
    and maintainability.",
    level: "3",
    competency_id: "9", slot_id: 1,
  },
  {
    desc: "Outline the costs and benefits to be expected from introducing particular types of test automation.",
    evidence: "- Đề xuất, đánh giá chi phí và lợi ích của việc đưa một công cụ test tự động vào sử dụng trong dự án / công ty.",
    level: "3",
    competency_id: "9", slot_id: 2,
  },
  {
    desc: "Select appropriate tools to automate technical testing tasks.",
    evidence: "- Thông qua kết quá đánh giá, phân tích ở slot 3a, lựa chọn công cụ automation test phù hợp với dự án. ",
    level: "3",
    competency_id: "9", slot_id: 3,
  },
  {
    desc: "Classify test tools according to their purpose and the test activities they support ",
    evidence: "- Có khả năng nhận biết và phân loại các công cụ hỗ trợ cho hoạt động testing ví dụ như: 
    Requirements testing tools
    Static analysis tools
    Test design tools
    Test data preparation tools
    Test running tools - character-based, GUI
    Comparison tools
    Test harnesses and drivers
    Performance test tools
    Dynamic analysis tools
    Debugging tools
    Test management tools
    Coverage measurement ",
    level: "1",
    competency_id: "10", slot_id: 1,
  },
  {
    desc: "Identify benefits and risks of test automation",
    evidence: "- Nhận biết, xác định được lợi ích và rủi ro của automation test 
    - QC có bằng chứng cho việc đề xuất 1 công cụ automation test và được sử dụng thành công, \
    hiệu quả ở ít nhất 1 dự án với qui mô 10 man-month trở lên có thể passed slot này",
    level: "1",
    competency_id: "10", slot_id: 2,
  },
  {
    desc: "Identify the main principles for selecting a testing tool",
    evidence: "- Xác định được các nguyên tắc trong việc lựa chọn 1 automation tool đem vào sử dụng cho dự án hoặc công ty. 
    - QC có bằng chứng trong việc đã đánh giá, lựa chọn ít nhất 2 loại tools (trong slot 1a) và \
    các tools này được sử dụng thành công ở cấp độ dự án thì được xem là bằng chứng của slot này",
    level: "1",
    competency_id: "10", slot_id: 3,
  },
  {
    desc: "Able to execute at least one non-functional testing types based on test specification",
    evidence: "- Đã thực hiện thành công ít nhất một trong các loại non-functional testing như: 
    + Performance testing  
    + Load testing 
    + Security testing 
    + Usability testing 
    + Reliability testing 
    + Portability testing 
    + Maintainability testing 
    Cần có bằng chứng ở ít nhất 2 dự án mới được xem xét pass lot này",
    level: "1",
    competency_id: "10", slot_id: 4,
  },
  {
    desc: "Assist in the selection and implementation process of testing tools",
    evidence: "- Hỗ trợ việc đánh giá, hiện thực các qui trình cho việc sử dụng các công cụ hỗ trợ test (automation testing). 
    - Tham gia quá trình set up, UAT cho testing tools cũng được xem là bằng chứng của slot này. ",
    level: "2",
    competency_id: "10", slot_id: 1,
  },
  {
    desc: "Describe management issues when selecting an open-source tool or deciding on a custom tool",
    evidence: "- Giải thích được các vấn đề management khi lựa chọn open-source tools / custom tools (bao gồm các lỗ \
    hổng về bảo mật, mức độ support, các tính năng của công cụ phù hợp như thế nào đối với nhu cầu của dự án hoặc công ty)",
    level: "2",
    competency_id: "10", slot_id: 2,
  },
  {
    desc: "Describe how metric collection and evaluation can be improved by using tools",
    evidence: "- Hiểu và mô tả được hoạt động metrics collection và evaluation có thể được cải thiện như thế nào thông qua \
    việc sử dụng các công cụ hỗ trợ testing. 
    - Nếu dự án / công ty đang sử dụng công cụ hỗ trợ test do QC đề xuất và công cụ này giúp rút ngắn được thời gian thu \
      thập, đánh giá các metrics của dự án và QA team thì được xem là bằng chứng của slot này",
    level: "2",
    competency_id: "10", slot_id: 3,
  },
  {
    desc: "Able to use applicable testing techniques to design non-functional test cases",
    evidence: "- Có khả năng sử dụng các loại testing techniques khác nhau để thiết kế test cases cho non-function testing bao gồm:  
    + Performance testing  
    + Load testing 
    + Security testing 
    + Usability testing 
    + Reliability testing 
    + Portability testing 
    + Maintainability testing  
    Đã viết test cases cho ít nhất 2 loại non-functional testing mới được xem là bằng chứng cho slot này.",
    level: "2",
    competency_id: "10", slot_id: 4,
  },
  {
    desc: "Identify the success factors for evaluation, implementation, deployment, and on-going support of test tools in a given project",
    evidence: "- Hiểu được success factors cho việc đánh giá, hiện thực, triển khai, và on-going support cho 1 automation tool
    - QC có bằng chứng trong việc đã đánh giá, lựa chọn ít nhất 2 loại tools (trong slot 1a) và các tools này được sử dụng \
    thành công ở cấp độ công ty thì được xem là bằng chứng của slot này",
    level: "3",
    competency_id: "10", slot_id: 5,
  },
  {
    desc: "Assess a given situation in order to devise a plan for tool selection, including risks, costs and benefits",
    evidence: "- Tương đương với PM của dự án 'đánh giá và lựa chọn automation tools' ở cấp độ công ty. ",
    level: "3",
    competency_id: "10", slot_id: 6,
  },
]
slot_create.each do |s|
  Slot.create!(desc: s[:desc], evidence: s[:evidence], level: s[:level], competency_id: s[:competency_id], slot_id: s[:slot_id])
end

#Create Title Privileges
TitlePrivilege.create!(id: 1, name: "User Management")
TitlePrivilege.create!(id: 2, name: "User Group Management")
TitlePrivilege.create!(id: 3, name: "CDS-CDP Review")
TitlePrivilege.create!(id: 4, name: "Template Management")
TitlePrivilege.create!(id: 5, name: "CDS Assessment")
TitlePrivilege.create!(id: 6, name: "CDP Assessment")
TitlePrivilege.create!(id: 7, name: "Schedule Management")

#Create Privilges
privilege = [
  { id: 1, name: "Full Access on User Management", title_id: 1 },
  { id: 2, name: "View User Management", title_id: 1 },
  { id: 3, name: "Export Users", title_id: 1 },
  { id: 4, name: "Full Access on User Group Management", title_id: 2 },
  { id: 5, name: "View User Group Management", title_id: 2 },
  { id: 6, name: "Full Access on CDS-CDP Review", title_id: 3 },
  { id: 7, name: "Review CDS-CDP Review", title_id: 3 },
  { id: 8, name: "View CDS-CDP Review", title_id: 3 },
  { id: 9, name: "Full Access on Template Management", title_id: 4 },
  { id: 10, name: "View Template Management", title_id: 4 },
  { id: 11, name: "Full Access on CDS Assessment", title_id: 5 },
  { id: 12, name: "Full Access on CDP Assessment", title_id: 6 },
  { id: 13, name: "Full Access on schedule company", title_id: 7 },
  { id: 14, name: "Full Access on schedule project", title_id: 7 },
]
privilege.each do |s|
  Privilege.create!(id: s[:id], name: s[:name], title_privilege_id: s[:title_id])
end
#  test template
Group.create!(id: 31, name: "Administration", description: "Administration", status: 1)
Group.create!(id: 32, name: "BOD", description: "BOD", status: 1)
Group.create!(id: 33, name: "HR", description: "HR", status: 1)
Group.create!(id: 34, name: "Manager", description: "Manager", status: 1)
Group.create!(id: 35, name: "Reviewer", description: "Reviewer", status: 1)
Group.create!(id: 36, name: "Staff", description: "Staff", status: 1)

#  template HR
AdminUser.create!(id: 32, email: "nguyenvana@example.com", password: "password", password_confirmation: "password", first_name: "A", last_name: "Nguyen Van", account: "anv", role_id: "6", company_id: "3")
UserGroup.create!(group_id: 33, admin_user_id: 32)
GroupPrivilege.create!(group_id: 33, privilege_id: 9)
GroupPrivilege.create!(group_id: 33, privilege_id: 10)

AdminUser.create!(id: 33, email: "nguyenvanb@example.com", password: "password", password_confirmation: "password", first_name: "B", last_name: "Nguyen Van", account: "bnv", role_id: "5", company_id: "3")
UserGroup.create!(group_id: 32, admin_user_id: 33)
GroupPrivilege.create!(group_id: 32, privilege_id: 10)

AdminUser.create!(id: 34, email: "nguyenvanc@example.com", password: "password", password_confirmation: "password", first_name: "C", last_name: "Nguyen Van", account: "cnv", role_id: "4", company_id: "3")
UserGroup.create!(group_id: 33, admin_user_id: 34)
GroupPrivilege.create!(group_id: 33, privilege_id: 13)
#  test user management
AdminUser.create!(id: 35, email: "nguyenvand@example.com", password: "password", password_confirmation: "password", first_name: "D", last_name: "Nguyen Van", account: "dnv", role_id: "6", company_id: "3")
UserGroup.create!(group_id: 34, admin_user_id: 35)
GroupPrivilege.create!(group_id: 34, privilege_id: 1)

AdminUser.create!(id: 36, email: "nguyenvane@example.com", password: "password", password_confirmation: "password", first_name: "E", last_name: "Nguyen Van", account: "env", role_id: "6", company_id: "2")
UserGroup.create!(group_id: 35, admin_user_id: 36)
GroupPrivilege.create!(group_id: 35, privilege_id: 2)
ProjectMember.create!(admin_user_id: 36, project_id: 3, is_managent: "0")

Period.create!(id: 3, from_date: "2019-06-16", to_date: "2019-07-16")
Period.create!(id: 4, from_date: "2019-07-16", to_date: "2019-8-16")
Period.create!(id: 5, from_date: "2019-10-16", to_date: "2019-11-16")
Schedule.create!(admin_user_id: 34, company_id: 3, period_id: 3, start_date: "2020-01-01", end_date_hr: "2020-02-02", notify_hr: 5, desc: "Period 1", status: "Done")
Schedule.create!(admin_user_id: 34, company_id: 2, period_id: 4, start_date: "2020-03-01", end_date_hr: "2020-04-02", notify_hr: 6, desc: "Period 2", status: "Done")
Schedule.create!(admin_user_id: 34, company_id: 1, period_id: 5, start_date: "2020-05-18", end_date_hr: "2020-06-18", notify_hr: 3, desc: "Period 3", status: "New")