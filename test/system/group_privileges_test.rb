require "application_system_test_case"

class GroupPrivilegesTest < ApplicationSystemTestCase
  setup do
    @group_privilege = group_privileges(:one)
  end

  test "visiting the index" do
    visit group_privileges_url
    assert_selector "h1", text: "Group Privileges"
  end

  test "creating a Group privilege" do
    visit group_privileges_url
    click_on "New Group Privilege"

    fill_in "Reference", with: @group_privilege.reference
    click_on "Create Group privilege"

    assert_text "Group privilege was successfully created"
    click_on "Back"
  end

  test "updating a Group privilege" do
    visit group_privileges_url
    click_on "Edit", match: :first

    fill_in "Reference", with: @group_privilege.reference
    click_on "Update Group privilege"

    assert_text "Group privilege was successfully updated"
    click_on "Back"
  end

  test "destroying a Group privilege" do
    visit group_privileges_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Group privilege was successfully destroyed"
  end
end
