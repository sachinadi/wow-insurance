aws_region  = "us-east-1"
environment = "prod"
app_name    = "wow-insurance"

# Sensitive values (jwt_secret, anthropic_api_key, anthropic_workspace_id,
# turso_database_url, turso_auth_token) are intentionally NOT set here.
# They're passed as TF_VAR_* environment variables sourced from GitHub
# Secrets in CI, or typed interactively for a local apply — never committed.
