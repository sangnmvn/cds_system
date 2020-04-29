require "application_system_test_case"

class TitlePrivilegesTest < ApplicationSystemTestCase
  setup do
    @title_privilege = title_privileges(:one)
  end

  test "visiting the index" do
    visit title_privileges_url
    assert_selector "h1", text: "Title Privileges"
  end

  test "creating a Title privilege" do
    visit title_privileges_url
    click_on "New Title Privilege"

    fill_in "Name", with: @title_privilege.Name
    click_on "Create Title privilege"

    assert_text "Title privilege was successfully created"
    click_on "Back"
  end

  test "updating a Title privilege" do
    visit title_privileges_url
    click_on "Edit", match: :first

    fill_in "Name", with: @title_privilege.Name
    click_on "Update Title privilege"

    assert_text "Title privilege was successfully updated"
    click_on "Back"
  end

  test "destroying a Title privilege" do
    visit title_privileges_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Title privilege was successfully destroyed"
  end
end
