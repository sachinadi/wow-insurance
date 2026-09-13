locals {
  secret_values = {
    JWT_SECRET             = var.jwt_secret
    ANTHROPIC_API_KEY      = var.anthropic_api_key
    ANTHROPIC_WORKSPACE_ID = var.anthropic_workspace_id
    TURSO_DATABASE_URL     = var.turso_database_url
    TURSO_AUTH_TOKEN       = var.turso_auth_token
  }
}

resource "aws_secretsmanager_secret" "app" {
  for_each = local.secret_values
  name     = "${var.app_name}/${var.environment}/${each.key}"
}

resource "aws_secretsmanager_secret_version" "app" {
  for_each      = local.secret_values
  secret_id     = aws_secretsmanager_secret.app[each.key].id
  secret_string = each.value
}
