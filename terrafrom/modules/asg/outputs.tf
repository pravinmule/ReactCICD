
output "asg_name" {
  value = aws_autoscaling_group.app.name
}

output "iam_instance_profile" {
  value = aws_iam_instance_profile.app.name
}

output "iam_role_arn" {
  value = aws_iam_role.ec2_role.arn
}
