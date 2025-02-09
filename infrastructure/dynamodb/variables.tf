provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = terraform.workspace
      Project     = "trip-planner"
      ManagedBy   = "terraform"
    }
  }
}

# locals {
#   environment = terraform.workspace
# }

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "table_name" {
  type        = string
  description = "Name of the DynamoDB table for Trip Planner"
  default     = "trip-planner"
}