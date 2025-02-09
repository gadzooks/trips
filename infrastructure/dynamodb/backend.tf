terraform {
  backend "s3" {
    bucket         = "trip-planner-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-west-2"
    dynamodb_table = "trip-planner-terraform-locks"
    encrypt        = true
  }
}