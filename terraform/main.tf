variable "localstack_host" {
  default = "localhost"
}

provider "aws" {
  version = "~> 2.39.0"
  alias = "local"
  region = "eu-central-1"
  access_key = "This is not an actual access key."
  secret_key = "This is not an actual secret key."
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  endpoints {
    secretsmanager  = "http://${var.localstack_host}:4584"
    s3              = "http://${var.localstack_host}:4566"
  }
}

resource "aws_s3_bucket" "test_bucket" {
  bucket = "test_bucket"
  provider = "aws.local"
  acl = "private"
}