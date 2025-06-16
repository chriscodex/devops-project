terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region     = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_subnet" "default" {
  id = tolist(data.aws_subnets.default.ids)[0]
}

module "security_group" {
  source = "../modules/security_group"
  vpc_id = data.aws_vpc.default.id
  name   = "stnetcomputer-prod-sg"
}

module "ssh_key" {
  source          = "../modules/ssh_key"
  key_name        = var.key_name
  key_output_path = "${path.module}/keys"
}

module "stnetcomputer_server" {
  source            = "../modules/instance"
  ami_id            = var.app_ami
  instance_type     = var.instance_type
  subnet_id         = data.aws_subnet.default.id
  tags              = { Name = "stnetcomputer-prod-server" }
  security_group_id = module.security_group.security_group_id
  key_name          = module.ssh_key.key_name
}
