#!/bin/bash

set -e

echo "==> Aplicando Terraform..."
cd ../
terraform apply -auto-approve

echo "==> Obteniendo IP pública..."
IP=$(terraform output -raw public_ip)

echo "==> Esperando 30s a que la instancia esté lista..."
sleep 30

echo "==> Subiendo archivos de despliegue..."
scp -i keys/stnetcomputer-key-staging -r deploy/* ubuntu@$IP:/home/ubuntu/app

echo "==> Ejecutando docker compose en la instancia..."
ssh -i keys/stnetcomputer-key-staging ubuntu@$IP << EOF
  cd /home/ubuntu/app
  docker compose -f docker-compose.staging.yml up -d
EOF

echo "==> ¡Despliegue completado en $IP!"
