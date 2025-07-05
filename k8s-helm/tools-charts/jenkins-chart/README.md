helm repo add jenkins https://charts.jenkins.io
helm repo add jenkinsci https://charts.jenkins.io  
helm repo update
helm search repo jenkins
helm dependency build .\jenkins-chart\  
minikube ssh
sudo mkdir /data/jenkins-volume
sudo chown -R 1000:1000 /data/jenkins-volume
exit
helm install jenkins-release .\jenkins-chart\ -n devops-tools --create-namespace
username = admin
password = 
           kubectl exec --namespace devops-tools -it svc/jenkins-release -c jenkins -- /bin/cat /run/secrets/additional/chart-admin-password

minikube service jenkins-release -n devops-tools
ngrok http <port>