class Schedule < ApplicationRecord
  ROLE_NAME = ["PM", "SM", "BOD"]
  belongs_to :user, optional: true
  belongs_to :project, optional: true
  belongs_to :company, optional: true
  belongs_to :period

  delegate :first_name, :last_name, :email, to: :user

  scope :search_schedule, ->(search) {
          where("`desc` LIKE :search OR companies.name LIKE :search", search: "%#{search}%") if search.present?
        }

  validate :happened_at_is_valid_datetime
  validate :pm_validation

  def pm_validation
    if _type == "PM" && project_id.nil?
      errors.add(:project_id, "Project must exist for schedule type PM")
    end
  end

  def happened_at_is_valid_datetime
    if start_date > end_date_hr
      errors.add(:end_date_hr, "End Date HR must be greater than Start Date")
    end

    if _type == "PM"
      if start_date > end_date_employee
        errors.add(:end_date_employee, "End Date Employee must be greater than Start Date")
      end

      if end_date_employee > end_date_reviewer
        errors.add(:end_date_reviewer, "End Date Reviewer must be greater than End Date Member")
      end

      if (end_date_employee - notify_employee.days) < start_date
        errors.add(:notify_employee, "Notify Member Date must be greater than Start Date")
      end

      if (end_date_reviewer - notify_reviewer.days) < end_date_employee
        errors.add(:notify_reviewer, "Notify Reviewer Date must be greater than Notify Member Date")
      end
    end

    if _type == "HR" && (end_date_hr - notify_hr.days) < start_date
      errors.add(:notify_hr, "Notify HR Date must be greater than Notify Reviewer Date")
    end
  end

  # run this command to create task, see config/schedule.rb
  # whenever --update-crontab

  def self.update_status
    Schedule.find_each do |schedule|
      start_date = schedule.start_date.midnight unless schedule.start_date.nil?
      end_date = schedule.end_date_hr.midnight unless schedule.end_date_hr.nil?
      today = Date.today.midnight
      if start_date <= today && end_date >= today
        schedule.status = "In-Progress"
      elsif today > start_date
        schedule.status = "New"
      elsif today > end_date
        schedule.status = "Done"
      end
      schedule.save
    end
  end
  def self.deliver_reminder
    Schedule.find_each do |schedule|
      current_user = User.find(schedule.user_id)
      end_date1 = schedule.end_date_employee.midnight unless schedule.end_date_employee.nil?
      end_date2 = schedule.end_date_reviewer.midnight unless schedule.end_date_reviewer.nil?
      end_date3 = schedule.end_date_hr.midnight unless schedule.end_date_hr.nil?
      # reset hours, minutes, seconds to 00:00 for exact day compare
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

  # run this command to create task, see config/schedule.rb
  # whenever --update-crontab

  def self.update_status
    Schedule.find_each do |schedule|
      start_date = schedule.start_date.midnight unless schedule.start_date.nil?
      end_date = schedule.end_date_hr.midnight unless schedule.end_date_hr.nil?
      today = Date.today.midnight
      if start_date <= today && end_date >= today
        schedule.status = "In-Progress"
      elsif today > start_date
        schedule.status = "New"
      elsif today > end_date
        schedule.status = "Done"
      end
      schedule.save
    end
  end
  def self.deliver_reminder
    Schedule.find_each do |schedule|
      current_user = User.find(schedule.user_id)
      end_date1 = schedule.end_date_employee.midnight unless schedule.end_date_employee.nil?
      end_date2 = schedule.end_date_reviewer.midnight unless schedule.end_date_reviewer.nil?
      end_date3 = schedule.end_date_hr.midnight unless schedule.end_date_hr.nil?
      # reset hours, minutes, seconds to 00:00 for exact day compare
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
