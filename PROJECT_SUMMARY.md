# WOW Insurance — Project Build & Deployment Summary

A record of everything built and deployed in this project, from the first line of code to a live AWS deployment.

**Repository:** https://github.com/sachinadi/wow-insurance (private)
**Live URL:** https://d6dz968myyud0.cloudfront.net
**Architecture diagrams:** https://claude.ai/code/artifact/34be7b4b-a832-4076-bf3f-45939485b4aa

---

## 1. What the app does

WOW Insurance is a Next.js (App Router, TypeScript) insurance web app with:

- **One login** (email or mobile number + password) — the account's role decides whether you land on the admin dashboard or the customer dashboard.
- **Admin view** — end-to-end visibility into every policy, the full claim history across all customers, and the product catalog.
- **Enduser view** — your own policy number, insurance amount, claim history, and FAQs.
- **New User Registration**, plus **Forgot Username** / **Forgot Password** flows (simulated on-screen in this draft rather than emailed/texted — no third-party email/SMS provider wired up).
- **AI assistant** (Claude Sonnet 5) on both dashboards — a chat widget that answers questions using only the signed-in account's own data (or portfolio-wide data for admins) and gives recommendations (coverage suggestions, claims that need attention, etc.).

**Stack:** Next.js 16 · TypeScript · Tailwind CSS · `lucide-react` · Turso (libSQL) · Drizzle ORM · `jose` (JWT) · `bcryptjs` · `zod` · `@anthropic-ai/sdk`.

---

## 2. How it was built (chronological)

### Phase 1 — Initial application
- Scaffolded with `create-next-app`, Tailwind, TypeScript.
- Designed the database schema in `db/schema.ts` (users, products, policies, claims, faqs, password_reset_tokens) using Drizzle ORM, backed by a **Turso** database (created via Turso's REST API directly, since no native Windows CLI exists for it).
- Built JWT-based auth (`lib/auth.ts`), separate admin/enduser login pages, registration, forgot-username/password flows, and role-protected dashboards via `middleware.ts`.
- Seeded the database (`scripts/seed.ts`) with a demo admin, sample insurance products, FAQs, and a demo customer with a policy and claim history.
- Verified everything end-to-end locally (`npm run dev` / `npm start`) and pushed the initial commit to a new private GitHub repo.

### Phase 2 — Unified login, visual redesign, AI assistant
- Replaced the separate Admin/User login picker with a **single `/login`** page that routes by the account's actual role.
- Redesigned the UI: gradient hero, `lucide-react` icons throughout, gradient stat cards, active-nav highlighting — while keeping the interface professional rather than flashy.
- Built the **AI assistant** (`lib/assistant.ts`, `app/api/assistant/route.ts`, `components/AssistantWidget.tsx`): a chat widget backed by real Claude Sonnet 5 calls, scoped so it only ever sees the signed-in account's own data.
- **Bugs found and fixed along the way:**
  - `next/font/google` couldn't reach Google's font CDN in this environment and was breaking every page with a 500 — removed it in favor of a system font stack.
  - Passed Lucide icon *components* as props from a Server Component into a Client Component, which React can't serialize — fixed by passing icon *names* and resolving them inside the client component instead.
  - The Anthropic API key was org-level and not scoped to a workspace, which the API rejected — added support for an `ANTHROPIC_WORKSPACE_ID` env var and the required header.
- Verified visually with a real browser session (login, both dashboards, the assistant answering real questions) and pushed to GitHub.

### Phase 3 — AWS infrastructure, CI/CD, and diagrams
- Wrote a complete **Terraform** configuration (`infra/`): a dedicated VPC across 2 Availability Zones, an Application Load Balancer, an ECS Fargate service (auto-scaling 2–6 tasks on CPU/memory), CloudFront for HTTPS/CDN, ECR for the Docker image, Secrets Manager for all app secrets, CloudWatch for logs/metrics, and the IAM roles tying it together.
- Wrote `infra/bootstrap/` separately: the one-time setup for Terraform's own remote state (S3 + DynamoDB) and the GitHub Actions OIDC trust + IAM roles (no long-lived AWS keys ever stored in GitHub).
- Wrote a multi-stage **Dockerfile** (Next.js standalone output) and two **GitHub Actions workflows**: `terraform.yml` (plan on PR, apply on merge) and `deploy.yml` (build → push to ECR → roll the ECS service).
- Documented every AWS service used and why in `docs/AWS_SERVICES.md`.
- Published an AWS-style architecture diagram and end-to-end workflow diagram as an Artifact.
- Kept the database on **Turso** rather than migrating to an AWS-native database — it's already managed and globally reachable, so only compute/hosting moved to AWS.

### Phase 4 — Actual deployment to AWS
- Installed Terraform, and worked through this machine's slow disk (a 686MB provider binary made every `terraform` command take several minutes to load) and a memory conflict with an unrelated, already-running Kubernetes lab cluster on the same machine.
- **A real AWS access key was accidentally exposed in the chat transcript** while checking for local credentials — flagged immediately, and the user rotated it before any further use.
- Ran `infra/bootstrap` — created the state backend and GitHub OIDC roles (11 AWS resources).
- Set all 7 required GitHub Actions secrets (2 role ARNs + 5 app secrets) via `gh secret set`, values never displayed in chat.
- Ran the main stack — created 43 AWS resources (VPC, ALB, ECS, CloudFront, ECR, Secrets Manager, IAM).
- **Found and fixed a real production bug**: GitHub's newer "stable subject claims" behavior appends immutable numeric IDs to the OIDC token's `sub` claim (`repo:owner@12345/repo@67890:ref:...`) instead of the plain documented format (`repo:owner/repo:ref:...`). This made every CI/CD deploy fail with `Not authorized to perform sts:AssumeRoleWithWebIdentity`. Diagnosed via AWS CloudTrail (which showed the actual claim GitHub was sending), then fixed the Terraform trust policy to match both formats.
- Triggered a real deploy through the actual CI/CD pipeline (build → ECR push → ECS rollout → health checks) and verified the app live with an HTTP 200 response.

---

## 3. Live resources

| Resource | Value |
|---|---|
| Live app URL | https://d6dz968myyud0.cloudfront.net |
| ALB DNS name | wow-insurance-prod-773324622.us-east-1.elb.amazonaws.com |
| GitHub repo | https://github.com/sachinadi/wow-insurance |
| AWS account | 685044194637 (region: us-east-1) |
| ECR repository | 685044194637.dkr.ecr.us-east-1.amazonaws.com/wow-insurance |
| ECS cluster / service | wow-insurance-prod |
| Terraform state bucket | wow-insurance-tfstate-685044194637 |

### Demo accounts (seeded in the live database)
- **Admin**: `admin@wowinsurance.com` / `_BmDTVhZGPJI`
- **Enduser**: `demo.user@example.com` or `9876543210` / `Demo@1234`

*(Change these once you've explored the app — there's no in-app "change my own password" flow yet, but Forgot Password works for any account.)*

---

## 4. Costs and teardown

This deployment has ongoing AWS costs — roughly **$50–80/month** — mainly the NAT Gateway, the ALB, and 2 continuously-running Fargate tasks, plus CloudFront and Secrets Manager usage.

To tear everything down when you're done:
```bash
cd infra
terraform destroy -var-file=environments/prod/terraform.tfvars
# (then, only if you also want to remove the state backend/CI roles)
cd bootstrap
terraform destroy -var="state_bucket_name=wow-insurance-tfstate-685044194637" -var="github_repo=sachinadi/wow-insurance"
```

---

## 5. Follow-ups worth doing

- **Rotate the Anthropic API key** — it also appeared in plain text in the chat transcript at one point during setup, the same way the AWS key did. Treat it as potentially exposed.
- **IAM scope**: the `wow-insurance-github-terraform` role uses `AdministratorAccess` as a deliberate simplification for this draft (see the comment in `infra/bootstrap/main.tf`). Worth tightening to a least-privilege policy before this is used in a real production account long-term.
- **Real email/SMS**: Forgot Username/Password currently show the result on-screen instead of sending it. Wire up a real provider (e.g. Resend, SendGrid, Twilio) when ready.
- **Custom domain**: currently using CloudFront's default `*.cloudfront.net` address. Add Route53 + ACM when you have a domain to attach.
- **Single NAT Gateway**: a deliberate cost-saving choice (one NAT instead of one per AZ) — a documented single point of failure for private-subnet internet egress if that ever needs to be eliminated.
