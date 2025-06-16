output "stnetcomputer_server_public_ip" {
  description = "IP pública del servidor EC2"
  value       = module.stnetcomputer_server.public_ip
}

output "stnetcomputer_server_public_dns" {
  description = "DNS público del servidor EC2"
  value       = module.stnetcomputer_server.public_dns
}
