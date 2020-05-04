require 'test_helper'

class GroupPrivilegesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @group_privilege = group_privileges(:one)
  end

  test "should get index" do
    get group_privileges_url
    assert_response :success
  end

  test "should get new" do
    get new_group_privilege_url
    assert_response :success
  end

  test "should create group_privilege" do
    assert_difference('GroupPrivilege.count') do
      post group_privileges_url, params: { group_privilege: { reference: @group_privilege.reference } }
    end

    assert_redirected_to group_privilege_url(GroupPrivilege.last)
  end

  test "should show group_privilege" do
    get group_privilege_url(@group_privilege)
    assert_response :success
  end

  test "should get edit" do
    get edit_group_privilege_url(@group_privilege)
    assert_response :success
  end

  test "should update group_privilege" do
    patch group_privilege_url(@group_privilege), params: { group_privilege: { reference: @group_privilege.reference } }
    assert_redirected_to group_privilege_url(@group_privilege)
  end

  test "should destroy group_privilege" do
    assert_difference('GroupPrivilege.count', -1) do
      delete group_privilege_url(@group_privilege)
    end

    assert_redirected_to group_privileges_url
  end
end
