variable "ami_id" {
  description = "AMI ID for the instance"
  type        = string
}

variable "instance_type" {
  description = "Type of EC2 instance"
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID to launch the instance in"
  type        = string
}

variable "tags" {
  description = "Tags for the instance"
  type        = map(string)
}

variable "security_group_id" {
  description = "ID of the security group to associate with the instance"
  type        = string
}

variable "key_name" {
  description = "SSH key name for the instance"
  type        = string
}
