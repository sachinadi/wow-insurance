# Infrastructure — WOW Insurance on AWS

Terraform-managed ECS Fargate deployment. See `../docs/AWS_SERVICES.md` for what gets created and why.

## One-time setup

1. **Bootstrap the remote state backend + CI roles:**
   ```bash
   cd infra/bootstrap
   terraform init
   terraform apply \
     -var="state_bucket_name=<globally-unique-bucket-name>" \
     -var="github_repo=sachinadi/wow-insurance"
   ```
   Note the `state_bucket`, `deploy_role_arn`, and `terraform_role_arn` outputs.

2. **Point the main stack at that backend:**
   Edit `environments/prod/backend.hcl` and set `bucket` to the bootstrap output.

3. **Add GitHub repo secrets** (Settings → Secrets and variables → Actions):
   - `AWS_TERRAFORM_ROLE_ARN` — bootstrap's `terraform_role_arn` output
   - `AWS_DEPLOY_ROLE_ARN` — bootstrap's `deploy_role_arn` output
   - `JWT_SECRET`, `ANTHROPIC_API_KEY`, `ANTHROPIC_WORKSPACE_ID`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` — same values as your local `.env.local`

4. **First apply of the main stack** (locally, or just push to `master` and let `terraform.yml` do it):
   ```bash
   cd infra
   terraform init -backend-config=environments/prod/backend.hcl
   terraform apply -var-file=environments/prod/terraform.tfvars
   # (prompts for the sensitive vars, or export TF_VAR_jwt_secret etc. first)
   ```
   This creates the ECS service with a placeholder image (nothing pushed to ECR yet), so it will be unhealthy until the first deploy runs.

5. **First app deploy:** push any app-code change to `master` — `deploy.yml` builds the image, pushes it to ECR, and updates the ECS service.

6. **Find the app**: `terraform output cloudfront_domain_name`.

## Day to day

- Change infra → edit files under `infra/`, open a PR (`terraform.yml` posts a plan), merge to apply.
- Change app code → push to `master` (`deploy.yml` builds + deploys automatically).
- The ECS service's `task_definition` and `desired_count` are deliberately ignored by Terraform after creation (see the comment in `modules/ecs/main.tf`) so CI deploys and Terraform applies don't fight each other.
