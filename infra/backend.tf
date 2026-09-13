# Bucket/table names come from infra/bootstrap's outputs and are only known
# after that runs, so they're supplied at init time rather than hardcoded:
#   terraform init -backend-config=environments/prod/backend.hcl
terraform {
  backend "s3" {
    key     = "wow-insurance/prod/terraform.tfstate"
    encrypt = true
  }
}
