require "test_helper"

class CdsAssessmentMailerTest < ActionMailer::TestCase
  test "user_submit" do
    mail = CdsAssessmentMailer.user_submit
    assert_equal "Commit", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end
end
