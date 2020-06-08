require 'test_helper'

class LevelMappingTest < ActiveSupport::TestCase
  test "level mapping attributes must not be empty" do
    level_mapping = LevelMapping.new
    assert level_mapping.invalid?
    assert level_mapping.errors[:level].any?
    assert level_mapping.errors[:quantity].any?
    assert level_mapping.errors[:rank_number].any?
  end

  # test "Level phai lon hon 1.0" do
  #   level_mapping = LevelMapping.new(competency_type: 'Hmm...',quantity: 1, rank_number: 1) 
  #   level_mapping.level = -1
  #   assert level_mapping.invalid? 
  #   assert_equal "must be greater than 0",
  #   level_mapping.errors[:level].join('') 

  #   level_mapping.level = 0
  #   assert level_mapping.invalid?
  #   assert_equal "must be greater than 0",
  #   level_mapping.errors[:level].join('')

  #   level_mapping.level = 5
  #   assert level_mapping.valid?
  # end

  # test "Quantity phai lon hon 1.0" do
  #   level_mapping = LevelMapping.new(competency_type: 'Hmm...',level: 1, rank_number: 1)
  #   level_mapping.quantity = -1
  #   assert level_mapping.invalid? 
  #   assert_equal "must be greater than 0",
  #   level_mapping.errors[:quantity].join('') 

  #   level_mapping.quantity = 0
  #   assert level_mapping.invalid?
  #   assert_equal "must be greater than 0",
  #   level_mapping.errors[:quantity].join('')

  #   level_mapping.quantity = 5
  #   assert level_mapping.valid?
  # end

  # test "Rank_number phai lon hon 1.0" do
  #   level_mapping = LevelMapping.new(:competency_type => 'Hmm...',level: 1, quantity: 1)
  #   level_mapping.rank_number = -1
  #   assert level_mapping.invalid? 
  #   assert_equal "must be greater than 0",
  #   level_mapping.errors[:rank_number].join('') 

  #   level_mapping.rank_number = 0
  #   assert level_mapping.invalid?
  #   assert_equal "must be greater than 0",
  #   level_mapping.errors[:rank_number].join('')

  #   level_mapping.rank_number = 5
  #   assert level_mapping.valid?
  # end
end
