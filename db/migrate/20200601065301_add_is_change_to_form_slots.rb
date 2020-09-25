class AddIsChangeToFormSlots < ActiveRecord::Migration[6.0]
  def change
    add_column :form_slots, :is_change, :boolean
    add_column :form_slots, :re_assess, :boolean
  end
end
