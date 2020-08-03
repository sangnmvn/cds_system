# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

#Delete all
FormSlotHistory.delete_all
TitleHistory.delete_all
LineManager.delete_all
Comment.delete_all
FormSlot.delete_all
Form.delete_all
Slot.delete_all
TitleMapping.delete_all
TitleCompetencyMapping.delete_all
Competency.delete_all
Template.delete_all
LevelMapping.delete_all
Title.delete_all
Approver.delete_all
UserGroup.delete_all
Schedule.delete_all
Period.delete_all
User.delete_all
# Role.delete_all
Project.delete_all
# Company.delete_all
Group.delete_all
ProjectMember.delete_all

User.create(id: 1, email: "admin@bestarion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "admin", last_name: "admin", account: "admin", role_id: "1", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2), title_id: rand(1..3))

User.create([
  { id: 2, role_id: 1, email: "staff01@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "staff01", last_name: "staff", account: "staff01", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 3, role_id: 2, email: "staff02@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "staff02", last_name: "staff", account: "staff02", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 4, role_id: 3, email: "staff03@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "staff03", last_name: "staff", account: "staff03", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 5, role_id: 5, email: "staff04@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "staff04", last_name: "staff", account: "staff04", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 6, role_id: 6, email: "staff05@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "staff05", last_name: "staff", account: "staff05", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 7, role_id: 7, email: "reviewer01@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "reviewer01", last_name: "reviewer", account: "reviewer01", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 8, role_id: 8, email: "reviewer02@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "reviewer02", last_name: "reviewer", account: "reviewer02", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 9, role_id: 9, email: "reviewer03@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "reviewer03", last_name: "reviewer", account: "reviewer03", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 10, role_id: 1, email: "reviewer04@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "reviewer04", last_name: "reviewer", account: "reviewer04", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 11, role_id: 2, email: "reviewer05@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "reviewer05", last_name: "reviewer", account: "reviewer05", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 12, role_id: 4, email: "approver01@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "approver01", last_name: "approver", account: "approver01", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 13, role_id: 4, email: "approver02@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "approver02", last_name: "approver", account: "approver02", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 14, role_id: 4, email: "approver03@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "approver03", last_name: "approver", account: "approver03", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 15, role_id: 16, email: "bod@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "bod", last_name: "bod", account: "bod", company_id: 3, joined_date: rand(12).years.ago, gender: true },
  { id: 16, role_id: 1, email: "staff01@bestarion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "staff01", last_name: "staff", account: "staff01", company_id: 2, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 17, role_id: 2, email: "staff02@bestarion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "staff02", last_name: "staff", account: "staff02", company_id: 2, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 18, role_id: 3, email: "staff03@bestarion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "staff03", last_name: "staff", account: "staff03", company_id: 2, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 19, role_id: 5, email: "staff04@bestarion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "staff04", last_name: "staff", account: "staff04", company_id: 2, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 20, role_id: 6, email: "staff05@bestarion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "staff05", last_name: "staff", account: "staff05", company_id: 2, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 21, role_id: 7, email: "reviewer01@bestarion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "reviewer01", last_name: "reviewer", account: "reviewer01", company_id: 2, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 22, role_id: 8, email: "reviewer02@bestarion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "reviewer02", last_name: "reviewer", account: "reviewer02", company_id: 2, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 23, role_id: 9, email: "reviewer03@bestarion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "reviewer03", last_name: "reviewer", account: "reviewer03", company_id: 2, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 24, role_id: 1, email: "reviewer04@bestarion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "reviewer04", last_name: "reviewer", account: "reviewer04", company_id: 2, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 25, role_id: 2, email: "reviewer05@bestarion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "reviewer05", last_name: "reviewer", account: "reviewer05", company_id: 2, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 26, role_id: 4, email: "approver01@bestarion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "approver01", last_name: "approver", account: "approver01", company_id: 2, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 27, role_id: 4, email: "approver02@bestarion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "approver02", last_name: "approver", account: "approver02", company_id: 2, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 28, role_id: 4, email: "approver03@bestarion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "approver03", last_name: "approver", account: "approver03", company_id: 2, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 29, role_id: 16, email: "bod@bestarion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "bod", last_name: "bod", account: "bod", company_id: 2, joined_date: rand(12).years.ago, gender: true },
  { id: 30, role_id: 1, email: "staff01@atalink.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "staff01", last_name: "staff", account: "staff01", company_id: 4, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 31, role_id: 2, email: "staff02@atalink.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "staff02", last_name: "staff", account: "staff02", company_id: 4, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 32, role_id: 3, email: "staff03@atalink.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "staff03", last_name: "staff", account: "staff03", company_id: 4, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 33, role_id: 5, email: "staff04@atalink.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "staff04", last_name: "staff", account: "staff04", company_id: 4, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 34, role_id: 6, email: "staff05@atalink.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "staff05", last_name: "staff", account: "staff05", company_id: 4, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 35, role_id: 7, email: "reviewer01@atalink.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "reviewer01", last_name: "reviewer", account: "reviewer01", company_id: 4, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 36, role_id: 8, email: "reviewer02@atalink.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "reviewer02", last_name: "reviewer", account: "reviewer02", company_id: 4, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 37, role_id: 9, email: "reviewer03@atalink.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "reviewer03", last_name: "reviewer", account: "reviewer03", company_id: 4, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 38, role_id: 1, email: "reviewer04@atalink.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "reviewer04", last_name: "reviewer", account: "reviewer04", company_id: 4, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 39, role_id: 2, email: "reviewer05@atalink.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "reviewer05", last_name: "reviewer", account: "reviewer05", company_id: 4, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 40, role_id: 4, email: "approver01@atalink.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "approver01", last_name: "approver", account: "approver01", company_id: 4, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 41, role_id: 4, email: "approver02@atalink.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "approver02", last_name: "approver", account: "approver02", company_id: 4, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 42, role_id: 4, email: "approver03@atalink.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "approver03", last_name: "approver", account: "approver03", company_id: 4, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 43, role_id: 16, email: "bod@atalink.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "bod", last_name: "bod", account: "bod", company_id: 4, joined_date: rand(12).years.ago, gender: true },
  { id: 44, role_id: 10, email: "hr01@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "hr01", last_name: "hr", account: "hr01", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 45, role_id: 10, email: "hr02@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "hr02", last_name: "hr", account: "hr02", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
  { id: 46, role_id: 10, email: "hr03@larion.com", password: "123QWEasd", password_confirmation: "123QWEasd", first_name: "hr03", last_name: "hr", account: "hr03", company_id: 3, joined_date: rand(12).years.ago, gender: rand(2) },
])

Project.create([
  { id: 1, name: "Mars", company_id: 3 },
  { id: 2, name: "IT", company_id: 3 },
  { id: 3, name: "FA", company_id: 3 },
  { id: 4, name: "Admin", company_id: 3 },
  { id: 5, name: "QM", company_id: 3 },
  { id: 6, name: "HR", company_id: 3 },
  { id: 7, name: "SDD2", company_id: 3 },
  { id: 8, name: "MSS", company_id: 2 },
  { id: 9, name: "CLS", company_id: 2 },
  { id: 10, name: "MIMS", company_id: 2 },
  { id: 11, name: "Integration Testing", company_id: 2 },
  { id: 12, name: "HUB", company_id: 2 },
  { id: 13, name: "QBO", company_id: 2 },
  { id: 14, name: "SCS", company_id: 2 },
  { id: 15, name: "CDS", company_id: 2 },
  { id: 16, name: "SnM", company_id: 2 },
  { id: 17, name: "Green Field", company_id: 4 },
  { id: 18, name: "Hot Sea", company_id: 4 },
  { id: 19, name: "Blue Sky", company_id: 4 },
  { id: 20, name: "CS", company_id: 4 },
])

ProjectMember.create([
  { id: 1, user_id: 2, project_id: 1 },
  { id: 2, user_id: 3, project_id: 1 },
  { id: 3, user_id: 4, project_id: 1 },
  { id: 4, user_id: 5, project_id: 1 },
  { id: 5, user_id: 6, project_id: 1 },
  { id: 6, user_id: 7, project_id: 1 },
  { id: 7, user_id: 8, project_id: 1 },
  { id: 8, user_id: 9, project_id: 1 },
  { id: 9, user_id: 10, project_id: 1 },
  { id: 10, user_id: 11, project_id: 1 },
  { id: 11, user_id: 12, project_id: 1 },
  { id: 12, user_id: 13, project_id: 1 },
  { id: 13, user_id: 14, project_id: 1 },
  { id: 15, user_id: 16, project_id: 15 },
  { id: 16, user_id: 17, project_id: 15 },
  { id: 17, user_id: 18, project_id: 15 },
  { id: 18, user_id: 19, project_id: 15 },
  { id: 19, user_id: 20, project_id: 15 },
  { id: 20, user_id: 21, project_id: 15 },
  { id: 21, user_id: 22, project_id: 15 },
  { id: 22, user_id: 23, project_id: 15 },
  { id: 23, user_id: 24, project_id: 15 },
  { id: 24, user_id: 25, project_id: 15 },
  { id: 25, user_id: 26, project_id: 15 },
  { id: 26, user_id: 27, project_id: 15 },
  { id: 27, user_id: 28, project_id: 15 },
  { id: 28, user_id: 29, project_id: 1 },
  { id: 30, user_id: 31, project_id: 19 },
  { id: 31, user_id: 32, project_id: 19 },
  { id: 32, user_id: 33, project_id: 19 },
  { id: 33, user_id: 34, project_id: 19 },
  { id: 34, user_id: 35, project_id: 19 },
  { id: 35, user_id: 36, project_id: 19 },
  { id: 36, user_id: 37, project_id: 19 },
  { id: 37, user_id: 38, project_id: 19 },
  { id: 38, user_id: 39, project_id: 19 },
  { id: 39, user_id: 40, project_id: 19 },
  { id: 40, user_id: 41, project_id: 19 },
  { id: 41, user_id: 42, project_id: 19 },
])

Group.create!(id: 1, name: "Administration", description: "Administration", status: 1, privileges: "1,2,3,4,5,6,7,9,10,13,14,15,16,17,19,18,20,21,22,24,25")
Group.create!(id: 2, name: "BOD", description: "BOD", status: 1, privileges: "1,2,3,4,5,6,7,9,10,13,14,15,16,17,19,18,20,21,22,24,25")
Group.create!(id: 3, name: "HR", description: "HR", status: 1, privileges: "1,2,3,4,5,6,7,9,10,13,14,15,16,17,19,18,20,21,22,24,25")
Group.create!(id: 4, name: "Manager", description: "Manager", status: 1, privileges: "1")
Group.create!(id: 5, name: "Reviewer", description: "Reviewer", status: 1, privileges: "16")
Group.create!(id: 6, name: "Staff", description: "Staff", status: 1, privileges: "15,19,23")
Group.create!(id: 7, name: "PM", description: "PM", status: 1, privileges: "14,17")

UserGroup.create(id: 1, group_id: 1, user_id: 1)
UserGroup.create([
  { id: 2, user_id: 2, group_id: 6 },
  { id: 3, user_id: 3, group_id: 6 },
  { id: 4, user_id: 4, group_id: 6 },
  { id: 5, user_id: 5, group_id: 6 },
  { id: 6, user_id: 6, group_id: 6 },
  { id: 7, user_id: 7, group_id: 6 },
  { id: 8, user_id: 8, group_id: 6 },
  { id: 9, user_id: 9, group_id: 6 },
  { id: 10, user_id: 10, group_id: 6 },
  { id: 11, user_id: 11, group_id: 6 },
  { id: 12, user_id: 12, group_id: 6 },
  { id: 13, user_id: 13, group_id: 6 },
  { id: 14, user_id: 14, group_id: 6 },
  { id: 15, user_id: 15, group_id: 6 },
  { id: 16, user_id: 16, group_id: 6 },
  { id: 17, user_id: 17, group_id: 6 },
  { id: 18, user_id: 18, group_id: 6 },
  { id: 19, user_id: 19, group_id: 6 },
  { id: 20, user_id: 20, group_id: 6 },
  { id: 21, user_id: 21, group_id: 6 },
  { id: 22, user_id: 22, group_id: 6 },
  { id: 23, user_id: 23, group_id: 6 },
  { id: 24, user_id: 24, group_id: 6 },
  { id: 25, user_id: 25, group_id: 6 },
  { id: 26, user_id: 26, group_id: 6 },
  { id: 27, user_id: 27, group_id: 6 },
  { id: 28, user_id: 28, group_id: 6 },
  { id: 29, user_id: 29, group_id: 6 },
  { id: 30, user_id: 30, group_id: 6 },
  { id: 31, user_id: 31, group_id: 6 },
  { id: 32, user_id: 32, group_id: 6 },
  { id: 33, user_id: 33, group_id: 6 },
  { id: 34, user_id: 34, group_id: 6 },
  { id: 35, user_id: 35, group_id: 6 },
  { id: 36, user_id: 36, group_id: 6 },
  { id: 37, user_id: 37, group_id: 6 },
  { id: 38, user_id: 38, group_id: 6 },
  { id: 39, user_id: 39, group_id: 6 },
  { id: 40, user_id: 40, group_id: 6 },
  { id: 41, user_id: 41, group_id: 6 },
  { id: 42, user_id: 42, group_id: 6 },
  { id: 43, user_id: 43, group_id: 6 },
  { id: 44, user_id: 44, group_id: 6 },
  { id: 45, user_id: 45, group_id: 6 },
  { id: 46, user_id: 46, group_id: 3 },
  { id: 47, user_id: 47, group_id: 3 },
  { id: 48, user_id: 48, group_id: 3 },
  { id: 49, user_id: 7, group_id: 5 },
  { id: 50, user_id: 8, group_id: 5 },
  { id: 51, user_id: 9, group_id: 5 },
  { id: 52, user_id: 10, group_id: 5 },
  { id: 53, user_id: 11, group_id: 5 },
  { id: 54, user_id: 21, group_id: 5 },
  { id: 55, user_id: 22, group_id: 5 },
  { id: 56, user_id: 23, group_id: 5 },
  { id: 57, user_id: 24, group_id: 5 },
  { id: 58, user_id: 25, group_id: 5 },
  { id: 59, user_id: 35, group_id: 5 },
  { id: 60, user_id: 36, group_id: 5 },
  { id: 61, user_id: 37, group_id: 5 },
  { id: 62, user_id: 38, group_id: 5 },
  { id: 63, user_id: 39, group_id: 5 },
  { id: 64, user_id: 12, group_id: 7 },
  { id: 65, user_id: 13, group_id: 7 },
  { id: 66, user_id: 14, group_id: 7 },
  { id: 67, user_id: 26, group_id: 7 },
  { id: 68, user_id: 27, group_id: 7 },
  { id: 69, user_id: 28, group_id: 7 },
  { id: 70, user_id: 40, group_id: 7 },
  { id: 71, user_id: 41, group_id: 7 },
  { id: 72, user_id: 42, group_id: 7 },
  { id: 73, user_id: 15, group_id: 2 },
  { id: 74, user_id: 29, group_id: 2 },
  { id: 75, user_id: 43, group_id: 2 },
])
