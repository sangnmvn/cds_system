require 'test_helper'

class SlotTest < ActiveSupport::TestCase
  test "slot attributes must not be empty" do
    slot = Slot.new
    assert slot.invalid?
    assert slot.errors[:description].any?
    assert slot.errors[:competency_id].any?
    assert slot.errors[:slot_id].any?
  end
end