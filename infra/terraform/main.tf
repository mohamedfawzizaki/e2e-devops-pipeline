resource "null_resource" "install_minikube" {
  provisioner "local-exec" {
    command = <<EOT
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    sudo install minikube-linux-amd64 /usr/local/bin/minikube
    minikube start --driver=docker
    EOT
  }
}


# terraform init
# terraform apply -auto-approve