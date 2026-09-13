variable "app_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "anthropic_api_key" {
  type      = string
  sensitive = true
}

variable "anthropic_workspace_id" {
  type      = string
  sensitive = true
  default   = ""
}

variable "turso_database_url" {
  type      = string
  sensitive = true
}

variable "turso_auth_token" {
  type      = string
  sensitive = true
}
