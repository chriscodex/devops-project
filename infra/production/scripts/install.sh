#!/bin/bash

# Actualizar e instalar dependencias
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Crear directorio para keyrings si no existe
sudo install -m 0755 -d /etc/apt/keyrings

# Agregar clave GPG oficial de Docker
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Agregar repositorio de Docker a las fuentes de Apt
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo ${UBUNTU_CODENAME:-$VERSION_CODENAME}) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Actualizar paquetes otra vez luego de agregar repositorio de Docker
sudo apt-get update

# Instalar Docker y sus componentes SIN pedir confirmación
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Crear carpeta para app
sudo mkdir -p /home/ubuntu/app
sudo chown ubuntu:ubuntu /home/ubuntu/app

# Crear red de Docker
sudo docker network create nginx-network

# Marcar finalización del script
echo "Instalación completa" >> /var/log/user-data.log
