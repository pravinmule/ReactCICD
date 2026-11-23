terraform {
  backend "s3" {
    bucket       = "YOUR_ACTUAL_STATE_BUCKET_NAME"
    key          = "dev/terraform.tfstate"
    region       = "ap-south-1"
    encrypt      = true
    use_lockfile = true
  }
}