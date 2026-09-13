# AWS Services Used — WOW Insurance

Everything below is provisioned by the Terraform in `infra/` (`infra/bootstrap` for the one-time setup, `infra/` for the app stack itself). Nothing here is aspirational — each line maps to a real resource in that code.

## Compute & containers

| Service | Purpose |
|---|---|
| **Amazon ECS (Fargate launch type)** | Runs the Next.js app as a container — no EC2 instances to patch or manage. |
| **Amazon ECR** | Private registry storing the app's Docker images (immutable tags, vulnerability scan on push, 20-image retention policy). |
| **AWS Application Auto Scaling** | Scales the ECS service's task count (2–6) on CPU (60% target) and memory (70% target) utilization. |

## Networking & delivery

| Service | Purpose |
|---|---|
| **Amazon VPC** | Dedicated network (`10.20.0.0/16`) across 2 Availability Zones, with public + private subnets. |
| **Amazon VPC NAT Gateway** | Lets ECS tasks in private subnets reach the internet (Turso, Anthropic API) without being publicly reachable themselves. |
| **Elastic Load Balancing (Application Load Balancer)** | Public entry point, health-checks tasks, spreads traffic across them and across AZs. |
| **Amazon CloudFront** | CDN in front of the ALB — free HTTPS (default `*.cloudfront.net` cert), AWS's edge network, and AWS Shield Standard DDoS protection. |

## Security & configuration

| Service | Purpose |
|---|---|
| **AWS Secrets Manager** | Stores `JWT_SECRET`, `ANTHROPIC_API_KEY`, `ANTHROPIC_WORKSPACE_ID`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` — injected into the ECS task at launch, never baked into the image or committed to the repo. |
| **AWS IAM** | Task execution role (pull image, write logs, read secrets), task role (placeholder for the app's own AWS calls), and the GitHub Actions OIDC roles below. |
| **IAM OpenID Connect provider (GitHub)** | Lets GitHub Actions assume AWS roles via short-lived tokens — no long-lived AWS access keys stored as GitHub secrets. |

## Observability

| Service | Purpose |
|---|---|
| **Amazon CloudWatch Logs** | Container stdout/stderr from every ECS task (30-day retention). |
| **Amazon CloudWatch Container Insights** | Cluster/service/task-level CPU, memory, and network metrics feeding the auto-scaling policies. |

## Terraform state (bootstrap)

| Service | Purpose |
|---|---|
| **Amazon S3** | Remote Terraform state storage (versioned, encrypted, public access blocked). |
| **Amazon DynamoDB** | State lock table — prevents concurrent `terraform apply` runs from corrupting state. |

## Outside AWS

| Service | Purpose |
|---|---|
| **Turso (libSQL)** | The application database — deliberately kept as-is rather than migrated, since it's already managed and globally reachable. Reached from ECS tasks over the internet via the NAT Gateway. |
| **Anthropic API (Claude)** | Powers the in-app AI assistant. Reached the same way. |
| **GitHub Actions** | CI/CD runner — builds/pushes images and applies Terraform (see `.github/workflows/`). |

## Scalability notes

- **Horizontal**: ECS service auto-scales 2→6 tasks on CPU/memory; the ALB and CloudFront distribute load across however many tasks are running and across both AZs.
- **Stateless app tier**: sessions are JWT cookies (see `lib/auth.ts`), not server-side session storage, so any task can serve any request — safe to add/remove tasks freely.
- **Database**: Turso scales independently of this stack's compute.
- **Known single point of failure (accepted for this draft)**: one NAT Gateway instead of one per AZ, to keep cost down. Straightforward to add a second later (see the comment in `infra/modules/network/main.tf`).
