require 'test_helper'

class TemplateTest < ActiveSupport::TestCase
  test "template attributes must not be empty" do
    template = Template.new
    assert template.invalid?
    assert template.errors[:name].any?
    assert template.errors[:role].any?
  end

  test "template is not valid without a unique name" do
    template = Template.new(name: "Template 1",
                          role_id: 3,
                          description: "Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum")
    assert template.invalid?
    assert_equal ["The template name already exists."], template.errors[:name]
  end
  
  test "role_id is not valid without a unique id" do
    template = Template.new(name: "Template 3",
                          role_id: 1,
                          description: "Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum")
    assert template.invalid?
    assert_equal ["Role already exists."], template.errors[:role_id]
  end
end