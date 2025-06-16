output "public_ip" {
  description = "IP pública del servidor"
  value       = aws_instance.server.public_ip
}

output "public_dns" {
  description = "DNS público del servidor"
  value       = aws_instance.server.public_dns
}