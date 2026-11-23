
variable "admin_ip_cidr" {
  description = "Your public IP with /32 for SSH and DEV access"
  type        = string
}

variable "database_password" {
  description = "DEV RDS password"
  type        = string
  sensitive   = true
}
