# Terraform setup + Github CICD
See details here : https://claude.ai/chat/ec217e06-b4d9-4f7e-9553-4ed289f53587
```sh
# use trip-planner-terraform-state S3 bucket to store tf state
aws s3 mb s3://trip-planner-terraform-state --region us-west-2

aws dynamodb create-table \
  --table-name trip-planner-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-west-2

terraform init \
  -backend-config="key=environments/dev/terraform.tfstate"

# QA and PROD via Gitbuh CICD
# terraform init \
#   -backend-config="key=environments/qa/terraform.tfstate"

# terraform init \
#   -backend-config="key=environments/prod/terraform.tfstate"


# store AWS creds in https://github.com/gadzooks/trips/settings/secrets/actions
```

## apply changes to dev from localhost
Make sure you have the AWS credendtials set up. Use trip-planner-terraform-user 
https://us-east-1.console.aws.amazon.com/iam/home?region=us-west-2#/users/details/trip-planner-terraform-user?section=security_credentials

```sh
cd infrastructure/dynamodb
terraform init  -backend-config="key=dev/terraform.tfstate"
terraform plan -var-file=environments/dev.tfvars -out=terraform.tfstate
terraform apply  -var-file=environments/dev.tfvars terraform.tfstate
```