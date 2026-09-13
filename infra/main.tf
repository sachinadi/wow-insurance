module "network" {
  source   = "./modules/network"
  app_name = var.app_name
  vpc_cidr = var.vpc_cidr
}

module "ecr" {
  source    = "./modules/ecr"
  repo_name = var.app_name
}

module "secrets" {
  source                 = "./modules/secrets"
  app_name               = var.app_name
  environment            = var.environment
  jwt_secret             = var.jwt_secret
  anthropic_api_key      = var.anthropic_api_key
  anthropic_workspace_id = var.anthropic_workspace_id
  turso_database_url     = var.turso_database_url
  turso_auth_token       = var.turso_auth_token
}

module "iam" {
  source      = "./modules/iam"
  app_name    = var.app_name
  environment = var.environment
  secret_arns = values(module.secrets.secret_arns)
}

module "alb" {
  source            = "./modules/alb"
  app_name          = var.app_name
  environment       = var.environment
  vpc_id            = module.network.vpc_id
  public_subnet_ids = module.network.public_subnet_ids
  container_port    = var.container_port
}

module "ecs" {
  source                = "./modules/ecs"
  app_name              = var.app_name
  environment           = var.environment
  aws_region            = var.aws_region
  vpc_id                = module.network.vpc_id
  private_subnet_ids    = module.network.private_subnet_ids
  alb_security_group_id = module.alb.alb_security_group_id
  target_group_arn      = module.alb.target_group_arn
  alb_listener_arn      = module.alb.http_listener_arn
  execution_role_arn    = module.iam.execution_role_arn
  task_role_arn         = module.iam.task_role_arn
  image_repository_url  = module.ecr.repository_url
  image_tag             = var.image_tag
  container_port        = var.container_port
  task_cpu              = var.task_cpu
  task_memory           = var.task_memory
  desired_count         = var.desired_count
  min_capacity          = var.min_capacity
  max_capacity          = var.max_capacity
  secret_arns           = module.secrets.secret_arns
}

module "cloudfront" {
  source       = "./modules/cloudfront"
  app_name     = var.app_name
  environment  = var.environment
  alb_dns_name = module.alb.alb_dns_name
}
