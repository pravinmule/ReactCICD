
variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "app_port" {
  type    = number
  default = 5000
}

variable "app_cidr_blocks" {
  type        = list(string)
  description = "Trusted CIDRs allowed to access the application"
  default     = []
}
