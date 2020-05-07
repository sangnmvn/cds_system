class AddSlotIdToSlots < ActiveRecord::Migration[6.0]
  def change
    add_column :slots, :slot_id, :string #dùng để set thứ tự hiển thị slot (1a, 1b, 1c ...)
  end
end
