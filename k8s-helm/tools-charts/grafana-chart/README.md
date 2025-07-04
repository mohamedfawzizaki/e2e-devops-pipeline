helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
helm dependency update
helm install grafana-release .\grafana-chart\ -n devops-tools

<!-- To get the Grafana admin password, run the command as follows: -->
linux:
    kubectl get secret --namespace monitoring my-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
windows:
    kubectl get secret --namespace devops-tools grafana-release -o jsonpath="{.data.admin-password}" | % { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }

<!-- to get the pod name -->
kubectl get pods --namespace devops-tools -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=grafana-release" -o jsonpath="{.items[0].metadata.name}"

kubectl --namespace devops-tools port-forward $POD_NAME 3000