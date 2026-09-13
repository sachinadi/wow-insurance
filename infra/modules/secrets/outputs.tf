output "secret_arns" {
  description = "Map of env var name => Secrets Manager secret ARN"
  value       = { for k, v in aws_secretsmanager_secret.app : k => v.arn }
}
