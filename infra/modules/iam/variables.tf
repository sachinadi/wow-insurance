variable "app_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "secret_arns" {
  type = list(string)
}
