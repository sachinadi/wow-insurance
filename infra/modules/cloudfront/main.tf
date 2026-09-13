resource "aws_cloudfront_distribution" "this" {
  enabled = true
  comment = "${var.app_name}-${var.environment}"

  origin {
    domain_name = var.alb_dns_name
    origin_id   = "alb-origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # No caching by default: this is a dynamic, session-cookie-driven app
  # (SSR pages + JSON APIs). CloudFront here mainly buys viewers free HTTPS,
  # AWS's edge network, and Shield Standard DDoS protection. Static assets
  # under /_next/static are already content-hashed and safe to cache
  # aggressively — add a second, path-scoped cache behavior for them later
  # as an optimization.
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "alb-origin"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      headers      = ["*"]
      cookies {
        forward = "all"
      }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
