require 'test_helper'

class TitlePrivilegesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @title_privilege = title_privileges(:one)
  end

  test "should get index" do
    get title_privileges_url
    assert_response :success
  end

  test "should get new" do
    get new_title_privilege_url
    assert_response :success
  end

  test "should create title_privilege" do
    assert_difference('TitlePrivilege.count') do
      post title_privileges_url, params: { title_privilege: { Name: @title_privilege.Name } }
    end

    assert_redirected_to title_privilege_url(TitlePrivilege.last)
  end

  test "should show title_privilege" do
    get title_privilege_url(@title_privilege)
    assert_response :success
  end

  test "should get edit" do
    get edit_title_privilege_url(@title_privilege)
    assert_response :success
  end

  test "should update title_privilege" do
    patch title_privilege_url(@title_privilege), params: { title_privilege: { Name: @title_privilege.Name } }
    assert_redirected_to title_privilege_url(@title_privilege)
  end

  test "should destroy title_privilege" do
    assert_difference('TitlePrivilege.count', -1) do
      delete title_privilege_url(@title_privilege)
    end

    assert_redirected_to title_privileges_url
  end
end
