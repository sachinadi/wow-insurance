data "aws_iam_policy_document" "ecs_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# Execution role: used by the ECS agent to pull the image, write logs, and
# fetch the Secrets Manager values referenced in the task definition.
resource "aws_iam_role" "execution" {
  name               = "${var.app_name}-${var.environment}-execution"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume.json
}

resource "aws_iam_role_policy_attachment" "execution_managed" {
  role       = aws_iam_role.execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data "aws_iam_policy_document" "execution_secrets" {
  statement {
    actions   = ["secretsmanager:GetSecretValue"]
    resources = var.secret_arns
  }
}

resource "aws_iam_role_policy" "execution_secrets" {
  name   = "${var.app_name}-${var.environment}-secrets-read"
  role   = aws_iam_role.execution.id
  policy = data.aws_iam_policy_document.execution_secrets.json
}

# Task role: assumed by the app itself at runtime. No AWS API calls are
# currently needed by the app, so this stays empty — a placeholder for
# least-privilege additions later (e.g. S3 access) rather than reusing the
# broader execution role for that purpose.
resource "aws_iam_role" "task" {
  name               = "${var.app_name}-${var.environment}-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume.json
}
