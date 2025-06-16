variable "access_key" {
  description = "Clave de acceso a AWS"
  type        = string
  sensitive   = true
}

variable "secret_key" {
  description = "Clave secreta de AWS"
  type        = string
  sensitive   = true
}

variable "region" {
  description = "Región donde se desplegará la infraestructura"
  type        = string
  sensitive   = true
}

variable "instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  sensitive   = true
}

variable "app_ami" {
  description = "ID de la AMI a utilizar"
  type        = string
}

variable "key_name" {
  description = "Nombre de la clave SSH"
  type        = string
}