# Fill in with infra/bootstrap's outputs, then:
#   terraform init -backend-config=environments/prod/backend.hcl
bucket         = "wow-insurance-tfstate-685044194637"
region         = "us-east-1"
dynamodb_table = "wow-insurance-terraform-locks"
