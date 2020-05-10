require "test_helper"

class CompetencyTest < ActiveSupport::TestCase
  fixtures :competencies
  # test "product is not valid without a unique title" do
  #   competency = Product.new(name: "Productivity",
  #                         desc: "yyy",
  #                         location: 1,
  #                         template_id: 1,
  #                         _type: "General")

  #   assert competency.invalid?
  #   assert_equal ["has already been taken"], competency.errors[:title]
  # end
end
