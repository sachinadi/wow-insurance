# Fill in with infra/bootstrap's outputs, then:
#   terraform init -backend-config=environments/prod/backend.hcl
bucket         = "REPLACE_WITH_BOOTSTRAP_STATE_BUCKET_OUTPUT"
region         = "us-east-1"
dynamodb_table = "wow-insurance-terraform-locks"
