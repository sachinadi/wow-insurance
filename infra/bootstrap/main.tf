# One-time bootstrap, run manually before the main stack:
#   cd infra/bootstrap && terraform init && terraform apply
# Creates the Terraform remote-state backend (S3 + DynamoDB) and the GitHub
# Actions OIDC trust + IAM roles used by the CI/CD workflows. State for this
# config is intentionally kept local — it manages the very backend the main
# stack's state will live in.

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "state_bucket_name" {
  description = "Globally-unique S3 bucket name for Terraform remote state"
  type        = string
}

variable "github_repo" {
  description = "GitHub repo allowed to assume the CI/CD roles, e.g. sachinadi/wow-insurance"
  type        = string
}

# --- Remote state backend ---

resource "aws_s3_bucket" "terraform_state" {
  bucket = var.state_bucket_name

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket                  = aws_s3_bucket.terraform_state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "wow-insurance-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}

# --- GitHub Actions OIDC (no long-lived AWS keys stored in GitHub) ---

data "tls_certificate" "github" {
  url = "https://token.actions.githubusercontent.com/.well-known/openid-configuration"
}

resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.github.certificates[0].sha1_fingerprint]
}

data "aws_iam_policy_document" "github_trust" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      # GitHub's newer "stable subject claims" appends immutable numeric IDs
      # to the owner/repo names (e.g. "repo:owner@123/repo@456:ref:...")
      # instead of the plain "repo:owner/repo:ref:..." documented format.
      # Match both so this keeps working regardless of which one a given
      # repo/org sends.
      values = [
        "repo:${var.github_repo}:*",
        "repo:${split("/", var.github_repo)[0]}@*/${split("/", var.github_repo)[1]}@*:*",
      ]
    }
  }
}

# Day-to-day role used by deploy.yml: build/push image, roll the ECS service.
resource "aws_iam_role" "deploy" {
  name               = "wow-insurance-github-deploy"
  assume_role_policy = data.aws_iam_policy_document.github_trust.json
}

data "aws_iam_policy_document" "deploy_permissions" {
  statement {
    sid       = "ECRAuth"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }
  statement {
    sid = "ECRPush"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
    ]
    resources = ["*"]
  }
  statement {
    sid = "ECSDeploy"
    actions = [
      "ecs:DescribeServices",
      "ecs:DescribeTaskDefinition",
      "ecs:RegisterTaskDefinition",
      "ecs:UpdateService",
    ]
    resources = ["*"]
  }
  statement {
    sid       = "PassRoleToECS"
    actions   = ["iam:PassRole"]
    resources = ["*"]
    condition {
      test     = "StringEquals"
      variable = "iam:PassedToService"
      values   = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy" "deploy" {
  name   = "wow-insurance-deploy-permissions"
  role   = aws_iam_role.deploy.id
  policy = data.aws_iam_policy_document.deploy_permissions.json
}

# Infra role used by terraform.yml: plan/apply the main stack.
resource "aws_iam_role" "terraform" {
  name               = "wow-insurance-github-terraform"
  assume_role_policy = data.aws_iam_policy_document.github_trust.json
}

# NOTE: AdministratorAccess is a deliberate simplification for this draft so
# `terraform apply` can manage VPC/ALB/ECS/IAM/SecretsManager/CloudFront/ECR
# without hand-maintaining a large custom least-privilege policy. Before
# running this against a real production AWS account, replace this with a
# policy scoped to only the services the main stack touches.
resource "aws_iam_role_policy_attachment" "terraform_admin" {
  role       = aws_iam_role.terraform.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

resource "aws_iam_role_policy" "terraform_state_access" {
  name = "wow-insurance-terraform-state-access"
  role = aws_iam_role.terraform.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "StateBucket"
        Effect   = "Allow"
        Action   = ["s3:GetObject", "s3:PutObject", "s3:ListBucket"]
        Resource = [aws_s3_bucket.terraform_state.arn, "${aws_s3_bucket.terraform_state.arn}/*"]
      },
      {
        Sid      = "LockTable"
        Effect   = "Allow"
        Action   = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:DeleteItem"]
        Resource = aws_dynamodb_table.terraform_locks.arn
      }
    ]
  })
}

output "state_bucket" {
  value = aws_s3_bucket.terraform_state.bucket
}

output "lock_table" {
  value = aws_dynamodb_table.terraform_locks.name
}

output "deploy_role_arn" {
  value = aws_iam_role.deploy.arn
}

output "terraform_role_arn" {
  value = aws_iam_role.terraform.arn
}
