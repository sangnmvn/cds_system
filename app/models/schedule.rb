class Schedule < ApplicationRecord
  ROLE_NAME = ["PM", "SM", "BOD"]
  belongs_to :user, optional: true
  belongs_to :project, optional: true
  belongs_to :company, optional: true
  belongs_to :period, optional: true

  delegate :first_name, :last_name, :email, to: :user
  #validates :_type, inclusion: { in: ["HR", "PM"] }

  paginates_per 20
  max_paginates_per 20

  def sample
    Schedule.create!(user_id: 3, status: "New")
  end

  # run this command to create task, see config/schedule.rb
  # whenever --update-crontab
  def self.deliver_reminder
    Schedule.find_each do |schedule|
      current_user = User.find(schedule.user_id)
      end_date1 = schedule.end_date_employee.midnight unless schedule.end_date_employee.nil?
      end_date2 = schedule.end_date_reviewer.midnight unless schedule.end_date_reviewer.nil?
      end_date3 = schedule.end_date_hr.midnight unless schedule.end_date_hr.nil?
      today = Date.today.midnight

      period = Period.find(schedule.period_id)
      sender = current_user

      if !end_date3.nil? && today == end_date3 && schedule._type == "HR"
        # Phase 2
        # * Assumpt: PM chỉ tạo schedule cho 1 company, nên khi tạo sẽ gửi email inform cho tất cả SDD/PM/SM của company đó theo email group
        # HR to PM
        user = User.joins(:role, :company).where("roles.name": ROLE_NAME, is_delete: false, "companies.id": schedule.company_id)
        ScheduleMailer.with(sender: current_user, user: user.to_a, schedule: schedule, period: period).phase2_mailer.deliver_later(wait: 1.minute)
      elsif !end_date2.nil? && today == end_date2 && schedule._type == "PM"
        # Phase 3
        # from PM to Reviewer
        user_id = User.joins(:project_members, :company).where("project_members.project_id": schedule.project_id, "project_members.is_managent": 0, is_delete: false, "companies.id": schedule.company_id).pluck(:id)
        user = Approver.distinct.where(user_id: user_id).pluck(:approver_id)
        ScheduleMailer.with(sender: current_user, user: user.to_a, schedule: schedule, period: period).phase3_mailer.deliver_later(wait: 1.minute)
      elsif !end_date1.nil? && today == end_date1 && schedule._type == "PM"
        # Phase 1
        # Assumpt: PM chỉ tạo schedule cho 1 project, nên khi tạo sẽ gửi email inform cho tất cả member của project theo email group
        user = User.joins(:project_members, :company).where("project_members.project_id": schedule.project_id, "project_members.is_managent": 0, is_delete: false, "companies.id": schedule.company_id)
        ScheduleMailer.with(sender: current_user, user: user.to_a, schedule: schedule, period: period).phase1_mailer.deliver_later(wait: 1.minute)
      end
    end
  end
end
