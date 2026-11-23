
module "networking" {
  source = "../../modules/networking"

  environment          = "dev"
  vpc_cidr             = "10.10.0.0/16"
  availability_zones   = ["ap-south-1a", "ap-south-1b"]

  public_subnet_cidrs  = [
    "10.10.1.0/24",
    "10.10.2.0/24"
  ]

  private_subnet_cidrs = [
    "10.10.11.0/24",
    "10.10.12.0/24"
  ]
}

module "security" {
  source = "../../modules/security"

  environment       = "dev"
  vpc_id            = module.networking.vpc_id
  app_port          = 80
  app_cidr_blocks   = [var.admin_ip_cidr]
 
}

module "ec2" {
  source = "../../modules/ec2"

  environment        = "dev"
  instance_type      = "t3.micro"
  subnet_id          = module.networking.public_subnet_ids[0]

  security_group_id  = module.security.app_sg_id

  associate_public_ip = true
}

module "rds" {
  source = "../../modules/rds"

  environment       = "dev"

  private_subnet_ids = module.networking.private_subnet_ids
  security_group_id  = module.security.database_sg_id

  database_name     = "todos_dev"
  database_username = "admin"
  database_password = var.database_password

  instance_class    = "db.t3.micro"
  allocated_storage = 20

  multi_az                 = false
  backup_retention_days    = 1
  deletion_protection      = false
  skip_final_snapshot      = true
}
