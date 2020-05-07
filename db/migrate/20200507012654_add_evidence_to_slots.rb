class AddEvidenceToSlots < ActiveRecord::Migration[6.0]
  def change
    add_column :slots, :evidence, :text
  end
end
