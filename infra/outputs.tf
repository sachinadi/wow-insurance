output "cloudfront_domain_name" {
  description = "Public HTTPS URL for the app"
  value       = module.cloudfront.distribution_domain_name
}

output "alb_dns_name" {
  value = module.alb.alb_dns_name
}

output "ecs_cluster_name" {
  value = module.ecs.cluster_name
}

output "ecs_service_name" {
  value = module.ecs.service_name
}

output "ecr_repository_url" {
  value = module.ecr.repository_url
}
