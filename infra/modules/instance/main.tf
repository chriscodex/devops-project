resource "aws_instance" "server" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  subnet_id                   = var.subnet_id
  associate_public_ip_address = true
  user_data                   = var.user_data
  tags                        = var.tags
  key_name                    = var.key_name
  vpc_security_group_ids      = [var.security_group_id]

  root_block_device {
    volume_size           = var.volume_size
    volume_type           = "gp3"
    delete_on_termination = true
  }
}
