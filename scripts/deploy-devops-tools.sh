helm repo add jenkinsci https://charts.jenkins.io  
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm dependency build 

helm install jenkins-release .\jenkins-chart\ -n devops-tools --create-namespace
helm install prometheus-stack-release .\prometheus-chart\ -n devops-tools
helm install grafana-release .\grafana-chart\ -n devops-tools

jenkinsPodName = kubectl get pods --namespace devops-tools -l "app.kubernetes.io/name=jenkins,app.kubernetes.io/instance=jenkins-release" -o jsonpath="{.items[0].metadata.name}"
jenkinsAdminUsername = admin
jenkinsAdminPassword = kubectl exec --namespace devops-tools -it svc/jenkins-release -c jenkins -- /bin/cat /run/secrets/additional/chart-admin-password

grafanaPodName = kubectl get pods --namespace devops-tools -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=grafana-release" -o jsonpath="{.items[0].metadata.name}"
grafanaAdminUsername = admin
grafanaAdminPassword = kubectl get secret --namespace devops-tools grafana-release -o jsonpath="{.data.admin-password}" | % { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }

kubectl port-forward svc/jenkins-release -n devops-tools 8080:8080
kubectl port-forward svc/prometheus-stack-release-server -n devops-tools 9090:80
kubectl port-forward svc/grafana-release -n devops-tools 3000:80
