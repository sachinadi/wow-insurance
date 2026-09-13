variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type    = string
  default = "prod"
}

variable "app_name" {
  type    = string
  default = "wow-insurance"
}

variable "vpc_cidr" {
  type    = string
  default = "10.20.0.0/16"
}

variable "container_port" {
  type    = number
  default = 3000
}

variable "task_cpu" {
  description = "Fargate task vCPU units (256 = .25 vCPU)"
  type        = number
  default     = 512
}

variable "task_memory" {
  description = "Fargate task memory in MiB"
  type        = number
  default     = 1024
}

variable "desired_count" {
  description = "Initial task count (auto scaling adjusts this at runtime)"
  type        = number
  default     = 2
}

variable "min_capacity" {
  type    = number
  default = 2
}

variable "max_capacity" {
  type    = number
  default = 6
}

variable "image_tag" {
  description = "Docker image tag to deploy; CI sets this to the git commit SHA"
  type        = string
  default     = "latest"
}

# --- Secrets (never committed; supplied via TF_VAR_* env vars from GitHub Secrets) ---

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
